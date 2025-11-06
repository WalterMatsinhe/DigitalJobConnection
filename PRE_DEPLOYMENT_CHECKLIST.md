# 📋 Pre-Deployment Checklist

Before you deploy to Vercel, verify these items:

## ✅ Code Quality
- [ ] All pages use axios `client` (not `fetch`) - ✅ **DONE**
- [ ] API base URL configured in `.env` - ✅ **DONE** (`http://localhost:4000/api`)
- [ ] No console errors in development
- [ ] All features work locally (`npm start`)

## ✅ Project Setup
- [ ] `package.json` has correct scripts
  ```json
  "dev": "vite",
  "server": "node server/index.js",
  "start": "node start.js",
  "build": "vite build"
  ```
- [ ] `vercel.json` configured correctly - ✅ **JUST FIXED**
- [ ] `/api/handler.js` exists and has all endpoints - ✅ **DONE**
- [ ] `.env` file has development config - ✅ **DONE**

## ✅ Git Setup
- [ ] Repository pushed to GitHub
  ```bash
  git add .
  git commit -m "Pre-deployment: all fixes complete"
  git push origin main
  ```

## 🔧 Before Deploying

### 1. Test Locally One More Time
```bash
npm start
```
Visit `http://localhost:5173` and test:
- [ ] Register (user and company)
- [ ] Login
- [ ] Browse jobs
- [ ] Apply for jobs (user)
- [ ] Post jobs (company)
- [ ] View profile

### 2. Prepare for Production

**Option A: With MongoDB (Recommended)**
1. Create MongoDB Atlas account: [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create a free M0 cluster
3. Get connection string
4. Note down username and password

**Option B: Without MongoDB (In-Memory)**
- No setup needed, but data won't persist across redeploys

### 3. Push Final Code
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 🚀 Deployment Steps

1. **Go to Vercel:** https://vercel.com/dashboard
2. **Import Project:** Select your GitHub repo
3. **Configure Env Vars:**
   - If using MongoDB: Add `MONGODB_URI` with your connection string
   - If not: Leave empty (uses in-memory)
4. **Deploy:** Click "Deploy" button
5. **Wait:** 2-5 minutes for build to complete
6. **Test:** Visit your production URL

## 📊 What You'll Get

**Free Vercel tier includes:**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Serverless functions
- ✅ Edge network with CDN
- ✅ Production and preview deployments
- ✅ GitHub integration

**Your production URL:** `https://your-project.vercel.app`

## 🔒 Security Notes

- **Never commit `.env` files** to Git (already in `.gitignore`)
- **Use environment variables** for sensitive data on Vercel
- **MongoDB:** Add Vercel's IP to network access (or allow all: `0.0.0.0/0`)
- **API Keys:** Store in Vercel environment variables only

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **React/Vite:** https://vitejs.dev

---

**Ready to go live? Follow DEPLOYMENT_STEPS.md next!** 🎉
