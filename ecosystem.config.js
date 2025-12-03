module.exports = {
  apps: [
    {
      name: "peshop-client",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/peshop-client",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logging
      error_file: "/var/log/pm2/peshop-client-error.log",
      out_file: "/var/log/pm2/peshop-client-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
