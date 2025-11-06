import { rest, RestRequest, ResponseComposition, RestContext } from 'msw'
import seed from './seed/seedData.json'

// Mock database for auth
const mockUsers: any = {}
const mockCompanies: any = {}
const mockJobs: any = seed.jobs.reduce((acc: any, job: any) => {
  acc[job.id] = job
  return acc
}, {})

export const handlers = [
  // ============ AUTH ENDPOINTS ============
  rest.post('/api/register', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { name, email, password, role, companyName } = req.body

    if (!email || !password) {
      return res(ctx.status(400), ctx.json({ success: false, message: 'Email and password required' }))
    }

    if (role === 'company') {
      if (mockCompanies[email]) {
        return res(ctx.status(409), ctx.json({ success: false, message: 'Company already exists' }))
      }
      const company = {
        _id: Date.now().toString(),
        name,
        email,
        companyName: companyName || name,
        role: 'company',
        logo: null,
        website: '',
        description: '',
        location: '',
        industry: ''
      }
      mockCompanies[email] = company
      return res(ctx.status(200), ctx.json({ success: true, message: 'Company registered', company }))
    } else {
      if (mockUsers[email]) {
        return res(ctx.status(409), ctx.json({ success: false, message: 'User already exists' }))
      }
      const user = {
        _id: Date.now().toString(),
        name,
        email,
        role: 'user',
        avatar: null,
        cv: null
      }
      mockUsers[email] = user
      return res(ctx.status(200), ctx.json({ success: true, message: 'User registered', user }))
    }
  }),

  rest.post('/api/login', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res(ctx.status(400), ctx.json({ success: false, message: 'Email and password required' }))
    }

    // Check companies
    if (mockCompanies[email]) {
      return res(ctx.status(200), ctx.json({
        success: true,
        message: 'Login successful',
        user: {
          id: mockCompanies[email]._id,
          email: mockCompanies[email].email,
          name: mockCompanies[email].name,
          companyName: mockCompanies[email].companyName,
          role: 'company'
        }
      }))
    }

    // Check users
    if (mockUsers[email]) {
      return res(ctx.status(200), ctx.json({
        success: true,
        message: 'Login successful',
        user: {
          id: mockUsers[email]._id,
          email: mockUsers[email].email,
          name: mockUsers[email].name,
          role: 'user'
        }
      }))
    }

    return res(ctx.status(401), ctx.json({ success: false, message: 'Invalid credentials' }))
  }),

  // ============ JOB ENDPOINTS ============
  rest.get('/api/jobs', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const q = req.url.searchParams.get('q') || ''
    let jobs = Object.values(mockJobs)

    if (q) {
      jobs = jobs.filter((j: any) =>
        j.title.toLowerCase().includes(q.toLowerCase()) ||
        (j.description && j.description.toLowerCase().includes(q.toLowerCase()))
      )
    }

    return res(ctx.status(200), ctx.json({ success: true, jobs }))
  }),

  rest.get('/api/jobs/:id', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { id } = req.params
    const job = mockJobs[id]

    if (!job) {
      return res(ctx.status(404), ctx.json({ success: false, message: 'Job not found' }))
    }

    return res(ctx.status(200), ctx.json({ success: true, job }))
  }),

  rest.post('/api/jobs', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { title, description, companyId } = req.body

    const job = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      title,
      description,
      companyId,
      status: 'Active',
      applications: []
    }

    mockJobs[job.id] = job
    return res(ctx.status(200), ctx.json({ success: true, message: 'Job posted', job }))
  }),

  // ============ PROFILE ENDPOINTS ============
  rest.get('/api/profile/user/:userId', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const user = Object.values(mockUsers).find((u: any) => u._id === req.params.userId)

    if (!user) {
      return res(ctx.status(404), ctx.json({ success: false, message: 'User not found' }))
    }

    return res(ctx.status(200), ctx.json({ success: true, user }))
  }),

  rest.get('/api/profile/company/:companyId', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const company = Object.values(mockCompanies).find((c: any) => c._id === req.params.companyId)

    if (!company) {
      return res(ctx.status(404), ctx.json({ success: false, message: 'Company not found' }))
    }

    return res(ctx.status(200), ctx.json({ success: true, company }))
  }),

  rest.put('/api/profile/user/:userId', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const user = Object.values(mockUsers).find((u: any) => u._id === req.params.userId)

    if (!user) {
      return res(ctx.status(404), ctx.json({ success: false, message: 'User not found' }))
    }

    const updated = { ...user, ...req.body }
    mockUsers[updated.email] = updated

    return res(ctx.status(200), ctx.json({ success: true, message: 'Profile updated', user: updated }))
  }),

  rest.put('/api/profile/company/:companyId', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const company = Object.values(mockCompanies).find((c: any) => c._id === req.params.companyId)

    if (!company) {
      return res(ctx.status(404), ctx.json({ success: false, message: 'Company not found' }))
    }

    const updated = { ...company, ...req.body }
    mockCompanies[updated.email] = updated

    return res(ctx.status(200), ctx.json({ success: true, message: 'Profile updated', company: updated }))
  }),

  // ============ APPLICATION ENDPOINTS ============
  rest.post('/api/applications', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { jobId, userId } = req.body

    const application = {
      _id: Date.now().toString(),
      jobId,
      userId,
      status: 'Pending',
      appliedAt: new Date()
    }

    return res(ctx.status(200), ctx.json({ success: true, message: 'Application submitted', application }))
  }),

  rest.get('/api/applications/user/:userId', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.status(200), ctx.json({ success: true, applications: [] }))
  }),

  // ============ HEALTH CHECK ============
  rest.get('/api/health', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    return res(ctx.status(200), ctx.json({ success: true, message: 'Mock server is running' }))
  })
]

