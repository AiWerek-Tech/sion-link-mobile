import { parseExactFrameEvent, parseSnapshotEvent } from './sionLinkClient'

describe('SION Link named SSE events', () => {
  it('parses the server snapshot event payload', () => {
    const snapshot = parseSnapshotEvent(JSON.stringify({
      projectionState: 'LIVE', currentSlide: { text: 'Kasih Tuhan' }, nextSlide: null,
      currentIndex: 0, nextIndex: null, hasNextSlide: false, flowPosition: 0,
      isSmartMode: false, updatedAt: 10
    }))
    expect(snapshot.currentSlide?.text).toBe('Kasih Tuhan')
    expect(snapshot.projectionState).toBe('LIVE')
  })

  it('parses the server exact-frame event payload', () => {
    const frame = parseExactFrameEvent(JSON.stringify({ dataUrl: 'data:image/jpeg;base64,AA==', updatedAt: 11 }))
    expect(frame.dataUrl).toContain('image/jpeg')
  })
})
