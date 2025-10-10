# Our Team Feature - Setup & Usage Guide

## Overview
The **Our Team** section in the Admin Portal allows you to manage team members displayed on the About Us page. This feature includes drag-and-drop ordering, image upload with automatic 4:5 aspect ratio cropping, visibility toggles, and atomic deletion with Cloudinary integration.

---

## Features Implemented

### ✅ Admin Portal Integration
- **Sidebar Menu**: "Our Team" menu item added between Staff Management and Blog Review
- **Switch Case**: Integrated into existing `AdminPortal.jsx` switch statement
- **Consistent UI**: Matches Blog Review and Staff Management styling

### ✅ Data Model (Firestore Collection: `teamMembers`)
Each document contains:
```javascript
{
  id: string,              // Firestore document ID
  name: string,            // Employee name
  role: string,            // Job title / designation
  images: [                // Array of images
    {
      format: string,      // e.g., "jpg"
      height: number,      // e.g., 1000
      width: number,       // e.g., 800
      publicId: string,    // e.g., "enarxi/our_team/john_doe"
      url: string          // Cloudinary URL
    }
  ],
  visibility: boolean,     // true/false
  createdAt: Timestamp,    // server timestamp
  updatedAt: Timestamp,    // server timestamp
  order: number            // numeric ordering field
}
```

### ✅ UI Components

#### TeamTable Component (`src/routers/admin/TeamTable.jsx`)
- **Real-time updates**: Uses `onSnapshot` for live data
- **Drag-and-drop ordering**: Implemented with `@dnd-kit` library
- **Six-dot drag handle**: Notion-like drag experience
- **Table columns**:
  - Drag handle (left)
  - Employee Name
  - Role
  - Visibility toggle (Eye/EyeOff icon)
  - Updated At (formatted: DD MMM YYYY, hh:mm a)
  - Actions (Edit | Delete)
- **Statistics cards**: Total members and visible members count

#### AddEditTeamModal Component (`src/routers/admin/AddEditTeamModal.jsx`)
- **Dual mode**: Single component handles both Add and Edit
- **Image upload with validation**:
  - Validates 4:5 aspect ratio
  - Auto-opens crop modal if ratio doesn't match
  - Shows image preview
- **Form fields**:
  - Employee Image (required for new, optional for edit)
  - Employee Name (required)
  - Role (required)
  - Visibility toggle (default: true)
- **Loading states**: Disabled inputs and spinner during submission

### ✅ Image Handling

#### Aspect Ratio Validation
- Target ratio: **4:5** (e.g., 800x1000px)
- Tolerance: 0.01 for floating-point comparison
- If image doesn't match → opens CropImageModal automatically

#### CropImageModal Updates
- Updated to support custom aspect ratios via `aspect` prop
- Default: 16/9 (for blogs)
- Team images: 4/5
- Dynamic title based on aspect ratio

#### Cloudinary Integration
- **Upload preset**: `VITE_CLOUDINARY_UPLOAD_PRESET_OUR_TEAM`
- **Upload function**: Updated `uploadToCloudinary()` to accept optional preset parameter
- **Stored data**: `url`, `publicId`, `format`, `width`, `height`

### ✅ Atomic Deletion
Follows the same pattern as Blog deletion:
1. **Confirmation modal**: User confirms deletion
2. **Delete from Cloudinary first**: Using `deleteFromCloudinary(publicId)`
3. **If Cloudinary deletion fails**: Abort, show error, do NOT delete from Firestore
4. **If Cloudinary deletion succeeds**: Delete Firestore document
5. **Toast notifications**: Loading, success, and error states

### ✅ Visibility Toggle
- Immediate update to Firestore
- Updates `updatedAt` timestamp
- Toast notification on success/error
- Eye icon (visible) / EyeOff icon (hidden)

### ✅ Drag-and-Drop Ordering
- **Library**: `@dnd-kit` (core, sortable, utilities)
- **Visual feedback**: 
  - Six-dot grip handle on left
  - Opacity change while dragging
  - Smooth animations
- **Persistence**:
  - On drag end, compute new order values
  - Use `writeBatch` to update all affected documents atomically
  - Updates `order` and `updatedAt` fields
  - Toast notification on success/error
- **Initial load**: Ordered by `order` ascending

---

## Environment Variables Required

Add to your `.env` file:

```bash
# Cloudinary Configuration for Our Team
VITE_CLOUDINARY_UPLOAD_PRESET_OUR_TEAM=enarxi_our_team
```

