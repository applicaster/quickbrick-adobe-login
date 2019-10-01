import * as React from "react";
import axios from "axios";
import { View, Text } from "react-native";
import { getAppData } from "@applicaster/zapp-react-native-bridge/QuickBrick";
import { FocusableGroup } from "@applicaster/zapp-react-native-ui-components/Components/FocusableGroup";
import { localStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/LocalStorage";
import { getAdobeAuthorizationHeader } from '../utils/index';
import Button from "../components/Button";
import Layout from "../components/Layout";

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mvpd: ''
    }

    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    const {
      environment_url,
      requestor_id,
      public_key,
      secret
    } = this.props.screenData.general

    axios.get(`https://${environment_url}/api/v1/tokens/authn?deviceId=${getAppData().uuid}&requestor=${requestor_id}`,
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
      .then(async res => {
        if (res.status === 200) {
          this.setState({
            mvpd: res.data.mvpd
          })
        } else {
          this.props.goToScreen('SIGNIN')
        }
      })
      .catch(err => console.log(err))
  }

  handleSignOut() {
    axios.post('https://dwettnsyyj.execute-api.eu-west-1.amazonaws.com/Prod/registration/api/Device/Logout',
      {
        "access_token": this.props.accessToken
      },
      {
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        }
      }
    ).then(async response => {
      if (response.data.succeeded) {
        localStorage.setItem(
          this.props.token,
          'NOT_SET',
          this.props.namespace
        )

        this.props.goToScreen('INTRO') 
      }
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <Layout>
        <View style={styles.container}>
          <Text style={styles.text}>You've signed in with your TV Provider: </Text>
          <Text style={{...styles.text, textAlign: 'center', fontWeight: 'bold'}}>{this.state.mvpd}</Text>
          <FocusableGroup id={'sign-in-button'} style={styles.buttonContainer}>
            <Button
              label="Sign Out"
              groupId={'sign-out-button'}
              onPress={() => this.handleSignOut()}
            />
          </FocusableGroup>
        </View>
      </Layout>
    );
  }
}

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
    color: '#1779AE'
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