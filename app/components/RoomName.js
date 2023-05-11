import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { meetingRoom } from '../constants';

export default function RoomName() {
  return (
    <View style={styles.roomNameRow}>
      <ExpoImage source={require('../images/logo.svg')} style={{ width: 28, height: 28 }} />
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
    lineHeight: 27,
    color: '#fff',
    fontSize: 21,
    fontWeight: 600,
  },
});
