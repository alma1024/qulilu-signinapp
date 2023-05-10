import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Signup({ navigation, route }) {
  // console.log(route, route?.params?.name)
  const onPress = () => {
    navigation.navigate('Home')
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Sign up {route?.params?.name ?? '=='}</Text>
      <Pressable style={styles.signInButton} onPress={onPress}>
        <Text style={styles.signInButtonText}>返回首页</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  }
});
