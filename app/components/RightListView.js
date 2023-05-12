import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { getMeetingTimeStr } from '../utils';
// import { BlurView } from 'expo-blur';

const Empty = () => {
  return (
    <View style={styles.emptyContainer}>
      <ExpoImage source={require('../images/empty.svg')} style={{ width: 79, height: 66 }} />
      <Text style={styles.emptyText}>今天后续无会议</Text>
    </View>
  );
};

const ListTitle = ({ roomIsBusy }) => {
  const icon = roomIsBusy ? require('../images/next-blue.svg') : require('../images/next-orange.svg');
  const title = roomIsBusy ? '正在进行的会议…' : '今天后续会议…';
  return (
    <View style={{ ...styles.iconTitleRow, marginVertical: 14 }}>
      <ExpoImage source={icon} style={{ width: 24, height: 24 }} />
      <Text style={{ ...styles.whiteText, lineHeight: 22, marginLeft: 4 }}>{title}</Text>
    </View>
  );
};

const ListItem = ({ rowData, bottomBordered }) => {
  const avatar = rowData.avatar ?? require('../images/avatar.svg');
  const from = getMeetingTimeStr(rowData.startMeetingTime);
  const to = getMeetingTimeStr(rowData.endMeetingTime);
  return (
    <View style={{ ...styles.listRow, borderBottomWidth: bottomBordered ? 1 : 0 }}>
      <View style={styles.iconTitleRow}>
        <ExpoImage source={require('../images/clock.svg')} style={{ width: 24, height: 24 }} />
        <Text style={{ ...styles.whiteText, marginLeft: 6, fontSize: 21 }}>
          Today, {from} - {to}
        </Text>
      </View>
      <View style={{ width: 320, marginTop: 6 }}>
        <Text style={{ ...styles.whiteText, fontSize: 21 }}>{rowData.name}</Text>
      </View>
      <View style={{ ...styles.iconTitleRow, marginTop: 16 }}>
        <View style={styles.avatarBorder}>
          <ExpoImage source={avatar} style={{ width: 32, height: 32 }} />
        </View>
        <Text style={{ ...styles.whiteText, marginLeft: 8, lineHeight: 22 }}>创建人, {rowData.applicant}</Text>
      </View>
    </View>
  );
};

const ShowNextButton = ({ onPress, title, arrow, roomIsBusy }) => {
  const icon = arrow === 'up' ? require('../images/up.svg') : require('../images/next-outline.svg');
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
      {roomIsBusy ? <ExpoImage source={icon} style={{ width: 24, height: 24 }} /> : null}
    </Pressable>
  );
};

const SignInView = ({ currentMeeting, nextMeeting, navigation }) => {
  const roomIsBusy = !!currentMeeting;
  // TODO 背景模糊效果
  const onPress = () => {
    navigation.navigate('Signup', { currentMeeting, nextMeeting });
  };
  const [buttonVisible, setButtonVisible] = useState(false);
  useEffect(() => {
    if (roomIsBusy) {
      const signStart = new Date(currentMeeting.startSignTime).valueOf();
      const signEnd = new Date(currentMeeting.endSignTime).valueOf();
      const now = new Date().valueOf();
      const canSign = now >= signStart && now <= signEnd;
      setButtonVisible(canSign);
    } else if (nextMeeting) {
      const signStart = new Date(nextMeeting.startSignTime).valueOf();
      const now = new Date().valueOf();
      const canSign = now >= signStart;
      setButtonVisible(canSign);
    } else {
      setButtonVisible(false);
    }
  }, [roomIsBusy, nextMeeting]);
  if (!buttonVisible) {
    return null;
  }
  return (
    <View style={styles.signInView} tint="dark" intensity={90}>
      <Pressable style={styles.signInButton} onPress={onPress}>
        <Text style={styles.signInButtonText}>会议签到</Text>
      </Pressable>
    </View>
  );
};

export default function RightListView({ currentMeeting, nextMeeting, meetingList, navigation }) {
  const roomIsBusy = !!currentMeeting;
  const hasNext = meetingList.length > 0;
  const [nextVisible, setNextVisible] = useState(false);
  const showNext = useCallback(() => setNextVisible(true), []);
  const hideNext = useCallback(() => setNextVisible(false), []);

  useEffect(() => {
    setNextVisible(!roomIsBusy);
  }, [roomIsBusy]);

  let timer;
  // 清理计时器
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);
  const nextListContent = hasNext ? (
    <>
      <ListTitle />
      {meetingList.map((data) => (
        <ListItem rowData={data} key={data.id} />
      ))}
      {roomIsBusy || meetingList.length > 1 ? (
        <ShowNextButton
          onPress={roomIsBusy ? hideNext : null}
          title={roomIsBusy ? '到底了 收起' : '- 到底了 -'}
          arrow="up"
          roomIsBusy={roomIsBusy}
        />
      ) : null}
    </>
  ) : !roomIsBusy ? (
    <View style={styles.container}>
      <Empty />
    </View>
  ) : null;
  const showNextButton = hasNext && !nextVisible ? <ShowNextButton onPress={showNext} title="查看后续会议" /> : null;

  const onScrollEndDrag = () => {
    if (timer) {
      clearInterval(timer);
    }
    if (nextVisible) {
      // 30 秒不操作，自动收起
      timer = setTimeout(() => {
        setNextVisible(false);
      }, 1000 * 30);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} onScrollEndDrag={onScrollEndDrag}>
        {roomIsBusy ? (
          <>
            <ListTitle roomIsBusy />
            <ListItem rowData={currentMeeting} bottomBordered={nextVisible} />
          </>
        ) : null}
        {nextVisible ? nextListContent : showNextButton}
      </ScrollView>
      <SignInView currentMeeting={currentMeeting} nextMeeting={nextMeeting} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 200,
    paddingBottom: 220,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(23, 29, 38)',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgb(23, 29, 38)',
  },
  emptyContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 14,
    fontSize: 14,
    color: '#abb7cc',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    width: 320,
  },
  whiteText: {
    color: '#ABB7CC',
    fontSize: 17,
    textAlignVertical: 'center',
    // backgroundColor: 'red'
  },
  listRow: {
    paddingVertical: 14,
    borderColor: '#fff',
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  avatarBorder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    padding: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  buttonText: {
    marginRight: 8,
    fontSize: 16,
    lineHeight: 20,
    color: '#abb7cc',
  },
  signInView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingTop: 24,
    alignItems: 'center',
    width: '100%',
    height: 136,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(245, 249, 255, 0.1)',
    backgroundColor: 'rgba(23, 29, 38, 0.9)',
  },
  signInButton: {
    paddingVertical: 14,
    width: 144,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#478bff',
    borderRadius: 28,
  },
  signInButtonText: {
    lineHeight: 24,
    fontSize: 18,
    color: '#478bff',
  },
});
