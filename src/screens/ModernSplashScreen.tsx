import { useEffect, useState } from 'react'
import { Animated, Image, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/tokens'

export function ModernSplashScreen({ onFinished }: { onFinished: () => void }) {
  const [opacity] = useState(() => new Animated.Value(0))
  const [scale] = useState(() => new Animated.Value(.82))
  const [progress] = useState(() => new Animated.Value(0))

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, damping: 12, stiffness: 120, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 1, duration: 1250, useNativeDriver: false })
    ]).start()
    const timer = setTimeout(onFinished, 1450)
    return () => clearTimeout(timer)
  }, [onFinished, opacity, progress, scale])

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
  return (
    <View style={styles.page}>
      <View style={styles.glowOne}/><View style={styles.glowTwo}/>
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <View style={styles.logoShell}><Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" /></View>
        <Text style={styles.title}>SION <Text style={styles.accent}>Link</Text></Text>
        <Text style={styles.subtitle}>TIM IBADAH · TERHUBUNG</Text>
      </Animated.View>
      <View style={styles.footer}><View style={styles.track}><Animated.View style={[styles.fill, { width }]}/></View><Text style={styles.version}>MOBILE ALPHA · 0.1.0</Text></View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#050817', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  glowOne: { position: 'absolute', width: 380, height: 380, borderRadius: 190, backgroundColor: 'rgba(14,165,233,.14)', top: -130, right: -160 },
  glowTwo: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(37,99,235,.12)', bottom: -130, left: -130 },
  content: { alignItems: 'center' }, logoShell: { width: 154, height: 154, borderRadius: 44, backgroundColor: 'rgba(15,23,66,.76)', borderWidth: 1, borderColor: 'rgba(34,211,238,.25)', alignItems: 'center', justifyContent: 'center', shadowColor: colors.cyan, shadowOpacity: .3, shadowRadius: 30, elevation: 12 },
  logo: { width: 124, height: 124 }, title: { color: colors.text, fontSize: 38, fontWeight: '900', letterSpacing: -1.5, marginTop: 24 }, accent: { color: colors.cyanLight }, subtitle: { color: colors.muted, fontWeight: '800', fontSize: 10, letterSpacing: 2.3, marginTop: 8 },
  footer: { position: 'absolute', bottom: 52, width: 150, alignItems: 'center', gap: 13 }, track: { height: 3, width: '100%', backgroundColor: '#18223B', borderRadius: 4, overflow: 'hidden' }, fill: { height: 3, backgroundColor: colors.cyan, borderRadius: 4 }, version: { color: '#526079', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 }
})
