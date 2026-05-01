import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SceneCanvas from '../../src/components/SceneCanvas.vue'

vi.mock('../../src/scenes/moonlit-night.js', () => ({
  init: vi.fn(),
  destroy: vi.fn(),
}))

describe('SceneCanvas', () => {
  it('renders a canvas element', () => {
    const wrapper = mount(SceneCanvas, { props: { scene: 'moonlit-night' } })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('calls scene init on mount', async () => {
    const { init } = await import('../../src/scenes/moonlit-night.js')
    mount(SceneCanvas, { props: { scene: 'moonlit-night' } })
    await new Promise(r => setTimeout(r, 50))
    expect(init).toHaveBeenCalled()
  })

  it('calls destroy on unmount', async () => {
    const { destroy } = await import('../../src/scenes/moonlit-night.js')
    const wrapper = mount(SceneCanvas, { props: { scene: 'moonlit-night' } })
    await new Promise(r => setTimeout(r, 50))
    wrapper.unmount()
    expect(destroy).toHaveBeenCalled()
  })
})
