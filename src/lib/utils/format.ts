import { format, parseISO } from 'date-fns'

/**
 * Format currency in millions (M€)
 */
export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)}M€`
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd/MM/yyyy')
}

/**
 * Format date to short format
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd MMM yy')
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Format OVR with potential indicator
 */
export function formatPlayerRating(ovr: number, potential: number): string {
  const diff = potential - ovr
  if (diff >= 10) return `${ovr} ⭐⭐⭐` // High potential
  if (diff >= 5) return `${ovr} ⭐⭐` // Medium potential
  if (diff > 0) return `${ovr} ⭐` // Some potential
  return `${ovr}` // At peak
}
