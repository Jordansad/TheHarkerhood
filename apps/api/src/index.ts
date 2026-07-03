import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './lib/env'
import { authRouter } from './routes/auth.routes'
import { skillsRouter } from './routes/skills.routes'
import { dashboardRouter } from './routes/dashboard.routes'
import { errorHandler } from './middleware/error'

const app = express()

app.use(cors({ origin: env.webOrigin, credentials: true }))
app.use(cookieParser())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/dashboard', dashboardRouter)

app.use(errorHandler)

app.listen(env.port, () => {
  console.log(`The Hackerhood API listening on port ${env.port}`)
})
