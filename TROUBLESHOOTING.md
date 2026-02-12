# Troubleshooting Deployment

## 🚨 Critical: Fixed "500 Internal Server Error"
If you see `500` errors for `/api/hackathons` or `/api/auth`, your **Backend is crashing**. This handles happens because Environment Variables are missing on Render.

1. Go to your **Render Dashboard**.
2. Click on your **Backend** service.
3. Click **"Environment"** in the sidebar.
4. Ensure these are set:
   - `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb+srv://...`)
   - `JWT_SECRET`: A random secret password.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (If you have them).
5. **Check the Logs**: Click the **"Logs"** tab in Render to see the exact error. It likely says "MongoTimeoutError" or "Connection refused".

## 🔐 Fix Google Login (403 Error)
The error `[GSI_LOGGER]: The given origin is not allowed` means Google doesn't trust your new Netlify website.

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Edit your **OAuth 2.0 Client ID**.
3. Under **Authorized JavaScript origins**, ADD your Netlify URL:
   - Example: `https://your-site-name.netlify.app`
   - *Note: Do not add a trailing slash `/`.*
4. Save. It may take 5-10 minutes to update.

## 🖼️ Fix Images (404)
If images are missing:
1. Ensure your frontend build command on Netlify is `npm run build`.
2. Ensure the publish directory is `dist`.
3. If you recently changed paths, try clearing the cache in your browser or Netlify (Trigger 'Clear cache and deploy site').
