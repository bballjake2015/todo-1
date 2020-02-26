import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyD5EreuAqZF3K8PG7hDEFjNUluHZuwYFGU",
  authDomain: "healthapp-introtocoding.firebaseapp.com",
  databaseURL: "https://healthapp-introtocoding.firebaseio.com",
  projectId: "healthapp-introtocoding",
  storageBucket: "healthapp-introtocoding.appspot.com",
  messagingSenderId: "346300730326",
  appId: "1:346300730326:web:f00deafa9b7bbb63147277"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
