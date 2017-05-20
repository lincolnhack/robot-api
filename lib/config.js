const config = {
  node_env: process.env.NODE_ENV || 'dev',
  server: {
    host: process.env.HOST || undefined,
    port: Number(process.env.PORT || 5000),
  },
}

module.exports = config
