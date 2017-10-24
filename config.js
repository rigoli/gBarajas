const config = {
  serverPort: 3000,
  mongoEnable: true,  // Afinar con las funciones
  defaultDB: "mssql",

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
