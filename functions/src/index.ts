/**
 * Firebase Functions Entry
 * Created by Kien AI (leejungkiin@gmail.com)
 */

import * as functions from "firebase-functions";
import { onChat } from "./ai/chat";
import { onVision } from "./ai/vision";
import { onSpeech } from "./ai/speech";

export const ai = {
  chat: functions.https.onRequest(onChat),
  vision: functions.https.onRequest(onVision),
  speech: functions.https.onRequest(onSpeech),
};


