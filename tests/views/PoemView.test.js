import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoemView from '../../src/views/PoemView.vue'

vi.mock('../../src/components/SceneCanvas.vue', () => ({
  default: { template: '<canvas />', props: ['scene'] },
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/poem/:id', component: PoemView },
    { path: '/poet/:id', component: { template: '<div/>' } },
  ],
})

describe('PoemView', () => {
  it('displays poem title', async () => {
    await router.push('/poem/jingye-si')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('静夜思')
  })

  it('shows 404 message for unknown poem', async () => {
    await router.push('/poem/nonexistent-poem')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('未找到')
  })

  it('displays poem lines', async () => {
    await router.push('/poem/jingye-si')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('床前明月光')
  })

  it('displays translation section', async () => {
    await router.push('/poem/jingye-si')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('白话')
  })
})
