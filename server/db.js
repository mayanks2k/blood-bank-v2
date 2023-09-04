const mysql = require('mysql')

const pool = mysql.createPool({
  user: 'root',
  password: 'Sunbeam_@123',
  host: 'localhost',
  port: 3306,
  database: 'virtue_db',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

module.exports = pool


