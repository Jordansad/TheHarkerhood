import type { Response } from 'express'
import * as teamService from '../services/team.service'
import type { AuthedRequest } from '../middleware/auth'

export async function list(_req: AuthedRequest, res: Response) {
  const members = await teamService.listTeamMembers()
  res.json({ members })
}
