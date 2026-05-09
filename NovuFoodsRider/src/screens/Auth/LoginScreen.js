import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import colors from '../../assets/theme/colors';

const TAB_EMAIL = 'email';
const TAB_PHONE = 'phone';

const LoginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(TAB_EMAIL);

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone state
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhone = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (phone.replace(/\D/g, '').length < 7) newErrors.phone = 'Enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    try {
      // TODO: Replace with your API call
      // const response = await api.login({ email, password });
      // store token: await AsyncStorage.setItem('token', response.token);
      await new Promise(r => setTimeout(r, 1200)); // simulated delay
      navigation.replace('MainDrawer');
    } catch (err) {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!validatePhone()) return;
    setLoading(true);
    try {
      // TODO: Replace with your API call
      // await api.sendOTP({ phone: countryCode + phone });
      await new Promise(r => setTimeout(r, 1000));
      navigation.navigate('OTPVerification', {
        phone: countryCode + phone,
        displayPhone: `${countryCode} ${phone}`,
      });
    } catch (err) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => setErrors({});

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Brand */}
          <View style={styles.brandWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🛵</Text>
            </View>
            <Text style={styles.brandName}>Novu Foods</Text>
            <Text style={styles.brandSub}>RIDER</Text>
          </View>

          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>Sign in to start delivering</Text>

          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, activeTab === TAB_EMAIL && styles.tabActive]}
              onPress={() => { setActiveTab(TAB_EMAIL); clearErrors(); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === TAB_EMAIL && styles.tabTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === TAB_PHONE && styles.tabActive]}
              onPress={() => { setActiveTab(TAB_PHONE); clearErrors(); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === TAB_PHONE && styles.tabTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>

          {/* General error */}
          {errors.general ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Email/Password form */}
          {activeTab === TAB_EMAIL && (
            <View style={styles.form}>
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrap, errors.email && styles.inputError]}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="driver@novufoods.com"
                    placeholderTextColor={colors.textHint}
                    value={email}
                    onChangeText={t => { setEmail(t); clearErrors(); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
              </View>

              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.inputWrap, errors.password && styles.inputError]}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textHint}
                    value={password}
                    onChangeText={t => { setPassword(t); clearErrors(); }}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleEmailLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(v => !v)}
                    style={styles.eyeBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
              </View>

              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleEmailLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.primaryBtnText}>Sign In</Text>
                }
              </TouchableOpacity>
            </View>
          )}

          {/* Phone form */}
          {activeTab === TAB_PHONE && (
            <View style={styles.form}>
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={[styles.inputWrap, errors.phone && styles.inputError]}>
                  <TouchableOpacity style={styles.countryCode} activeOpacity={0.7}>
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                    <Text style={styles.dropArrow}>▾</Text>
                  </TouchableOpacity>
                  <View style={styles.phoneDivider} />
                  <TextInput
                    style={styles.input}
                    placeholder="787 555 0123"
                    placeholderTextColor={colors.textHint}
                    value={phone}
                    onChangeText={t => { setPhone(t); clearErrors(); }}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    onSubmitEditing={handlePhoneLogin}
                  />
                </View>
                {errors.phone ? <Text style={styles.fieldError}>{errors.phone}</Text> : null}
              </View>

              <Text style={styles.otpNote}>
                We'll send a 6-digit verification code to this number.
              </Text>

              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handlePhoneLogin}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.primaryBtnText}>Send OTP</Text>
                }
              </TouchableOpacity>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Need help? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.footerLink}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  brandWrap: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 28,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoEmoji: {
    fontSize: 36,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textHint,
    letterSpacing: 3,
    marginTop: 2,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textHint,
  },
  tabTextActive: {
    color: colors.primary,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  form: {
    gap: 4,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    height: 54,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },
  fieldError: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dropArrow: {
    fontSize: 12,
    color: colors.textHint,
  },
  phoneDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  otpNote: {
    fontSize: 13,
    color: colors.textHint,
    lineHeight: 18,
    marginBottom: 8,
    marginTop: -4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.textHint,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
