import React, { useEffect, useRef } from 'react'
import { View, Text, Platform } from "react-native";
import { useInitialFocus } from "@applicaster/zapp-react-native-utils/focusManager";
import { trackEvent } from "../analytics/segment/index";
import Button from "../components/Button";
import Layout from "../components/Layout";

const IntroScreen = (props) => {
  const {
    focused,
    segmentKey,
    goToScreen,
    parentFocus,
    groupId,
    screenData
  } = props;

  const signInButton = useRef(null);

  useEffect(() => {
    trackEvent(segmentKey, "User Register Start");
  }, [])

  if (Platform.OS === 'android') {
    useInitialFocus(focused, signInButton);
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.subTitle}>
          {screenData.general.intro_message}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            label="Sign In"
            preferredFocus={true}
            groupId={groupId}
            id="sign-in-button"
            buttonRef={signInButton}
            onPress={() => goToScreen("SIGNIN")}
            nextFocusLeft={parentFocus ? parentFocus.nextFocusLeft : null}
          />
        </View>
      </View>
    </Layout>
  );
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
export default IntroScreen
