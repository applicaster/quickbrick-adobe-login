import * as React from "react";
import axios from "axios";
import CryptoJS from 'crypto-js';
import { View, Text, ActivityIndicator } from "react-native";
import { getAppData } from "@applicaster/zapp-react-native-bridge/QuickBrick";
import { uuidv4 } from '../utils/index';
import Layout from "../components/Layout"
import QRCode from "../components/QRCode"

const HEARBEAT_INTERVAL = 5000;

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devicePinCode: '',
      loading: true
    };

    //    this.getSignInStatus = this.getSignInStatus.bind(this);
    this.getAdobeAuthorizationHeader = this.getAdobeAuthorizationHeader.bind(this);
    this.getRegistrationCode = this.getRegistrationCode.bind(this);
  }

  componentDidMount() {
    this.getRegistrationCode()
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
    const {
      environment_url,
      public_key,
      requestor_id,
      secret
    } = this.props.screenData.general;

    const params = new URLSearchParams();
    params.append('deviceId', getAppData().uuid);

    axios.post(`https://${environment_url}/reggie/v1/olychannel/regcode`, params,
      {
        headers: {
          "Authorization": this.getAdobeAuthorizationHeader(
            'POST',
            requestor_id,
            '/regcode',
            public_key,
            secret
          )
        }
      }
    ).then(res => {
      this.setState({
        devicePinCode: res.data.code,
        loading: false
      }, () => this.heartbeat = setInterval(() => {
        console.log('HEARBEAT')
      }, HEARBEAT_INTERVAL));
    })
      .catch(err => console.log(err))
  }

  componentWillUnmount() {
    clearInterval(this.heartbeat)
  }

  /*   getSignInStatus() {
      axios.get(`https://dwettnsyyj.execute-api.eu-west-1.amazonaws.com/Prod/registration/api/Device/GetDeviceByPin/${this.state.devicePinCode}`,
        {
          headers: {
            "accept": "application/json"
          }
        }
      ).then(async response => {
        if (response.data.access_token) {
          await localStorage.setItem(
            this.props.token,
            response.data.access_token,
            this.props.namespace
          )
  
          await localStorage.setItem(
            this.props.userName,
            response.data.firstname,
            this.props.namespace
          )
  
          if (this.props.isPrehook) {
            this.props.closeHook({ success: true })
          } else {
            this.props.goToScreen('WELCOME')
          }
  
        }
      }).catch(err => console.log(err))
    } */

  render() {
    return (
      <Layout isPrehook={this.props.isPrehook}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Enjoy the Olympic Channel content by activating your device with your pay TV account
          </Text>
          <View style={styles.columnsContainer}>
            <View style={styles.leftColumn}>
              <Text style={styles.text} adjustsFontSizeToFit>
                Go to:
              </Text>
              <Text style={{ ...styles.text, ...styles.url }} adjustsFontSizeToFit>
                activate.olympicchannel.com
              </Text>
              <Text style={{ ...styles.text, marginBottom: 30 }} adjustsFontSizeToFit>
                Enter the activation code below
              </Text>
              {
                this.state.loading
                  ? <View style={styles.pinCodeSpinner}>
                    <ActivityIndicator size="small" color="#525A5C" />
                  </View>
                  : <Text style={styles.pinCode} adjustsFontSizeToFit>{this.state.devicePinCode}</Text>
              }
            </View>
            <View style={styles.rightColumn}>
              {
                this.state.loading
                  ? <View style={styles.loadContainer}>
                    <ActivityIndicator size="large" color="#525A5C" />
                  </View>
                  : <QRCode url={this.props.registrationUrl} />
              }
            </View>
          </View>
        </View>
      </Layout>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    color: "#525A5C",
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 110
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
    color: '#1779AE'
  },
  columnsContainer: {
    width: 1110,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 30
  },
  bottomText: {
    width: 1110,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 150
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightColor: '#979797',
    borderRightWidth: 2,
    minHeight: 330
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderLeftColor: '#979797',
    borderLeftWidth: 2,
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
  }
};

SignInScreen.displayName = 'SignInScreen';
export default SignInScreen;