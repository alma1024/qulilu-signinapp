import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getDateDetail } from '../utils';

export default function TimeView({ hideDate }) {
  const [timeData, setTimeData] = useState({});
  useEffect(() => {
    const updateTimeData = () => {
      const data = getDateDetail();
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
  }, []);
  return (
    <View style={styles.timeViewRow}>
      <Text style={styles.time}>
        {timeData.hours}:{timeData.minutes}
      </Text>
      {!hideDate ? (
        <Text style={styles.date}>
          {timeData.year}.{timeData.month}.{timeData.date} / 星期{timeData.day}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  timeViewRow: {
    flexDirection: 'column',
  },
  time: {
    fontSize: 54,
    lineHeight: 54,
    color: '#fff',
  },
  date: {
    fontSize: 17,
    color: '#fff',
  },
});
