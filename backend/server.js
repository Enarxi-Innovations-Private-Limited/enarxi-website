import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import session from 'express-session';

// Import routes
import usersRoutes from './routes/users.js';
import cloudinaryRoutes from './routes/cloudinary.js';
import blogsRoutes from './routes/blogs.js';
import statsRoutes from './routes/stats.js';

// Import middleware
import { optionalAuthenticate } from './middleware/auth.js';
import { trackVisitor } from './middleware/visitorTracker.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['PORT', 'FRONTEND_URL', 'SESSION_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please check your .env file');
  process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Disable CSP as it's handled by frontend
}));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL.split(',').map(url => url.trim()),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Visitor tracking (applied globally)
app.use(optionalAuthenticate);
app.use(trackVisitor);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Enarxi Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/users', usersRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
// Enhanced 404 handler with detailed logging
app.use((req, res) => {
  console.error('❌ 404 - Route Not Found');
  console.error('🧭 Method:', req.method);
  console.error('📍 Path:', req.originalUrl);
  console.error('🔢 Query:', req.query);
  console.error('📦 Body:', req.body);

  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    debug: {
      method: req.method,
      path: req.originalUrl,
      query: req.query,
      body: req.body
    }
  });
});


// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Enarxi Backend API Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📦 PORT = ${PORT}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Enarxi Backend API Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🚀 Enarxi Backend API Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET    /api/health                          - Health check');
  console.log('  DELETE /api/users/:uid                - Delete user');
  console.log('  PUT    /api/users/:uid/email            - Update user email');
  console.log('  PUT    /api/users/:uid/password         - Update user password');
  console.log('  PUT    /api/users/:uid                  - Update user profile');
  console.log('  POST   /api/cloudinary/delete           - Delete Cloudinary image');
  console.log('  POST   /api/cloudinary/delete-by-url    - Delete by URL');
  console.log('  POST   /api/cloudinary/delete-multiple  - Delete multiple images');
  console.log('  DELETE /api/blogs/:blogId             - Delete blog');
  console.log('  PUT    /api/blogs/:blogId/approve       - Approve blog');
  console.log('  PUT    /api/blogs/:blogId/reject        - Reject blog');
  console.log('  PUT    /api/blogs/:blogId/retry         - Request blog revision');
  console.log('  PUT    /api/blogs/:blogId               - Update blog content');
  console.log('═══════════════════════════════════════════════════════════');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

export default app;
