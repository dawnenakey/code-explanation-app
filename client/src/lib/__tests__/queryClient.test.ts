import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiRequest } from '../queryClient'

// Mock fetch
global.fetch = vi.fn()

describe('Query Client Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('apiRequest', () => {
    it('should make successful GET requests', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('success')
      } as Response

      vi.mocked(fetch).mockResolvedValue(mockResponse)

      const result = await apiRequest('GET', '/api/test')
      
      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: {},
        body: undefined,
        credentials: 'include'
      })
      expect(result).toEqual(mockResponse)
    })

    it('should make successful POST requests with data', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        json: () => Promise.resolve({ success: true, id: 1 }),
        text: () => Promise.resolve('created')
      } as Response

      vi.mocked(fetch).mockResolvedValue(mockResponse)

      const postData = { name: 'test', value: 123 }
      const result = await apiRequest('POST', '/api/test', postData)
      
      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
        credentials: 'include'
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle request failures', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid request')
      } as Response

      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await expect(apiRequest('GET', '/api/test')).rejects.toThrow('400: Invalid request')
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      await expect(apiRequest('GET', '/api/test')).rejects.toThrow('Network error')
    })

    it('should handle server errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Server error')
      } as Response

      vi.mocked(fetch).mockResolvedValue(mockResponse)

      await expect(apiRequest('GET', '/api/test')).rejects.toThrow('500: Server error')
    })
  })
})