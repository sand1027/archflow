// Migration script to update old task types to new ones
const mongoose = require('mongoose');

const TASK_TYPE_MAPPING = {
  'LAUNCH_BROWSER': 'START',
  'PAGE_TO_HTML': 'HTTP_REQUEST',
  'EXTRACT_TEXT_FROM_ELEMENT': 'HTTP_REQUEST',
  'FILL_INPUT': 'HTTP_REQUEST',
  'CLICK_ELEMENT': 'HTTP_REQUEST',
  'WAIT_FOR_ELEMENT': 'DELAY',
  'EXTRACT_DATA_WITH_AI': 'OPENAI',
  'NAVIGATE_URL': 'HTTP_REQUEST',
  'SCROLL_TO_ELEMENT': 'HTTP_REQUEST'
};

async function migrateWorkflows() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('workflows');

    const workflows = await collection.find({}).toArray();
    console.log(`Found ${workflows.length} workflows to migrate`);

    for (const workflow of workflows) {
      let definition;
      try {
        definition = JSON.parse(workflow.definition);
      } catch (e) {
        console.log(`Skipping workflow ${workflow._id} - invalid JSON`);
        continue;
      }

      let updated = false;

      if (definition.nodes) {
        definition.nodes.forEach(node => {
          if (node.data && node.data.type && TASK_TYPE_MAPPING[node.data.type]) {
            console.log(`Updating node ${node.id}: ${node.data.type} -> ${TASK_TYPE_MAPPING[node.data.type]}`);
            node.data.type = TASK_TYPE_MAPPING[node.data.type];
            updated = true;
          }
        });
      }

      if (updated) {
        await collection.updateOne(
          { _id: workflow._id },
          { 
            $set: { 
              definition: JSON.stringify(definition),
              updatedAt: new Date()
            }
          }
        );
        console.log(`Updated workflow ${workflow._id}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  migrateWorkflows();
}

module.exports = { migrateWorkflows };