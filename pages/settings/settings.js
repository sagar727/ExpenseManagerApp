import RemoteDB from "../../js/database/remotedb.js";

const remotedb = new RemoteDB();
remotedb
  .open()
  .then((res) => {
    console.log(res);
  })
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
      displayNotification();
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
      displayNotification();
    } else if (permission == "denied") {
      console.log("denied");
    }
  });
}

function displayNotification() {
  const options = {
    //body: "Don't forget to add today's expenses and income.",
    body: (navigator.getBattery().level * 100).toFixed(0) + "%",
  };

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification("Msg from ExpenseManager", options);
  });
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
    handleBatteryStatusAPI();
  } else if ((checkMode.checked = true)) {
    handlePermissionsAPI();
  }
}

async function handleBatteryStatusAPI() {
  if ("getBattery" in navigator) {
    const battery = await navigator.getBattery();
    console.log(battery);
    if (battery.charging == false) {
      if ((battery.level * 100).toFixed(0) < 20) {
        const options = {
          body: "Please charge your phone.",
        };

        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification("Msg from ExpenseManager", options);
        });
      }
    }
  } else {
    console.log("batteryapi not available");
  }
}
