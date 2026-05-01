import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoetCard from '../../src/components/PoetCard.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/poet/:id', component: { template: '<div/>' } }],
})

const poet = {
  id: 'li-bai',
  name: '李白',
  dynasty: '唐',
  style: '浪漫主义',
  bio: '字太白，号青莲居士。',
  avatar: '/images/poets/li-bai.png',
}

describe('PoetCard', () => {
  it('displays poet name', async () => {
    const wrapper = mount(PoetCard, { props: { poet }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('李白')
  })

  it('displays dynasty and style', async () => {
    const wrapper = mount(PoetCard, { props: { poet }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('唐')
    expect(wrapper.text()).toContain('浪漫主义')
  })

  it('links to poet detail page', async () => {
    const wrapper = mount(PoetCard, { props: { poet }, global: { plugins: [router] } })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/poet/li-bai')
  })
})
