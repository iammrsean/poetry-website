import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoemCard from '../../src/components/PoemCard.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/poem/:id', component: { template: '<div/>' } }],
})

const poem = {
  id: 'jingye-si',
  title: '静夜思',
  author: '李白',
  dynasty: '唐',
  type: 'classical',
  lines: ['床前明月光', '疑是地上霜'],
  scene: 'moonlit-night',
}

describe('PoemCard', () => {
  it('displays poem title', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('静夜思')
  })

  it('displays author and dynasty', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('李白')
    expect(wrapper.text()).toContain('唐')
  })

  it('displays first line as preview', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('床前明月光')
  })

  it('links to poem detail page', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/poem/jingye-si')
  })
})
