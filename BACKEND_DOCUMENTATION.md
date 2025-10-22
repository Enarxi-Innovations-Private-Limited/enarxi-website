# 🚀 Enarxi Backend Documentation

## 📋 Table of Contents
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Firebase Configuration](#-firebase-configuration)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Project Structure

```
backend/
├── config/
│   ├── firebase.js     # Firebase Admin SDK setup
│   └── cloudinary.js   # Cloudinary configuration
├── middleware/
│   └── auth.js         # Authentication & authorization
├── routes/
│   ├── users.js        # User management
│   ├── cloudinary.js   # Image handling
│   └── blogs.js        # Blog management
└── server.js           # Main server file
```

## ⚙️ Environment Setup

1. **Required Variables** (add to `.env`):
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   
   # Firebase
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Frontend
   FRONTEND_URL=http://localhost:3001
   ```

## 🔥 Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project
   - Enable Firestore Database and Authentication

2. **Service Account Setup**
   - Project Settings → Service Accounts
   - Generate new private key
   - Copy values to `.env`

3. **IAM Permissions**
   - Go to [Google Cloud IAM](https://console.cloud.google.com/iam-admin/iam)
   - Add these roles to your service account:
     - Cloud Datastore User
     - Firebase Admin SDK Administrator Service Agent

## 🌐 API Endpoints

### 🔐 Authentication
All endpoints require a valid Firebase ID token in the `Authorization` header:
```
Authorization: Bearer <firebase_id_token>
```

### 👥 User Management
- `GET /api/users` - List all users (Admin only)
- `PUT /api/users/:uid/email` - Update user email
  ```json
  {
    "email": "new@example.com"
  }
  ```
- `PUT /api/users/:uid/password` - Update password
  ```json
  {
    "newPassword": "securePassword123!"
  }
  ```

### ☁️ Cloudinary
- `POST /api/cloudinary/upload` - Upload image
  ```form-data
  file: [image_file]
  folder: "blog_images"
  ```
- `POST /api/cloudinary/delete` - Delete image
  ```json
  {
    "publicId": "folder/filename"
  }
  ```

## 🛡️ Authentication

### JWT Validation
1. Frontend sends Firebase ID token in `Authorization` header
2. Backend verifies token using Firebase Admin SDK
3. For admin routes, checks user's role in Firestore

### Admin Access
Add `role: 'admin'` to user document in Firestore:
```javascript
{
  email: "admin@example.com",
  role: "admin",
  createdAt: FieldValue.serverTimestamp()
}
```

## 🚨 Error Handling

### Common Errors
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side issue

### Error Response Format
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable message"
}
```

## 🚀 Deployment

### 1. Production Environment
```env
NODE_ENV=production
PORT=3000
# Other production variables...
```

### 2. PM2 Setup
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name "enarxi-backend"

# Save process list
pm2 save

# Set up startup script
pm2 startup
```

## 🔧 Troubleshooting

### 1. Firebase Permission Denied
- Verify service account has correct IAM roles
- Check `.env` for correct values
- Ensure `FIREBASE_PRIVATE_KEY` has `\n` characters

### 2. CORS Issues
- Verify `FRONTEND_URL` in `.env`
- Check browser console for CORS errors

### 3. Image Upload Fails
- Verify Cloudinary credentials
- Check file size (<10MB)
- Ensure valid image format

## 📝 License
MIT License - See [LICENSE](LICENSE) for details.

## 📞 Support
For support, contact: kumar@enarxi.com