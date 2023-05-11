import { StyleSheet, Text, View } from 'react-native';
import RoomName from './RoomName';
import TimeView from './TimeView';
import { Image as ExpoImage } from 'expo-image/build/Image';
import React from 'react';
import { getMeetingTimeStr } from '../utils';

const MeetingTitle = ({ data }) => {
  return (
    <View style={styles.meetingTitleRow}>
      <Text style={styles.meetingTitle}>{data?.name ?? '--'}</Text>
    </View>
  );
};

const MeetingDescription = ({ data }) => {
  const avatar = data.avatar ?? require('../images/avatar-white.svg');
  const from = getMeetingTimeStr(data.startMeetingTime);
  const to = getMeetingTimeStr(data.endMeetingTime);
  return (
    <View style={styles.meetingDescriptionWrapper}>
      <View style={styles.meetingDescriptionRow}>
        <View style={styles.avatarBorder}>
          <ExpoImage source={avatar} style={{ width: 32, height: 32 }} />
        </View>
        <Text style={styles.whiteText}>创建人, {data.applicant}</Text>
      </View>
      <View style={styles.meetingDescriptionRow}>
        <View style={styles.avatarBorder}>
          <ExpoImage source={require('../images/clock-white.svg')} style={{ width: 32, height: 32 }} />
        </View>
        <Text style={styles.whiteText}>
          {from}&nbsp;-&nbsp;{to}
        </Text>
      </View>
    </View>
  );
};

const StatusTitle = ({ isBusy }) => {
  return (
    <View style={styles.statusTitleRow}>
      <Text style={{ ...styles.statusTitle, color: isBusy ? '#478bff' : '#ff9500' }}>
        会议{isBusy ? '进行' : '签到'}中...
      </Text>
    </View>
  );
};

// TODO 数据：区分会议进行中 和 即将开始的会议
export default function LeftDetailView({ currentMeeting, nextMeeting }) {
  // 优先使用正在进行中的会议信息
  const data = currentMeeting || nextMeeting;
  return (
    <View style={styles.leftDetailView}>
      <RoomName />
      <MeetingTitle data={data} />
      <MeetingDescription data={data} />
      <StatusTitle isBusy={!!currentMeeting} />
      <View style={styles.footer}>
        <TimeView />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftDetailView: {
    padding: 40,
    height: '100%',
    width: 410,
    backgroundColor: '#0b1526',
  },
  meetingTitleRow: {
    marginTop: 70,
  },
  meetingTitle: {
    lineHeight: 46,
    fontSize: 36,
    fontWeight: 600,
    color: '#fff',
  },
  meetingDescriptionWrapper: {
    marginTop: 16,
    borderColor: '#fff',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
  },
  meetingDescriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderColor: '#fff',
    borderStyle: 'dashed',
    borderTopWidth: 1,
    // borderBottomWidth: 1,
  },
  whiteText: {
    marginLeft: 8,
    lineHeight: 28,
    fontSize: 18,
    color: '#fff',
  },
  statusTitleRow: {
    marginTop: 40,
  },
  statusTitle: {
    lineHeight: 28,
    fontSize: 24,
    fontWeight: 600,
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
});
