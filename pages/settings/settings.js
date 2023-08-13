import RemoteDB from "../../js/database/remote-db.js";

const remotedb = new RemoteDB();
remotedb
  .open()
  .then((res) => {})
  .catch((error) => {
    console.log(error);
  });

async function handlePermissionsAPI() {
  if ("permissions" in navigator) {
    console.log(navigator.permissions);
    const status = await navigator.permissions.query({
      name: "notifications",
    });
    console.log(status);
    if (status.state == "prompt") {
      requestPermission();
    } else if (status.state == "granted") {
      dateLoop();
    } else if (status.state == "denied") {
      console.log("denied");
    }
  } else {
    console.log("permission api not available");
  }
}

function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission == "granted") {
      dateLoop();
    } else if (permission == "denied") {
      console.log("denied");
    }
  });
}

function displayNotification() {
  const options = {
    body: "Don't forget to add today's expenses and income.",
  };
  new Notification("Msg from ExpenseManager", options);
}

const outBtn = document.getElementById("sign");
outBtn.addEventListener("click", outaction);

function outaction() {
  remotedb
    .signOut()
    .then(() => {
      location.href = "../../index.html";
    })
    .catch((error) => {
      console.log(error);
    });
}

const checkMode = document.getElementById("notification");
checkMode.addEventListener("click", notifyMe);

function notifyMe() {
  if (checkMode.checked == false) {
    clearInterval(dateLoop);
  } else if ((checkMode.checked = true)) {
    handlePermissionsAPI();
    handleBatteryStatusAPI();
  }
}

async function handleBatteryStatusAPI() {
  if ("getBattery" in navigator) {
    const battery = await navigator.getBattery();
    console.log(battery);
    if (battery.charging == false) {
      console.log(battery.level);
      if ((battery.level * 100).toFixed(0) < 20) {
        const options = {
          body: "Please charge your phone.",
        };

        new Notification("Msg from ExpenseManager", options);
      }
    }
  } else {
    console.log("batteryapi not available");
  }
}
function checkDate() {
  var date = new Date();
  console.log(date.getDay());
  console.log(date.getHours());
  if (date.getHours() === 20) {
    displayNotification();
  }
}

var dateLoop = setInterval(function () {
  checkDate();
}, 5000);
