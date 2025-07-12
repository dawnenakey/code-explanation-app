import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../ui/button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled button</Button>)
    const button = screen.getByText('Disabled button')
    expect(button).toBeDisabled()
  })

  it('applies variant styles correctly', () => {
    render(<Button variant="secondary">Secondary button</Button>)
    const button = screen.getByText('Secondary button')
    expect(button).toHaveClass('bg-secondary')
  })

  it('applies size styles correctly', () => {
    render(<Button size="sm">Small button</Button>)
    const button = screen.getByText('Small button')
    expect(button).toHaveClass('h-9') // Default small button height
  })
})