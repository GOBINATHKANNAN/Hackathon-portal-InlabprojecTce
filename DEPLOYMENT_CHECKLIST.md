# 🚀 Complete Deployment Checklist - Hackathon Portal

## ✅ Pre-Deployment Verification

### 1. **Local Configuration Check**

#### Backend (.env file) - ✓ VERIFIED
```
PORT=5000
MONGO_URI=mongodb+srv://admin:admin123@hackathon-complete-vers.a2mww8c.mongodb.net/?appName=Hackathon-complete-version
JWT_SECRET=GobinathPortalTCE2025
EMAIL_USER=gobinathkannan2@gmail.com
EMAIL_PASS=pawc jhal kedf gdfn
GOOGLE_CLIENT_ID=495523531422-hqolcs7uvu6dq5ca6c21ppe2v72afh97.apps.googleusercontent.com
CLOUDINARY_CLOUD_NAME=Hackathon
CLOUDINARY_API_KEY=916471745434948
CLOUDINARY_API_SECRET=bSbH2OfXbnWryFb51DG6DCMnjQY
```

**Status**: ✅ All configurations present

#### Frontend Configuration
- Uses `VITE_API_URL` environment variable
- Fallback to `http://localhost:5000/api` for local development
- **Action Required**: Create `.env` file in frontend folder for production

---

## 📋 Step-by-Step Deployment Guide

### **STEP 1: MongoDB Atlas Setup** ✓ ALREADY CONFIGURED

Your MongoDB Atlas is already set up and working:
- **Connection String**: `mongodb+srv://admin:admin123@hackathon-complete-vers.a2mww8c.mongodb.net/`
- **Cluster**: `hackathon-complete-vers`

#### Verify Atlas Configuration:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login with your credentials
3. **Check Network Access**:
   - Click "Network Access" in left sidebar
   - Ensure `0.0.0.0/0` is in the IP Access List (allows all IPs)
   - If not, click "Add IP Address" → "Allow Access from Anywhere"

4. **Check Database User**:
   - Click "Database Access"
   - Verify user `admin` exists with "Read and write to any database" permissions

5. **Test Connection** (Optional):
   - In your cluster, click "Connect" → "Connect your application"
   - Verify the connection string matches your `.env` file

**Status**: ✅ MongoDB Atlas is ready

---

### **STEP 2: Backend Deployment on Render**

#### A. Push Code to GitHub (Already Done ✓)
Your code is already on GitHub at:
`https://github.com/GOBINATHKANNAN/Hackathon-portal-InlabprojecTce.git`

#### B. Deploy to Render

