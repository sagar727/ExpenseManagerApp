import RemoteDB from "../../js/database/remotedb.js";

// Service Worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .catch(function (error) {
      console.log("Service Worker failed to register:", error);
    });
} else {
  console.log("Service Worker is not supported by this browser.");
}

const localDB = new LocalDB();
const res = localDB
  .open()
  .then((result) => {})
  .catch((error) => {
    console.log(error);
  });

const remotedb = new RemoteDB();
const result = remotedb
  .open()
  .then((res) => {
    login;
  })
  .catch((error) => {
    console.log(error);
  });

const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", login);
function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (navigator.onLine) {
    remotedb
      .login(username, password)
      .then((res) => {
        localStorage.setItem("uid", res);
        location.href = "./pages/home/home.html";
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    localDB
      .checkLogin()
      .then((res) => {
        checkUser(res);
      })
      .catch((error) => {
        console.log("error");
      });

    function checkUser(data) {
      data.forEach((childData) => {
        const email = childData.email;
        const pass = childData.password;
        if (username === email && password === pass) {
          location.href = "./pages/home/home.html";
        } else {
          alert("Incorrect username or password.");
        }
      });
    }
  }
}
