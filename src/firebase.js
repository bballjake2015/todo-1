import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyAHOdwo289bsaLMZrMbIUK_nuvVelAOm5M",
  authDomain: "todo-c9dc0.firebaseapp.com",
  databaseURL: "https://todo-c9dc0.firebaseio.com",
  projectId: "todo-c9dc0",
  storageBucket: "todo-c9dc0.appspot.com",
  messagingSenderId: "82557749251",
  appId: "1:82557749251:web:adbf0643a6df7dcb"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
