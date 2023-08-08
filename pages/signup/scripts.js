import RemoteDB from "../../js/database/remote-db.js";

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
    signup;
  })
  .catch((error) => {
    console.log(error);
  });

const signUpBtn = document.getElementById("signupBtn");
signUpBtn.addEventListener("click", signup);

function signup() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var password2 = document.getElementById("password2").value;

  if (username != "") {
    if (password != "" || password2 != "") {
      if (password === password2) {
        var passw = /^[A-Za-z]\w{7,14}$/;
        if (!password.match(passw)) {
          alert("Invalid password characters");
        } else {
          remotedb
            .signUpUser(username, password2)
            .then((res) => {
              console.log(res);
              let data = {
                email: username,
                password: password2,
                uid: res.uid,
              };
              localDB
                .add("Users", data)
                .then(() => {
                  location.href = "../../index.html";
                })
                .catch((error) => {
                  console.log(error);
                  alert("Error while signup, Please try again later.");
                });
            })
            .catch((error) => {
              alert(error);
            });
        }
      } else {
        alert("Both passwords must be matched.");
      }
    } else {
      alert("Enter your password.");
    }
  } else {
    alert("Enter your email.");
  }
}
