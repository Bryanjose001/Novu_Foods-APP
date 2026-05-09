import React, { useState, useRef, useEffect } from 'react';
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

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const OTPVerificationScreen = ({ navigation, route }) => {
  const { phone, displayPhone } = route.params || {};
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleOtpChange = (text, index) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      // Handle paste — fill from current index
      const chars = cleaned.slice(0, OTP_LENGTH - index).split('');
      chars.forEach((c, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = c;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newOtp[index] = cleaned;
    setOtp(newOtp);
    setError('');

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      // TODO: Replace with your API call
      // const response = await api.verifyOTP({ phone, code });
      // await AsyncStorage.setItem('token', response.token);
      await new Promise(r => setTimeout(r, 1200));
      navigation.replace('MainDrawer');
    } catch (err) {
      setError('Invalid or expired code. Please try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResending(true);
    try {
      // TODO: Replace with your API call
      // await api.sendOTP({ phone });
      await new Promise(r => setTimeout(r, 800));
      setResendTimer(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(''));
      setError('');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const filled = otp.filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backText}>←  Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.iconWrap}>
            <Text style={styles.iconEmoji}>📱</Text>
          </View>
          <Text style={styles.heading}>Verify Your Phone</Text>
          <Text style={styles.subheading}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.phoneHighlight}>{displayPhone || phone}</Text>
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={ref => (inputRefs.current[i] = ref)}
                style={[
                  styles.otpBox,
                  digit && styles.otpBoxFilled,
                  error && styles.otpBoxError,
                ]}
                value={digit}
                onChangeText={text => handleOtpChange(text, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
                selectTextOnFocus
                autoFocus={i === 0}
              />
            ))}
          </View>

          {/* Error */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={styles.progressRow}>
              {Array(OTP_LENGTH).fill(0).map((_, i) => (
                <View
                  key={i}
                  style={[styles.progressDot, i < filled && styles.progressDotFilled]}
                />
              ))}
            </View>
          )}

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyBtn,
              (filled < OTP_LENGTH || loading) && styles.verifyBtnDisabled,
            ]}
            onPress={handleVerify}
            activeOpacity={0.85}
            disabled={filled < OTP_LENGTH || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.verifyBtnText}>Verify & Continue</Text>
            }
          </TouchableOpacity>

          {/* Resend */}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0 || resending} activeOpacity={0.7}>
              {resending
                ? <ActivityIndicator size="small" color={colors.primary} />
                : <Text style={[styles.resendBtn, resendTimer > 0 && styles.resendBtnDisabled]}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                  </Text>
              }
            </TouchableOpacity>
          </View>

          {/* Change number */}
          <TouchableOpacity
            style={styles.changeNumBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.changeNumText}>Change phone number</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backBtn: {
    paddingVertical: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  iconEmoji: {
    fontSize: 36,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 36,
  },
  phoneHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  otpBoxError: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 8,
    height: 20,
    alignItems: 'center',
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  progressDotFilled: {
    backgroundColor: colors.primary,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  verifyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyBtnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  resendLabel: {
    fontSize: 14,
    color: colors.textHint,
  },
  resendBtn: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  resendBtnDisabled: {
    color: colors.textHint,
    fontWeight: '400',
  },
  changeNumBtn: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  changeNumText: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default OTPVerificationScreen;
