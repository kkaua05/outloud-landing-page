import { siteConfig } from '../config/site'

const parsed = Date.parse(siteConfig.drop.startsAt)

/** Release time in epoch ms, or `null` when not configured / invalid. */
export const dropStartsAt: number | null = Number.isFinite(parsed) ? parsed : null

export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function splitTimeLeft(ms: number): TimeLeft {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  }
}
