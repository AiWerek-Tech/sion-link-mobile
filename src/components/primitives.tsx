import type { PropsWithChildren, ReactNode } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps } from 'react-native'
import { colors, radius, spacing } from '../theme/tokens'

export function Card({ children, tone = 'default' }: PropsWithChildren<{ tone?: 'default' | 'cyan' }>) {
  return <View style={[styles.card, tone === 'cyan' && styles.cardCyan]}>{children}</View>
}

export function Eyebrow({ children }: PropsWithChildren) { return <Text style={styles.eyebrow}>{children}</Text> }
export function Heading({ children }: PropsWithChildren) { return <Text style={styles.heading}>{children}</Text> }
export function Muted({ children }: PropsWithChildren) { return <Text style={styles.muted}>{children}</Text> }

export function ActionButton({ label, loading, variant = 'primary', icon, ...props }: PressableProps & { label: string; loading?: boolean; variant?: 'primary' | 'secondary' | 'danger'; icon?: ReactNode }) {
  return (
    <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, styles[`button_${variant}`], pressed && styles.pressed, props.disabled && styles.disabled]} {...props}>
      {loading ? <ActivityIndicator color={variant === 'primary' ? colors.canvas : colors.text} /> : <>{icon}<Text style={[styles.buttonText, variant === 'primary' && styles.buttonTextPrimary]}>{label}</Text></>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  cardCyan: { borderColor: '#155E75', backgroundColor: '#09202D' },
  eyebrow: { color: colors.cyan, fontWeight: '800', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2 },
  heading: { color: colors.text, fontSize: 28, lineHeight: 34, fontWeight: '800' },
  muted: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  button: { minHeight: 52, borderRadius: radius.md, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm, borderWidth: 1 },
  button_primary: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  button_secondary: { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
  button_danger: { backgroundColor: '#3A111B', borderColor: '#7F1D2D' },
  buttonText: { color: colors.text, fontSize: 15, fontWeight: '800' },
  buttonTextPrimary: { color: colors.canvas },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 }
})

