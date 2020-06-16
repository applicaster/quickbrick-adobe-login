import axios from "axios";
import { Platform } from "react-native";
import { localStorage } from "@applicaster/zapp-react-native-bridge/ZappStorage/LocalStorage";

const TRACK_URL = "https://api.segment.io/v1/track"
const IDENTIFY_URL = "https://api.segment.io/v1/identify"
const NAMESPACE = 'adobe-login';

export async function trackEvent(segmentKey, screen, payload = {}, previousPage = "") {
  let userId = {};
  let deviceId = await localStorage.getItem('uuid', NAMESPACE);

  if (payload.accessToken) {
    userId = {
      "userId": payload.accessToken,
    }
  } else {
    userId = {
      "anonymousId": deviceId,
    }
  }

  axios.post(TRACK_URL,
    {
      ...userId,
      "event": `${screen}`,
      "properties": {
        'provider': 'Adobe',
        "name": `${screen}`,
        "device_type": Platform.OS,
        "previous_page": previousPage,
        "device_id": deviceId,
        payload
      },
      "timestamp": Date.now()
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${segmentKey}`
      }
    }
  ).then(response => {
    console.log(response)
  }).catch(err => console.log(err))
}

export function identifyUser(segmentKey, userName, accessToken, devicePinCode, previousPage) {
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
        "Authorization": `Basic ${segmentKey}`
      }
    }
  ).then(response => {
    console.log(response)
  }).catch(err => console.log(err))
}