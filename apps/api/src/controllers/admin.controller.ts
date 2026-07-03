import type { Response } from 'express'
import * as adminService from '../services/admin.service'
import type { AuthedRequest } from '../middleware/auth'

export async function overview(_req: AuthedRequest, res: Response) {
  const data = await adminService.getOverview()
  res.json(data)
}
