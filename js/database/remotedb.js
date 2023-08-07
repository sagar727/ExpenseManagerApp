import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

class RemoteDB {
  constructor() {
    this.db = null;
    this.auth = null;
  }

  open() {
    return new Promise((resolve, reject) => {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyC7ehzFwfK3dY7x763Cy0d6iTCZcT8JBrQ",
          authDomain: "mymusic-2b812.firebaseapp.com",
          projectId: "mymusic-2b812",
          storageBucket: "mymusic-2b812.appspot.com",
          messagingSenderId: "899375861768",
          appId: "1:899375861768:web:08b0f15fd4f6283165c1bd",
        };
        const app = initializeApp(firebaseConfig);
        const dataBase = getFirestore(app);
        const auth = getAuth(app);
        this.db = dataBase;
        this.auth = auth;
        resolve(this.db);
      } catch (error) {
        reject(error.message);
      }
    });
  }

  signUpUser(email, password) {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          resolve(user);
        })
        .catch((error) => {
          const errorMessage = error.message;
          reject(errorMessage);
        });
    });
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user.uid;
          resolve(user);
        })
        .catch((error) => {
          const errorMessage = error.message;
          reject(errorMessage);
        });
    });
  }

  signOut() {
    return new Promise((resolve, reject) => {
      signOut(this.auth)
        .then(() => {
          // Sign-out successful.
          resolve();
        })
        .catch((error) => {
          // An error happened.
          reject(error);
        });
    });
  }

  displayData(uid) {
    const result = [];
    let expenseSum = 0;
    let incomeSum = 0;
    return new Promise((resolve, reject) => {
      if (!this.open()) {
        reject("Database is not avaialble");
      }

      const dbCollection = collection(this.db, uid);
      getDocs(dbCollection)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            console.log(data);
            if (data.type == "") {
              incomeSum = incomeSum + data.amount;
            } else {
              expenseSum = expenseSum + data.amount;
            }
            result.push(data);
          });
          const total = incomeSum - expenseSum;
          result.push(total);
          resolve(result);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }

  add(data, uid) {
    return new Promise((resolve, reject) => {
      if (this.open()) {
        const dbCollection = collection(this.db, uid);
        addDoc(dbCollection, data)
          .then((ref) => {
            resolve(ref.id);
          })
          .catch((error) => {
            reject(error.message);
          });
      }
    });
  }

  delete(uid, id) {
    return new Promise((resolve, reject) => {
      if (this.open()) {
        const docRef = doc(this.db, uid, id);

        deleteDoc(docRef)
          .then(() => {
            console.log("deleted");
            resolve();
          })
          .catch((error) => {
            reject(error.message);
          });
      }
    });
  }

  update(uid, id, data) {
    return new Promise((resolve, reject) => {
      if (this.open()) {
        const docRef = doc(this.db, uid, id);

        updateDoc(docRef, data)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error.message);
          });
      }
    });
  }
}
export default RemoteDB;
