import * as React from "react";
import axios from "axios";
import { View, Text, ActivityIndicator } from "react-native";
import { localStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/LocalStorage";
import { sessionStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/SessionStorage";
import { trackEvent, identifyUser } from "../analytics/segment/index";
import { getAdobeAuthorizationHeader, uuidv4 } from '../utils/index';
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

    this.getRegistrationCode = this.getRegistrationCode.bind(this);
    this.getAuthn = this.getAuthn.bind(this);
  }

  componentDidMount() {
    trackEvent(this.props.segmentKey, "Waiting Page")
    this.getRegistrationCode()
  }

  getAuthn() {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = this.props.screenData.general;

    if (this.props.deviceId) {
      axios.get(`https://${environment_url}/api/v1/tokens/authn?deviceId=${this.props.deviceId}&requestor=${requestor_id}`,
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
          trackEvent(this.props.segmentKey, "Login Success")

          identifyUser(this.props.segmentKey, '', res.data.userId, this.state.devicePinCode, 'Sign In Page')

          localStorage.setItem(
            this.props.mvpd,
            res.data.mvpd,
            this.props.namespace
          )

          localStorage.setItem(
            'adobe-user-id',
            res.data.userId,
            this.props.namespace
          )
          this.props.goToScreen('WELCOME')
        })
        .catch(err => {
          trackEvent(this.props.segmentKey, "Login Error")
          console.log(err)
        })
    }
  }

  getRegistrationCode() {
    const {
      environment_url,
      public_key,
      requestor_id,
      secret
    } = this.props.screenData.general;

    const params = new URLSearchParams();

    sessionStorage.getItem('uuid').then(deviceId => {
      params.append('deviceId', deviceId || uuidv4());
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
        this.setState({
          devicePinCode: res.data.code,
          loading: false
        }, () => this.heartbeat = setInterval(() => {
          this.getAuthn()
        }, HEARBEAT_INTERVAL));
      })
        .catch(err => console.log(err))
    })
  }

  componentWillUnmount() {
    clearInterval(this.heartbeat)
  }

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
    color: '#525A5C'
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