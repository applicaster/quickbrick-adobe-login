import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { View, Text, Platform } from "react-native";
import { useInitialFocus } from "@applicaster/zapp-react-native-utils/focusManager";
import { localStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/LocalStorage";
import { getAdobeAuthorizationHeader } from '../utils/index';
import { trackEvent } from "../analytics/segment/index";
import Button from "../components/Button";
import Layout from "../components/Layout";

let forceFocus = true;

const WelcomeScreen = props => {
  const {
    segmentKey,
    groupId,
    parentFocus,
    screenData,
    deviceId,
    goToScreen,
    focused,
    adobeToken,
    namespace
  } = props;

  let logoutButton = useRef(null);
  const [mvpd, setMvpd] = useState('');

  useEffect(() => {
    if (deviceId) {
      checkDeviceStatus(deviceId);
    }
  }, [])

  useEffect(() => {
    trackEvent(segmentKey, "Welcome", { accessToken: mvpd });
  }, [mvpd]);

  useEffect(() => {
    checkDeviceStatus(deviceId)
  }, [deviceId]);

  const checkDeviceStatus = () => {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = screenData.general

    axios.get(`https://${environment_url}/api/v1/tokens/authn?deviceId=${deviceId}&requestor=${requestor_id}`,
      {
        headers: {
          "Authorization": getAdobeAuthorizationHeader(
            'GET',
            requestor_id,
            '/authn',
            public_key,
            secret
          )
        }
      })
      .then(async res => {
        if (res.status === 200) {
          setMvpd(res.data.mvpd)
        } else {
          goToScreen('SIGNIN')
        }
      })
      .catch(err => console.log(err))
  }

  const handleSignOut = () => {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = screenData.general;

    axios.delete(`https://${environment_url}/api/v1/logout?deviceId=${deviceId}`,
      {
        headers: {
          "Authorization": getAdobeAuthorizationHeader(
            'GET',
            requestor_id,
            '/logout',
            public_key,
            secret
          )
        }
      }
    ).then(async response => {
      if (response.status === 204) {
        trackEvent(segmentKey, "Signed Out", { accessToken: mvpd }, "Welcome");
        await localStorage.setItem(
          adobeToken,
          'undefined',
          namespace
        );
        goToScreen('LOADING')
      }
    }).catch(err => console.log(err))
  }

  if (Platform.OS === 'android') {
    useInitialFocus(forceFocus || focused, logoutButton);
    forceFocus = false;
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.text}>You've signed in with your TV Provider </Text>
        <Button
          label={'Sign Out'}
          preferredFocus={true}
          groupId={groupId || 'logout-group'}
          id="welcome-group"
          buttonRef={logoutButton}
          onPress={() => handleSignOut()}
          nextFocusUp={parentFocus ? parentFocus.nextFocusUp : null}
          nextFocusLeft={parentFocus ? parentFocus.nextFocusLeft : null}
        />
      </View>
    </Layout>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: 100
  },
  text: {
    color: "#525A5C",
    fontSize: 32,
    marginBottom: 20,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 36,
    marginBottom: 60,
    color: "#525A5C",
  },
  url: {
    fontWeight: 'bold',
    fontSize: 36,
    marginBottom: 60,
    color: '#525A5C'
  },
  subTitle: {
    color: "#525A5C",
    fontSize: 32,
  },
  buttonContainer: {
    marginTop: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
};

WelcomeScreen.displayName = 'WelcomeScreen';
export default WelcomeScreen;