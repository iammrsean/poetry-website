import { describe, it, expect } from 'vitest'

const sceneModules = [
  '../../src/scenes/moonlit-night.js',
  '../../src/scenes/spring-morning.js',
  '../../src/scenes/river-flow.js',
  '../../src/scenes/rain.js',
  '../../src/scenes/autumn.js',
]

describe('scene modules', () => {
  sceneModules.forEach(modulePath => {
    it(`${modulePath} exports init and destroy`, async () => {
      const mod = await import(modulePath)
      expect(typeof mod.init).toBe('function')
      expect(typeof mod.destroy).toBe('function')
    })

    it(`${modulePath} init accepts canvas element`, async () => {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 600
      const mod = await import(modulePath)
      expect(() => mod.init(canvas)).not.toThrow()
      mod.destroy()
    })
  })
})
