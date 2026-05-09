import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../assets/theme/colors';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      // TODO: Replace with your API call
      // await api.forgotPassword({ email });
      await new Promise(r => setTimeout(r, 1000));
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backText}>←  Back</Text>
          </TouchableOpacity>

          {!sent ? (
            <>
              <View style={styles.iconWrap}>
                <Text style={styles.iconEmoji}>🔑</Text>
              </View>
              <Text style={styles.heading}>Forgot Password?</Text>
              <Text style={styles.subheading}>
                Enter your registered email and we'll send you a link to reset your password.
              </Text>

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrap, error && styles.inputError]}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="driver@novufoods.com"
                    placeholderTextColor={colors.textHint}
                    value={email}
                    onChangeText={t => { setEmail(t); setError(''); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    autoFocus
                  />
                </View>
                {error ? <Text style={styles.fieldError}>{error}</Text> : null}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.primaryBtnText}>Send Reset Link</Text>
                }
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successWrap}>
              <View style={[styles.iconWrap, styles.iconSuccess]}>
                <Text style={styles.iconEmoji}>✅</Text>
              </View>
              <Text style={styles.heading}>Check Your Email</Text>
              <Text style={styles.subheading}>
                We sent a password reset link to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Text style={styles.successNote}>
                Didn't receive it? Check your spam folder or try again.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => { setSent(false); setEmail(''); }}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backToLoginBtn}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.backToLoginText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { paddingVertical: 16, alignSelf: 'flex-start' },
  backText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, marginTop: 8,
  },
  iconSuccess: { backgroundColor: '#F0FDF4' },
  iconEmoji: { fontSize: 36 },
  heading: {
    fontSize: 28, fontWeight: '800', color: colors.textPrimary,
    letterSpacing: -0.5, marginBottom: 10,
  },
  subheading: {
    fontSize: 15, color: colors.textSecondary,
    lineHeight: 22, marginBottom: 32,
  },
  emailHighlight: { color: colors.primary, fontWeight: '700' },
  fieldWrap: { marginBottom: 24 },
  label: {
    fontSize: 13, fontWeight: '600', color: colors.textSecondary,
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.inputBg, borderRadius: 12,
    borderWidth: 1.5, borderColor: 'transparent',
    paddingHorizontal: 14, height: 54,
  },
  inputError: { borderColor: colors.error, backgroundColor: '#FEF2F2' },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: colors.textPrimary, paddingVertical: 0 },
  fieldError: { color: colors.error, fontSize: 12, marginTop: 6, fontWeight: '500' },
  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: 14,
    paddingVertical: 17, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryBtnDisabled: { opacity: 0.7, shadowOpacity: 0, elevation: 0 },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  successWrap: { flex: 1 },
  successNote: {
    fontSize: 13, color: colors.textHint, lineHeight: 18,
    marginTop: -16, marginBottom: 28,
  },
  backToLoginBtn: { alignSelf: 'center', marginTop: 16, padding: 8 },
  backToLoginText: {
    fontSize: 14, color: colors.primary,
    fontWeight: '600', textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;
