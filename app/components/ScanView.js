import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { manipulateAsync } from 'expo-image-manipulator';
// import { LinearGradient } from 'expo-linear-gradient';
import { Image as ExpoImage } from 'expo-image';
import Toast, { DURATION } from 'react-native-easy-toast';
import TimeView from './TimeView';

// 人脸识别框
const FaceBorder = ({ data }) => {
  if (!data) {
    return null;
  }
  const sizeStyles = { width: data.width / 4, height: data.height / 4 };
  return (
    <View style={{ ...faceBorderStyles.container, ...data }}>
      <View style={{ ...faceBorderStyles.border, ...faceBorderStyles.lt, ...sizeStyles }} />
      <View style={{ ...faceBorderStyles.border, ...faceBorderStyles.rt, ...sizeStyles }} />
      <View style={{ ...faceBorderStyles.border, ...faceBorderStyles.lb, ...sizeStyles }} />
      <View style={{ ...faceBorderStyles.border, ...faceBorderStyles.rb, ...sizeStyles }} />
    </View>
  );
};
const faceBorderStyles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  border: {
    position: 'absolute',
    borderStyle: 'solid',
    borderColor: '#fff',
  },
  lt: {
    left: 0,
    top: 0,
    borderTopWidth: 6,
    borderLeftWidth: 6,
  },
  rt: {
    right: 0,
    top: 0,
    borderTopWidth: 6,
    borderRightWidth: 6,
  },
  lb: {
    left: 0,
    bottom: 0,
    borderBottomWidth: 6,
    borderLeftWidth: 6,
  },
  rb: {
    right: 0,
    bottom: 0,
    borderBottomWidth: 6,
    borderRightWidth: 6,
  },
});

// 顶部时间显示
const StatusTitle = ({ isBusy }) => {
  return (
    <View>
      <Text style={scanHeaderStyles.statusTitle}>会议{isBusy ? '进行中' : '即将开始'}...</Text>
    </View>
  );
};

// 签到页面顶部：时间 + 文字
const ScanViewHeader = ({ currentMeeting, showBar }) => {
  return (
    <View style={[scanHeaderStyles.container, { backgroundColor: 'transparent' }]}>
      <View style={scanHeaderStyles.header}>
        <TimeView hideDate />
        <StatusTitle isBusy={!!currentMeeting} />
      </View>
      {showBar && (
        <View style={scanHeaderStyles.barRow}>
          {/*<LinearGradient*/}
          {/*  colors={['rgba(7, 224, 162, 0.1)', 'rgba(7, 224, 162, 1)', 'rgba(7, 224, 162, 0.1)']}*/}
          {/*  style={scanHeaderStyles.bar}*/}
          {/*  start={{ x: 0, y: 0.5 }}*/}
          {/*  end={{ x: 1, y: 0.5 }}*/}
          {/*/>*/}
          <Text style={scanHeaderStyles.tip}>请将手机上的二维码对准屏幕</Text>
        </View>
      )}
    </View>
  );
};
const scanHeaderStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 48,
    left: 0,
    width: '100%',
    alignItems: 'center',
  },
  statusTitle: {
    lineHeight: 20,
    fontSize: 17,
    fontWeight: 600,
    color: '#fff',
  },
  barRow: {
    position: 'absolute',
    top: '45.5%',
    left: 0,
    alignItems: 'center',
    width: '100%',
    height: 44,
  },
  bar: {
    position: 'absolute',
    width: 320,
    height: 4,
  },
  tip: {
    fontSize: 18,
    color: '#abb7cc',
  },
});

// 信息提示框
const ToastTimer = () => {
  const [counter, setCounter] = useState(3);
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((_counter) => _counter - 1);
    }, 1000);
    if (counter === 0 && timer) {
      clearInterval(timer);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, []);
  return counter > 0 ? `${counter}s` : '';
};
const messageMap = {
  success: {
    icon: require('../images/success.svg'),
    title: (userName) => `签到成功，欢迎${userName}`,
    timer: true,
  },
  loading: {
    icon: require('../images/loading.svg'),
    title: () => '读码中，请稍候...',
  },
  error: {
    icon: require('../images/error.svg'),
    title: (_, cameraType) => (cameraType === 'face' ? '签到失败，请联系管理员。' : '签到失败，请重新扫码。'),
  },
};
const ToastView = ({ type, userName, cameraType }) => {
  const message = messageMap[type];
  return (
    <View style={toastStyles.container}>
      <ExpoImage source={message.icon} key={type} style={{ width: 32, height: 32 }} />
      <Text style={toastStyles.text}>{message.title(userName, cameraType)} {message.timer ? <ToastTimer /> : ''}</Text>
    </View>
  );
};
const toastStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 5,
    paddingRight: 14,
  },
  text: {
    marginLeft: 8,
    lineHeight: 22,
    fontSize: 17,
    color: '#fff',
    fontWeight: 600,
  },
});

