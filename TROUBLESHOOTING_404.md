# Troubleshooting Guide - 404 on /api/login

## Problem
Getting "Failed to load resource: the server responded with a status of 404" for `/api/login`

## Solutions

### 1. Check if Backend Server is Running

The backend server must be running on port 4000 for the frontend to reach the API.

**Open a NEW terminal and check:**

```powershell
# Check if port 4000 is listening
netstat -ano | findstr :4000

# If you see a process, good! If not, backend isn't running.
```

### 2. Verify Backend Started

When you run `npm start`, you should see TWO processes starting:

✅ Backend should print:
```
ℹ️  MONGODB_URI not set - using in-memory storage for development
Server listening on port 4000
```

✅ Frontend should print:
```
VITE v5.2.0  ready in XXX ms
Local:   http://localhost:5173/
```

**If you only see the frontend starting**, the backend failed. Check for errors above.

---

### 3. Common Backend Startup Issues

#### Issue: "Cannot find module..."
**Solution:**
```powershell
npm install
```

#### Issue: "Port 4000 already in use"
**Solution:**
```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
npm start
```

#### Issue: Mongoose errors
**Expected:** In-memory mode doesn't need MongoDB. You should see:
```
ℹ️  MONGODB_URI not set - using in-memory storage for development
```

If you see MongoDB errors, the `.env` file might have `MONGODB_URI` set.
**Solution:** Check `.env` and comment out MONGODB_URI:
```
# MONGODB_URI=...
```

---

### 4. Test Backend Directly

Open browser and visit:
```
http://localhost:4000/api/health
```

You should see:
```json
{"success":true,"message":"Server is running","timestamp":"2025-11-06T..."}
```

**If you get 404 or connection refused:**
- Backend isn't running
- Run: `npm run server` in a separate terminal

---

### 5. Restart Everything

**Kill everything:**
```powershell
# Close all terminals
# Or kill processes:
taskkill /F /IM node.exe
```

**Start fresh:**
```powershell
npm start
```

Wait for both to start (should take ~10 seconds)

---

### 6. Run Servers Separately (Easier to Debug)

**Terminal 1 - Backend:**
```powershell
npm run server
```

Wait for:
```
Server listening on port 4000
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

Wait for:
```
Local: http://localhost:5173/
```

Now visit: http://localhost:5173

---

## Checklist

- [ ] Backend console shows "Server listening on port 4000"
- [ ] Frontend console shows "Local: http://localhost:5173/"
- [ ] Both are running (check task manager)
- [ ] http://localhost:4000/api/health returns JSON
- [ ] http://localhost:5173 loads the login page
- [ ] Try registering - should work now!

---

## If Still Not Working

### Check Vite Proxy
The frontend proxies `/api` calls to the backend. Verify in vite.config.ts:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:4000',
    changeOrigin: true,
    secure: false
  }
}
```
✅ Looks good!

### Check Browser Network Tab
1. Open DevTools (F12)
2. Go to "Network" tab
3. Try to login
4. Look for `/api/login` request
5. Click it and check:
   - URL should be: `http://localhost:5173/api/login`
   - Status should change from 404 to 200
   - Response should show user data

If URL shows `http://localhost:4000`, the proxy isn't working. Try restarting frontend.

---

## Next Steps

1. ✅ Ensure `npm start` runs both backend and frontend
2. ✅ Check that backend prints "Server listening on port 4000"
3. ✅ Visit http://localhost:4000/api/health to verify backend works
4. ✅ Try registering again

---

**Everything should work now!** Let me know if you still get errors. 🚀
