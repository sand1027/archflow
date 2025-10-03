import { ExecutionEnviornment } from "@/lib/types";
import { MongoDBTask } from "../../task/MongoDB";
import { getCredentialValue } from "@/lib/credential-helper";
import { MongoClient } from "mongodb";

// Scenario detection and processing functions
function detectScenario(collection: string, headers: string[]): string {
  const collectionLower = collection.toLowerCase();
  const headerStr = headers.join(' ').toLowerCase();
  
  // E-commerce scenarios
  if (collectionLower.includes('product') || headerStr.includes('price') || headerStr.includes('sku')) {
    return 'E-commerce Product Catalog';
  }
  if (collectionLower.includes('order') || headerStr.includes('order') || headerStr.includes('customer')) {
    return 'Order Management';
  }
  
  // HR/Employee scenarios
  if (collectionLower.includes('employee') || collectionLower.includes('user') || headerStr.includes('salary') || headerStr.includes('department')) {
    return 'Employee Management';
  }
  
  // Student/Education scenarios
  if (collectionLower.includes('student') || headerStr.includes('grade') || headerStr.includes('course')) {
    return 'Student Records';
  }
  
  // Lead/CRM scenarios
  if (collectionLower.includes('lead') || collectionLower.includes('contact') || headerStr.includes('phone') || headerStr.includes('email')) {
    return 'CRM Lead Management';
  }
  
  // Inventory scenarios
  if (collectionLower.includes('inventory') || headerStr.includes('stock') || headerStr.includes('quantity')) {
    return 'Inventory Management';
  }
  
  // Event scenarios
  if (collectionLower.includes('event') || headerStr.includes('date') || headerStr.includes('venue')) {
    return 'Event Management';
  }
  
  return 'General Data Collection';
}

function processRowByScenario(scenario: string, headers: string[], row: any[], userId: string): any {
  const baseDoc: any = {
    createdAt: new Date(),
    userId,
    scenario,
    status: 'active'
  };
  
  // Map headers to values
  headers.forEach((header: string, index: number) => {
    if (header && row[index] !== undefined && row[index] !== '') {
      const cleanHeader = header.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      baseDoc[cleanHeader] = row[index];
    }
  });
  
  // Scenario-specific processing
  switch (scenario) {
    case 'E-commerce Product Catalog':
      return {
        ...baseDoc,
        category: baseDoc.category || 'uncategorized',
        inStock: baseDoc.quantity > 0,
        priceRange: baseDoc.price ? getPriceRange(baseDoc.price) : 'unknown'
      };
      
    case 'Employee Management':
      return {
        ...baseDoc,
        fullName: `${baseDoc.first_name || baseDoc.name || ''} ${baseDoc.last_name || ''}`.trim(),
        salaryBand: baseDoc.salary ? getSalaryBand(baseDoc.salary) : 'not_specified',
        isActive: baseDoc.status !== 'inactive'
      };
      
    case 'CRM Lead Management':
      return {
        ...baseDoc,
        leadScore: calculateLeadScore(baseDoc),
        contactMethod: baseDoc.phone ? 'phone' : baseDoc.email ? 'email' : 'unknown',
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };
      
    case 'Student Records':
      return {
        ...baseDoc,
        gradeLevel: baseDoc.grade || baseDoc.class || 'unknown',
        academicYear: new Date().getFullYear(),
        isEnrolled: true
      };
      
    default:
      return baseDoc;
  }
}

function getScenarioMetadata(scenario: string, userId: string): any {
  return {
    userId,
    scenario,
    source: 'workflow',
    processedAt: new Date(),
    version: '1.0'
  };
}

function generateScenarioSummary(scenario: string, documents: any[]): any {
  const summary: any = {
    scenario,
    totalRecords: documents.length,
    timestamp: new Date().toISOString()
  };
  
  switch (scenario) {
    case 'E-commerce Product Catalog':
      summary.categories = Array.from(new Set(documents.map(d => d.category)));
      summary.avgPrice = documents.reduce((sum, d) => sum + (parseFloat(d.price) || 0), 0) / documents.length;
      break;
      
    case 'Employee Management':
      summary.departments = Array.from(new Set(documents.map(d => d.department)));
      summary.avgSalary = documents.reduce((sum, d) => sum + (parseFloat(d.salary) || 0), 0) / documents.length;
      break;
      
    case 'CRM Lead Management':
      summary.leadSources = Array.from(new Set(documents.map(d => d.source)));
      summary.avgLeadScore = documents.reduce((sum, d) => sum + (d.leadScore || 0), 0) / documents.length;
      break;
  }
  
  return summary;
}

