import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  SafeAreaView,
} from 'react-native';
import colors from '../../assets/theme/colors';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Deliver with Ease',
    subtitle:
      'Accept orders near you instantly. Our smart dispatch assigns the closest orders so you spend less time waiting.',
    icon: '🛵',
    bg: colors.primary,
    textColor: '#fff',
  },
  {
    id: '2',
    title: 'Navigate Like a Pro',
    subtitle:
      'Built-in Google Maps integration shows you the fastest route to the restaurant and customer every time.',
    icon: '🗺️',
    bg: '#fff',
    textColor: colors.primary,
  },
  {
    id: '3',
    title: 'Earn & Track',
    subtitle:
      'Watch your earnings grow in real time. Withdraw to your bank anytime directly from your wallet.',
    icon: '💰',
    bg: colors.primary,
    textColor: '#fff',
  },
];

const Slide = ({ item }) => {
  const isDark = item.bg === colors.primary;
  return (
    <View style={[styles.slide, { backgroundColor: item.bg, width }]}>
      <View style={styles.iconWrap}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <Text style={[styles.slideTitle, { color: isDark ? '#fff' : colors.primary }]}>
        {item.title}
      </Text>
      <Text style={[styles.slideSubtitle, { color: isDark ? 'rgba(255,255,255,0.8)' : colors.textSecondary }]}>
        {item.subtitle}
      </Text>
    </View>
  );
};

const Dots = ({ activeIndex }) => (
  <View style={styles.dotsRow}>
    {slides.map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          i === activeIndex ? styles.dotActive : styles.dotInactive,
        ]}
      />
    ))}
  </View>
);

const OnboardingScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  const isDark = slides[activeIndex].bg === colors.primary;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: slides[activeIndex].bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={slides[activeIndex].bg}
      />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
        <Text style={[styles.skipText, { color: isDark ? 'rgba(255,255,255,0.7)' : colors.textHint }]}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={slides}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => <Slide item={item} />}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        <Dots activeIndex={activeIndex} />

        <TouchableOpacity
          style={[
            styles.nextBtn,
            isDark ? styles.nextBtnLight : styles.nextBtnGreen,
          ]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.nextBtnText,
              { color: isDark ? colors.primary : '#fff' },
            ]}
          >
            {activeIndex === slides.length - 1 ? "Let's Go" : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 40,
  },
  iconWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  iconText: {
    fontSize: 72,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '400',
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: '#fff',
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  nextBtn: {
    width: '100%',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnLight: {
    backgroundColor: '#fff',
  },
  nextBtnGreen: {
    backgroundColor: colors.primary,
  },
  nextBtnText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});

export default OnboardingScreen;