1. **Go to [Render.com](https://render.com/)**
   - Sign up or login (use GitHub to sign in)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select repository: `GOBINATHKANNAN/Hackathon-portal-InlabprojecTce`

3. **Configure Web Service**
   ```
   Name: hackathon-portal-backend (or any name you prefer)
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables** (Click "Advanced" → "Add Environment Variable")
   Add these EXACTLY as shown:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://admin:admin123@hackathon-complete-vers.a2mww8c.mongodb.net/?appName=Hackathon-complete-version
   JWT_SECRET=GobinathPortalTCE2025
   EMAIL_USER=gobinathkannan2@gmail.com
   EMAIL_PASS=pawc jhal kedf gdfn
   GOOGLE_CLIENT_ID=495523531422-hqolcs7uvu6dq5ca6c21ppe2v72afh97.apps.googleusercontent.com
   CLOUDINARY_CLOUD_NAME=Hackathon
   CLOUDINARY_API_KEY=916471745434948
   CLOUDINARY_API_SECRET=bSbH2OfXbnWryFb51DG6DCMnjQY
   NODE_ENV=production
   ```

5. **Select Free Plan**
   - Instance Type: Free

6. **Click "Create Web Service"**
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://hackathon-portal-backend.onrender.com`

7. **Verify Backend is Running**
   - Open the URL in browser
   - You should see: "Hackathon Portal API is running"
   - Test API endpoint: `https://your-backend-url.onrender.com/api/auth/test`

**⚠️ Important Notes:**
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Files uploaded to local storage will be deleted on restart (that's why we use Cloudinary)

---

### **STEP 3: Frontend Deployment on Netlify**

#### A. Create Frontend Environment File

First, create a `.env` file in the `frontend` folder:

1. **After backend is deployed**, copy your Render backend URL
2. Create file: `frontend/.env`
3. Add this line (replace with YOUR backend URL):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Update .gitignore** to prevent committing this file (already done ✓)

#### B. Deploy to Netlify

1. **Go to [Netlify.com](https://www.netlify.com/)**
   - Sign up or login (use GitHub)

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select repository: `GOBINATHKANNAN/Hackathon-portal-InlabprojecTce`

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Set Environment Variables**
   - Click "Show advanced" → "New variable"
   - Add:
     ```
     Key: VITE_API_URL
     Value: https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url` with your actual Render URL

5. **Deploy Site**
   - Click "Deploy site"
   - Wait 3-5 minutes
   - You'll get a URL like: `https://random-name-12345.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Site settings" → "Domain management"
   - Click "Add custom domain"
   - Follow instructions to add your domain

7. **Verify Frontend is Working**
   - Open your Netlify URL
   - Try logging in
   - Check browser console for errors

---

### **STEP 4: Post-Deployment Configuration**

#### A. Update Google OAuth (If using Google Login)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Add Authorized JavaScript origins:
   ```
   https://your-netlify-url.netlify.app
   ```
6. Add Authorized redirect URIs:
   ```
   https://your-netlify-url.netlify.app
   https://your-netlify-url.netlify.app/auth/callback
   ```
7. Click "Save"

#### B. Update CORS (If needed)

If you face CORS errors, update `backend/server.js`:

```javascript
// Replace line 29
app.use(cors());

// With:
app.use(cors({
    origin: [
        'https://your-netlify-url.netlify.app',
        'http://localhost:5173' // Keep for local development
    ],
    credentials: true
}));
```

Then commit and push to trigger redeployment.

---

## 🔄 How to Update After Git Changes

### When you make code changes:

#### Backend Changes:
1. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Render Auto-Deploy**:
   - Render automatically detects the push
   - Rebuilds and redeploys (takes 5-10 minutes)
   - Check deployment logs in Render dashboard

3. **Manual Deploy** (if auto-deploy is off):
   - Go to Render dashboard
   - Click on your service
   - Click "Manual Deploy" → "Deploy latest commit"

#### Frontend Changes:
1. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Netlify Auto-Deploy**:
   - Netlify automatically detects the push
   - Rebuilds and redeploys (takes 3-5 minutes)
   - Check deployment logs in Netlify dashboard

3. **Manual Deploy** (if needed):
   - Go to Netlify dashboard
   - Click "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

---

## 🧪 Testing Checklist

After deployment, test these features:

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth login works
- [ ] Student dashboard loads
- [ ] File upload works (certificates, team submissions)
- [ ] Admin panel accessible
- [ ] Proctor dashboard works
- [ ] Email notifications sent
- [ ] Certificate generation works
- [ ] All images/assets load correctly

---

## 🐛 Common Issues & Solutions

### Issue 1: "Network Error" or "Cannot connect to server"
**Solution**: 
- Check if backend URL in frontend `.env` is correct
- Verify backend is running on Render
- Check Render logs for errors

### Issue 2: "CORS Error"
**Solution**: 
- Update CORS configuration in `backend/server.js` (see Step 4B)
- Redeploy backend

### Issue 3: "MongoDB Connection Failed"
**Solution**: 
- Check MongoDB Atlas Network Access allows `0.0.0.0/0`
- Verify `MONGO_URI` environment variable in Render
- Check database user credentials

### Issue 4: "Images not loading"
**Solution**: 
- Verify Cloudinary credentials in Render environment variables
- Check browser console for 404 errors
- Ensure Cloudinary account is active

### Issue 5: "Backend sleeps/slow first load"
**Solution**: 
- This is normal for Render free tier
- Consider upgrading to paid plan ($7/month)
- Or use a ping service to keep it awake

### Issue 6: "Environment variables not working"
**Solution**: 
- In Netlify: Variables must start with `VITE_`
- After adding variables, trigger a new deployment
- Clear browser cache and test again

---

## 📊 Monitoring Your Deployment

### Render (Backend):
- Dashboard: `https://dashboard.render.com/`
- View logs: Click service → "Logs" tab
- Check metrics: "Metrics" tab shows CPU/Memory usage

### Netlify (Frontend):
- Dashboard: `https://app.netlify.com/`
- View logs: Click site → "Deploys" → Click on deploy → "Deploy log"
- Analytics: "Analytics" tab (requires upgrade)

### MongoDB Atlas:
- Dashboard: `https://cloud.mongodb.com/`
- Monitor: Click cluster → "Metrics" tab
- View data: "Browse Collections"

---

## 🎯 Quick Reference URLs

After deployment, save these URLs:

```
Frontend (Netlify): https://_____________________.netlify.app
Backend (Render):   https://_____________________.onrender.com
MongoDB Atlas:      https://cloud.mongodb.com/
GitHub Repo:        https://github.com/GOBINATHKANNAN/Hackathon-portal-InlabprojecTce
```

---

## 💡 Pro Tips

1. **Enable Auto-Deploy**: Both Render and Netlify support auto-deploy from GitHub
2. **Use Environment Variables**: Never hardcode secrets in code
3. **Monitor Logs**: Check logs regularly for errors
4. **Backup Database**: Export MongoDB data regularly
5. **Test Before Push**: Always test locally before pushing to production
6. **Use Branches**: Create a `development` branch for testing
7. **SSL Certificates**: Both platforms provide free SSL automatically

---

## ✅ Deployment Complete!

Once all steps are done:
1. ✓ MongoDB Atlas is running
2. ✓ Backend is deployed on Render
3. ✓ Frontend is deployed on Netlify
4. ✓ All services are connected
5. ✓ Application is live and accessible

**Your hackathon portal is now live! 🎉**
