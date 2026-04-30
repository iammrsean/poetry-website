import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../../src/components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders search input', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('emits search event on input', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('input').setValue('李白')
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['李白'])
  })

  it('renders category tabs', () => {
    const wrapper = mount(SearchBar)
    const text = wrapper.text()
    expect(text).toContain('全部')
    expect(text).toContain('唐诗')
    expect(text).toContain('宋词')
    expect(text).toContain('现代诗')
  })

  it('emits category event when tab clicked', async () => {
    const wrapper = mount(SearchBar)
    const tabs = wrapper.findAll('.tab')
    await tabs[1].trigger('click')
    expect(wrapper.emitted('category')).toBeTruthy()
  })
})
