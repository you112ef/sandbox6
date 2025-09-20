import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.API_PORT || '8000'),
    logLevel: process.env.LOG_LEVEL || 'info',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://vibecode:password@localhost:5432/vibecode_db',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    cookieSecret: process.env.COOKIE_SECRET || 'your-cookie-secret',
    bcryptRounds: 12,
    tokenExpiry: '7d',
    refreshTokenExpiry: '30d',
  },
  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  cors: {
    origins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
  },
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4-turbo-preview',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-sonnet-20240229',
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
      model: 'gemini-pro',
    },
  },
  deployment: {
    vercel: {
      token: process.env.VERCEL_TOKEN,
    },
    netlify: {
      token: process.env.NETLIFY_TOKEN,
    },
    flyio: {
      token: process.env.FLY_IO_TOKEN,
    },
  },
  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucketName: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION || 'us-east-1',
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
      serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },
  sandbox: {
    timeout: parseInt(process.env.SANDBOX_TIMEOUT || '30000'),
    memoryLimit: process.env.SANDBOX_MEMORY_LIMIT || '512m',
    cpuLimit: process.env.SANDBOX_CPU_LIMIT || '0.5',
    dockerRegistry: process.env.DOCKER_REGISTRY || 'vibecode',
  },
  websocket: {
    port: parseInt(process.env.WEBSOCKET_PORT || '8080'),
    path: process.env.WEBSOCKET_PATH || '/socket.io',
  },
  github: {
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  monitoring: {
    prometheus: {
      port: parseInt(process.env.PROMETHEUS_PORT || '9090'),
    },
    grafana: {
      port: parseInt(process.env.GRAFANA_PORT || '3001'),
    },
  },
} as const

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

export default config