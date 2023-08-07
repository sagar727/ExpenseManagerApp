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

      const dbCollection = collection(this.db, "/Users/" + uid + "/Expenses");
      getDocs(dbCollection)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            expenseSum = expenseSum + data.amount;
            result.push(data);
          });
        })
        .catch((error) => {
          reject(error.message);
        });

      const dbCollection1 = collection(this.db, "/Users/" + uid + "/Income");
      getDocs(dbCollection1)
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            incomeSum = incomeSum + data.amount;
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

  add(storeName, data, uid) {
    data.time = Date.now();
    return new Promise((resolve, reject) => {
      if (this.open()) {
        const dbCollection = collection(
          this.db,
          uid + "/" + storeName + "/" + data.time
        );
        const sendData = [];
        addDoc(dbCollection, data)
          .then((ref) => {
            console.log(ref._key.path.segments[2]);
            sendData.push(ref.id, ref._key.path.segments[2]);
            resolve(sendData);
          })
          .catch((error) => {
            reject(error.message);
          });
      }
    });
  }

  delete(uid, id, type, time) {
    let storeName = "";
    if (type == "") {
      storeName = "Income";
    } else {
      storeName = "Expenses";
    }

    return new Promise((resolve, reject) => {
      if (this.open()) {
        const docRef = doc(
          this.db,
          "/" + uid + "/" + storeName + "/" + time + "/",
          id
        );

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
    let storeName = "";
    if (data.type === "") {
      storeName = "Income";
    } else {
      storeName = "Expenses";
    }
    return new Promise((resolve, reject) => {
      if (this.open()) {
        const docRef = doc(
          this.db,
          "/" + uid + "/" + storeName + "/" + data.time,
          id
        );

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