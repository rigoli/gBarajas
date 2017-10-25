const config = {
  serverPort: 3000,
  mongoEnable: true,  // Afinar con las funciones
  defaultDB: "mssql",
  userTest: 1,

  mongodb: {
    host: 'localhost',
    port: '27017',
    database: 'gbarajasLog'
  },
  mssql: {
    user: 'sa',
    password: 'servegame',
    server: 'localhost',
    database: 'gbarajasReportes'
  }
}

module.exports = config
