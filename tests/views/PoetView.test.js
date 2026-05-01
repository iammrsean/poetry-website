import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoetView from '../../src/views/PoetView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/poet/:id', component: PoetView },
    { path: '/poem/:id', component: { template: '<div/>' } },
  ],
})

describe('PoetView', () => {
  it('displays poet name', async () => {
    await router.push('/poet/li-bai')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('李白')
  })

  it('displays poet bio', async () => {
    await router.push('/poet/li-bai')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('浪漫主义')
  })

  it('displays poems by this poet', async () => {
    await router.push('/poet/li-bai')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.findAll('.poem-card').length).toBeGreaterThan(0)
  })

  it('shows 404 for unknown poet', async () => {
    await router.push('/poet/unknown-poet')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('未找到')
  })
})
