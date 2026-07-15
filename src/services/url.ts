export interface ServerAddress { host: string; port: number }

export function normalizeServerAddress(hostInput: string, portInput = 41732): ServerAddress {
  const trimmed = hostInput.trim()
  if (!trimmed) throw new Error('Alamat server wajib diisi.')
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`
  const url = new URL(candidate)
  const host = url.hostname
  const port = url.port ? Number(url.port) : portInput
  if (!host || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Alamat atau port tidak valid.')
  return { host, port }
}

export function baseUrlOf(address: ServerAddress): string {
  return `http://${address.host}:${address.port}`
}

export function parsePairingQr(value: string): { host: string; port: number; code: string } {
  const url = new URL(value)
  if (!['http:', 'sionlink:'].includes(url.protocol)) throw new Error('QR bukan link SION yang valid.')
  const code = (url.searchParams.get('code') || url.searchParams.get('token') || '').trim().toUpperCase()
  if (!/^[A-F0-9]{6}$/.test(code)) throw new Error('QR tidak memiliki kode akses yang valid.')
  return { host: url.hostname, port: url.port ? Number(url.port) : 41732, code }
}

