import React, { Component } from 'react';
import * as R from "ramda";
import { sessionStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/SessionStorage";
import { localStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/LocalStorage";
import { connectToStore } from "@applicaster/zapp-react-native-redux";
import { withNavigator } from "@applicaster/zapp-react-native-ui-components/Decorators/Navigator";
import LoadingScreen from './screens/LoadingScreen';
import IntroScreen from './screens/IntroScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { uuidv4 } from './utils';

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
    this.getDeviceId = this.getDeviceId.bind(this);
  }

  async componentWillMount() {
    let deviceId = await this.getDeviceId()
    this.setState({
      deviceId,
    })
  }

  async getDeviceId() {
    let deviceId = await localStorage.getItem('uuid', NAMESPACE);

    if (!deviceId || typeof deviceId === 'object') {
      deviceId = await sessionStorage.getItem(
        'advertisingIdentifier', 'applicaster.v2'
      );
    }

    //Fallback if advertisingIdentifier is not available
    if (!deviceId) {
      deviceId = uuidv4()
    }

    localStorage.setItem('uuid', deviceId, NAMESPACE);
    return deviceId;
  }

  goToScreen(screen) {
    this.setState({
      screen
    })
  }

  renderScreen(screen) {
    const {
      screenData,
      payload,
      configuration,
      parentFocus,
      focused
    } = this.props

    const groupId = () => {
      if (screenData) {
        return screenData.groupId;
      }
      if (payload) {
        return payload.groupId
      }
      return '';
    }

    const segmentKey = configuration.segment_key;

    switch (screen) {
      case 'LOADING': {
        return <LoadingScreen
          goToScreen={this.goToScreen}
          screenData={screenData}
          groupId={groupId()}
          segmentKey={segmentKey}
          deviceId={this.state.deviceId}
          adobeToken={ADOBE_TOKEN}
          namespace={NAMESPACE}
        />;
      }
      case 'INTRO': {
        return <IntroScreen
          goToScreen={this.goToScreen}
          screenData={screenData}
          groupId={groupId()}
          segmentKey={segmentKey}
          parentFocus={parentFocus}
          focused={focused}
        />;
      }
      case 'SIGNIN': {
        return <SignInScreen
          goToScreen={this.goToScreen}
          registrationUrl={screenData.general.registration_url}
          screenData={screenData}
          namespace={NAMESPACE}
          adobeToken={ADOBE_TOKEN}
          deviceId={this.state.deviceId}
          groupId={groupId()}
          segmentKey={segmentKey}
          parentFocus={parentFocus}
          focused={focused}
        />
      }
      case 'WELCOME': {
        return <WelcomeScreen
          goToScreen={this.goToScreen}
          screenData={screenData}
          namespace={NAMESPACE}
          adobeToken={ADOBE_TOKEN}
          deviceId={this.state.deviceId}
          groupId={groupId()}
          segmentKey={segmentKey}
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
