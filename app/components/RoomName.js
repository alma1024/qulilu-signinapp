import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { meetingRoom } from '../constants';

export default function RoomName() {
  return (
    <View style={styles.roomNameRow}>
      <ExpoImage source={require('../images/logo_jinjiang_white.svg')} style={{ width: 40, height: 44 }} />
      <Text style={styles.roomName}>{meetingRoom}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  roomNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomName: {
    marginLeft: 4,
    lineHeight: 34,
    color: '#fff',
    fontSize: 26,
    fontWeight: 600,
  },
});
