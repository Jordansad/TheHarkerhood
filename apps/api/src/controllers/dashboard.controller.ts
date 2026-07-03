import type { Response } from 'express'
import * as dashboardService from '../services/dashboard.service'
import type { AuthedRequest } from '../middleware/auth'

export async function getStats(req: AuthedRequest, res: Response) {
  const stats = await dashboardService.getDashboardStats(req.userId!)
  res.json({ stats })
}
