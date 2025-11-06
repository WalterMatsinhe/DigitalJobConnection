// Simple test server to verify Express is working
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 4000

app.use(express.json())
app.use(cors())

console.log('Starting test server on port 4000...')

// Health check
app.get('/api/health', (req, res) => {
  console.log('[GET] /api/health')
  res.json({ success: true, message: 'Server is running' })
})

// Test login
app.post('/api/login', (req, res) => {
  console.log('[POST] /api/login received')
  console.log('Body:', req.body)
  
  // Simple test - accept any email/password
  if (req.body.email && req.body.password) {
    res.json({ 
      success: true, 
      message: 'Test login successful',
      user: { 
        id: '12345',
        email: req.body.email,
        name: 'Test User',
        role: 'user'
      }
    })
  } else {
    res.status(400).json({ success: false, message: 'Email and password required' })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Test server listening on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
})
