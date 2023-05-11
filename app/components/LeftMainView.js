import React, { useCallback, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Image as ExpoImage } from 'expo-image';
import { getMeetingTimeStr } from '../utils';
import RoomName from './RoomName';
import TimeView from './TimeView';

SplashScreen.preventAutoHideAsync();

const CurrentMeeting = ({ currentMeeting }) => {
  const roomIsBusy = !!currentMeeting;
  const title = roomIsBusy ? '会议进行中…' : '会议室空闲中…';
  return (
    <View style={styles.mainTitleRow}>
      <Text style={{ ...styles.mainTitle, color: roomIsBusy ? '#fff' : '#478bff' }}>{title}</Text>
    </View>
  );
};

const MeetingDescription = ({ currentMeeting, nextMeeting }) => {
  const [timeData, setTimeData] = useState('');
  const getTimeDetail = () => {
    const roomIsBusy = !!currentMeeting;
    let currentInfo;
    if (roomIsBusy) {
      const now = new Date(); // 现在的时间
      const end = new Date(currentMeeting.endMeetingTime); // 会议结束时间
      const delta = (end - now) / 1000 / 60; // 将时间差换算成分钟
      let toEnd = '';
      if (delta >= 60) {
        toEnd = ` ${Math.floor(delta / 60)} 小时`;
      }
      if (delta % 60 > 0) {
        toEnd += ` ${Math.floor(delta % 60)} 分钟`;
      }
      const from = getMeetingTimeStr(currentMeeting.startMeetingTime);
      const to = getMeetingTimeStr(currentMeeting.endMeetingTime);
      currentInfo = currentMeeting ? `${from} - ${to}，还剩${toEnd}结束…` : '';
    }
    const info = nextMeeting ? `下个会议 ${getMeetingTimeStr(nextMeeting.startMeetingTime)} 开始` : '今天后续无会议';
    return roomIsBusy ? currentInfo : info;
  };
  useEffect(() => {
    const updateTimeData = () => {
      const data = getTimeDetail();
      setTimeData(data);
    };
    updateTimeData();
    // 每 1 秒更新一次时间显示
    const timer = setInterval(() => {
      updateTimeData();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [currentMeeting, nextMeeting]);
  return (
    <View style={styles.descriptionRow}>
      <ExpoImage source={require('../images/clock-white.svg')} style={{ width: 24, height: 24 }} />
      <Text style={styles.description}>{timeData}</Text>
    </View>
  );
};

const QrCode = () => {
  return (
    <View style={styles.qrCode}>
      <ExpoImage source={require('../images/qr-test.jpg')} style={{ width: 96, height: 96 }} />
      <Text style={styles.qrInfo}>扫码预约会议</Text>
    </View>
  );
};

export default function LeftMainView({ currentMeeting, nextMeeting }) {
  const [fontsLoaded] = useFonts({
    AliShuHeiTi_Bold: require('../../assets/fonts/Alimama_ShuHeiTi_Bold.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  const roomIsBusy = !!currentMeeting;
  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.containerBg} onLayout={onLayoutRootView}>
      <ImageBackground source={require('../images/meeting_bg.jpg')} resizeMode="cover" style={styles.bgImage}>
        <View
          style={{
            ...styles.innerWrapper,
            backgroundColor: roomIsBusy ? 'rgba(71, 139, 255, 0.9)' : 'rgba(11, 21, 38, 0.9)',
          }}>
          <RoomName />
          <CurrentMeeting currentMeeting={currentMeeting} />
          <MeetingDescription currentMeeting={currentMeeting} nextMeeting={nextMeeting} />
          <View style={styles.footer}>
            <TimeView />
            <QrCode />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBg: {
    height: '100%',
    width: '60%',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  innerWrapper: {
    position: 'relative',
    flexDirection: 'column',
    height: '100%',
    padding: 40,
    fontSize: 0,
    backgroundColor: 'rgba(11, 21, 38, 0.9)',
  },
  mainTitleRow: {
    flexDirection: 'row',
    marginTop: 166,
  },
  mainTitle: {
    color: '#478bff',
    fontSize: 60,
    lineHeight: 60,
    fontFamily: 'AliShuHeiTi_Bold',
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 6,
    paddingBottom: 8,
    borderColor: '#fff',
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  description: {
    marginLeft: 8,
    lineHeight: 28,
    color: '#fff',
    fontSize: 21,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    left: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qrCode: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrInfo: {
    marginTop: 10,
    lineHeight: 21,
    fontSize: 17,
    color: '#fff',
  },
});
