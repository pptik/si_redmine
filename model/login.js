require('dotenv').config();
const { MongoClient } = require('mongodb');


// Connection URL
const url = process.env.DB_URL;
// const url = 'mongodb://root:root123@localhost:27017';
const client = new MongoClient(url);
dbName=process.env.DB_NAME;

async function getAll() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = await collection.find({}).count();
    // console.log('Found documents =>', findResult);
  
    return findResult;
  }

  async function groupByUser() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = 
    await collection.aggregate([
      {"$group" : {_id:"$payload.user_id", count:{$sum:1}}}
  
  // await collection.aggregate([{ $group: {
  //   _id: new Date("$payload.log_create_at").getMonth(),
  //   numberofbookings: { $sum: 1 }
  // }}
])

  return findResult.toArray()
}
  async function groupByMonth(tahun) {
    const currentYear = new Date().getFullYear()
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = 
      await collection.aggregate([

        {
          $project:
         {
           "year": { $year: { $toDate: "$payload.log_create_at" } },
           "month": { $month: { $toDate: "$payload.log_create_at" } },
          }
        },

        // {

          { $match: { year:parseInt(tahun)}},

       



        { $group: {
      _id: "$month",
      numberoflogin: { $sum: 1 }
    }},
    {"$sort": { "_id": 1 }},
    
    
    
  ])

  return findResult.toArray()
}

  async function groupByDay(tahun, bulan) {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = 
      await collection.aggregate([
        {
          $project:
         {
           "year": { $year: { $toDate: "$payload.log_create_at" } },
           "month": { $month: { $toDate: "$payload.log_create_at" } },
           "day": { $dayOfMonth: { $toDate: "$payload.log_create_at" }},
          }
        },
        
        { $match: { $and:[{year:parseInt(tahun)}, {month:parseInt(bulan)}]}},

        { $group: {
      _id: "$day",
      numberoflogin: { $sum: 1 }
    }},
    {"$sort": { "_id": 1 }},
  ])

  return findResult.toArray()
}


  async function groupByUser(tahun, bulan) {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = 
      await collection.aggregate([
        {
          $project:
         {
           "year": { $year: { $toDate: "$payload.log_create_at" } },
           "month": { $month: { $toDate: "$payload.log_create_at" } },
           "day": { $dayOfMonth: { $toDate: "$payload.log_create_at" }},
           "user_id":"$payload.user_id",
           "user_name":"$user",
          }
        },
        
        { $match: { $and:[{year:parseInt(tahun)}, {month:parseInt(bulan)}]}},

        { $group: {
      // _id: "$day",
      _id:"$user_id",
      user_name: { $first: "$user_name" }, 
      numberoflogin: { $sum: 1 }
    }},
    {"$sort": { "numberoflogin": -1 }},
    { $limit : 5 }
  ])

  return findResult.toArray()
}
  async function allMonth() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('login_logs');
  
    // const findResult = await collection.find({}).toArray();
    const findResult = 
       collection.aggregate([
        {
          $project:
         {
           "year": { $year: { $toDate: "$payload.log_create_at" } },
           "month": { $month: { $toDate: "$payload.log_create_at" } },
           "day": { $dayOfMonth: { $toDate: "$payload.log_create_at" }},
           "user_id":"$payload.user_id",
           "user_name":"$user",
          }
        },
        { $group: {
      _id:{"month":"$month", "year":"$year"},
      numberoflogin: { $sum: 1 }
    }},
    {"$sort": { "_id.year": -1, "_id.month":-1 }},
    
  ])

  return findResult.toArray()
}


function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('id', { month: 'long' });
}
  module.exports={getAll, groupByUser, groupByMonth, groupByDay, allMonth}



  // { $month: { date: Date("2022-11-03 08:52:20 UTC") } }
// { $month: { date: ISODate("2040-10-28T23:58:18Z") } }