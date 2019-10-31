import axios from "axios";
import { Platform } from "react-native";
import { getAppData } from "@applicaster/zapp-react-native-bridge/QuickBrick";

const TRACK_URL = "https://api.segment.io/v1/track"
const IDENTIFY_URL = "https://api.segment.io/v1/identify"

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function trackEvent(segmentKey, screen, payload = {}, previousPage = "") {
  axios.post(TRACK_URL,
    {
      "anonymousId": uuidv4(),
      "event": `Adobe - ${screen}`,
      "properties": {
        "deviceType": Platform.OS,
        "previousPage": previousPage,
        "deviceId": getAppData().uuid,
        payload
      },
      "timestamp": Date.now()
    },
    {
      auth: {
        username: segmentKey,
      },
      headers: {
        "Content-Type": "application/json",
      }
    }
  ).then(response => {
    console.log(response)
  }).catch(err => console.log(err))
}

export function identifyUser(userName, accessToken, devicePinCode) {
  axios.post(IDENTIFY_URL,
    {
      "userId": accessToken,
      "properties": {
        "deviceType": Platform.OS,
        "previousPage": previousPage,
      },
      "traits": {
        "name": userName,
        "access_token": accessToken,
        "device_pin_code": devicePinCode
      },
      "timestamp": Date.now()
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${segmentKey}:`)}`
      }
    }
  ).then(response => {
    console.log(response)
  }).catch(err => console.log(err))
}