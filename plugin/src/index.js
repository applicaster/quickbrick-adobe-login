import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import CryptoJS from 'crypto-js';
import axios from 'axios'
import { getAppData } from "@applicaster/zapp-react-native-bridge/QuickBrick";
import { uuidv4 } from './utils/index';

const { height } = Dimensions.get('window');

const STAGING_URL = "api.auth-staging.adobe.com"

class AdobeLoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.getAdobeAuthorizationHeader = this.getAdobeAuthorizationHeader.bind(this);
    this.getRegistrationCode = this.getRegistrationCode.bind(this);
  }

  getAdobeAuthorizationHeader(verb, requestorId, requestUri, publicKey, secretKey) {
    const authorizationParams = 
      `${verb} requestor_id=${requestorId}, nonce=${uuidv4()}, signature_method=HMAC-SHA1, request_time=${Date.now()}, request_uri=${requestUri}`;

    const secretKeyEncoded = CryptoJS.enc.Utf8.parse(secretKey);
    const contentEncoded = CryptoJS.enc.Utf8.parse(authorizationParams);

    const signatureBytes = CryptoJS.HmacSHA1(contentEncoded, secretKeyEncoded);
    const signatureBase64String = CryptoJS.enc.Base64.stringify(signatureBytes);

    return `${authorizationParams}, public_key=${publicKey}, signature=${signatureBase64String}`
  }

  getRegistrationCode() {
    const params = new URLSearchParams();
    params.append('deviceId', getAppData().uuid);

    axios.post(`https://${STAGING_URL}/reggie/v1/olychannel/regcode`, params,
      {
        headers: {
          "Authorization": this.getAdobeAuthorizationHeader(
            'POST', 
            'olychannel', 
            '/regcode', 
            'miwI0BXa2QWhCGG8vevnw9OK3x1bgv3h', 
            'WuVIyVeNagAXnzWO'
          )
        }
      }
    ).then(() => {
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>ADOBE</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    height,
    alignItems: 'center',
  },
  text: {
    color: "#525A5C",
    fontSize: 32,
    marginBottom: 20,
  },
};

AdobeLoginComponent.displayName = 'AdobeLoginComponent';
export default AdobeLoginComponent;