import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { requireAuth } from "@/lib/auth-utils";
import { getCredentialValue } from "@/lib/credential-helper";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const { credentialId, collection, query = {}, limit = 50 } = await request.json();

    if (!credentialId || !collection) {
      return NextResponse.json({ error: "Credential and collection required" }, { status: 400 });
    }

    const credentials = await getCredentialValue(credentialId, userId);
    if (!credentials?.connection_string) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const client = new MongoClient(credentials.connection_string);
    await client.connect();
    
    const db = client.db();
    const coll = db.collection(collection);
    
    // Add user filter for security
    const userQuery = { ...query, userId };
    
    const data = await coll.find(userQuery)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
    
    const count = await coll.countDocuments(userQuery);
    
    await client.close();
    
    return NextResponse.json({
      data: data.map(doc => ({
        ...doc,
        _id: doc._id.toString()
      })),
      count,
      collection,
      query: userQuery
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}