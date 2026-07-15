import { normalizeServerAddress, parsePairingQr } from './url'

describe('connection URL helpers', () => {
  it('normalizes a LAN address', () => expect(normalizeServerAddress('192.168.1.60')).toEqual({ host: '192.168.1.60', port: 41732 }))
  it('reads pairing URL', () => expect(parsePairingQr('http://192.168.1.60:41732/stage?code=ABC123')).toEqual({ host: '192.168.1.60', port: 41732, code: 'ABC123' }))
  it('rejects missing code', () => expect(() => parsePairingQr('http://192.168.1.60:41732')).toThrow())
})

