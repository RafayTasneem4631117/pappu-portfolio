import { Component } from 'react'

/**
 * SafeBoundary — if the wrapped component crashes (e.g. the 3D library or the
 * GLB file fails to load), show `fallback` (default: nothing) instead of
 * breaking the whole website.
 */
export default class SafeBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.warn('[SafeBoundary] component hidden after error:', error) }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children }
}
