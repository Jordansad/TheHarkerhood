import { app } from './app'
import { env } from './lib/env'

app.listen(env.port, () => {
  console.log(`The Hackerhood API listening on port ${env.port}`)
})