**Note**: The following variables should already exist:
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_API_KEY`
- `VITE_CLOUDINARY_API_SECRET`

---

## Cloudinary Upload Preset Setup

### Create Upload Preset in Cloudinary Console

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Navigate to **Settings** → **Upload**
3. Scroll to **Upload presets** section
4. Click **Add upload preset**
5. Configure:
   - **Preset name**: `enarxi_our_team`
   - **Signing mode**: Unsigned (for client-side uploads)
   - **Folder**: `enarxi/our_team` (optional but recommended)
   - **Format**: Auto
   - **Quality**: Auto
   - **Allowed formats**: jpg, png, webp
6. Click **Save**

---

## Firebase Firestore Setup

### Create Collection and Indexes

1. **Collection**: `teamMembers` (will be auto-created on first add)

2. **Composite Index** (for ordering):
   - Collection: `teamMembers`
   - Fields:
     - `order` (Ascending)
     - `__name__` (Ascending)

3. **Optional Index** (for public queries):
   - Collection: `teamMembers`
   - Fields:
     - `visibility` (Ascending)
     - `order` (Ascending)

**Note**: Firebase will prompt you to create indexes when you first run queries. Follow the provided link.

---

## Usage Instructions

### Adding a Team Member

1. Navigate to **Admin Portal** → **Our Team**
2. Click **+ Add New** button
3. Upload employee image:
   - If image is 4:5 ratio → uploaded directly
   - If not 4:5 → crop modal opens automatically
4. Fill in:
   - Employee Name (required)
   - Role (required)
   - Visibility (toggle, default: true)
5. Click **Add Member**
6. Image uploads to Cloudinary → Document created in Firestore
7. Success toast appears

### Editing a Team Member

1. Click **Edit** on any team member row
2. Modal opens with pre-filled data
3. Optionally change image (same validation/crop flow)
4. Update name, role, or visibility
5. Click **Update Member**
6. Changes saved to Firestore (and Cloudinary if image changed)

### Deleting a Team Member

1. Click **Delete** on any team member row
2. Confirmation dialog appears
3. On confirm:
   - Image deleted from Cloudinary first
   - If Cloudinary deletion fails → abort, show error
   - If successful → delete Firestore document
4. Success toast appears

### Toggling Visibility

1. Click the **Eye icon** in the Visibility column
2. Immediate update to Firestore
3. `updatedAt` timestamp updated
4. Toast notification appears

### Reordering Team Members

1. Click and hold the **six-dot handle** on the left of any row
2. Drag up or down to new position
3. Release to drop
4. Order persisted to Firestore using batch write
5. Toast notification on success

---

## Integration with About Us Page

### Query Team Members

```javascript
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const fetchTeamMembers = async () => {
  const q = query(
    collection(db, 'teamMembers'),
    where('visibility', '==', true),
    orderBy('order', 'asc')
  );
  
  const snapshot = await getDocs(q);
  const members = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return members;
};
```

### Display Team Member Image

Use Cloudinary transformations for optimized delivery:

```javascript
const TeamMemberCard = ({ member }) => {
  // Get base URL and apply transformations
  const imageUrl = member.images[0].url;
  const optimizedUrl = imageUrl.replace(
    '/upload/',
    '/upload/w_400,h_500,c_fill,f_auto,q_auto/'
  );
  
  return (
    <div className="team-member-card">
      <img 
        src={optimizedUrl} 
        alt={member.name}
        className="w-full h-auto"
      />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </div>
  );
};
```

**Transformation parameters**:
- `w_400,h_500`: Resize to 400x500 (maintains 4:5 ratio)
- `c_fill`: Fill mode (crop if needed)
- `f_auto`: Auto format (WebP for supported browsers)
- `q_auto`: Auto quality optimization

---

## Dependencies Installed

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Already present:
- `react-hot-toast` (notifications)
- `framer-motion` (animations)
- `lucide-react` (icons)
- `react-easy-crop` (image cropping)
- `firebase` (Firestore)

---

## File Structure

```
src/
├── routers/
│   ├── AdminPortal.jsx                    # Updated: added team case
│   └── admin/
│       ├── Sidebar.jsx                    # Updated: added Our Team menu
│       ├── TeamTable.jsx                  # NEW: main table component
│       └── AddEditTeamModal.jsx           # NEW: add/edit modal
├── components/
│   └── CropImageModal.jsx                 # Updated: custom aspect ratio support
└── utils/
    └── uploadToCloudinary.js              # Updated: optional preset parameter
```

---

## Testing Checklist

- [ ] Sidebar shows "Our Team" menu item
- [ ] Clicking "Our Team" loads TeamTable component
- [ ] "Add New" button opens modal
- [ ] Image upload validates 4:5 aspect ratio
- [ ] Non-4:5 images open crop modal automatically
- [ ] Cropped images are 4:5 ratio
- [ ] Form validation works (required fields)
- [ ] Add member uploads to Cloudinary with correct preset
- [ ] Add member creates Firestore document with correct structure
- [ ] Edit modal pre-fills existing data
- [ ] Edit without changing image doesn't re-upload
- [ ] Edit with new image uploads and updates document
- [ ] Visibility toggle updates Firestore immediately
- [ ] Delete confirms before proceeding
- [ ] Delete removes from Cloudinary first, then Firestore
- [ ] Delete fails gracefully if Cloudinary deletion fails
- [ ] Drag-and-drop reorders smoothly
- [ ] Drag-and-drop persists order to Firestore
- [ ] Real-time updates work (changes reflect immediately)
- [ ] Toast notifications appear for all actions
- [ ] Statistics cards show correct counts
- [ ] Table is responsive on mobile

---

## Troubleshooting

### Issue: "Cloudinary configuration missing"
**Solution**: Ensure `.env` file has `VITE_CLOUDINARY_UPLOAD_PRESET_OUR_TEAM` set and restart dev server.

### Issue: "Failed-precondition" error on query
**Solution**: Create the required Firestore composite index. Firebase will provide a link in the error message.

### Issue: Drag-and-drop not working
**Solution**: Ensure `@dnd-kit` packages are installed. Run `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`.

### Issue: Images not deleting from Cloudinary
**Solution**: Verify `VITE_CLOUDINARY_API_KEY` and `VITE_CLOUDINARY_API_SECRET` are set correctly in `.env`.

### Issue: Crop modal not opening
**Solution**: Check browser console for errors. Ensure `react-easy-crop` is installed and `imageCropUtils.js` exists.

---

## Future Enhancements (Optional)

- [ ] Bulk upload multiple team members
- [ ] Export team members to CSV
- [ ] Advanced filtering (by role, visibility)
- [ ] Search functionality
- [ ] Image gallery view in admin
- [ ] Social media links per team member
- [ ] Bio/description field
- [ ] Multiple images per team member

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure Firebase indexes are created
4. Check Cloudinary upload preset configuration
5. Review Firestore security rules (ensure admin has write access)

---

**Implementation Date**: 2025-10-10  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready for Testing
