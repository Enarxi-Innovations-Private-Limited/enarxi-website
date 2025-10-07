# ✅ Cloudinary Deletion - Quick Setup Checklist

## 🚀 Setup Steps (5 minutes)

### Step 1: Add API Credentials to `.env`

```bash
# Open or create .env file
nano .env

# Add these lines (replace with your actual values):
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=enarxi_unsigned
VITE_CLOUDINARY_API_KEY=your_api_key_here
VITE_CLOUDINARY_API_SECRET=your_api_secret_here
```

**Where to find credentials:**
1. Go to https://cloudinary.com/console
2. Click on "Dashboard" or "Settings"
3. **Cloud Name**: Top-right corner
4. **API Key & Secret**: Settings → Security → API Keys
5. Click "Reveal" to see API Secret

### Step 2: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

**Important**: Environment variables are only loaded on server start!

### Step 3: Test Deletion

1. Login as admin
2. Go to Blog Review section
3. Find a test blog with image
4. Click "Delete" button
5. Confirm deletion

**Expected Result**:
- ✅ Toast: "Deleting image(s) from Cloudinary..."
- ✅ Toast: "✅ Blog and X image(s) deleted successfully!"
- ✅ Blog removed from list

### Step 4: Verify in Cloudinary

1. Go to https://cloudinary.com/console
2. Navigate to Media Library
3. Search for deleted image
4. Should show "No results found"

---

## 🔍 Quick Troubleshooting

### Issue: "Cloudinary credentials missing"
**Fix**: Add all 3 credentials to `.env` and restart server

### Issue: "Invalid signature"
**Fix**: Double-check API_SECRET matches Cloudinary dashboard

### Issue: Images not deleting
**Fix**: 
1. Check browser console for errors
2. Verify API credentials are correct
3. Check Cloudinary usage quota

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] `.env` file has all Cloudinary credentials
- [ ] Tested deletion with single image
- [ ] Tested deletion with multiple images
- [ ] Tested deletion without images
- [ ] Verified images deleted from Cloudinary dashboard
- [ ] Checked browser console for errors
- [ ] Tested on different browsers
- [ ] Verified only admins can delete blogs
- [ ] Documented API credentials securely
- [ ] Set up Cloudinary backups (optional but recommended)

---

## 🎯 What's Implemented

✅ **Secure Deletion**: Uses signed SHA-256 requests  
✅ **Automatic Cleanup**: Images deleted when blog deleted  
✅ **Progress Tracking**: Real-time toast notifications  
✅ **Error Handling**: Graceful failures with clear messages  
✅ **Batch Deletion**: Multiple images per blog  
✅ **Fallback**: Continues even if some images fail  

---

## 📁 Modified Files

1. ✅ `/src/utils/uploadToCloudinary.js` - Added signed deletion function
2. ✅ `/src/routers/admin/BlogsTable.jsx` - Updated delete handler
3. ✅ `.env.example` - Added API_KEY and API_SECRET placeholders

---

## 🔐 Security Notes

**API Credentials in Frontend:**
- Used only for deletion (not upload)
- Protected by Firebase admin authentication
- Can be rotated if compromised
- Rate-limited by Cloudinary

**Best Practices:**
- Rotate API_SECRET every 3-6 months
- Monitor Cloudinary usage dashboard
- Enable Cloudinary backups for recovery
- Consider implementing audit trail

---

## 📞 Need Help?

- **Full Guide**: `CLOUDINARY_DELETION_GUIDE.md`
- **Setup Guide**: `CLOUDINARY_SETUP.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

**Status**: ✅ Ready to test! Just add credentials and restart server.
