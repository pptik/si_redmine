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
    const collection = db.collection('project_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = await collection.find({}).count();
    // console.log('Found documents =>', findResult);
  
    return findResult;
  }

  async function groupMonth() {
    const currentYear = new Date().getFullYear()
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('project_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult =
    //  await collection.aggregate([
    //   {"$group" : {_id:"$payload.user_id", count:{$sum:1}}}

    // await collection.aggregate([{ 
    //   $group: {
    //     _id: {$substr: ['$payload.log_create_at', 5, 2]}, 
    //     numberofbookings: {$sum: 1}
    // }}

    await collection.aggregate([

      {
        $project:
       {
         "year": { $year: { $toDate: "$payload.log_create_at" } },
         "month": { $month: { $toDate: "$payload.log_create_at" } },
        }
      },

      // {

        { $match: { year:currentYear}},

     



      { $group: {
    _id: "$month",
    numberoflogin: { $sum: 1 }
  }},
  {"$sort": { "_id": 1 }},
  
  
  
])

return findResult.toArray()
}

  async function allProject() {
    const currentYear = new Date().getFullYear()
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('project_logs');
    const findResult =
    await collection.aggregate([

      {
        $project:
       {
         "year": { $year: { $toDate: "$payload.log_create_at" } },
         "month": { $month: { $toDate: "$payload.log_create_at" } },
         "payload.project_id":1, 
         "payload.project_name":1, 
        }
      },

      { $group: {
    _id: "$payload.project_id",
    name:{$first:"$payload.project_name"},
    numberofaccess: { $sum: 1 }
  }},
  {"$sort": { "_id": 1 }},
  
  
  
])

return findResult.toArray()
}

async function groupByProject(){
  const tahun = new Date().getFullYear()
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('project_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = await collection.aggregate([
      {
        $project:
       {
         "year": { $year: { $toDate: "$payload.log_create_at" } },
         "month": { $month: { $toDate: "$payload.log_create_at" } },
         "payload.project_id":1,
         "payload.project_name":1
        }
      },
      { $match: { year:tahun}},
      { $group: {
        _id: "$payload.project_id",
        name: {$first: "$payload.project_name"},
        numberofaccess: { $sum: 1 }
      }},
      {"$sort": { "_id": -1 }},
      {"$limit":5}
    ])

    return findResult.toArray();
}

groupMonth();
  module.exports={getAll, groupMonth, groupByProject, allProject}