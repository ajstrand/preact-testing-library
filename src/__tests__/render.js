import '@testing-library/jest-dom/extend-expect'
import { Component, createRef, h } from 'preact'
import { createPortal, useEffect } from 'preact/compat'
import { cleanup, render, screen } from '..'

test('renders div into document', () => {
  const ref = createRef()

  const { container } = render(<div ref={ref} />)

  expect(container.firstChild).toBe(ref.current)
})

test('works great with preact portals', () => {
  function MyPortal () {
    const portalNode = document.createElement('div')
    portalNode.dataset.testid = 'my-portal'

    useEffect(() => {
      document.body.appendChild(portalNode)
      return () => {
        portalNode.parentNode.removeChild(portalNode)
      }
    }, [portalNode])

    return createPortal(<Greet greeting="Hello" subject="World" />, portalNode)
  }

  function Greet ({ greeting, subject }) {
    return (
      <div>
        <strong>
          {greeting} {subject}
        </strong>
      </div>
    )
  }
  const { getByText, getByTestId, unmount } = render(<MyPortal />)
  expect(getByText('Hello World')).toBeInTheDocument()
  const portalNode = getByTestId('my-portal')
  expect(portalNode).toBeInTheDocument()
  unmount()
  expect(portalNode).not.toBeInTheDocument()
})

test('returns baseElement which defaults to document.body', () => {
  const { baseElement } = render(<div />)
  expect(baseElement).toBe(document.body)
})

test('supports fragments', () => {
  class Comp extends Component {
    render () {
      return (
        <div>
          <code>DocumentFragment</code> is pretty cool!
        </div>
      )
    }
  }

  const { asFragment } = render(<Comp />)
  expect(asFragment()).toMatchSnapshot()
})

test('renders options.wrapper around node', () => {
  const WrapperComponent = ({ children }) => <div data-testid="wrapper">{children}</div>

  const { container, getByTestId } = render(<div data-testid="inner" />, {
    wrapper: WrapperComponent
  })

  expect(getByTestId('wrapper')).toBeInTheDocument()
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      data-testid="wrapper"
    >
      <div
        data-testid="inner"
      />
    </div>
  `)
})
