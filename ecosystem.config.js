module.exports = {
  apps: [
    {
      name: 'e-recharge-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      watch: false,
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
