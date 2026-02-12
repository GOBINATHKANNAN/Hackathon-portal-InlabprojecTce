---
description: Deploy the application to production
---

# Deployment Workflow

This workflow guides you through deploying the Hackathon Portal to production after making changes.

## Prerequisites
- Code is committed and pushed to GitHub
- You have accounts on Render, Netlify, and MongoDB Atlas

## Step 1: Verify Connections Locally

// turbo
Run the verification script to ensure all connections are working:
```bash
cd backend
node verify-connections.js
```

Expected output: "✅ ALL CONNECTIONS VERIFIED SUCCESSFULLY!"

## Step 2: Commit and Push Changes

```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

## Step 3: Deploy Backend (Render)

### Option A: Auto-Deploy (Recommended)
If auto-deploy is enabled on Render:
1. Go to https://dashboard.render.com/
2. Click on your backend service
3. Wait for automatic deployment (5-10 minutes)
4. Check "Logs" tab for any errors

### Option B: Manual Deploy
If auto-deploy is disabled:
1. Go to https://dashboard.render.com/
2. Click on your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

### Verify Backend Deployment
1. Open your backend URL (e.g., https://your-app.onrender.com)
2. You should see: "Hackathon Portal API is running"
3. Test API: https://your-app.onrender.com/api/auth/test

## Step 4: Deploy Frontend (Netlify)

### Option A: Auto-Deploy (Recommended)
If auto-deploy is enabled on Netlify:
1. Go to https://app.netlify.com/
2. Click on your site
3. Click "Deploys" tab
4. Wait for automatic deployment (3-5 minutes)
5. Check deploy log for any errors

### Option B: Manual Deploy
If auto-deploy is disabled:
1. Go to https://app.netlify.com/
2. Click on your site
3. Click "Deploys" tab
4. Click "Trigger deploy" → "Deploy site"
5. Wait for deployment to complete

### Verify Frontend Deployment
1. Open your Netlify URL (e.g., https://your-app.netlify.app)
2. Test login functionality
3. Check browser console for errors

## Step 5: Post-Deployment Testing

Test these critical features:
- [ ] User login/registration
- [ ] File uploads (certificates, submissions)
- [ ] Admin dashboard
- [ ] Student dashboard
- [ ] Proctor approvals
- [ ] Email notifications

## Step 6: Monitor Logs

### Backend Logs (Render)
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Watch for errors or warnings

### Frontend Logs (Netlify)
1. Go to Netlify dashboard
2. Click on your site
3. Click "Deploys" → Latest deploy → "Deploy log"
4. Check for build errors

## Troubleshooting

### Backend not deploying
- Check Render logs for build errors
- Verify environment variables are set correctly
- Ensure `package.json` has correct start script

### Frontend not deploying
- Check Netlify deploy log for build errors
- Verify `VITE_API_URL` environment variable is set
- Ensure build command is `npm run build`

### CORS errors after deployment
- Update CORS configuration in `backend/server.js`
- Add your Netlify URL to allowed origins
- Redeploy backend

### MongoDB connection errors
- Check MongoDB Atlas Network Access
- Verify `MONGO_URI` in Render environment variables
- Ensure database user has correct permissions

## Quick Reference

**Render Dashboard**: https://dashboard.render.com/
**Netlify Dashboard**: https://app.netlify.com/
**MongoDB Atlas**: https://cloud.mongodb.com/
**GitHub Repo**: https://github.com/GOBINATHKANNAN/Hackathon-portal-InlabprojecTce

## Notes

- Free tier on Render sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Always test locally before deploying to production
- Keep environment variables secure and never commit them to Git
