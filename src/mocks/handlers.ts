import { rest, RestRequest, ResponseComposition, RestContext } from 'msw'
import seed from './seed/seedData.json'

export const handlers = [
  rest.get('/api/jobs', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const q = req.url.searchParams.get('q') || ''
    if (q) {
      const filtered = seed.jobs.filter((j: any) => j.title.toLowerCase().includes(q.toLowerCase()) || (j.description && j.description.toLowerCase().includes(q.toLowerCase())))
      return res(ctx.status(200), ctx.json({ jobs: filtered }))
    }
    return res(ctx.status(200), ctx.json({ jobs: seed.jobs }))
  }),

  rest.get('/api/jobs/:id', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const { id } = req.params
    const job = seed.jobs.find((j: any) => j.id === id)
    return res(ctx.status(200), ctx.json({ job }))
  }),

  rest.get('/api/users', (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
    const role = req.url.searchParams.get('role')
    if (role === 'mentor') {
      const mentors = seed.users.filter((u: any) => u.roleTags && u.roleTags.includes('mentor'))
      return res(ctx.status(200), ctx.json({ users: mentors }))
    }
    return res(ctx.status(200), ctx.json({ users: seed.users }))
  })
]
