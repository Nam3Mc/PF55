

export function dayCalculator (startDate: Date, endDate: Date) {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const diferencesInMs = Math.abs(end - start)
    const milisecondPerDay = 1000 * 60 *60 * 24
    const days = diferencesInMs / milisecondPerDay
    return Math.round(days)
  }