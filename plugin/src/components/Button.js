import * as React from "react";
import { View, Text } from "react-native";
import { Focusable } from "@applicaster/zapp-react-native-ui-components/Components/Focusable";

export default function Button({ label, groupId, onPress, preferredFocus}) {
  return (
    <Focusable id={`oc-login-${label}`} groupId={groupId} onPress={onPress} preferredFocus={preferredFocus}>
      {focused => {
        const buttonStyles = styles[focused ? "focused" : "default"];
        return (
          <View style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{label}</Text>
          </View>
        );
      }}
    </Focusable>
  );
}

const button = {
  width: 600,
  height: 80,
  backgroundColor: "#D8D8D8",
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
};

const buttonText = {
  color: "#5D5D5D",
  fontSize: 24,
  fontWeight: 'bold'
};

const styles = {
  focused: {
    button: {
      ...button,
      backgroundColor: "#0081C8",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      width: 650,
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
    },
    buttonText: {
      ...buttonText,
      color: "#ffffff"
    }
  },
  default: {
    button,
    buttonText
  }
};