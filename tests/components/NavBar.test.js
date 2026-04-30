import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import NavBar from '../../src/components/NavBar.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/poet/all', component: { template: '<div/>' } },
  ],
})

describe('NavBar', () => {
  it('renders site name', async () => {
    const wrapper = mount(NavBar, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('诗词天地')
  })

  it('has a link to home', async () => {
    const wrapper = mount(NavBar, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))
    expect(hrefs).toContain('/')
  })

  it('has a link to explore poets', async () => {
    const wrapper = mount(NavBar, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('诗人')
  })
})
