import React, { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ScanView({ backToHome }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [faces, setFaces] = useState([]);
  const [pic, setPic] = useState();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef();

  // // 主动拍照，将照片发送给后台进行 AI 识别
  // const takePic = async () => {
  //   if (cameraRef.current) {
  //     console.log(cameraRef.current.takePictureAsync);
  //     let photo = await cameraRef.current.takePictureAsync();
  //     console.log(photo.uri);
  //     setPic(photo.uri);
  //     console.log('pic', pic);
  //     // this.setState({
  //     //   isShowCamera: false,
  //     //   uri: photo.uri
  //     // })
  //   }
  // };
  //
  // // 检测到人脸的事件：更新脸部识别框的位置，主动拍照
  // const faceDetected = ({ faces }) => {
  //   setFaces(faces); // instead of setFaces({faces})
  //   console.log(faces[0]);
  //   if (!pic) {
  //     takePic();
  //   }
  // };
  //
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);
  //
  // // const [hasPermission1, setHasPermission1] = useState(null);
  // // useEffect(() => {
  // //   const getBarCodeScannerPermissions = async () => {
  // //     const { status } = await BarCodeScanner.requestPermissionsAsync();
  // //     setHasPermission1(status === 'granted');
  // //   };
  // //   getBarCodeScannerPermissions();
  // // }, []);
  //
  // const handleBarCodeScanned = ({ type, data }) => {
  //   setScanned(true);
  //   console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
  // };
  //
  // const clearPic = () => {
  //   setPic(undefined);
  // };
  //
  // if (!hasPermission) {
  //   return <Text>No access to camera</Text>;
  // }
  return (
    <View style={styles.scanView}>
      {/*<Camera*/}
      {/*  style={{ flex: 1 }}*/}
      {/*  type="front"*/}
      {/*  ref={cameraRef}*/}
      {/*  onFacesDetected={faceDetected}*/}
      {/*  FaceDetectorSettings={{*/}
      {/*    mode: FaceDetector.FaceDetectorMode.fast,*/}
      {/*    detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,*/}
      {/*    runClassifications: FaceDetector.FaceDetectorClassifications.none,*/}
      {/*    minDetectionInterval: 5000,*/}
      {/*    tracking: false,*/}
      {/*  }}*/}
      {/*  barCodeScannerSettings={{*/}
      {/*    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],*/}
      {/*    onBarCodeScanned: scanned ? undefined : handleBarCodeScanned,*/}
      {/*    style: StyleSheet.absoluteFillObject,*/}
      {/*  }}*/}
      {/*/>*/}
      <Pressable style={styles.signInButton} onPress={backToHome}>
        <Text style={styles.signInButtonText}>返回首页</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scanView: {
    flex: 1,
  },
  signInButton: {
    paddingVertical: 17,
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
