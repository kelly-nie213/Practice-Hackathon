import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedCard from '../../components/common/AnimatedCard';
import DateWeatherCard from '../../components/home/DateWeatherCard';
import FamilySpotlightCard from '../../components/home/FamilySpotlightCard';
import WhoAmICard from '../../components/home/WhoAmICard';
import AffirmationCard from '../../components/home/AffirmationCard';
import ChecklistCard from '../../components/home/ChecklistCard';
import SOSButton from '../../components/home/SOSButton';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

function isEvening(): boolean {
  const h = new Date().getHours();
  return h >= 18;
}

export default function DailyOrientationScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedCard delay={0} style={styles.card}>
          <DateWeatherCard />
        </AnimatedCard>

        <AnimatedCard delay={120} style={styles.card}>
          <FamilySpotlightCard />
        </AnimatedCard>

        <AnimatedCard delay={240} style={styles.card}>
          <WhoAmICard />
        </AnimatedCard>

        <AnimatedCard delay={360} style={styles.card}>
          <AffirmationCard />
        </AnimatedCard>

        <AnimatedCard delay={480} style={styles.card}>
          <ChecklistCard type={isEvening() ? 'evening' : 'morning'} />
        </AnimatedCard>

        {/* Extra bottom padding so SOS doesn't overlap last card */}
        <View style={{ height: 80 }} />
      </ScrollView>

      <SOSButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.CREAM },
  scroll: { flex: 1 },
  content: { padding: SPACING.LG, gap: SPACING.MD },
  card: {},
});
