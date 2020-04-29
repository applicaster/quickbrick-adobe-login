import React, { Component } from 'react';
import * as R from "ramda";
import { sessionStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/SessionStorage";
import { connectToStore } from "@applicaster/zapp-react-native-redux";
import { withNavigator } from "@applicaster/zapp-react-native-ui-components/Decorators/Navigator";
import LoadingScreen from './screens/LoadingScreen';
import IntroScreen from './screens/IntroScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const NAMESPACE = 'adobe-login';
const ADOBE_TOKEN = "adobe-token";

class AdobeLoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: 'LOADING',
      userName: '',
      deviceId: '',
    };

    this.renderScreen = this.renderScreen.bind(this);
    this.goToScreen = this.goToScreen.bind(this);
  }

  async componentWillMount() {
    const deviceId = await sessionStorage.getItem('uuid');

    this.setState({
      deviceId,
    })
  }

  goToScreen(screen) {
    this.setState({
      screen
    })
  }

  renderScreen(screen) {
    const {
      screenData,
      configuration,
      parentFocus,
      focused
    } = this.props

    const groupId = screenData.groupId || '';
    const segmentKey = configuration.segment_key;

    const screenConfig = {
      goToScreen: this.goToScreen,
      deviceId: this.state.deviceId,
      configuration,
      segmentKey,
      groupId,
    }

    switch (screen) {
      case 'LOADING': {
        return <LoadingScreen {...screenConfig} />;
      }
      case 'INTRO': {
        return <IntroScreen
          {...screenConfig}
          parentFocus={parentFocus}
          focused={focused}
        />;
      }
      case 'SIGNIN': {
        return <SignInScreen
          {...screenConfig}
          namespace={NAMESPACE}
          adobeToken={ADOBE_TOKEN}
          parentFocus={parentFocus}
          focused={focused}
        />
      }
      case 'WELCOME': {
        return <WelcomeScreen
          {...screenConfig}
          namespace={NAMESPACE}
          adobeToken={ADOBE_TOKEN}
          parentFocus={parentFocus}
          focused={focused}
        />;
      }
    }
  }

  render() {
    return this.renderScreen(this.state.screen)
  }
}

AdobeLoginComponent.displayName = 'AdobeLoginComponent';

export default R.compose(
  withNavigator,
  connectToStore(R.pick(["rivers"]))
)(AdobeLoginComponent);
