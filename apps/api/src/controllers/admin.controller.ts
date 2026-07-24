import type { Response } from 'express'
import * as adminService from '../services/admin.service'
import type { AuthedRequest } from '../middleware/auth'

export async function overview(_req: AuthedRequest, res: Response) {
  const data = await adminService.getOverview()
  res.json(data)
}

export async function members(_req: AuthedRequest, res: Response) {
  const data = await adminService.getMembers()
  res.json({ members: data })
}

export async function memberDetail(req: AuthedRequest, res: Response) {
  const data = await adminService.getMemberDetail(req.params.id)
  res.json(data)
}

export async function deleteMember(req: AuthedRequest, res: Response) {
  await adminService.deleteMember(req.userId!, req.params.id)
  res.status(204).end()
}
