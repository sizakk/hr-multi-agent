export function createTokenTracker() {
  let inputTokens = 0
  let outputTokens = 0
  let startTime = null

  return {
    start() {
      startTime = Date.now()
      inputTokens = 0
      outputTokens = 0
    },

    addTokens(input, output) {
      inputTokens += input
      outputTokens += output
    },

    getElapsedMinutes() {
      if (!startTime) return '0.0'
      return ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    },

    getElapsedSeconds() {
      if (!startTime) return 0
      return Math.floor((Date.now() - startTime) / 1000)
    },

    getTotalTokens() {
      return inputTokens + outputTokens
    },

    getSummary() {
      return {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        elapsedMinutes: this.getElapsedMinutes(),
        estimatedCost: ((inputTokens * 0.003 + outputTokens * 0.015) / 1000).toFixed(4),
      }
    },
  }
}
