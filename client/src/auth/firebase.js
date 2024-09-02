import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7TKaOr7d5-kkeFmULPVsaQVlqjEHhQxc",
  authDomain: "finance-trac.firebaseapp.com",
  projectId: "finance-trac",
  storageBucket: "finance-trac.appspot.com",
  messagingSenderId: "712205732404",
  appId: "1:712205732404:web:7c33913fb49bf733435861",
  measurementId: "G-YVL4PMGR73"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export { auth };