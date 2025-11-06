const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in environment variables')
}

// Connect to MongoDB
if (MONGODB_URI && mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000
  })
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch((err) => console.error('✗ MongoDB connection error:', err.message))
}

// Import models
const User = require('./models/User')
const Company = require('./models/Company')
const Job = require('./models/Job')
const Application = require('./models/Application')
const bcrypt = require('bcryptjs')
const mockDb = require('./mockDb')

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() })
})

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    console.log('📨 Register request:', { email: req.body.email, role: req.body.role })
    const { name, email, password, role, companyName, industry, website, description, location } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' })
    if (!role || !['user', 'company'].includes(role)) return res.status(400).json({ success: false, message: 'Role must be "user" or "company"' })

    console.log('🔐 Hashing password...')
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    if (role === 'company') {
      if (!companyName) return res.status(400).json({ success: false, message: 'Company name is required for company registration' })
      
      let existingCompany
      if (mongoose.connection.readyState === 1) {
        console.log('🔍 Checking existing company in MongoDB...')
        existingCompany = await Company.findOne({ email })
      } else {
        console.log('🔍 Checking existing company in mock storage...')
        existingCompany = mockDb.getCompany(email)
      }
      if (existingCompany) return res.status(409).json({ success: false, message: 'Company already exists' })

      const companyData = { name, email, password: hash, companyName, industry, website, description, location }
      
      if (mongoose.connection.readyState === 1) {
        console.log('💾 Saving company to MongoDB...')
        const company = new Company(companyData)
        await company.save()
        return res.json({ success: true, message: 'Company registered', company: { id: company._id, email: company.email, name: company.name, companyName: company.companyName, role: 'company' } })
      } else {
        console.log('💾 Saving company to mock storage...')
        const companyWithId = { ...companyData, _id: Date.now() }
        mockDb.addCompany(email, companyWithId)
        return res.json({ success: true, message: 'Company registered (in-memory)', company: { id: companyWithId._id, email, name, companyName, role: 'company' } })
      }
    } else {
      let existingUser
      if (mongoose.connection.readyState === 1) {
        console.log('🔍 Checking existing user in MongoDB...')
        existingUser = await User.findOne({ email })
      } else {
        console.log('🔍 Checking existing user in mock storage...')
        existingUser = mockDb.getUser(email)
      }
      if (existingUser) return res.status(409).json({ success: false, message: 'User already exists' })

      const userData = { name, email, password: hash, role: 'user' }
      
      if (mongoose.connection.readyState === 1) {
        console.log('💾 Saving user to MongoDB...')
        const user = new User(userData)
        await user.save()
        return res.json({ success: true, message: 'User registered', user: { id: user._id, email: user.email, name: user.name, role: 'user' } })
      } else {
        console.log('💾 Saving user to mock storage...')
        const userWithId = { ...userData, _id: Date.now() }
        mockDb.addUser(email, userWithId)
        return res.json({ success: true, message: 'User registered (in-memory)', user: { id: userWithId._id, email, name, role: 'user' } })
      }
    }
  } catch (err) {
    console.error('❌ Register error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log('📨 Login request:', { email: req.body.email })
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' })

    let account = null
    let dbSource = 'MongoDB'
    const isMongoConnected = mongoose.connection.readyState === 1

    if (isMongoConnected) {
      console.log('🔍 Checking MongoDB for company...')
      account = await Company.findOne({ email })
      if (account) {
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' })
        return res.json({ success: true, message: 'Login successful', user: { id: account._id, email: account.email, name: account.name, companyName: account.companyName, role: 'company' } })
      }

      console.log('🔍 Checking MongoDB for user...')
      account = await User.findOne({ email })
      if (account) {
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' })
        return res.json({ success: true, message: 'Login successful', user: { id: account._id, email: account.email, name: account.name, role: 'user' } })
      }
    } else {
      console.log('🔍 Checking mock storage...')
      dbSource = 'in-memory'
      
      account = mockDb.getCompany(email)
      if (account) {
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' })
        return res.json({ success: true, message: 'Login successful (' + dbSource + ')', user: { id: account.id, email: account.email, name: account.name, companyName: account.companyName, role: 'company' } })
      }

      account = mockDb.getUser(email)
      if (account) {
        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' })
        return res.json({ success: true, message: 'Login successful (' + dbSource + ')', user: { id: account.id, email: account.email, name: account.name, role: 'user' } })
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' })
  } catch (err) {
    console.error('❌ Login error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// GET ALL JOBS
app.get('/api/jobs', async (req, res) => {
  try {
    console.log('🔍 Fetching all jobs...')
    
    if (mongoose.connection.readyState === 1) {
      console.log('📦 Getting jobs from MongoDB...')
      const jobs = await Job.find({ status: 'Active' })
        .populate('companyId', 'logo companyName')
        .sort({ createdAt: -1 })
      
      const jobsWithLogos = jobs.map(job => {
        const jobObj = job.toObject ? job.toObject() : job
        if (!jobObj.companyId) {
          jobObj.companyId = { _id: null, logo: null, companyName: 'Unknown Company' }
        } else if (!jobObj.companyId.logo) {
          jobObj.companyId.logo = null
        }
        return jobObj
      })
      
      return res.json({ success: true, jobs: jobsWithLogos })
    } else {
      console.log('📦 Getting jobs from mock storage...')
      const jobs = mockDb.getAllJobs()
      
      const jobsWithCompany = jobs.map(job => {
        if (job.companyId && typeof job.companyId === 'string') {
          const company = mockDb.getCompanyById(job.companyId)
          return {
            ...job,
            companyId: company ? { _id: company._id, logo: company.logo, companyName: company.companyName } : null
          }
        }
        return job
      })
      
      return res.json({ success: true, jobs: jobsWithCompany })
    }
  } catch (err) {
    console.error('❌ Fetch jobs error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// POST JOB
app.post('/api/jobs', async (req, res) => {
  try {
    console.log('📝 Post job request:', { title: req.body.title })
    const { title, description, requirements, company, companyId, location, jobType, sector, salary, deadline } = req.body
    
    if (!title || !description || !requirements || !company || !companyId || !location || !deadline) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' })
    }

    const jobData = {
      title,
      description,
      requirements,
      company,
      companyId,
      location,
      jobType: jobType || 'Full-time',
      sector: sector || 'IT',
      salary: salary || '',
      deadline: new Date(deadline),
      status: 'Active',
      applications: []
    }

    if (mongoose.connection.readyState === 1) {
      console.log('💾 Saving job to MongoDB...')
      const job = new Job(jobData)
      await job.save()
      return res.json({ success: true, message: 'Job posted successfully', job: job.toObject() })
    } else {
      console.log('💾 Saving job to mock storage...')
      const jobWithId = { ...jobData, _id: Date.now().toString() }
      mockDb.addJob(jobWithId)
      return res.json({ success: true, message: 'Job posted (in-memory)', job: jobWithId })
    }
  } catch (err) {
    console.error('❌ Post job error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// GET SINGLE JOB
app.get('/api/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params
    console.log('🔍 Fetching job:', jobId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('📦 Getting job from MongoDB...')
      const job = await Job.findById(jobId)
        .populate('companyId', 'logo companyName')
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' })
      }
      return res.json({ success: true, job })
    } else {
      console.log('📦 Getting job from mock storage...')
      const job = mockDb.getJob(jobId)
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' })
      }
      
      if (job.companyId && typeof job.companyId === 'string') {
        const company = mockDb.getCompanyById(job.companyId)
        job.companyId = company ? { _id: company._id, logo: company.logo, companyName: company.companyName } : null
      }
      
      return res.json({ success: true, job })
    }
  } catch (err) {
    console.error('❌ Fetch job error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// GET JOBS BY COMPANY
app.get('/api/jobs/company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params
    console.log('🔍 Fetching jobs for company:', companyId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('📦 Getting company jobs from MongoDB...')
      const jobs = await Job.find({ companyId })
        .populate('companyId', 'logo companyName')
        .sort({ createdAt: -1 })
      return res.json({ success: true, jobs })
    } else {
      console.log('📦 Getting company jobs from mock storage...')
      const jobs = mockDb.getJobsByCompany(companyId)
      
      const jobsWithCompany = jobs.map(job => {
        if (job.companyId && typeof job.companyId === 'string') {
          const company = mockDb.getCompanyById(job.companyId)
          return {
            ...job,
            companyId: company ? { _id: company._id, logo: company.logo, companyName: company.companyName } : null
          }
        }
        return job
      })
      
      return res.json({ success: true, jobs: jobsWithCompany })
    }
  } catch (err) {
    console.error('❌ Fetch company jobs error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// APPLY FOR JOB
app.post('/api/applications', async (req, res) => {
  try {
    console.log('📨 Apply for job request:', { jobId: req.body.jobId, userId: req.body.userId })
    const { jobId, userId, userName, userEmail, coverLetter } = req.body
    
    if (!jobId || !userId || !userName || !userEmail) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' })
    }

    const applicationData = {
      jobId,
      userId,
      userName,
      userEmail,
      coverLetter: coverLetter || '',
      status: 'Pending'
    }

    if (mongoose.connection.readyState === 1) {
      console.log('💾 Saving application to MongoDB...')
      const application = new Application(applicationData)
      await application.save()
      
      await Job.findByIdAndUpdate(jobId, {
        $push: { applications: application._id }
      })
      
      return res.json({ success: true, message: 'Application submitted', application: application.toObject() })
    } else {
      console.log('💾 Saving application to mock storage...')
      const appWithId = { ...applicationData, _id: Date.now().toString() }
      mockDb.addApplication(appWithId)
      return res.json({ success: true, message: 'Application submitted (in-memory)', application: appWithId })
    }
  } catch (err) {
    console.error('❌ Apply error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// GET APPLICATIONS FOR JOB
app.get('/api/applications/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params
    console.log('🔍 Fetching applications for job:', jobId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('📦 Getting applications from MongoDB...')
      const applications = await Application.find({ jobId })
        .populate({
          path: 'userId',
          model: 'User',
          select: '-password'
        })
        .sort({ appliedAt: -1 })
      return res.json({ success: true, applications })
    } else {
      console.log('📦 Getting applications from mock storage...')
      const applications = mockDb.getApplicationsByJob(jobId)
      return res.json({ success: true, applications })
    }
  } catch (err) {
    console.error('❌ Fetch applications error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// GET APPLICATIONS FOR USER
app.get('/api/applications/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    console.log('🔍 Fetching applications for user:', userId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('📦 Getting user applications from MongoDB...')
      const applications = await Application.find({ userId }).populate('jobId').sort({ appliedAt: -1 })
      return res.json({ success: true, applications })
    } else {
      console.log('📦 Getting user applications from mock storage...')
      const applications = mockDb.getApplicationsByUser(userId)
      return res.json({ success: true, applications })
    }
  } catch (err) {
    console.error('❌ Fetch user applications error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// UPDATE APPLICATION STATUS
app.patch('/api/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params
    const { status } = req.body
    
    console.log('✏️ Updating application status:', applicationId, 'to', status)
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' })
    }
    
    const validStatuses = ['Pending', 'Reviewed', 'Rejected', 'Accepted', 'shortlisted']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Updating application in MongoDB...')
      const application = await Application.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true }
      )
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
      return res.json({ success: true, message: 'Application status updated', application: application.toObject() })
    } else {
      console.log('💾 Updating application in mock storage...')
      const application = mockDb.updateApplication(applicationId, { status })
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' })
      return res.json({ success: true, message: 'Application status updated (in-memory)', application })
    }
  } catch (err) {
    console.error('❌ Update application error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// UPDATE JOB
app.put('/api/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params
    const updateData = req.body
    console.log('✏️ Updating job:', jobId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Updating job in MongoDB...')
      const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true })
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
      return res.json({ success: true, message: 'Job updated', job })
    } else {
      console.log('💾 Updating job in mock storage...')
      const job = mockDb.updateJob(jobId, updateData)
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
      return res.json({ success: true, message: 'Job updated (in-memory)', job })
    }
  } catch (err) {
    console.error('❌ Update job error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// DELETE JOB
app.delete('/api/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params
    console.log('🗑️ Deleting job:', jobId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Deleting job from MongoDB...')
      const job = await Job.findByIdAndDelete(jobId)
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
      return res.json({ success: true, message: 'Job deleted' })
    } else {
      console.log('💾 Deleting job from mock storage...')
      mockDb.deleteJob(jobId)
      return res.json({ success: true, message: 'Job deleted (in-memory)' })
    }
  } catch (err) {
    console.error('❌ Delete job error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// GET USER PROFILE
app.get('/api/profile/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    console.log('🔍 Fetching user profile:', userId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('📦 Getting user profile from MongoDB...')
      const user = await User.findById(userId).select('-password')
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      return res.json({ success: true, user: user.toObject() })
    } else {
      console.log('📦 Getting user profile from mock storage...')
      const user = mockDb.getUser(userId)
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      const { password, ...userWithoutPassword } = user
      return res.json({ success: true, user: userWithoutPassword })
    }
  } catch (err) {
    console.error('❌ Get user profile error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// GET COMPANY PROFILE
app.get('/api/profile/company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params
    console.log('🔍 Fetching company profile:', companyId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('📦 Getting company profile from MongoDB...')
      const company = await Company.findById(companyId).select('-password')
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' })
      return res.json({ success: true, company: company.toObject() })
    } else {
      console.log('📦 Getting company profile from mock storage...')
      const company = mockDb.getCompany(companyId)
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' })
      const { password, ...companyWithoutPassword } = company
      return res.json({ success: true, company: companyWithoutPassword })
    }
  } catch (err) {
    console.error('❌ Get company profile error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// UPDATE USER PROFILE
app.put('/api/profile/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const updateData = req.body
    console.log('✏️ Updating user profile:', userId)
    
    delete updateData.password
    delete updateData.email
    delete updateData.role
    updateData.updatedAt = new Date()
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Updating user profile in MongoDB...')
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      return res.json({ success: true, message: 'User profile updated', user: user.toObject() })
    } else {
      console.log('💾 Updating user profile in mock storage...')
      const user = mockDb.updateUser(userId, updateData)
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      const { password, ...userWithoutPassword } = user
      return res.json({ success: true, message: 'User profile updated (in-memory)', user: userWithoutPassword })
    }
  } catch (err) {
    console.error('❌ Update user profile error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// UPDATE COMPANY PROFILE
app.put('/api/profile/company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params
    const updateData = req.body
    console.log('✏️ Updating company profile:', companyId)
    
    delete updateData.password
    delete updateData.email
    delete updateData.role
    updateData.updatedAt = new Date()
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Updating company profile in MongoDB...')
      const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true }).select('-password')
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' })
      return res.json({ success: true, message: 'Company profile updated', company: company.toObject() })
    } else {
      console.log('💾 Updating company profile in mock storage...')
      const company = mockDb.updateCompany(companyId, updateData)
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' })
      const { password, ...companyWithoutPassword } = company
      return res.json({ success: true, message: 'Company profile updated (in-memory)', company: companyWithoutPassword })
    }
  } catch (err) {
    console.error('❌ Update company profile error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// UPLOAD AVATAR
app.post('/api/upload/avatar/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { imageData, imageType } = req.body
    
    if (!imageData) {
      return res.status(400).json({ success: false, message: 'Image data is required' })
    }
    
    console.log('📸 Uploading avatar for user:', userId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Saving avatar to MongoDB...')
      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: imageData, avatarType: imageType || 'image/jpeg' },
        { new: true }
      ).select('-password')
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      return res.json({ success: true, message: 'Avatar uploaded', avatar: user.avatar })
    } else {
      console.log('💾 Saving avatar to mock storage...')
      const user = mockDb.updateUser(userId, { avatar: imageData, avatarType: imageType || 'image/jpeg' })
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      return res.json({ success: true, message: 'Avatar uploaded (in-memory)', avatar: user.avatar })
    }
  } catch (err) {
    console.error('❌ Upload avatar error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// UPLOAD LOGO
app.post('/api/upload/logo/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params
    const { imageData, imageType } = req.body
    
    if (!imageData) {
      return res.status(400).json({ success: false, message: 'Image data is required' })
    }
    
    console.log('📸 Uploading logo for company:', companyId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Saving logo to MongoDB...')
      const company = await Company.findByIdAndUpdate(
        companyId,
        { logo: imageData, logoType: imageType || 'image/jpeg' },
        { new: true }
      ).select('-password')
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' })
      return res.json({ success: true, message: 'Logo uploaded', logo: company.logo })
    } else {
      console.log('💾 Saving logo to mock storage...')
      const company = mockDb.updateCompany(companyId, { logo: imageData, logoType: imageType || 'image/jpeg' })
      if (!company) return res.status(404).json({ success: false, message: 'Company not found' })
      return res.json({ success: true, message: 'Logo uploaded (in-memory)', logo: company.logo })
    }
  } catch (err) {
    console.error('❌ Upload logo error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

// UPLOAD CV
app.post('/api/upload/cv/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { cvData, cvType, cvName } = req.body
    
    if (!cvData) {
      return res.status(400).json({ success: false, message: 'CV data is required' })
    }
    
    console.log('📄 Uploading CV for user:', userId)
    
    if (mongoose.connection.readyState === 1) {
      console.log('💾 Saving CV to MongoDB...')
      const user = await User.findByIdAndUpdate(
        userId,
        { cv: cvData, cvType: cvType || 'application/pdf', cvName: cvName || 'resume.pdf' },
        { new: true }
      ).select('-password')
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      return res.json({ success: true, message: 'CV uploaded', cv: user.cv })
    } else {
      console.log('💾 Saving CV to mock storage...')
      const user = mockDb.updateUser(userId, { cv: cvData, cvType: cvType || 'application/pdf', cvName: cvName || 'resume.pdf' })
      if (!user) return res.status(404).json({ success: false, message: 'User not found' })
      return res.json({ success: true, message: 'CV uploaded (in-memory)', cv: user.cv })
    }
  } catch (err) {
    console.error('❌ Upload CV error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
})

module.exports = app