// Helper functions
function getPriceRange(price: any): string {
  const p = parseFloat(price);
  if (p < 50) return 'budget';
  if (p < 200) return 'mid-range';
  return 'premium';
}

function getSalaryBand(salary: any): string {
  const s = parseFloat(salary);
  if (s < 50000) return 'entry-level';
  if (s < 80000) return 'mid-level';
  return 'senior-level';
}

function calculateLeadScore(lead: any): number {
  let score = 50; // Base score
  if (lead.email) score += 20;
  if (lead.phone) score += 15;
  if (lead.company) score += 10;
  if (lead.title) score += 5;
  return Math.min(score, 100);
}

export async function InsertExecutor(
  enviornment: ExecutionEnviornment<typeof MongoDBTask>
): Promise<boolean> {
  let client: MongoClient | null = null;
  
  try {
    const collection = enviornment.getInput("Collection");
    const document = enviornment.getInput("Document");
    const sheetsData = enviornment.getInput("Data"); // From Google Sheets
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

    enviornment.log.info("🔌 Connecting to MongoDB...");
    client = new MongoClient(credentials.connection_string);
    await client.connect();
    const db = client.db();
    const coll = db.collection(collection);

    // Scenario-based data processing
    if (sheetsData) {
      enviornment.log.info("📊 Processing input data for scenario-based insert");
      
      let parsedData;
      try {
        parsedData = JSON.parse(sheetsData);
      } catch {
        enviornment.log.error("❌ Invalid JSON data from input");
        return false;
      }
      
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        const documents = [];
        const headers = parsedData[0]; // First row as headers
        
        // Detect scenario based on collection name and headers
        const scenario = detectScenario(collection, headers);
        enviornment.log.info(`🎯 Detected scenario: ${scenario}`);
        
        for (let i = 1; i < parsedData.length; i++) {
          const row = parsedData[i];
          if (Array.isArray(row)) {
            const doc = processRowByScenario(scenario, headers, row, enviornment.userId);
            if (doc) documents.push(doc);
          }
        }
        
        if (documents.length > 0) {
          const result = await coll.insertMany(documents);
          enviornment.setOutput("Result", JSON.stringify({
            scenario,
            insertedCount: result.insertedCount,
            insertedIds: Object.values(result.insertedIds),
            summary: generateScenarioSummary(scenario, documents)
          }));
          enviornment.setOutput("Count", String(result.insertedCount));
          enviornment.log.info(`✅ ${scenario}: Inserted ${result.insertedCount} records`);
          return true;
        }
      }
    }
    
    // Handle manual document insert
    if (document) {
      const parsedDoc = JSON.parse(document);
      const scenario = detectScenario(collection, Object.keys(parsedDoc));
      enviornment.log.info(`🎯 Manual insert scenario: ${scenario}`);
      
      // Check if it's an array (bulk insert)
      if (Array.isArray(parsedDoc)) {
        const enrichedDocs = parsedDoc.map(doc => ({
          ...doc,
          ...getScenarioMetadata(scenario, enviornment.userId),
          createdAt: new Date()
        }));
        
        const result = await coll.insertMany(enrichedDocs);
        
        enviornment.setOutput("Result", JSON.stringify({
          scenario,
          insertedCount: result.insertedCount,
          insertedIds: Object.values(result.insertedIds)
        }));
        enviornment.setOutput("Count", String(result.insertedCount));
        enviornment.log.info(`✅ ${scenario}: Bulk inserted ${result.insertedCount} documents`);
        return true;
      } else {
        // Single document
        const enrichedDoc = {
          ...parsedDoc,
          ...getScenarioMetadata(scenario, enviornment.userId),
          createdAt: new Date()
        };
        
        const result = await coll.insertOne(enrichedDoc);
        
        enviornment.setOutput("Result", JSON.stringify({
          scenario,
          insertedId: result.insertedId,
          acknowledged: result.acknowledged
        }));
        enviornment.setOutput("Count", "1");
        enviornment.log.info(`✅ ${scenario}: Document inserted with ID: ${result.insertedId}`);
        return true;
      }
    }
    
    enviornment.log.error("❌ No document data provided");
    return false;

  } catch (error: any) {
    enviornment.log.error(`❌ MongoDB Insert Error: ${error.message}`);
    return false;
  } finally {
    if (client) {
      await client.close();
      enviornment.log.info("🔌 MongoDB connection closed");
    }
  }
}