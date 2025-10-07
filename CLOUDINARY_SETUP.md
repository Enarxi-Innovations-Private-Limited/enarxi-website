# Cloudinary Integration Setup Guide

## ✅ Current Implementation Status

### What's Working:
- ✅ **Staff Portal**: Images upload to Cloudinary on blog submission
- ✅ **Firestore**: Stores Cloudinary URLs with metadata (url, publicId, format, width, height)
- ✅ **Admin Portal**: Displays images from Cloudinary URLs
- ✅ **Website**: Fetches and displays blog images from Cloudinary
- ✅ **Image Validation**: 5MB file size limit
- ✅ **Error Handling**: Comprehensive error messages for upload failures
- ✅ **Backward Compatibility**: Supports old local image paths

### What Needs Backend (Optional Enhancement):
- ⚠️ **Cloudinary Deletion**: Currently logs public_id to console (requires backend API for secure deletion)

---

## 🔧 Environment Setup

### 1. Create `.env` file in project root:

```bash
# Copy from .env.example
cp .env.example .env
```

### 2. Add your Cloudinary credentials:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=enarxi_unsigned
```

**Where to find these:**
1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. **Cloud Name**: Found in dashboard top-right
3. **Upload Preset**: Settings → Upload → Upload presets → `enarxi_unsigned`

---

## 📦 Cloudinary Upload Preset Configuration

Your current preset: **`enarxi_unsigned`**

### Settings:
```
✅ Unsigned: ON (allows frontend uploads)
✅ Folder: enarxi/blogs (auto-organizes uploads)
✅ Disallow Public ID: OFF (Cloudinary generates unique IDs)
✅ Generate Public ID: default auto (random IDs for security)
✅ Generate Display Name: default (uses original filename)
```

### Recommended Additional Settings:
1. **Max File Size**: 5MB (already enforced in frontend)
2. **Allowed Formats**: jpg, jpeg, png, webp, gif
3. **Auto Tagging**: Add tag "blog_image" for easy filtering
4. **Transformations**: 
   - Auto quality: `q_auto`
   - Auto format: `f_auto`
   - Max width: `w_1920`

---

## 🚀 How It Works

### Staff Blog Submission Flow:

```
1. Staff writes blog + selects images
   ↓
2. Click "Submit Blog Post"
   ↓
3. Frontend validates file sizes (max 5MB each)
   ↓
4. Upload each image to Cloudinary
   - Shows progress: "📤 Uploaded 1/3 images..."
   ↓
5. Cloudinary returns:
   {
     url: "https://res.cloudinary.com/...",
     publicId: "enarxi/blogs/xyz123",
     format: "jpg",
     width: 1920,
     height: 1080
   }
   ↓
6. Save blog to Firestore with Cloudinary URLs
   ↓
7. Success: "✅ Blog saved! 3 image(s) uploaded to Cloudinary"
```

### Admin Approval Flow:

```
1. Admin views pending blogs
   ↓
2. Click "View Blog" → Images load from Cloudinary URLs
   ↓
3. Option A: Click "Accept" → Blog becomes public
   Option B: Click "Delete" → 
      - Deletes blog from Firestore
      - Logs Cloudinary public_ids to console
      - (Backend needed for actual Cloudinary deletion)
```

### Website Display Flow:

```
1. User visits /blogs
   ↓
2. Fetch approved blogs from Firestore
   ↓
3. Display blog cards with Cloudinary images
   ↓
4. Click "View Post" → Modal shows full blog with all images
   ↓
5. Images load from Cloudinary CDN (fast, optimized)
```

---

## 🔐 Security Considerations

### Current Setup (Unsigned Upload):
- ✅ **Pros**: 
  - No API secrets exposed in frontend
  - Simple implementation
  - Works without backend
  
- ⚠️ **Cons**:
  - Anyone with preset name can upload
  - No server-side validation
  - Deletion requires backend

### Mitigation:
1. **Upload Preset Restrictions**:
   - Set folder to `enarxi/blogs` (isolates uploads)
   - Enable "Unique filename" (prevents overwrites)
   - Set max file size in Cloudinary settings

2. **Frontend Validation**:
   - File type check: `accept="image/*"`
   - Size limit: 5MB enforced before upload
   - User authentication required (Firebase Auth)

3. **Firestore Security Rules**:
   ```javascript
   match /blogs/{blogId} {
     allow create: if request.auth != null;
     allow read: if resource.data.isAdminAccepted == true;
     allow update, delete: if request.auth.token.admin == true;
   }
   ```

---

## 🗑️ Image Deletion (Backend Implementation)

### Current Behavior:
When admin deletes a blog, the system:
1. ✅ Deletes blog document from Firestore
2. ⚠️ Logs Cloudinary public_ids to console
3. ❌ Does NOT delete from Cloudinary (requires backend)

### Why Backend is Needed:
Cloudinary deletion requires **API Secret**, which cannot be exposed in frontend.

### Implementation Options:

#### Option 1: Firebase Cloud Function (Recommended)

**File**: `functions/cloudinaryDelete.js` (already created)

**Setup**:
```bash
# 1. Install dependencies
cd functions
npm install cloudinary

