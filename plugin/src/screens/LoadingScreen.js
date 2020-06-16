import * as React from "react";
import axios from "axios";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { getAdobeAuthorizationHeader, uuidv4 } from '../utils/index';
import { localStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/LocalStorage";

const { height } = Dimensions.get('window');

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceId: '',
      adobeToken: ''
    }

    this.checkDeviceStatus = this.checkDeviceStatus.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  async componentDidMount() {
    const adobeToken = await localStorage.getItem(
      this.props.adobeToken,
      this.props.namespace
    );
    
    this.setState({
      adobeToken: adobeToken !== 'undefined' ? adobeToken : null
    });
    
    if (this.props.deviceId) {
      this.checkDeviceStatus(this.props.deviceId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deviceId !== this.props.deviceId) {
      this.checkDeviceStatus(nextProps.deviceId)
    }
  }

  handleSignOut() {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = this.props.screenData.general;

    axios.delete(`https://${environment_url}/api/v1/logout?deviceId=${this.props.deviceId}`,
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
    ).then(response => {
      if (response.status === 204) {
        this.props.goToScreen('INTRO')
      }
    }).catch(err => console.log(err))
  }

  checkDeviceStatus(deviceId) {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = this.props.screenData.general;

    axios.get(`https://${environment_url}/api/v1/tokens/authn?deviceId=${deviceId || uuidv4()}&requestor=${requestor_id}`,
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
      .then(res => {
        if (res.status === 200) {
          if (this.state.adobeToken) {
            this.props.goToScreen('WELCOME')
          } else {
            this.handleSignOut();
          }
        }
      })
      .catch(err => {
        console.log(err);
        this.props.goToScreen('INTRO')
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#525A5C" />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    height,
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
};

LoadingScreen.displayName = 'LoadingScreen';
export default LoadingScreen;