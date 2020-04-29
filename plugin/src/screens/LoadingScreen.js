import * as React from "react";
import axios from "axios";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { getAdobeAuthorizationHeader, uuidv4 } from '../utils/index';

const { height } = Dimensions.get('window');

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceId: ''
    }

    this.checkDeviceStatus = this.checkDeviceStatus.bind(this);
  }

  componentDidMount() {
    if (this.props.deviceId) {
      this.checkDeviceStatus(this.props.deviceId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deviceId !== this.props.deviceId) {
      this.checkDeviceStatus(nextProps.deviceId)
    }
  }

  checkDeviceStatus(deviceId) {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = this.props.configuration;

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
          this.props.goToScreen('WELCOME')
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