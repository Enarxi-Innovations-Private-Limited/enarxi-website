# Our Team Feature - Final Checklist

## 📋 Pre-Launch Checklist

### Environment Setup
- [ ] Add `VITE_CLOUDINARY_UPLOAD_PRESET_OUR_TEAM=enarxi_our_team` to `.env`
- [ ] Verify `VITE_CLOUDINARY_CLOUD_NAME` is set
- [ ] Verify `VITE_CLOUDINARY_API_KEY` is set
- [ ] Verify `VITE_CLOUDINARY_API_SECRET` is set
- [ ] Restart development server after adding env variables

### Cloudinary Configuration
- [ ] Login to [Cloudinary Console](https://cloudinary.com/console)
- [ ] Navigate to Settings → Upload → Upload presets
- [ ] Create new upload preset named `enarxi_our_team`
- [ ] Set signing mode to "Unsigned"
- [ ] Set folder to `enarxi/our_team` (optional but recommended)
- [ ] Save preset

### Firebase Setup
- [ ] Firestore collection `teamMembers` will auto-create on first add
- [ ] Create composite index when prompted (or manually):
  - Collection: `teamMembers`
  - Fields: `order` (asc), `__name__` (asc)
- [ ] Optional: Create index for public queries:
  - Collection: `teamMembers`
  - Fields: `visibility` (asc), `order` (asc)

---

## 🧪 Testing Checklist

### Access & Navigation
- [ ] Login to Admin Portal
- [ ] Sidebar shows "Our Team" menu item
- [ ] "Our Team" is positioned between "Staff Management" and "Blog Review"
- [ ] Clicking "Our Team" loads the TeamTable component
- [ ] Empty state shows when no team members exist

### Add New Team Member
- [ ] Click "+ Add New" button
- [ ] Modal opens with "Add New Team Member" title
- [ ] All form fields are visible (Image, Name, Role, Visibility)
- [ ] Visibility toggle defaults to checked (true)

#### Image Upload - 4:5 Aspect Ratio
- [ ] Upload image with 4:5 ratio (e.g., 800x1000) → accepted directly
- [ ] Upload image with different ratio → crop modal opens
- [ ] Crop modal title shows "Crop Image to 4:5"
- [ ] Crop area is 4:5 aspect ratio
- [ ] Zoom slider works
- [ ] Rotate button works
- [ ] Cancel closes crop modal
- [ ] "Crop & Continue" processes image
- [ ] Cropped image appears in preview
- [ ] Image preview shows 4:5 ratio box

#### Form Validation
- [ ] Submit without name → error toast
- [ ] Submit without role → error toast
- [ ] Submit without image → error toast
- [ ] Submit with all fields → success

#### Cloudinary Upload
- [ ] Image uploads to Cloudinary
- [ ] Upload uses `enarxi_our_team` preset
- [ ] Image appears in Cloudinary dashboard under `enarxi/our_team` folder
- [ ] Console shows upload success

#### Firestore Creation
- [ ] Document created in `teamMembers` collection
- [ ] Document has correct structure:
  - `name` (string)
  - `role` (string)
  - `images` (array with format, height, width, publicId, url)
  - `visibility` (boolean)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)
  - `order` (number)
- [ ] `order` is set to end of list (existingMembersCount)

#### UI Feedback
- [ ] Loading spinner shows during upload
- [ ] "Adding..." text shows on button
- [ ] Success toast appears
- [ ] Modal closes automatically
- [ ] New member appears in table immediately

### Edit Team Member
- [ ] Click "Edit" on any team member
- [ ] Modal opens with "Edit Team Member" title
- [ ] Form pre-fills with existing data
- [ ] Image preview shows existing image
- [ ] Name field shows existing name
- [ ] Role field shows existing role
- [ ] Visibility toggle shows existing state

#### Edit Without Changing Image
- [ ] Change only name
- [ ] Click "Update Member"
- [ ] Success toast appears
- [ ] Modal closes
- [ ] Table updates with new name
- [ ] Image remains unchanged in Cloudinary

#### Edit With New Image
- [ ] Upload new image
- [ ] New image goes through validation/crop flow
- [ ] Click "Update Member"
- [ ] New image uploads to Cloudinary
- [ ] Document updates with new image data
- [ ] Success toast appears
- [ ] Table shows updated data

