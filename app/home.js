import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Crypto from 'expo-crypto';
import LeftMainView from './components/LeftMainView';
import RightListView from './components/RightListView';
import { appid, secret_key, sn } from './constants';

const testMeeting = {
  name: 'test1 2023年5月年中总结大会',
  startMeetingTime: '2023-05-24T08:00:00',
  endMeetingTime: '2023-05-24T22:00:00',
  userIds: '1000001',
  meetingRoomId: '2',
  startSignTime: '2023-05-24T08:00:00',
  endSignTime: '2023-05-24T22:00:00',
  reason: null,
  status: '1',
  id: 3,
  createTime: '2023-04-18T13:15:47',
  updateTime: '2023-04-18T13:15:51',
  applicant: '张三',
  applicantAvatar: 'https://ksso.cityservice.com.cn/upload/image/2023/03-27/167990743657477541079.png',
  applicantUid: null,
  isSign: false,
  meetingRoomName: '会议室502',
  meetingUserNames: '用户1',
  meetingUserAvatars: "https://koss.cityservice.com.cn/app/2023-05-04/6b22_tmp_39204f80ae9781b7bde544c1822d52230bc12665238aa277.jpg,https://koss.cityservice.com.cn/app/2023-05-03/fda2_tmp_b6c77501619192c63c1d36c07c529d67.jpg,https://koss.cityservice.com.cn/app/2023-05-05/2edd_tmp_67be1ceafd02cf4bb97d76c7c5c3b20fc93b64e49eee2cda.JPG",
  meetingstatus: '进行中',
};
const testMeeting1 = {
  name: 'test2 2023年5月年中总结大会',
  startMeetingTime: '2023-05-12T18:00:00',
  endMeetingTime: '2023-05-12T19:00:00',
  userIds: '1000001',
  meetingRoomId: '2',
  startSignTime: '2023-05-12T13:00:00',
  endSignTime: '2023-05-12T19:00:00',
  reason: null,
  status: '1',
  id: 4,
  createTime: '2023-04-18T13:15:47',
  updateTime: '2023-04-18T13:15:51',
  applicant: '张三',
  applicantAvatar: 'https://ksso.cityservice.com.cn/upload/image/2023/03-27/167990743657477541079.png',
  applicantUid: null,
  isSign: false,
  meetingRoomName: '会议室502',
  meetingUserNames: '用户1',
  meetingstatus: '未开始',
};

export default function Home({ navigation }) {
  // Perform some sort of async data or asset fetching.
  const [isReady, setReady] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState();
  const [nextMeeting, setNextMeeting] = useState();
  const [meetingList, setMeetingList] = useState([]);

  useEffect(() => {
    const getMeetings = async () => {
      const UUID = Crypto.randomUUID();
      const timestamp = new Date().valueOf();
      const tokenStr = `appid=${appid},timestamp=${timestamp},once=${UUID},secret=${secret_key}`;
      const tokenMd5 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, tokenStr);
      const query = `&page=1&size=100&sn=${sn}`;
      const url = `https://kapi.cityservice.com.cn/v1/app/meeting/info?timestamp=${timestamp}&appid=${appid}&once=${UUID}&token=${tokenMd5}${query}`;
      setReady(false);
      const res = await fetch(url);
      setReady(true);
      const data = await res.json();
      if (data.error || data.message !== 'success') {
        console.log('data.error: ', data);
      } else if (data.data) {
        // console.log(JSON.stringify(data, null, 4))
        // const meetingListData = data.data;
        const meetingListData = [testMeeting].concat(data.data); // for test
        // const meetingListData = data.data.concat([testMeeting, testMeeting1]); // for test
        const now = new Date().valueOf();
        const currentMeetingData = meetingListData.find(
          (item) => new Date(item.startMeetingTime).valueOf() <= now && new Date(item.endMeetingTime).valueOf() >= now
        );
        const nextListData = meetingListData.filter((item) => new Date(item.startMeetingTime).valueOf() >= now);
        setMeetingList(nextListData);
        setCurrentMeeting(currentMeetingData);
        setNextMeeting(nextListData[0] ?? undefined);
      }
    };
    getMeetings();

    // 每 30 秒更新一次数据
    const timer = setInterval(() => {
      getMeetings();
    }, 1000 * 30);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const changeScreenOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    changeScreenOrientation();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* When all loading is setup, unmount the splash screen component. */}
      {!isReady && <SplashScreen />}
      <View style={styles.container}>
        <LeftMainView currentMeeting={currentMeeting} nextMeeting={nextMeeting} />
        <RightListView
          currentMeeting={currentMeeting}
          nextMeeting={nextMeeting}
          meetingList={meetingList}
          navigation={navigation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
