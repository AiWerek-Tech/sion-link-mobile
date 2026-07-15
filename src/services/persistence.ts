import * as SecureStore from 'expo-secure-store'

const PAIRING_KEY = 'sion-link.pairing.v1'
const ONBOARDING_KEY = 'sion-link.onboarding.v1'

export interface SavedPairing {
  host: string
  port: number
  code: string
  serverName?: string
  role?: string
}

export async function loadPairing(): Promise<SavedPairing | null> {
  const raw = await SecureStore.getItemAsync(PAIRING_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as SavedPairing } catch { return null }
}

export async function savePairing(pairing: SavedPairing): Promise<void> {
  await SecureStore.setItemAsync(PAIRING_KEY, JSON.stringify(pairing), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
  })
}

export async function clearPairing(): Promise<void> {
  await SecureStore.deleteItemAsync(PAIRING_KEY)
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  return (await SecureStore.getItemAsync(ONBOARDING_KEY)) === 'done'
}

export async function completeOnboarding(): Promise<void> {
  await SecureStore.setItemAsync(ONBOARDING_KEY, 'done')
}
