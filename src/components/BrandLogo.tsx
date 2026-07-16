import { Image, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/tokens'

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.row}>
      <Image source={require('../../assets/logo.png')} style={compact ? styles.logoCompact : styles.logo} resizeMode="contain" />
      <View>
        <Text style={compact ? styles.nameCompact : styles.name}>SION <Text style={styles.accent}>Link</Text></Text>
        {!compact && <Text style={styles.tagline}>MOBILE COMPANION</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 58, height: 58 }, logoCompact: { width: 36, height: 36 },
  name: { color: colors.text, fontSize: 24, fontWeight: '900', letterSpacing: -.7 }, nameCompact: { color: colors.text, fontSize: 19, fontWeight: '900', letterSpacing: -.5 },
  accent: { color: colors.cyanLight }, tagline: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginTop: 2 }
})