// 测试用的返回首页按钮
const TempBackHome = ({ backHomeAndClear }) => {
  return (
    <Pressable
      style={{
        paddingVertical: 14,
        marginLeft: 32,
        width: 144,
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#fff',
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)'
      }}
      onPress={backHomeAndClear}>
      <Text
        style={{
          lineHeight: 24,
          fontSize: 18,
          color: '#fff',
        }}>
        返回首页
      </Text>
    </Pressable>)
}

export default function ScanView({ backToHome, currentMeeting }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [faceBorder, setFaceBorder] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraType, setCameraType] = useState('face');
  const cameraRef = useRef();
  const toastRef = useRef();
  const backTimer = useRef();
  const backCallTimer = useRef();

  const clearTimer = () => {
    if (backTimer.current) {
      clearTimeout(backTimer.current);
    }
    if (backCallTimer.current) {
      clearTimeout(backCallTimer.current);
    }
  };

  const backHomeAndClear = () => {
    clearTimer();
    backToHome();
  };

  const fetchPhoto = async (uri) => {
    console.log('fetchPhoto uri: ', uri);
    const manipulateAsyncRes = await manipulateAsync(uri, [], { base64: true });
    const formData = new FormData();
    formData.append('sourceStr', manipulateAsyncRes.base64);
    formData.append('pictureUrls', currentMeeting.meetingUserAvatars ?? '');
    formData.append('userIds', currentMeeting.userIds ?? '');
    formData.append('meetingReportId', currentMeeting.id ?? '');
    console.log('sourceStr base64 20位: ', manipulateAsyncRes.base64.slice(0, 20));
    console.log('pictureUrls: ', currentMeeting.meetingUserAvatars);
    console.log('userIds: ', currentMeeting.userIds);
    console.log('meetingReportId: ', currentMeeting.id);
    setLoading(true);
    console.log('toastRef show loading!!!!!');
    toastRef.current?.show(<ToastView type="loading" />, DURATION.FOREVER);
    const url = 'https://fliot.cityservice.com.cn/face/api/v1.0/face/meeting-user-check/base64';
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (cameraType !== 'face') {
        return;
      }
      fetchCallback(data);
    } catch (e) {
      console.log('face catch error: ', e)
      fetchCallback();
    }
  };

  // 二维码识别
  const fetchQr = async (qr) => {
    const formData = new FormData();
    formData.append('qrStr', qr);
    formData.append('meetingReportId', currentMeeting.id ?? '');
    setLoading(true); // 通过 loading 控制是否需要识别二维码
    toastRef.current?.show(<ToastView type="loading" />, DURATION.FOREVER);
    const url = `https://fliot.cityservice.com.cn/face/api/v1.0/meeting/qr/singin`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (cameraType !== 'qr') {
        return;
      }
      fetchCallback(data);
    } catch (e) {
      console.log('qr catch error: ', e)
      fetchCallback();
    }
  };

  const resetBackToHomeCaller = () => {
    if (backTimer.current) {
      clearTimeout(backTimer.current);
    }
    backToHomeCaller();
  };

  // 处理返回数据: 成功后显示签到成功提示（3秒后自动消失）
  const fetchCallback = (res) => {
    console.log('fetchCallback res: ', res);
    if (res && res.code === 0 && res.payload) {
      console.log('meetingUserNames: ', currentMeeting.meetingUserNames);
      console.log('userIds: ', currentMeeting.userIds);
      console.log('payload.userId: ', res.payload.userId);
      // 成功 显示 3s
      const userNames = currentMeeting.meetingUserNames?.split(',');
      const index = currentMeeting.userIds?.split(',').findIndex(userId => userId === `${res.payload.userId}`);
      const userName = userNames[index] ?? '';
      console.log('userName: ', userName);
      toastRef.current?.show(<ToastView type="success" userName={userName} key="success" />, 3 * 1000);
    } else {
      // 失败 显示 3s
      toastRef.current?.show(<ToastView type="error" cameraType={cameraType} />, 3 * 1000);
    }
    backCallTimer.current = setTimeout(() => {
      setLoading(false);
      resetBackToHomeCaller();
    }, 1000 * 3);
  };

  // 30 秒内没有检测到人脸或二维码，自动回到主页面
  const backToHomeCaller = () => {
    backTimer.current = setTimeout(() => {
      backHomeAndClear();
    }, 1000 * 30);
  };

  // 主动拍照，将照片发送给后台进行 AI 识别
  const takePic = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync({ quality: 0.1 });
      fetchPhoto(photo.uri);
    }
  };

  // 检测到人脸的事件：更新脸部识别框的位置，主动拍照 [仅处理第一个人脸数据]
  const faceDetected = ({ faces }) => {
    const face = faces[0];
    if (!face) {
      setFaceBorder(undefined);
      if (backTimer.current) return;
      backToHomeCaller();
      return;
    }
    const {
      bounds: {
        origin: { x, y },
        size: { width, height },
      },
      yawAngle,
    } = face;
    // 一些限制：脸部必须出现在视图中，面向摄像头 15 度以内
    if (x < 0 || y < 0 || yawAngle > 15) {
      setFaceBorder(undefined);
      return;
    }
    const borderLength = Math.max(width, height);
    let deltaH = 0;
    if (height > width) {
      deltaH = (height - width) / 2;
    }
    let deltaV = 0;
    if (width > height) {
      deltaV = (width - height) / 2;
    }
    setFaceBorder({
      left: Math.floor(x) - deltaH,
      top: Math.floor(y) - deltaV,
      width: Math.floor(borderLength),
      height: Math.floor(borderLength),
    });
    if (!loading) {
      takePic();
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ bounds, cornerPoints, data }) => {
    console.log('Scanned data: ', bounds, cornerPoints, data);
    fetchQr(data);
  };

  const switchCameraType = () => {
    setCameraType(cameraType === 'face' ? 'qr' : 'face');
    setFaceBorder(undefined);
    toastRef.current?.close();
    setLoading(false);
    clearTimer();
  };

  useEffect(() => {
    return () => {
      console.log('unmount');
      clearTimer();
      setCameraType('face');
    };
  }, []);

  if (!hasPermission) {
    return <View style={styles.scanView}><Text>No access to camera</Text></View>;
  }
  return (
    <View style={styles.scanView}>
      {cameraType === 'face' ? (
        <>
          <Camera
            style={{ flex: 1 }}
            type="front"
            ref={cameraRef}
            onFacesDetected={faceDetected}
            faceDetectorSettings={{
              mode: FaceDetector.FaceDetectorMode.fast,
              detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
              runClassifications: FaceDetector.FaceDetectorClassifications.none,
              minDetectionInterval: 500,
              tracking: false,
            }}
          />
          <ScanViewHeader currentMeeting={currentMeeting} showBar={false} />
          <FaceBorder data={faceBorder} />
        </>
      ) : (
        <>
          <Camera
            style={{ flex: 1 }}
            type="front"
            ref={cameraRef}
            autoFocus
            onBarCodeScanned={loading ? undefined : handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
          />
          <ScanViewHeader currentMeeting={currentMeeting} showBar />
        </>
      )}
      <View style={styles.switchButtonRow}>
        <Pressable style={styles.switchButton} onPress={switchCameraType}>
          <Text style={styles.switchButtonText}>{cameraType === 'face' ? '扫码签到' : '人脸识别'}</Text>
        </Pressable>
        {/* Todo temp */}
        <TempBackHome backHomeAndClear={backHomeAndClear} />
      </View>
      <Toast ref={toastRef} position="center" style={styles.toastView} />
    </View>
  );
}

const styles = StyleSheet.create({
  scanView: {
    flex: 1,
  },
  switchButtonRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 56,
    width: '100%',
    left: 0,
    bottom: 0,
    alignItems: 'center',
  },
  switchButton: {
    paddingVertical: 14,
    width: 144,
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  switchButtonText: {
    lineHeight: 24,
    fontSize: 18,
    fontWeight: 500,
    color: '#293f66',
  },
  toastView: {
    padding: 0,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: 'rgba(23,29,38,.5)',
  },
});
