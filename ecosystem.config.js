module.exports = {
  apps: [
    {
      name: "peshop-client",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000, // Change this if you want to run on a different port
      },
    },
  ],
};
