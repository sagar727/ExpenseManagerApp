import RemoteDB from "../../js/database/remotedb.js";

let uid = localStorage.getItem("uid");

let val = "";

const remotedb = new RemoteDB();
remotedb
  .open()
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });

const localDB = new LocalDB();
localDB
  .open()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

const remoteDB = new RemoteDB();
if (navigator.onLine) {
  remoteDB
    .open()
    .then((result) => {
      remoteDB
        .displayData(uid)
        .then((data) => {
          addList(data);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
} else {
  localDB
    .open()
    .then((result) => {
      getListData();
    })
    .catch((error) => {
      console.log(error);
    });
}

let id = "";

function getListData() {
  localDB
    .getAll()
    .then((data) => {
      addList(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

const radio1 = document.getElementById("radio-1");
const radio2 = document.getElementById("radio-2");
radio1.addEventListener("click", disable);
radio2.addEventListener("click", disable);

function disable() {
  const type = document.getElementById("choose-sel");
  const category = document.getElementsByName("category");
  if (category[0].checked) {
    type.disabled = false;
  } else if (category[1].checked) {
    type.disabled = true;
  }
}

const btn = document.getElementById("saveBtn");
btn.addEventListener("click", add);

function add() {
  const amount = parseFloat(document.getElementById("amount").value);
  const desc = document.getElementById("description").value;
  const type = document.getElementById("choose-sel").value;
  const date = document.getElementById("datepicker").value;
  const category = document.getElementsByName("category");
  const btn = document.getElementById("saveBtn");
  if (category[0].checked) {
    val = category[0].value;
    let data = {
      date: date,
      type: type,
      desc: desc,
      amount: amount,
    };

    if (btn.innerText == "Save") {
      remotedb
        .add(data, uid)
        .then((ref) => {
          data.id = ref;
          alert("Record Saved!!");
          localDB
            .add("Expenses", data)
            .then(() => {
              data = {};
              getListData();
            })
            .catch((error) => {
              console.log(error);
              alert("Not saved.");
            });
          data = {};
          location.href = "../home/home.html";
          getListData();
        })
        .catch((error) => {
          console.log(error);
          //alert("Error saving data.");
        });
    } else if (btn.innerText == "Update") {
      updateData();
      getListData();
    }
  } else if (category[1].checked) {
    val = category[1].value;
    let data = {
      date: date,
      type: "",
      desc: desc,
      amount: amount,
    };

    if (btn.innerText == "Save") {
      remotedb
        .add(data, uid)
        .then((ref) => {
          data.id = ref;
          alert("Record Saved!!");
          localDB
            .add("Income", data)
            .then(() => {
              data = {};
              getListData();
            })
            .catch((error) => {
              console.log(error);
              alert("Not saved.");
            });
          data = {};
          location.href = "../home/home.html";
          getListData();
        })
        .catch((error) => {
          console.log(error);
          //alert("Error saving data.");
        });
    } else if (btn.innerText == "Update") {
      updateData();
      getListData();
    }
  }
}

function addList(data) {
  var size = data.length;
  var number = data[size - 1];
  const balance = document.getElementById("balaceId");
  const balanceDiv = document.getElementById("balance-div");
  if (number < 0.0) {
    balanceDiv.style.backgroundColor = "rgba(227, 212, 212, 0.2)";
    balance.style.color = "#902f2f";
  } else if (number > 0.0) {
    balanceDiv.style.backgroundColor = "rgba(213, 227, 212, 0.2)";
    balance.style.color = "#2f9062";
  } else if (number == 0.0) {
    balanceDiv.style.backgroundColor = "rgba(228, 228, 211, 0.2)";
    balance.style.color = "#90852f";
  }

  balance.innerText = "$ " + number;
  var listData = data.splice(0, size - 1);
  listData.forEach((childData) => {
    const date = childData.date;
    const amount = childData.amount;
    const type = childData.type;
    const desc = childData.desc;
    const id = childData.id;
    listitems(date, amount, type, desc, id);
  });
}

function listitems(date, amount, type, desc, id) {
  const maindiv = document.querySelector(".list-container");
  const node = document.createElement("DIV");
  node.className = "list-item";
  const div = document.createElement("DIV");
  div.className = "detail-container";
  const p = document.createElement("P");
  const q = document.createElement("P");
  const div2 = document.createElement("DIV");
  div2.className = "button-container";
  const editBtn = document.createElement("BUTTON");
  editBtn.id = "editBtn";
  const editImage = document.createElement("IMG");
  editImage.id = "editImg";
  editImage.src = "../../images/pencil.png";
  editImage.alt = "Edit";
  editBtn.appendChild(editImage);
  const deleteBtn = document.createElement("BUTTON");
  deleteBtn.id = "deleteBtn";
  const deleteImage = document.createElement("IMG");
  deleteImage.id = "deleteImg";
  deleteImage.src = "../../images/delete.png";
  deleteImage.alt = "Delete";
  deleteBtn.appendChild(deleteImage);
  maindiv.appendChild(node);
  node.appendChild(div);
  div.appendChild(p);
  div.appendChild(q);
  node.appendChild(div2);
  div2.appendChild(editBtn);
  div2.appendChild(deleteBtn);
  p.innerText = date + " $" + amount;
  q.innerText = type + " " + desc;

  editBtn.addEventListener("click", showUpdatePage);
  function showUpdatePage() {
    localStorage.setItem("date", date);
    localStorage.setItem("type", type);
    localStorage.setItem("desc", desc);
    localStorage.setItem("amount", amount);
    localStorage.setItem("id", id);
    location.href = "../add/add.html";
  }

  deleteBtn.addEventListener("click", deleteList);
  function deleteList() {
    remoteDB
      .delete(uid, id, type)
      .then(() => {
        localDB
          .delete(id, type)
          .then(() => {
            console.log("removed");
            location.href = "../home/home.html";
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    node.remove();
  }
}

document.addEventListener("DOMContentLoaded", setData);

function setData() {
  if (localStorage.length < 6) {
    btn.innerText = "Save";
  } else {
    const timeData = localStorage.getItem("time");
    id = localStorage.getItem("id");
    const dateData = localStorage.getItem("date");
    const typeData = localStorage.getItem("type");
    const descData = localStorage.getItem("desc");
    const amountData = localStorage.getItem("amount");
    const amount = document.getElementById("amount");
    const desc = document.getElementById("description");
    const type = document.getElementById("choose-sel");
    const date = document.getElementById("datepicker");
    const category = document.getElementsByName("category");
    const btn = document.getElementById("saveBtn");
    timeid = parseInt(timeData);

    amount.value = amountData;
    desc.value = descData;
    date.value = dateData;
    type.value = typeData;
    if (typeData != "") {
      category[0].checked = true;
    } else {
      category[1].checked = true;
      type.disabled = true;
    }
    btn.innerText = "Update";
  }
}

function updateData() {
  const amount = parseFloat(document.getElementById("amount").value);
  const desc = document.getElementById("description").value;
  const type = document.getElementById("choose-sel").value;
  const date = document.getElementById("datepicker").value;
  const category = document.getElementsByName("category");
  if (category[0].checked) {
    val = category[0].value;
    let data = {
      date: date,
      type: type,
      desc: desc,
      amount: amount,
    };
    remoteDB
      .update(uid, id, data)
      .then((res) => {
        console.log("updated");
        localDB
          .update(data)
          .then((res) => {
            console.log("updated");
            localStorage.removeItem("id");
            localStorage.removeItem("date");
            localStorage.removeItem("type");
            localStorage.removeItem("desc");
            localStorage.removeItem("amount");
            location.href = "../home/home.html";
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (category[1].checked) {
    type.disabled = true;
    val = category[1].value;
    let data = {
      date: date,
      type: "",
      desc: desc,
      amount: amount,
    };
    remoteDB
      .update(uid, id, data)
      .then((res) => {
        console.log("updated");
        localDB
          .update(data)
          .then((res) => {
            console.log("updated");
            localStorage.removeItem("id");
            localStorage.removeItem("date");
            localStorage.removeItem("type");
            localStorage.removeItem("desc");
            localStorage.removeItem("amount");
            location.href = "../home/home.html";
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

async function handleBatteryStatusAPI() {
  if ("getBattery" in navigator) {
    const battery = await navigator.getBattery();
    console.log(battery);
  } else {
    console.log("batteryapi not available");
  }
}
