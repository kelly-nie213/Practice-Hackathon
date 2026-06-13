import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import LargeText from '../common/LargeText';
import PrimaryButton from '../common/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { useUser } from '../../context/UserContext';

export default function SOSButton() {
  const { profile } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [sending, setSending] = useState(false);

  const sendLocation = async () => {
    setSending(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow location access so we can help you.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = loc.coords;
      const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      const phone = profile?.emergencyContactPhone;

      if (phone) {
        const smsUrl = `sms:${phone}?body=I need help. Here is my location: ${mapsLink}`;
        await Linking.openURL(smsUrl);
      } else {
        await Linking.openURL(mapsLink);
      }
    } catch (e: any) {
      Alert.alert('Error', 'Could not get location. Please call a family member.');
    } finally {
      setSending(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.sos} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <LargeText size="CAPTION" bold color={COLORS.WARM_WHITE} center>I'm{'\n'}Lost</LargeText>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <LargeText size="H2" bold center>Do you need help?</LargeText>
            <LargeText size="BODY" center color={COLORS.MEDIUM_GRAY} style={styles.dialogSub}>
              We'll send your location to your family so they can come find you.
            </LargeText>
            <PrimaryButton
              label="Yes, Send My Location"
              onPress={sendLocation}
              loading={sending}
              variant="danger"
              style={{ marginTop: SPACING.LG }}
            />
            <PrimaryButton
              label="Cancel"
              onPress={() => setModalVisible(false)}
              variant="secondary"
              style={{ marginTop: SPACING.SM }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sos: {
    position: 'absolute',
    bottom: 96,
    right: SPACING.LG,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.DANGER_RED,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.DANGER_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  dialog: {
    backgroundColor: COLORS.WARM_WHITE,
    borderRadius: RADIUS.LG,
    padding: SPACING.XL,
    width: '100%',
  },
  dialogSub: { marginTop: SPACING.SM },
});
