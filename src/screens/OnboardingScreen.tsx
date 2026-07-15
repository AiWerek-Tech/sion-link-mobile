import { useState } from 'react'
import { ChevronRight, MonitorSmartphone, QrCode, ShieldCheck, Wifi } from 'lucide-react-native'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ActionButton } from '../components/primitives'
import { completeOnboarding } from '../services/persistence'
import { colors, radius, spacing } from '../theme/tokens'

const steps = [
  { icon: Wifi, eyebrow: 'LANGKAH 1 · JARINGAN', title: 'Satu Wi-Fi, langsung terhubung.', body: 'Pastikan HP dan komputer operator menggunakan jaringan Wi-Fi atau LAN yang sama.' },
  { icon: QrCode, eyebrow: 'LANGKAH 2 · PAIRING', title: 'Scan QR adalah cara termudah.', body: 'Buka Pengaturan › SION Link pada SION Media, aktifkan server, lalu scan QR sesuai role Anda.' },
  { icon: ShieldCheck, eyebrow: 'LANGKAH 3 · ROLE AMAN', title: 'Akses otomatis sesuai tugas.', body: 'Kode menentukan apakah perangkat menjadi Pemateri, Operator, Live Viewer, atau Stage Display.' }
]

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const step = steps[index]!
  const Icon = step.icon
  const finish = async () => { await completeOnboarding(); onDone() }
  return (
    <View style={styles.page}>
      <View style={styles.top}><Image source={require('../../assets/logo.png')} style={styles.logo}/><Pressable onPress={() => void finish()} hitSlop={12}><Text style={styles.skip}>Lewati</Text></Pressable></View>
      <View style={styles.visual}><View style={styles.orbitOuter}/><View style={styles.orbitInner}/><View style={styles.iconShell}><Icon size={54} color={colors.cyan}/></View><View style={styles.deviceBadge}><MonitorSmartphone size={18} color={colors.green}/><Text style={styles.deviceText}>Native mobile</Text></View></View>
      <View style={styles.copy}><Text style={styles.eyebrow}>{step.eyebrow}</Text><Text style={styles.title}>{step.title}</Text><Text style={styles.body}>{step.body}</Text></View>
      <View style={styles.bottom}><View style={styles.dots}>{steps.map((_, dot) => <View key={dot} style={[styles.dot, dot === index && styles.dotActive]}/>)}</View><ActionButton label={index === steps.length - 1 ? 'Mulai gunakan SION Link' : 'Lanjut'} icon={<ChevronRight size={19} color={colors.canvas}/>} onPress={() => index === steps.length - 1 ? void finish() : setIndex(index + 1)} /></View>
    </View>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas, padding: spacing.lg, justifyContent: 'space-between' }, top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, logo: { width: 44, height: 44 }, skip: { color: colors.muted, fontWeight: '800', padding: 8 },
  visual: { height: 300, alignItems: 'center', justifyContent: 'center' }, orbitOuter: { position: 'absolute', width: 270, height: 270, borderRadius: 135, borderWidth: 1, borderColor: '#182B48' }, orbitInner: { position: 'absolute', width: 196, height: 196, borderRadius: 98, backgroundColor: '#0B1730', borderWidth: 1, borderColor: '#164E63' }, iconShell: { width: 120, height: 120, borderRadius: 38, backgroundColor: '#10213C', borderWidth: 1, borderColor: '#155E75', alignItems: 'center', justifyContent: 'center', elevation: 8 }, deviceBadge: { position: 'absolute', bottom: 24, flexDirection: 'row', gap: 7, alignItems: 'center', backgroundColor: '#0D211C', borderColor: '#14532D', borderWidth: 1, paddingHorizontal: 13, paddingVertical: 8, borderRadius: radius.pill }, deviceText: { color: colors.green, fontSize: 11, fontWeight: '800' },
  copy: { gap: spacing.sm }, eyebrow: { color: colors.cyan, fontWeight: '900', letterSpacing: 1.3, fontSize: 11 }, title: { color: colors.text, fontWeight: '900', fontSize: 34, lineHeight: 40, letterSpacing: -1.2 }, body: { color: colors.muted, fontSize: 16, lineHeight: 24 }, bottom: { gap: spacing.lg, paddingBottom: spacing.sm }, dots: { flexDirection: 'row', gap: 7 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#334155' }, dotActive: { width: 28, backgroundColor: colors.cyan }
})

