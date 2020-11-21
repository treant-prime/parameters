import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAVDySds-81u-te8I2N-1JFXDBkq5VbX-Y",
  authDomain: "pzpn-lottery.firebaseapp.com",
  databaseURL: "https://pzpn-lottery.firebaseio.com",
  projectId: "pzpn-lottery",
  storageBucket: "pzpn-lottery.appspot.com",
  messagingSenderId: "4394152772"
};
var firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();

export default db;