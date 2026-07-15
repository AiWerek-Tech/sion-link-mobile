import { useCallback, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { ConnectionScreen } from './src/screens/ConnectionScreen'
import { RoleScreen } from './src/screens/RoleScreen'
import { useConnectionStore } from './src/store/connectionStore'
import { colors } from './src/theme/tokens'
import { ModernSplashScreen } from './src/screens/ModernSplashScreen'
import { OnboardingScreen } from './src/screens/OnboardingScreen'
import { hasCompletedOnboarding } from './src/services/persistence'

function AppContent() {
  const role = useConnectionStore((state) => state.role)
  const [splashDone, setSplashDone] = useState(false)
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null)
  useEffect(() => { void hasCompletedOnboarding().then(setOnboardingDone) }, [])
  const finishSplash = useCallback(() => setSplashDone(true), [])

  if (!splashDone || onboardingDone === null) return <ModernSplashScreen onFinished={finishSplash} />
  if (!onboardingDone) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}><OnboardingScreen onDone={() => setOnboardingDone(true)} /></SafeAreaView>
  return <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>{role ? <RoleScreen /> : <ConnectionScreen />}</SafeAreaView>
}

export default function App() {
  return <SafeAreaProvider><StatusBar style="light" /><AppContent /></SafeAreaProvider>
}
