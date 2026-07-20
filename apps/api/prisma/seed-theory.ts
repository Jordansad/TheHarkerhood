import fs from 'fs'
import path from 'path'

/**
 * Cours théoriques par compétence, un fichier markdown par slug dans
 * ./theory-content/. Chaque texte est calibré pour rester sous ~20 min de
 * lecture (~130 mots/min) afin de laisser le temps pour le lab associé.
 */

const CONTENT_DIR = path.join(__dirname, 'theory-content')

export function loadTheoryBySlug(): Record<string, string> {
  const result: Record<string, string> = {}
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    if (!file.endsWith('.md')) continue
    const slug = file.replace(/\.md$/, '')
    result[slug] = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8').trim()
  }
  return result
}
