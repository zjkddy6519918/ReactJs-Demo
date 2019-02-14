import firebase from 'firebase';
import 'firebase/firestore';

/**
 * Configuration needed to access Firebase
 */
const config = {
  apiKey: "AIzaSyArN-zgwAVS7T2UB2ru_jnvJioin0PJcIg",
  authDomain: "swen-90016-red-team.firebaseapp.com",
  databaseURL: "https://swen-90016-red-team.firebaseio.com",
  projectId: "swen-90016-red-team",
  storageBucket: "swen-90016-red-team.appspot.com",
  messagingSenderId: "404333766418"
};

/**
 * Get Firebase database (and initialize if not initialized yet)
 */
const getDb = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  let db = firebase.firestore();
  db.settings({
    timestampsInSnapshots: true
  });

  return db;
};

export default getDb();
