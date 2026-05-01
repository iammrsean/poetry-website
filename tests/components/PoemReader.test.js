import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PoemReader from '../../src/components/PoemReader.vue'

const lines = ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡']

describe('PoemReader', () => {
  it('renders all poem lines', () => {
    const wrapper = mount(PoemReader, { props: { lines, delay: 0 } })
    lines.forEach(line => {
      expect(wrapper.text()).toContain(line)
    })
  })

  it('renders correct number of line elements', () => {
    const wrapper = mount(PoemReader, { props: { lines, delay: 0 } })
    expect(wrapper.findAll('.poem-line').length).toBe(4)
  })
})
