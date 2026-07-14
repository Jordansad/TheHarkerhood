import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './lib/env'
import { authRouter } from './routes/auth.routes'
import { skillsRouter } from './routes/skills.routes'
import { dashboardRouter } from './routes/dashboard.routes'
import { methodologiesRouter } from './routes/methodologies.routes'
import { activitiesRouter } from './routes/activities.routes'
import { journalRouter } from './routes/journal.routes'
import { wikiRouter } from './routes/wiki.routes'
import { ctfRouter } from './routes/ctf.routes'
import { certificationsRouter } from './routes/certifications.routes'
import { teamRouter } from './routes/team.routes'
import { quizRouter } from './routes/quiz.routes'
import { mentorRouter } from './routes/mentor.routes'
import { adminRouter } from './routes/admin.routes'
import { errorHandler } from './middleware/error'

export const app = express()

app.use(cors({ origin: env.webOrigin, credentials: true }))
app.use(cookieParser())
app.use(express.json())

app.get('/', (_req, res) => res.json({ ok: true }))
app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/methodologies', methodologiesRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/journal', journalRouter)
app.use('/api/wiki', wikiRouter)
app.use('/api/ctf', ctfRouter)
app.use('/api/certifications', certificationsRouter)
app.use('/api/team', teamRouter)
app.use('/api/quiz', quizRouter)
app.use('/api/mentor', mentorRouter)
app.use('/api/admin', adminRouter)

app.use(errorHandler)
