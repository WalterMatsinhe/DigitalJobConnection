#!/usr/bin/env node

/**
 * Smart Startup Script
 * Runs backend first, waits for it to be ready, then starts frontend
 */

const { spawn } = require('child_process')
const http = require('http')

const PORT = process.env.PORT || 4000
const MAX_RETRIES = 90 // 90 seconds total
let retries = 0

console.log('🚀 Starting Digital Job Connection...\n')

// Function to check if backend is ready
function isBackendReady() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/health',
      method: 'GET',
      timeout: 3000
    }

    const req = http.request(options, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 300)
    })

    req.on('error', () => {
      resolve(false)
    })

    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })

    req.end()
  })
}

// Start backend
console.log('📦 Starting backend server on port', PORT)
console.log('⏳ Waiting for server to initialize...')
console.log('   (This may take 10-30 seconds if connecting to MongoDB)\n')

const backend = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: false,
  env: { ...process.env, PORT }
})

backend.on('error', (err) => {
  console.error('❌ Failed to start backend:', err.message)
  process.exit(1)
})

// Wait for backend to be ready, then start frontend
let checkStarted = false
let frontendStarted = false

const backendCheckInterval = setInterval(async () => {
  const ready = await isBackendReady()

  if (ready && !frontendStarted) {
    clearInterval(backendCheckInterval)
    frontendStarted = true
    
    console.log('\n✅ Backend is ready!\n')
    console.log('🎨 Starting frontend dev server on http://localhost:5173\n')

    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    })

    frontend.on('error', (err) => {
      console.error('❌ Failed to start frontend:', err.message)
      backend.kill()
      process.exit(1)
    })

    frontend.on('exit', (code) => {
      console.log('\n👋 Frontend stopped')
      backend.kill()
      process.exit(code || 0)
    })
  } else if (!ready && !frontendStarted) {
    retries++
    if (!checkStarted && retries === 2) {
      checkStarted = true
      console.log('⏳ Backend initializing (connecting to MongoDB if configured)...')
    }
    if (retries % 5 === 0 && retries > 0) {
      const remaining = MAX_RETRIES - retries
      console.log(`⏳ Waiting for backend... (${retries}s / ${MAX_RETRIES}s)`)
    }

    if (retries > MAX_RETRIES) {
      console.error(`\n❌ Backend health check failed after ${MAX_RETRIES} seconds`)
      console.error('\n📋 Troubleshooting:')
      console.error('   1. Check if port 4000 is already in use: netstat -ano | findstr :4000')
      console.error('   2. Check server logs above for errors')
      console.error('   3. Try manually: npm run server (in another terminal)')
      console.error('   4. If MongoDB connection fails, the server should still start with in-memory storage\n')
      backend.kill()
      process.exit(1)
    }
  }
}, 1000)

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...')
  clearInterval(backendCheckInterval)
  backend.kill()
  process.exit(0)
})

backend.on('exit', (code) => {
  if (code !== null && code !== 0) {
    console.error(`\n❌ Backend exited with code ${code}`)
    clearInterval(backendCheckInterval)
    process.exit(1)
  }
})
