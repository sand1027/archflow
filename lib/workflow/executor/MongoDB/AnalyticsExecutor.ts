import { ExecutionEnviornment } from "@/lib/types";
import { MongoDBTask } from "../../task/MongoDB";
import { getCredentialValue } from "@/lib/credential-helper";
import { MongoClient } from "mongodb";

export async function AnalyticsExecutor(
  enviornment: ExecutionEnviornment<typeof MongoDBTask>
): Promise<boolean> {
  let client: MongoClient | null = null;
  
  try {
    const collection = enviornment.getInput("Collection");
    const credentialId = enviornment.getInput("Credentials");

    if (!collection) {
      enviornment.log.error("❌ Collection name is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("❌ MongoDB credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.connection_string) {
      enviornment.log.error("❌ Invalid MongoDB credentials");
      return false;
    }

    enviornment.log.info("📊 Running MongoDB Analytics...");
    client = new MongoClient(credentials.connection_string);
    await client.connect();
    const db = client.db();
    const coll = db.collection(collection);

    // User-specific analytics
    const userFilter = { userId: enviornment.userId };
    
    // 1. Document count by user
    const totalDocs = await coll.countDocuments(userFilter);
    
    // 2. Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentDocs = await coll.countDocuments({
      ...userFilter,
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // 3. Daily activity aggregation
    const dailyActivity = await coll.aggregate([
      { $match: { ...userFilter, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 },
          date: { $first: "$createdAt" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]).toArray();
    
    // 4. Top fields analysis (if documents have common fields)
    const sampleDoc = await coll.findOne(userFilter);
    let fieldAnalysis: Record<string, any> = {};
    
    if (sampleDoc) {
      const fields = Object.keys(sampleDoc).filter(key => 
        !['_id', 'userId', 'createdAt', 'updatedAt'].includes(key)
      );
      
      for (const field of fields.slice(0, 5)) { // Analyze top 5 fields
        const fieldStats = await coll.aggregate([
          { $match: { ...userFilter, [field]: { $exists: true, $ne: null } } },
          { $group: { _id: `$${field}`, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]).toArray();
        
        fieldAnalysis[field] = fieldStats;
      }
    }
    
    const analytics = {
      summary: {
        totalDocuments: totalDocs,
        recentDocuments: recentDocs,
        collectionName: collection,
        analysisDate: new Date().toISOString()
      },
      dailyActivity: dailyActivity.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        count: item.count
      })),
      fieldAnalysis,
      insights: {
        activityTrend: recentDocs > 0 ? "Active" : "Inactive",
        avgDocsPerDay: Math.round(recentDocs / 7),
        peakDay: dailyActivity.length > 0 ? 
          dailyActivity.reduce((max, day) => day.count > max.count ? day : max) : null
      }
    };
    
    enviornment.setOutput("Result", JSON.stringify(analytics, null, 2));
    enviornment.setOutput("Count", String(totalDocs));
    
    enviornment.log.info(`📊 Analytics Summary:`);
    enviornment.log.info(`   📈 Total Documents: ${totalDocs}`);
    enviornment.log.info(`   🔥 Recent Activity: ${recentDocs} docs in last 7 days`);
    enviornment.log.info(`   📅 Avg per day: ${Math.round(recentDocs / 7)}`);
    
    return true;
  } catch (error: any) {
    enviornment.log.error(`❌ MongoDB Analytics Error: ${error.message}`);
    return false;
  } finally {
    if (client) {
      await client.close();
      enviornment.log.info("🔌 MongoDB connection closed");
    }
  }
}