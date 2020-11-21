import firebase from "firebase";

var config = {
  apiKey: "AIzaSyDxA8J5Xl3Ct4M8M6ObC7OgEJAfYTkEbhw",
  authDomain: "parameters-d975a.firebaseapp.com",
  databaseURL: "https://parameters-d975a.firebaseio.com",
  projectId: "parameters-d975a",
  storageBucket: "parameters-d975a.appspot.com",
  messagingSenderId: "385179745039",
  appId: "1:385179745039:web:0c426c97a9f0dc045b1c7a"
};
var firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();

export default db;

// https://parameters-296314.firebaseio.com/
