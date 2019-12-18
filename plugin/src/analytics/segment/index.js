import axios from "axios";
import { Platform } from "react-native";
import { getAppData } from "@applicaster/zapp-react-native-bridge/QuickBrick";
import { uuidv4 } from "../../utils";

const TRACK_URL = "https://api.segment.io/v1/track"
const IDENTIFY_URL = "https://api.segment.io/v1/identify"

export function trackEvent(segmentKey, screen, payload = {}, previousPage = "") {
  
  if (payload.accessToken) {
    userId = {
      "userId": payload.accessToken,
    }
  } else {
    userId = {
      "anonymousId": uuidv4(),
    }
  }

  axios.post(TRACK_URL,
    {
      ...userId,
      "event": `Adobe ${screen}`,
      "properties": {
        "device_type": Platform.OS,
        "previou_page": previousPage,
        "device_id": getAppData().uuid || uuidv4(),
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