import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, Platform } from "react-native";
import axios from "axios";
import { localStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/LocalStorage";
import { useInitialFocus } from "@applicaster/zapp-react-native-utils/focusManager";
import { trackEvent, identifyUser } from "../analytics/segment/index";
import { getAdobeAuthorizationHeader, uuidv4 } from '../utils/index';
import Layout from "../components/Layout"
import QRCode from "../components/QRCode"
import Button from "../components/Button";

const HEARBEAT_INTERVAL = 5000;

const SignInScreen = props => {
  const {
    segmentKey,
    configuration,
    deviceId,
    isPrehook,
    adobeToken,
    namespace,
    goToScreen,
    groupId,
    parentFocus,
  } = props;

  let heartbeat;
  let refreshButton = useRef(null);

  const [devicePinCode, setDevicePinCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent(segmentKey, "Waiting Page")
    getRegistrationCode()
  }, [])


  useEffect(() => {
    heartbeat = setInterval(() => {
      getAuthn()
    }, HEARBEAT_INTERVAL);
  }, [devicePinCode])

  if (Platform.OS === 'android') {
    useInitialFocus(true, refreshButton);
  }

  const getRegistrationCode = () => {
    const {
      environment_url,
      public_key,
      requestor_id,
      secret
    } = configuration;

    const params = new URLSearchParams();
    params.append('deviceId', (deviceId || uuidv4()));

    axios.post(`https://${environment_url}/reggie/v1/olychannel/regcode`, params,
      {
        headers: {
          "Authorization": getAdobeAuthorizationHeader(
            'POST',
            requestor_id,
            '/regcode',
            public_key,
            secret
          )
        }
      }
    ).then(res => {
      setDevicePinCode(res.data.code);
      setLoading(false);
    })
      .catch(err => console.log(err))
  }

  const getAuthn = () => {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = configuration;

    axios.get(`https://${environment_url}/api/v1/tokens/authn?deviceId=${(deviceId || uuidv4())}&requestor=${requestor_id}`,
      {
        headers: {
          "Authorization": getAdobeAuthorizationHeader(
            'POST',
            requestor_id,
            '/authn',
            public_key,
            secret
          )
        }
      })
      .then(res => {
        trackEvent(segmentKey, "Login Success")

        identifyUser(segmentKey, '', res.data.userId, devicePinCode, 'Sign In Page')

        localStorage.setItem(
          adobeToken,
          JSON.stringify(res.data),
          namespace
        )

        goToScreen('WELCOME')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const refreshPinCode = () => {
    clearInterval(heartbeat);
    getRegistrationCode()
  }

  return (
    <Layout isPrehook={isPrehook}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {configuration.sign_message}
        </Text>
        <View style={styles.columnsContainer}>
          <View style={styles.leftColumn}>
            <Text style={styles.text} adjustsFontSizeToFit>
              Go to:
            </Text>
            <Text style={{ ...styles.text, ...styles.url }} adjustsFontSizeToFit>
              {configuration.registration_url}
            </Text>
            <Text style={{ ...styles.text, marginBottom: 30 }} adjustsFontSizeToFit>
              Enter the activation code below
          </Text>
            {
              loading
                ? <View style={styles.pinCodeSpinner}>
                  <ActivityIndicator size="small" color="#525A5C" />
                </View>
                : <Text style={styles.pinCode} adjustsFontSizeToFit>{devicePinCode}</Text>
            }
            <Button
              label="Refresh Code"
              preferredFocus={true}
              groupId={groupId}
              id="refresh-pin-code"
              buttonRef={refreshButton}
              onPress={refreshPinCode}
              nextFocusLeft={parentFocus ? parentFocus.nextFocusLeft : null}
              style={styles.focusBtnContainer}
            />
          </View>
          <View style={styles.rightColumn}>
            {
              loading
                ? <View style={styles.loadContainer}>
                  <ActivityIndicator size="large" color="#525A5C" />
                </View>
                : <QRCode url={configuration.registration_url} />
            }
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    color: "#525A5C",
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 60
  },
  text: {
    color: "#525A5C",
    fontSize: 32,
    marginBottom: 20,
  },
  url: {
    fontWeight: 'bold',
    fontSize: 36,
    marginBottom: 60,
    color: '#525A5C'
  },
  columnsContainer: {
    width: 1110,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 30
  },
  leftColumn: {
    width: 700,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightColor: '#979797',
    borderRightWidth: 2,
    minHeight: 450
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    minHeight: 330
  },
  loadContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pinCode: {
    fontSize: 72,
    color: "#525A5C",
    fontWeight: 'bold'
  },
  pinCodeSpinner: {
    width: 500,
    alignItems: 'center',
    justifyContent: 'center'
  },
  focusBtnContainer: {
    marginTop: 60
  }
};

SignInScreen.displayName = 'SignInScreen';
export default SignInScreen;