### Visibility Toggle
- [ ] Click eye icon on visible member → becomes hidden
- [ ] Icon changes from Eye to EyeOff
- [ ] Toast notification appears
- [ ] Firestore `visibility` field updates
- [ ] Firestore `updatedAt` timestamp updates
- [ ] Click EyeOff icon → becomes visible again
- [ ] Statistics card updates (Visible on Website count)

### Delete Team Member
- [ ] Click "Delete" button
- [ ] Confirmation dialog appears
- [ ] Dialog mentions Cloudinary and database deletion
- [ ] Click Cancel → nothing happens
- [ ] Click Confirm → deletion starts

#### Atomic Deletion Flow
- [ ] Loading toast appears: "Starting deletion process..."
- [ ] Toast updates: "Deleting image from Cloudinary..."
- [ ] Image deleted from Cloudinary (check console logs)
- [ ] Toast updates: "Deleting member from database..."
- [ ] Document deleted from Firestore
- [ ] Success toast: "Team member deleted successfully!"
- [ ] Member removed from table
- [ ] Statistics cards update

#### Deletion Error Handling
- [ ] If Cloudinary deletion fails:
  - [ ] Error toast appears
  - [ ] Firestore document NOT deleted
  - [ ] Member remains in table
- [ ] If Firestore deletion fails:
  - [ ] Error toast appears
  - [ ] Member remains in table

### Drag-and-Drop Ordering
- [ ] Six-dot grip handle visible on left of each row
- [ ] Cursor changes to grab when hovering handle
- [ ] Click and hold handle → cursor changes to grabbing
- [ ] Drag row up → visual feedback (opacity, position)
- [ ] Drag row down → visual feedback
- [ ] Drop row → smooth animation
- [ ] Order updates in UI immediately

#### Order Persistence
- [ ] After drag-and-drop, check Firestore
- [ ] All affected documents have updated `order` values
- [ ] All affected documents have updated `updatedAt` timestamps
- [ ] Success toast appears: "Order updated successfully"
- [ ] Refresh page → order persists
- [ ] Open in another tab → order matches

### Real-time Updates
- [ ] Open Admin Portal in two browser tabs
- [ ] Add member in Tab 1 → appears in Tab 2 immediately
- [ ] Edit member in Tab 1 → updates in Tab 2 immediately
- [ ] Delete member in Tab 1 → removes from Tab 2 immediately
- [ ] Toggle visibility in Tab 1 → updates in Tab 2 immediately
- [ ] Reorder in Tab 1 → updates in Tab 2 immediately

### Statistics Cards
- [ ] "Total Team Members" shows correct count
- [ ] "Visible on Website" shows correct count
- [ ] Counts update after add
- [ ] Counts update after delete
- [ ] Counts update after visibility toggle

### Responsive Design
- [ ] Table displays correctly on desktop (1920px)
- [ ] Table displays correctly on laptop (1366px)
- [ ] Table displays correctly on tablet (768px)
- [ ] Table displays correctly on mobile (375px)
- [ ] Modal displays correctly on all screen sizes
- [ ] Drag-and-drop works on touch devices
- [ ] Images scale properly on all devices

### Animations & UX
- [ ] Modal opens with smooth animation
- [ ] Modal closes with smooth animation
- [ ] Table rows fade in on load
- [ ] Hover effects on buttons work
- [ ] Drag-and-drop has smooth transitions
- [ ] Loading spinners are visible
- [ ] Toast notifications appear and dismiss smoothly

---

## 🔗 Integration Testing (About Us Page)

### Query Team Members
- [ ] Create test component using example from `ABOUT_US_INTEGRATION_EXAMPLE.md`
- [ ] Query returns only visible members
- [ ] Query returns members in correct order
- [ ] Query handles empty state

### Display Images
- [ ] Images load with Cloudinary transformations
- [ ] Images are optimized (WebP for supported browsers)
- [ ] Images maintain 4:5 aspect ratio
- [ ] Images lazy load below fold
- [ ] Images have proper alt text

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Images are compressed
- [ ] No console errors
- [ ] No memory leaks

---

## 🐛 Error Scenarios to Test

### Network Errors
- [ ] Disable internet → show error toast
- [ ] Slow connection → loading states work
- [ ] Timeout → error handling works

### Invalid Data
- [ ] Upload non-image file → error toast
- [ ] Upload corrupted image → error toast
- [ ] Submit form with XSS attempt → sanitized

