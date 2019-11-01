import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import LoadingScreen from './screens/LoadingScreen';
import IntroScreen from './screens/IntroScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const { height } = Dimensions.get('window');

const NAMESPACE = 'adobe-login';
const MVPD = 'adobe-mvpd'

class AdobeLoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: 'LOADING',
      userName: ''
    };

    this.renderScreen = this.renderScreen.bind(this);
    this.goToScreen = this.goToScreen.bind(this);
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

    const segmentKey = this.props.screenData ? this.props.screenData.segment_key : "7g6t2YcCLJJB5UUuIKhtWxd6Sg8x652M"

    switch (screen) {
      case 'LOADING': {
        return <LoadingScreen
          goToScreen={this.goToScreen}
          screenData={this.props.screenData}
          groupId={groupId()}
          segmentKey={segmentKey}
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
      this.renderScreen(this.state.screen)
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