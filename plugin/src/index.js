import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import LoadingScreen from './screens/LoadingScreen';
import IntroScreen from './screens/IntroScreen';
import SignInScreen from './screens/SignInScreen';

const { height } = Dimensions.get('window');

class AdobeLoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: 'INTRO',
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
    switch (screen) {
      case 'LOADING': {
        return <LoadingScreen
          goToScreen={this.goToScreen}
        />;
      }
      case 'INTRO': {
        return <IntroScreen
          goToScreen={this.goToScreen}
        />;
      }
      case 'SIGNIN': {
        return <SignInScreen
          goToScreen={this.goToScreen}
          registrationUrl={this.props.screenData.general.registration_url}
          screenData={this.props.screenData}
        />
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