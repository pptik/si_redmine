const { MongoClient } = require('mongodb');


// Connection URL
const url = process.env.DB_URL;
const client = new MongoClient(url);
dbName=process.env.DB_NAME;
async function getAll() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('issue_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = await collection.find({}).count();
    // console.log('Found documents =>', findResult);
  
    return findResult;
  }
async function groupByProject(id) {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('issue_logs');
  
    // const findResult = await collection.find({}).toArray();
  //   const findResult = await collection.find({
  //     "payload.project.project_id":parseInt(id)
  // })

  const findResult = await collection.aggregate([
    {
      $project:
     {
       "year": { $year: { $toDate: "$payload.log_create_at" } },
       "month": { $month: { $toDate: "$payload.log_create_at" } },
       "payload.issue_id":1,
       "payload.issue_subject":1,
       "payload.project.project_id":1,
       "payload.project.project_name":1,
      }
    },
    { $match: { "payload.project.project_id":parseInt(id)}},
    { $group: {
      _id: "$payload.issue_id",
      name: {$first: "$payload.issue_subject"},
      project_name: {$first: "$payload.project.project_name"},
      numberofaccess: { $sum: 1 }
    }},
    {$limit:5}
  ])
  
    
    return findResult.toArray();
}
async function groupByIssue() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('issue_logs');
  
    // const findResult = await collection.find({}).toArray();
  //   const findResult = await collection.find({
  //     "payload.project.project_id":parseInt(id)
  // })

  const findResult = await collection.aggregate([
    {
      $project:
     {
       "year": { $year: { $toDate: "$payload.log_create_at" } },
       "month": { $month: { $toDate: "$payload.log_create_at" } },
       "payload.issue_id":1,
       "payload.issue_subject":1,
       "payload.project.project_id":1,
       "payload.project.project_name":1,
      }
    },
    // { $match: { "payload.project.project_id":parseInt(id)}},
    { $group: {
      _id: {"issue_id":"$payload.issue_id", "project_id":"$payload.project.project_id" },
      name: {$first: "$payload.issue_subject"},
      project_name: {$first: "$payload.project.project_name"},
      numberofaccess: { $sum: 1 }
    }},
  ])
  
    
    return findResult.toArray();
}
  
    

  module.exports={getAll, groupByProject, groupByIssue}


  