module.exports = {
  apps: [
    {
      name: 'messaging-backend',
      script: 'src/server.js',
      instances: 1, // With Socket.IO, start with 1 instance unless you use a Redis adapter for multi-instance clustering
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
