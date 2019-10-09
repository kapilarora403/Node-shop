// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'admin'
// })

// module.exports = pool.promise()

// const Sequelize = require('sequelize')

// const sequelize = new Sequelize('node-complete', 'root', 'admin', {dialect: 'mysql', host: 'localhost'})

// module.exports = sequelize

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

// let _db

// const mongoConnect = (callback) => {
//     MongoClient.connect('mongodb://localhost/shop', {useNewUrlParser: true, useUnifiedTopology: true} ).then(client => {
//     console.log('Connected!')
//     _db = client.db()
//     callback()
// }).catch(err => {throw err})

// }

// const getDb = () => {
//     if (_db) {
//         return _db
//     }
//     throw 'No database found'
// }

// exports.mongoConnect = mongoConnect
// exports.getDb = getDb

