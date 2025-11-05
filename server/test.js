#!/usr/bin/env node

// Quick test to verify server is working
const http = require('http')

const testEndpoints = [
  { method: 'GET', path: '/api/health', name: 'Health Check' },
  {
    method: 'POST',
    path: '/api/register',
    name: 'Register User',
    body: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123',
      role: 'user'
    }
  }
]

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          })
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          })
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  })
}

async function runTests() {
  console.log('🧪 Testing server endpoints...\n')

  for (const test of testEndpoints) {
    try {
      console.log(`Testing: ${test.name}`)
      const result = await makeRequest(test.method, test.path, test.body)
      console.log(`Status: ${result.status}`)
      console.log(`Response:`, JSON.stringify(result.data, null, 2))
      console.log('✅ Success\n')
    } catch (err) {
      console.error(`❌ Error: ${err.message}\n`)
    }
  }
}

runTests()
