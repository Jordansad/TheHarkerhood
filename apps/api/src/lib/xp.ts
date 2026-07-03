/** Level N requires N*100 XP; cumulative XP is triangular. */
export function computeLevel(xp: number): { level: number; xpToNextLevel: number; xpIntoLevel: number } {
  let level = 1
  let xpUsed = 0
  for (;;) {
    const xpForThisLevel = level * 100
    if (xpUsed + xpForThisLevel > xp) {
      return { level, xpToNextLevel: xpUsed + xpForThisLevel - xp, xpIntoLevel: xp - xpUsed }
    }
    xpUsed += xpForThisLevel
    level += 1
  }
}
