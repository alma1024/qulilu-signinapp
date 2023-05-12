import { StyleSheet, View } from 'react-native';
import LeftDetailView from './components/LeftDetailView';
import ScanView from './components/ScanView';

export default function Signup({ navigation, route }) {
  const { currentMeeting, nextMeeting } = route.params;
  const backToHome = () => {
    navigation.navigate('Home');
    // navigation.goBack();
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.container}>
        <LeftDetailView currentMeeting={currentMeeting} nextMeeting={nextMeeting} />
        <ScanView currentMeeting={currentMeeting} backToHome={backToHome} />
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