# 2. Set Cloudinary credentials
firebase functions:config:set cloudinary.cloud_name="YOUR_CLOUD_NAME"
firebase functions:config:set cloudinary.api_key="YOUR_API_KEY"
firebase functions:config:set cloudinary.api_secret="YOUR_API_SECRET"

# 3. Deploy function
firebase deploy --only functions
```

**Update BlogsTable.jsx**:
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const deleteCloudinaryImage = httpsCallable(functions, 'deleteCloudinaryImage');

// In handleDelete function:
for (const imageData of blogImages) {
  const publicId = imageData.publicId || extractPublicId(imageData.url);
  if (publicId) {
    await deleteCloudinaryImage({ publicId });
  }
}
```

#### Option 2: Custom Backend API

**Express.js Example**:
```javascript
// server.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post('/api/cloudinary/delete', async (req, res) => {
  const { publicId } = req.body;
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Option 3: Manual Cleanup (Temporary)

**Until backend is implemented**:
1. Admin deletes blog → public_ids logged to console
2. Copy public_ids from browser console
3. Go to Cloudinary Dashboard → Media Library
4. Search for public_id
5. Delete manually

**Or use Cloudinary CLI**:
```bash
npm install -g cloudinary-cli
cld admin delete enarxi/blogs/image_id
```

---

## 📊 Monitoring & Maintenance

### Cloudinary Dashboard:
- **Media Library**: View all uploaded images
- **Transformations**: Monitor CDN usage
- **Reports**: Track bandwidth and storage
- **Quota**: Free tier = 25GB storage, 25GB bandwidth/month

### Cleanup Strategy:
1. **Orphaned Images**: Images uploaded but blog never saved
   - Solution: Implement cleanup job to delete images older than 24h without associated blog
   
2. **Deleted Blogs**: Images remain in Cloudinary after blog deletion
   - Solution: Implement backend deletion (see above)
   
3. **Old Images**: Accumulation over time
   - Solution: Archive or delete blogs older than X years

---

## 🧪 Testing Checklist

### Staff Portal:
- [ ] Upload single image → Verify Cloudinary URL in Firestore
- [ ] Upload multiple images → Check all URLs saved
- [ ] Upload 6MB image → Should show error
- [ ] Upload without images → Should work (empty images array)
- [ ] Network error during upload → Should show error message

### Admin Portal:
- [ ] View blog with images → Images load from Cloudinary
- [ ] Approve blog → Images remain accessible
- [ ] Delete blog → Blog removed, public_ids logged to console
- [ ] View blog without images → No errors

### Website:
- [ ] Blog list shows Cloudinary images
- [ ] Click "View Post" → Modal displays images
- [ ] Multiple images → Thumbnail gallery appears
- [ ] Image load error → Fallback to default image

---

## 🐛 Troubleshooting

### Issue: "Cloudinary configuration missing"
**Solution**: Check `.env` file has `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`

### Issue: Upload fails with 401 Unauthorized
**Solution**: Verify upload preset is set to "Unsigned" in Cloudinary dashboard

### Issue: Images not displaying on website
**Solution**: 
1. Check browser console for CORS errors
2. Verify Cloudinary URLs in Firestore are valid
3. Check image format is supported (jpg, png, webp, gif)

### Issue: Upload is slow
**Solution**: 
1. Compress images before upload
2. Use WebP format for better compression
3. Check internet connection speed

### Issue: "Failed to upload image"
**Possible Causes**:
- File size > 5MB
- Invalid image format
- Network timeout
- Cloudinary quota exceeded
- Upload preset doesn't exist

---

## 📈 Future Enhancements

1. **Image Compression**: Auto-compress before upload using browser API
2. **Progress Bar**: Show upload progress per image
3. **Drag & Drop**: Improve UX with drag-drop interface
4. **Image Cropping**: Allow staff to crop/resize before upload
5. **Bulk Upload**: Upload multiple blogs at once
6. **Image Gallery**: Rich text editor with inline image insertion
7. **Lazy Loading**: Implement intersection observer for blog list
8. **CDN Optimization**: Use Cloudinary transformations (q_auto, f_auto)
9. **Analytics**: Track most viewed blog images
10. **Backup**: Periodic backup of Cloudinary URLs to external storage

---

## 📞 Support

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Firebase Functions**: https://firebase.google.com/docs/functions
- **Issues**: Check browser console and Cloudinary dashboard logs

---

## 🎉 Summary

Your Cloudinary integration is **fully functional** for:
- ✅ Uploading images from Staff Portal
- ✅ Storing URLs in Firestore
- ✅ Displaying images in Admin Portal
- ✅ Showing images on public website

**Optional Enhancement**: Implement backend API for automatic Cloudinary deletion when admin rejects blogs.

**Current Workaround**: Manual deletion via Cloudinary dashboard or CLI.
