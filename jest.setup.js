import "@testing-library/jest-dom"
import { jest } from "@jest/globals"

// Mock HTMLAudioElement
global.HTMLAudioElement = class MockAudio {
  constructor() {
    this.play = jest.fn(() => Promise.resolve())
    this.pause = jest.fn()
    this.currentTime = 0
    this.duration = 0
    this.volume = 1
    this.addEventListener = jest.fn()
    this.removeEventListener = jest.fn()
  }
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