### Cloudinary Errors
- [ ] Wrong upload preset → error toast
- [ ] Upload limit exceeded → error toast
- [ ] Invalid credentials → error toast

### Firestore Errors
- [ ] Missing index → helpful error message
- [ ] Permission denied → error toast
- [ ] Quota exceeded → error toast

---

## 📊 Performance Checklist

### Load Time
- [ ] Initial page load < 2 seconds
- [ ] Table renders < 1 second
- [ ] Modal opens < 300ms

### Image Optimization
- [ ] Images use Cloudinary transformations
- [ ] Images are served as WebP when supported
- [ ] Images have proper dimensions (not oversized)
- [ ] Lazy loading implemented

### Database Queries
- [ ] Query uses index (no full collection scans)
- [ ] Real-time listener doesn't cause memory leaks
- [ ] Batch writes used for reordering

---

## 🔒 Security Checklist

### Authentication
- [ ] Only authenticated admins can access
- [ ] Unauthenticated users redirected to login

### Authorization
- [ ] Firestore rules allow admin write access
- [ ] Firestore rules allow public read access (visibility=true)
- [ ] Cloudinary upload preset is unsigned (for client uploads)
- [ ] Cloudinary API secret not exposed to client

### Data Validation
- [ ] Server-side validation (Firestore rules)
- [ ] Client-side validation (form validation)
- [ ] Image file type validation
- [ ] Image size limits enforced

---

## 📝 Documentation Checklist

- [x] `OUR_TEAM_SETUP_GUIDE.md` created
- [x] `ABOUT_US_INTEGRATION_EXAMPLE.md` created
- [x] `IMPLEMENTATION_SUMMARY.md` created
- [x] `OUR_TEAM_CHECKLIST.md` created (this file)
- [ ] README.md updated with Our Team feature
- [ ] Inline code comments are clear
- [ ] JSDoc comments for functions

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] Environment variables documented
- [ ] Cloudinary preset created in production
- [ ] Firestore indexes created in production

### Post-Deployment
- [ ] Test add member in production
- [ ] Test edit member in production
- [ ] Test delete member in production
- [ ] Test drag-and-drop in production
- [ ] Test visibility toggle in production
- [ ] Verify images appear on About Us page
- [ ] Check Cloudinary usage/quota
- [ ] Check Firestore usage/quota

---

## ✅ Sign-Off

### Developer
- [ ] All features implemented as specified
- [ ] Code follows project conventions
- [ ] No known bugs
- [ ] Documentation complete

### QA
- [ ] All test cases passed
- [ ] Edge cases tested
- [ ] Performance acceptable
- [ ] Security verified

### Product Owner
- [ ] Features meet requirements
- [ ] UX is intuitive
- [ ] Ready for production

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: "Cloudinary configuration missing"  
**Solution**: Add `VITE_CLOUDINARY_UPLOAD_PRESET_OUR_TEAM` to `.env` and restart server

**Issue**: "Failed-precondition" error  
**Solution**: Create Firestore composite index (Firebase will provide link)

**Issue**: Images not deleting from Cloudinary  
**Solution**: Verify `VITE_CLOUDINARY_API_KEY` and `VITE_CLOUDINARY_API_SECRET` are correct

**Issue**: Drag-and-drop not working  
**Solution**: Ensure `@dnd-kit` packages are installed

**Issue**: Crop modal not opening  
**Solution**: Check `react-easy-crop` is installed and `imageCropUtils.js` exists

### Debug Commands

```bash
# Check environment variables
cat .env | grep CLOUDINARY

# Check installed packages
npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Check Firestore indexes
# Go to Firebase Console → Firestore → Indexes

# Check Cloudinary preset
# Go to Cloudinary Console → Settings → Upload → Upload presets

# Restart dev server
npm run dev
```

---

## 🎉 Completion Criteria

Feature is complete when:
- ✅ All checklist items above are checked
- ✅ No critical bugs
- ✅ Documentation is complete
- ✅ Code is deployed to production
- ✅ Team members can be managed successfully
- ✅ About Us page displays team members correctly

---

**Status**: 🟡 Ready for Testing  
**Next Step**: Complete this checklist  
**Target**: 🟢 Production Ready

---

**Created**: 2025-10-10  
**Version**: 1.0.0  
**Last Updated**: 2025-10-10
