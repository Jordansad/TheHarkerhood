import dns from 'dns'
import type { LookupFunction } from 'net'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import type { PoolConfig } from 'pg'
import { env } from './env'

// Certains environnements (dont les machines sans route IPv6) laissent la requête AAAA
// traîner/échouer avant de retomber sur l'IPv4 ; on force une résolution IPv4 uniquement
// pour la connexion Postgres (sans impact en prod, où IPv6 fonctionne normalement).
// `lookup` est un vrai réglage pg/net au runtime, mais absent des types @types/pg.
const lookupIPv4Only: LookupFunction = (hostname, options, callback) =>
  dns.lookup(hostname, { family: 4 }, callback)

const adapter = new PrismaPg({ connectionString: env.databaseUrl, lookup: lookupIPv4Only } as PoolConfig)

export const prisma = new PrismaClient({ adapter })
