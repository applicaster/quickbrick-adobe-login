import * as React from "react";
import axios from "axios";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { getAdobeAuthorizationHeader } from '../utils/index';
import { sessionStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/SessionStorage";

const { height } = Dimensions.get('window');

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceId: ''
    }
  }

  componentDidMount() {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = this.props.screenData.general

    sessionStorage.getItem('uuid').then(deviceId => {
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
      .then(res => {
        if (res.status === 200) {
          this.props.goToScreen('WELCOME')
        }
      })
      .catch(err => { 
        console.log(err);
        this.props.goToScreen('INTRO')
      })
    })


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