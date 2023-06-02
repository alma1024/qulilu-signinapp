# 锦江瞿溪路办公大楼会议签到APP

Use [`expo-router`](https://expo.github.io/router) to build native navigation using files in the `app/` directory.

## 安装依赖

```sh
npm install
```


## 🚀 运行

```sh
npx expo start
```

## ! 如果网络条件不佳，可以使用离线模式运行

```sh
npx expo start --offline
```

## 线上打包

详见:

https://docs.expo.dev/build/setup/

https://docs.expo.dev/build-reference/apk/

```sh
eas build -p android --profile preview
```

打包 debug 版本
```sh
eas build -p android --profile preview1
```

## expo 生成 android 配置

```sh
npx expo run:android
```

## 本地打包

```sh
cd android
./gradlew assembleRelease
```

## 将本地打包产物安装到通过USB连接的设备上

```sh
cd android/app/build/outputs/apk/release
adb install app-release.apk

cd android/app/build/outputs/apk/debug
adb install app-debug.apk
```

## 📝 Notes

- [Expo Router: Docs](https://expo.github.io/router)
- [Expo Router: Repo](https://github.com/expo/router)
- [Request for Comments](https://github.com/expo/router/discussions/1)
