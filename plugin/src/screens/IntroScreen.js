import * as React from "react";
import { View, Text } from "react-native";
import { FocusableGroup } from "@applicaster/zapp-react-native-ui-components/Components/FocusableGroup";
import Button from "../components/Button";
import Layout from "../components/Layout";

class IntroScreen extends React.Component {
  render() {
    return (
      <Layout>
        <View style={styles.container}>
          <Text style={styles.subTitle}>
            Sign in with your TV Provider
          </Text>
          <Text style={styles.subTitle}>
            to watch live Olympic Channel events
          </Text>
          <Text style={styles.subTitle}>(US Only)</Text>
          <View style={styles.buttonContainer}>
            <FocusableGroup id={'sign-in-button'} style={styles.focusBtnContainer}>
              <Button label="Sign In" groupId={'sign-in-button'} onPress={() => this.props.goToScreen("SIGNIN")} />
            </FocusableGroup>
          </View>
        </View>
      </Layout>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100
  },
  subTitle: {
    color: "#525A5C",
    fontSize: 32,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  focusBtnContainer: {
    justifyContent: 'center', 
    alignItems: 'center'
  }
};

IntroScreen.displayName = 'IntroScreen';
export default IntroScreen;