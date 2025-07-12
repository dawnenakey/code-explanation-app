import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Toaster } from '../ui/toaster'
import { useToast } from '@/hooks/use-toast'

// Test component to trigger toast
const TestComponent = () => {
  const { toast } = useToast()
  
  return (
    <div>
      <button onClick={() => toast({ title: 'Test toast', description: 'This is a test' })}>
        Show Toast
      </button>
      <Toaster />
    </div>
  )
}

describe('Toast Component', () => {
  it('displays toast notifications', async () => {
    render(<TestComponent />)
    
    const button = screen.getByText('Show Toast')
    
    act(() => {
      button.click()
    })
    
    expect(screen.getByText('Test toast')).toBeInTheDocument()
    expect(screen.getByText('This is a test')).toBeInTheDocument()
  })
  
  it('handles success toast variants', async () => {
    const TestSuccessComponent = () => {
      const { toast } = useToast()
      
      return (
        <div>
          <button onClick={() => toast({ title: 'Success!', variant: 'default' })}>
            Show Success
          </button>
          <Toaster />
        </div>
      )
    }
    
    render(<TestSuccessComponent />)
    
    const button = screen.getByText('Show Success')
    
    act(() => {
      button.click()
    })
    
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })
  
  it('handles error toast variants', async () => {
    const TestErrorComponent = () => {
      const { toast } = useToast()
      
      return (
        <div>
          <button onClick={() => toast({ title: 'Error!', variant: 'destructive' })}>
            Show Error
          </button>
          <Toaster />
        </div>
      )
    }
    
    render(<TestErrorComponent />)
    
    const button = screen.getByText('Show Error')
    
    act(() => {
      button.click()
    })
    
    expect(screen.getByText('Error!')).toBeInTheDocument()
  })
})