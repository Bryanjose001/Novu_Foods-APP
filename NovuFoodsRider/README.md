# Novu Foods – Rider App · Auth Screens

## Files delivered

```
src/
├── assets/theme/
│   └── colors.js               ← Brand color tokens
├── navigation/
│   └── AuthNavigator.js        ← Stack navigator for auth flow
└── screens/Auth/
    ├── OnboardingScreen.js     ← 3 swipeable intro slides
    ├── LoginScreen.js          ← Email/password + Phone tabs
    ├── OTPVerificationScreen.js← 6-box OTP entry + resend
    └── ForgotPasswordScreen.js ← Email reset + success state
App.js                          ← Root with token check
```

## Install dependencies

```bash
npm install \
  @react-navigation/native \
  @react-navigation/native-stack \
  react-native-screens \
  react-native-safe-area-context \
  @react-native-async-storage/async-storage

# iOS only
cd ios && pod install && cd ..
```

## Flow

```
App launch
  └── token in AsyncStorage?
        ├── YES → MainDrawer (your main app)
        └── NO  → Onboarding (first time) / Login
                    ├── Email tab → Sign In → MainDrawer
                    ├── Email tab → Forgot Password → reset email sent
                    └── Phone tab → Send OTP → OTPVerification → MainDrawer
```

## Hooking up your API

Every screen has clearly marked `// TODO` comments. Replace the
`await new Promise(...)` stubs with your real API calls, e.g.:

```js
// LoginScreen.js – email login
const response = await api.login({ email, password });
await AsyncStorage.setItem('token', response.token);

// LoginScreen.js – phone login
await api.sendOTP({ phone: countryCode + phone });

// OTPVerificationScreen.js
const response = await api.verifyOTP({ phone, code });
await AsyncStorage.setItem('token', response.token);

// ForgotPasswordScreen.js
await api.forgotPassword({ email });
```

## Customization

- **Colors**: edit `src/assets/theme/colors.js` — everything inherits from there.
- **Slides**: edit the `slides` array in `OnboardingScreen.js`.
- **Country code picker**: the `+1` button in the phone tab is a stub — wire in
  a library like `react-native-country-picker-modal` when ready.
- **OTP length**: change `OTP_LENGTH` constant in `OTPVerificationScreen.js`.
