import React, { Component } from 'react';
import { sessionStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/SessionStorage";
import LoadingScreen from './screens/LoadingScreen';
import IntroScreen from './screens/IntroScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const NAMESPACE = 'adobe-login';
const MVPD = 'adobe-mvpd'

class AdobeLoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: 'LOADING',
      userName: '',
      deviceId: ''
    };

    this.renderScreen = this.renderScreen.bind(this);
    this.goToScreen = this.goToScreen.bind(this);
  }

  componentDidMount() {
    sessionStorage.getItem('uuid').then(deviceId => {
      this.setState({
        deviceId
      })
    })
  }

  goToScreen(screen) {
    this.setState({
      screen
    })
  }

  renderScreen(screen) {
    const groupId = () => {
      if (this.props.screenData) {
        return this.props.screenData.groupId;
      }  
      if (this.props.payload) {
        return this.props.payload.groupId
      } 
      return '';
    }

    const segmentKey = this.props.screenData 
      ? this.props.screenData.general.segment_key 
      :  this.props.configuration.segment_key;

    switch (screen) {
      case 'LOADING': {
        return <LoadingScreen
          goToScreen={this.goToScreen}
          screenData={this.props.screenData}
          groupId={groupId()}
          segmentKey={segmentKey}
          deviceId={this.state.deviceId}
        />;
      }
      case 'INTRO': {
        return <IntroScreen
          goToScreen={this.goToScreen}
          screenData={this.props.screenData}
          groupId={groupId()}
          segmentKey={segmentKey}
        />;
      }
      case 'SIGNIN': {
        return <SignInScreen
          goToScreen={this.goToScreen}
          registrationUrl={this.props.screenData.general.registration_url}
          screenData={this.props.screenData}
          namespace={NAMESPACE}
          mvpd={MVPD}
          deviceId={this.state.deviceId}
          groupId={groupId()}
          segmentKey={segmentKey}
        />
      }
      case 'WELCOME': {
        return <WelcomeScreen
          goToScreen={this.goToScreen}
          screenData={this.props.screenData}
          namespace={NAMESPACE}
          mvpd={MVPD}
          groupId={groupId()}
          segmentKey={segmentKey}
        />;
      }
    }
  }

  render() {
    return (
      this.state.deviceId ? this.renderScreen(this.state.screen) : null
    );
  }
}

AdobeLoginComponent.displayName = 'AdobeLoginComponent';
export default AdobeLoginComponent;