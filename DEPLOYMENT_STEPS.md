# 🚀 Vercel Deployment Guide

Your app is ready to deploy! Follow these steps to get it live on Vercel.

## Step 1: Push to GitHub

Make sure all your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

## Step 2: Create a Vercel Account (if you don't have one)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended for seamless integration)
3. Authorize Vercel to access your GitHub repositories

## Step 3: Import Your Project to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your **DigitalJobConnection** repository
5. Click **"Import"**

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

Then follow the prompts to select your project and authorize.

## Step 4: Configure Environment Variables

After importing, Vercel will show you the environment setup screen:

1. **Click "Environment Variables"**
2. **Add the following variables:**

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/digitaljobconnection` | See MongoDB Atlas setup below |

**To get MongoDB Atlas connection string:**
1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create a free account
3. Create a new cluster (M0 - Free tier)
4. Get your connection string from "Connect" > "Connect your application"
5. Replace username and password in the string
6. Replace `digitaljobconnection` with your database name

**If you don't have MongoDB yet (using in-memory storage):**
- Leave `MONGODB_URI` empty or commented out
- The app will use in-memory storage for development

## Step 5: Deploy

1. After adding environment variables, click **"Deploy"**
2. Vercel will automatically build and deploy your app
3. You'll get a production URL like: `https://your-project.vercel.app`

⏳ **Wait 2-5 minutes** for the deployment to complete.

## Step 6: Verify Deployment

Once deployed:

1. Visit your production URL
2. **Test the key features:**
   - Register a new account (user or company)
   - Login with credentials
   - Browse jobs (for users)
   - Post jobs (for companies)
   - Apply for jobs (for users)

## What Gets Deployed

### Frontend
- React app (built with Vite)
- TypeScript components
- TailwindCSS styles
- All pages and components

### Backend
- Express.js API (in `/api/handler.js`)
- Serverless functions on Vercel
- All endpoints from your Express server
- File uploads (avatar, logo, CV)

### Database
- MongoDB Atlas (optional, if configured)
- In-memory storage (fallback if no MongoDB)

## Troubleshooting

### ❌ Deployment Failed
Check the Vercel build logs:
1. Go to your project dashboard
2. Click on the failed deployment
3. Scroll to "Build Logs"
4. Look for error messages

Common issues:
- Missing environment variables
- MongoDB connection string invalid
- Port conflicts

### ❌ API 404 Errors After Deployment
1. Verify all endpoints in `/api/handler.js` match your app's API calls
2. Check that `.env` variables are set in Vercel
3. Ensure the app is making requests to the correct API base URL

### ❌ Database Connection Issues
1. Go to MongoDB Atlas
2. Click "Network Access"
3. Add `0.0.0.0/0` to allow all IPs (or Vercel's IP range)
4. Verify connection string includes username and password

## Environment Variables Explained

**For Local Development (`dev` mode):**
- Uses `http://localhost:4000/api` (from `.env`)
- Can use local MongoDB or in-memory storage

**For Production (Vercel):**
- Uses serverless functions at your Vercel domain
- Should use MongoDB Atlas for persistent data
- Or in-memory storage (data lost on redeploy)

## Next Steps

After successful deployment:

1. **Custom Domain:** Add your own domain in Vercel settings
2. **SSL Certificate:** Automatically included with Vercel
3. **Analytics:** Monitor traffic in Vercel dashboard
4. **CI/CD:** Automatic deployments when you push to GitHub

## Support

For issues with:
- **Vercel:** Check [vercel.com/docs](https://vercel.com/docs)
- **MongoDB:** Check [docs.mongodb.com](https://docs.mongodb.com)
- **Your App:** Review the application logs or contact support

---

**You're all set!** 🎉 Your app is ready for the world to see!
