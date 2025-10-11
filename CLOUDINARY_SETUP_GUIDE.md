# Cloudinary Blog Deletion Fix Guide

## 🔴 Problem
Blog deletion fails with error:
```
Cloudinary credentials missing. Please set VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, and VITE_CLOUDINARY_API_SECRET
```

## 🎯 Root Cause
Your `.env` file either:
1. **Has placeholder values** (like `your_cloud_name`, `my-api-key`) instead of real credentials
2. **Dev server wasn't restarted** after adding the real values

## ✅ Solution

### Step 1: Get Your Real Cloudinary Credentials

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Log in to your account
3. On the dashboard, you'll see:
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "Reveal" to see it, e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### Step 2: Update Your `.env` File

Open `/home/chella-ubun/projects/enarxi-website/EnarxiWebsite/.env` and replace with **REAL** values:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dxxxxxx  # ← Replace with your actual cloud name
VITE_CLOUDINARY_UPLOAD_PRESET=enarxi_unsigned
VITE_CLOUDINARY_UPLOAD_PRESET_OUR_TEAM=enarxi_our_team
VITE_CLOUDINARY_API_KEY=123456789012345  # ← Replace with your actual API key
VITE_CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456  # ← Replace with your actual API secret

# Other env variables...
```

**⚠️ IMPORTANT:** Do NOT use placeholder values like:
- ❌ `your_cloud_name`
- ❌ `my-api-key`
- ❌ `my-api-secret`

### Step 3: Restart Your Dev Server

**This is CRITICAL!** Vite only loads `.env` variables when it starts.

1. In your terminal running `npm run dev`, press `Ctrl+C`
2. Run `npm run dev` again
3. Wait for the server to fully start

### Step 4: Test the Deletion

1. Go to Admin Portal → Blog Review
2. Try deleting a blog
3. Check the browser console - you should now see:
   ```
   🔍 Cloudinary Delete - Environment Check:
     CLOUD_NAME: ✅ Set (dxxxxxx)
     API_KEY: ✅ Set (1234...)
     API_SECRET: ✅ Set (abcd...)
   ```

If you see ❌ Missing, your `.env` file still has placeholder values or the server wasn't restarted.

## 🔒 Security Note

You mentioned you're okay with exposing the API secret to the frontend. While this works for development, be aware:

- **API Secret in frontend = Anyone can delete your images**
- For production, consider using a backend endpoint or Cloudinary's unsigned delete (if available)
- Current implementation is fine for internal admin tools with authentication

## 🐛 Debugging

If it still doesn't work after following all steps:

1. Check browser console for the environment check logs
2. Verify your Cloudinary credentials are correct by testing them in Postman
3. Make sure there are no typos in your `.env` variable names (must be exact: `VITE_CLOUDINARY_*`)
4. Ensure `.env` file is in the project root (same level as `package.json`)

## 📝 Quick Checklist

- [ ] `.env` file exists in project root
- [ ] `.env` has REAL Cloudinary credentials (not placeholders)
- [ ] Dev server was restarted after updating `.env`
- [ ] Browser console shows ✅ for all three credentials
- [ ] No typos in environment variable names

---

**Need more help?** Check the browser console logs after attempting deletion - they now show exactly which credentials are missing.
