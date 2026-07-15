import { useEffect, useMemo, useState } from 'react'
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera'
import { ChevronDown, ChevronUp, CircleHelp, LockKeyhole, QrCode, Radio, Server, Wifi } from 'lucide-react-native'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { BrandLogo } from '../components/BrandLogo'
import { ActionButton, Card, Eyebrow } from '../components/primitives'
import { normalizeServerAddress, parsePairingQr } from '../services/url'
import { useConnectionStore } from '../store/connectionStore'
import { colors, radius } from '../theme/tokens'

export function ConnectionScreen() {
  const { address, serverName, status, error, connect, hydrate } = useConnectionStore()
  const [host, setHost] = useState('')
  const [port, setPort] = useState('41732')
  const [code, setCode] = useState('')
  const [manualOpen, setManualOpen] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    void hydrate().then((saved) => {
      if (!saved) return
      setHost(saved.host); setPort(String(saved.port)); setCode(saved.code)
    })
  }, [hydrate])

  const busy = status === 'connecting'
  const canConnect = useMemo(() => host.trim().length > 0 && /^[A-Fa-f0-9]{6}$/.test(code.trim()) && Number(port) > 0, [host, port, code])
  const submit = async () => { try { await connect(normalizeServerAddress(host, Number(port)), code, true) } catch {} }
  const openScanner = async () => {
    setScanError(null)
    const result = permission?.granted ? permission : await requestPermission()
    if (result.granted) setScannerOpen(true)
    else setScanError('Izin kamera diperlukan untuk membaca QR. Anda tetap dapat menggunakan metode manual.')
  }
  const onScanned = (result: BarcodeScanningResult) => {
    try {
      const pairing = parsePairingQr(result.data)
      setScannerOpen(false); setHost(pairing.host); setPort(String(pairing.port)); setCode(pairing.code)
      void connect({ host: pairing.host, port: pairing.port }, pairing.code, true).catch(() => setManualOpen(true))
    } catch { setScanError('QR ini bukan QR koneksi SION Link. Scan QR role dari halaman Pengaturan SION Media.') }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><BrandLogo compact/><Pressable onPress={() => setHelpOpen(true)} accessibilityRole="button" accessibilityLabel="Bantuan koneksi" style={styles.helpButton}><CircleHelp size={20} color={colors.muted}/></Pressable></View>
        <View style={styles.intro}><View style={styles.livePill}><View style={styles.liveDot}/><Text style={styles.liveText}>SIAP TERHUBUNG</Text></View><Text style={styles.title}>Hubungkan perangkat ke <Text style={styles.titleAccent}>SION Media.</Text></Text><Text style={styles.subtitle}>Pilih salah satu metode koneksi berikut. Scan QR adalah cara paling cepat.</Text></View>

        {(error || scanError) && <View style={styles.error}><Text style={styles.errorTitle}>Periksa koneksi</Text><Text style={styles.errorText}>{scanError || error}</Text></View>}

        <View style={styles.methodLabel}><Text style={styles.methodNumber}>01</Text><View><Text style={styles.methodTitle}>Scan QR</Text><Text style={styles.methodHint}>Metode yang direkomendasikan</Text></View></View>
        <Pressable onPress={() => void openScanner()} style={({ pressed }) => [styles.qrCard, pressed && styles.pressed]}>
          <View style={styles.qrGlow}/><View style={styles.qrIcon}><QrCode size={36} color={colors.canvas} strokeWidth={2.4}/></View>
          <View style={styles.qrCopy}><Text style={styles.qrTitle}>Scan QR koneksi</Text><Text style={styles.qrBody}>Arahkan kamera ke QR role yang ditampilkan SION Media.</Text></View>
          <View style={styles.recommended}><Text style={styles.recommendedText}>CEPAT</Text></View>
        </Pressable>

        {serverName && address && <Card tone="cyan"><View style={styles.savedHeader}><View style={styles.savedIcon}><Radio size={20} color={colors.green}/></View><View style={styles.savedCopy}><Eyebrow>Perangkat terakhir</Eyebrow><Text style={styles.savedName}>{serverName}</Text><Text style={styles.savedAddress}>{address.host}:{address.port}</Text></View></View><ActionButton label="Hubungkan kembali" loading={busy} disabled={!canConnect || busy} onPress={() => void submit()} /></Card>}

        <View style={styles.methodLabel}><Text style={styles.methodNumber}>02</Text><View><Text style={styles.methodTitle}>Input manual</Text><Text style={styles.methodHint}>Gunakan jika QR tidak tersedia</Text></View></View>
        <View style={styles.manualCard}>
          <Pressable style={styles.manualHeader} onPress={() => setManualOpen(!manualOpen)}>
            <View style={styles.manualIcon}><Server size={22} color={colors.blue}/></View><View style={styles.manualCopy}><Text style={styles.manualTitle}>Masukkan alamat server</Text><Text style={styles.manualHint}>IP, port, dan kode akses</Text></View>{manualOpen ? <ChevronUp color={colors.muted}/> : <ChevronDown color={colors.muted}/>}</Pressable>
          {manualOpen && <View style={styles.form}>
            <View style={styles.infoStrip}><Wifi size={16} color={colors.cyan}/><Text style={styles.infoText}>HP dan PC operator harus berada di jaringan yang sama.</Text></View>
            <Text style={styles.label}>Alamat IP SION Media</Text><TextInput value={host} onChangeText={setHost} autoCapitalize="none" autoCorrect={false} placeholder="Contoh: 192.168.1.60" placeholderTextColor="#526079" style={styles.input} keyboardType="url" />
            <View style={styles.row}><View style={styles.portField}><Text style={styles.label}>Port</Text><TextInput value={port} onChangeText={setPort} placeholder="41732" placeholderTextColor="#526079" style={styles.input} keyboardType="number-pad" /></View><View style={styles.codeField}><Text style={styles.label}>Kode role</Text><TextInput value={code} onChangeText={(value) => setCode(value.toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 6))} placeholder="ABC123" placeholderTextColor="#526079" style={[styles.input, styles.codeInput]} autoCapitalize="characters" maxLength={6} secureTextEntry /></View></View>
            <ActionButton label="Hubungkan secara manual" loading={busy} disabled={!canConnect || busy} onPress={() => void submit()} />
          </View>}
        </View>

        <View style={styles.security}><LockKeyhole size={15} color={colors.muted}/><Text style={styles.securityText}>Kode disimpan aman di perangkat ini dan role tetap dikontrol oleh SION Media.</Text></View>
      </ScrollView>

      <Modal visible={scannerOpen} animationType="fade" onRequestClose={() => setScannerOpen(false)} statusBarTranslucent>
        <View style={styles.scannerPage}><CameraView style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={onScanned}/><View style={styles.scannerOverlay}><View style={styles.scannerTop}><BrandLogo compact/><Pressable style={styles.cancel} onPress={() => setScannerOpen(false)}><Text style={styles.cancelText}>Tutup</Text></Pressable></View><View style={styles.scannerCenter}><Text style={styles.scannerTitle}>Scan QR SION Link</Text><Text style={styles.scannerSubtitle}>Posisikan QR tepat di dalam bingkai</Text><View style={styles.scanFrame}><View style={[styles.corner, styles.tl]}/><View style={[styles.corner, styles.tr]}/><View style={[styles.corner, styles.bl]}/><View style={[styles.corner, styles.br]}/></View></View><View style={styles.scannerBottom}><Text style={styles.scannerHelp}>QR tersedia di Pengaturan Sistem › SION Link pada komputer operator.</Text></View></View></View>
      </Modal>
      <Modal visible={helpOpen} transparent animationType="slide" onRequestClose={() => setHelpOpen(false)}>
        <View style={styles.sheetBackdrop}><Pressable style={StyleSheet.absoluteFill} onPress={() => setHelpOpen(false)}/><View style={styles.helpSheet}><View style={styles.sheetHandle}/><Text style={styles.helpTitle}>Cara menghubungkan</Text><Text style={styles.helpLead}>Siapkan koneksi dalam tiga langkah sederhana.</Text>{[
          ['1', 'Aktifkan SION Link', 'Pada PC operator buka Pengaturan Sistem › SION Link, lalu aktifkan server.'],
          ['2', 'Pastikan satu jaringan', 'HP dan PC harus memakai Wi-Fi/LAN yang sama. Internet tidak diperlukan.'],
          ['3', 'Scan QR role', 'Scan QR Pemateri, Operator, Viewer, atau Stage. Role dipilih otomatis oleh kode.']
        ].map(([number, title, body]) => <View key={number} style={styles.helpStep}><Text style={styles.helpNumber}>{number}</Text><View style={styles.helpStepCopy}><Text style={styles.helpStepTitle}>{title}</Text><Text style={styles.helpStepBody}>{body}</Text></View></View>)}<ActionButton label="Saya mengerti" onPress={() => setHelpOpen(false)}/></View></View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.canvas }, page: { padding: 20, paddingBottom: 42, gap: 18 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, helpButton: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  intro: { gap: 10, marginTop: 12, marginBottom: 5 }, livePill: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', backgroundColor: '#09221E', borderColor: '#14532D', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green }, liveText: { color: colors.green, fontSize: 9, fontWeight: '900', letterSpacing: 1 }, title: { color: colors.text, fontSize: 33, lineHeight: 39, fontWeight: '900', letterSpacing: -1.3 }, titleAccent: { color: colors.cyan }, subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23 },
  error: { padding: 15, borderRadius: radius.md, backgroundColor: '#32131C', borderWidth: 1, borderColor: '#7F1D2D', gap: 4 }, errorTitle: { color: colors.red, fontWeight: '900' }, errorText: { color: '#FDA4AF', lineHeight: 20 }, methodLabel: { flexDirection: 'row', gap: 11, alignItems: 'center', marginTop: 6 }, methodNumber: { color: colors.cyan, backgroundColor: '#0D2632', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9, fontSize: 10, fontWeight: '900' }, methodTitle: { color: colors.text, fontSize: 15, fontWeight: '900' }, methodHint: { color: colors.muted, fontSize: 11, marginTop: 2 },
  qrCard: { minHeight: 146, borderRadius: 24, backgroundColor: '#18C9E6', padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, overflow: 'hidden', elevation: 8, shadowColor: colors.cyan, shadowOpacity: .22, shadowRadius: 18 }, qrGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,.18)', right: -70, top: -90 }, qrIcon: { width: 68, height: 68, borderRadius: 21, backgroundColor: 'rgba(3,12,28,.92)', alignItems: 'center', justifyContent: 'center' }, qrCopy: { flex: 1 }, qrTitle: { color: '#06101F', fontSize: 20, fontWeight: '900', letterSpacing: -.5 }, qrBody: { color: '#0B3B4B', fontSize: 12, lineHeight: 18, marginTop: 5, fontWeight: '600' }, recommended: { position: 'absolute', right: 12, top: 12, backgroundColor: 'rgba(3,12,28,.85)', borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5 }, recommendedText: { color: '#8DEBFA', fontSize: 8, fontWeight: '900', letterSpacing: .8 }, pressed: { opacity: .82, transform: [{ scale: .99 }] },
  savedHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' }, savedIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#0A2D26', alignItems: 'center', justifyContent: 'center' }, savedCopy: { flex: 1 }, savedName: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 3 }, savedAddress: { color: colors.muted, marginTop: 2, fontSize: 12 },
  manualCard: { borderRadius: 22, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, overflow: 'hidden' }, manualHeader: { padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12 }, manualIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#102144', alignItems: 'center', justifyContent: 'center' }, manualCopy: { flex: 1 }, manualTitle: { color: colors.text, fontWeight: '900', fontSize: 15 }, manualHint: { color: colors.muted, fontSize: 11, marginTop: 3 }, form: { borderTopWidth: 1, borderTopColor: colors.border, padding: 17, gap: 11 }, infoStrip: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: '#0B2030', padding: 12, borderRadius: 12 }, infoText: { flex: 1, color: '#A5D8E8', fontSize: 12, lineHeight: 17 }, label: { color: colors.muted, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: .9 }, input: { minHeight: 52, borderRadius: 14, borderColor: colors.border, borderWidth: 1, backgroundColor: '#080E1A', color: colors.text, paddingHorizontal: 14, fontSize: 15 }, codeInput: { letterSpacing: 4, fontWeight: '900' }, row: { flexDirection: 'row', gap: 10 }, portField: { flex: .7, gap: 7 }, codeField: { flex: 1.3, gap: 7 }, security: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', paddingHorizontal: 4 }, securityText: { flex: 1, color: '#66758C', fontSize: 11, lineHeight: 17 },
  scannerPage: { flex: 1, backgroundColor: '#02040A' }, scannerOverlay: { flex: 1, backgroundColor: 'rgba(1,5,15,.5)', padding: 20, paddingTop: 48, justifyContent: 'space-between' }, scannerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, cancel: { backgroundColor: 'rgba(8,15,30,.9)', borderColor: '#334155', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 17, paddingVertical: 10 }, cancelText: { color: colors.text, fontWeight: '800' }, scannerCenter: { alignItems: 'center' }, scannerTitle: { color: colors.text, fontSize: 25, fontWeight: '900' }, scannerSubtitle: { color: '#CBD5E1', marginTop: 7 }, scanFrame: { width: 275, height: 275, marginTop: 28 }, corner: { position: 'absolute', width: 52, height: 52, borderColor: colors.cyan }, tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 }, tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 }, bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 }, br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 }, scannerBottom: { backgroundColor: 'rgba(8,15,30,.9)', borderColor: '#334155', borderWidth: 1, borderRadius: 18, padding: 16 }, scannerHelp: { color: '#CBD5E1', textAlign: 'center', fontSize: 12, lineHeight: 18 },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,.62)' }, helpSheet: { backgroundColor: '#0C1424', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: colors.border, padding: 22, paddingBottom: 34, gap: 16 }, sheetHandle: { width: 42, height: 4, borderRadius: 4, backgroundColor: '#334155', alignSelf: 'center', marginBottom: 4 }, helpTitle: { color: colors.text, fontSize: 25, fontWeight: '900', letterSpacing: -.7 }, helpLead: { color: colors.muted, marginTop: -9 }, helpStep: { flexDirection: 'row', gap: 12 }, helpNumber: { width: 31, height: 31, borderRadius: 10, backgroundColor: '#0E3A49', color: colors.cyan, textAlign: 'center', textAlignVertical: 'center', fontWeight: '900' }, helpStepCopy: { flex: 1 }, helpStepTitle: { color: colors.text, fontWeight: '900', fontSize: 14 }, helpStepBody: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 }
})
