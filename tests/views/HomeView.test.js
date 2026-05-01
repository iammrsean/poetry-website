import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../../src/views/HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/poem/:id', component: { template: '<div/>' } },
  ],
})

describe('HomeView', () => {
  it('renders poem cards', async () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    await new Promise(r => setTimeout(r, 10))
    expect(wrapper.findAll('.poem-card').length).toBeGreaterThan(0)
  })

  it('renders search bar', () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('filters poems by search query', async () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    await wrapper.find('input').setValue('李白')
    const cards = wrapper.findAll('.poem-card')
    expect(cards.length).toBeGreaterThan(0)
    cards.forEach(card => {
      expect(card.text()).toContain('李白')
    })
  })

  it('filters poems by category', async () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    const tabs = wrapper.findAll('.tab')
    const modernTab = tabs.find(t => t.text() === '现代诗')
    await modernTab.trigger('click')
    await new Promise(r => setTimeout(r, 10))
    const cards = wrapper.findAll('.poem-card')
    cards.forEach(card => {
      expect(card.text()).toContain('现代')
    })
  })
})
