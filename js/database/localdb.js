class LocalDB {
  constructor() {
    this.db = null;
    this.isAvailable = false;
  }

  open() {
    return new Promise((resolve, reject) => {
      if ("indexedDB" in window) {
        const request = indexedDB.open("ExpenseManager", 1);
        request.onerror = (event) => {
          reject(event.target.error.message);
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          console.log("open");
          if (db) {
            this.db = db;
            this.isAvailable = true;
            resolve(db);
          } else {
            reject("Database is not available.");
          }
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const objectStore = db.createObjectStore("Users", {
            keyPath: "uid",
          });
          const objectStore1 = db.createObjectStore("Expenses", {
            keyPath: "id",
          });
          objectStore1.createIndex("type", "type");

          const objectStore2 = db.createObjectStore("Income", {
            keyPath: "id",
          });
        };
      } else {
        reject("Your browser does not support IndexedDb.");
      }
    });
  }

  add(storeName, data) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("database not open");
      }
      const transaction = this.db.transaction(storeName, "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };
      transaction.oncomplete = (event) => {
        resolve(event);
      };
      const store = transaction.objectStore(storeName);
      const storeRequest = store.add(data);
      storeRequest.onerror = (event) => {
        reject(event.target.error.message);
      };
      storeRequest.onsuccess = (event) => {
        console.log(event);
      };
    });
  }

  getAll() {
    let expenseSum = 0;
    let incomeSum = 0;
    let result = [];
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("database not open");
      }
      const transaction = this.db.transaction(
        ["Expenses", "Income"],
        "readonly"
      );
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };
      transaction.oncomplete = (event) => {
        //console.log(event);
        const total = incomeSum - expenseSum;
        result.push(total);
        resolve(result);
      };
      const store = transaction.objectStore(["Expenses"]);
      const store1 = transaction.objectStore(["Income"]);
      const storeRequest = store.getAll();
      storeRequest.onerror = (event) => {
        reject(event.target.error.message);
      };
      storeRequest.onsuccess = (event) => {
        event.target.result.forEach((res) => {
          result.push(res);
          expenseSum = expenseSum + res.amount;
        });
      };
      const storeRequest1 = store1.getAll();
      storeRequest1.onerror = (event) => {
        reject(event.target.error.message);
      };
      storeRequest1.onsuccess = (event) => {
        event.target.result.forEach((res) => {
          result.push(res);
          incomeSum = incomeSum + res.amount;
        });
      };
    });
  }

  getByExpenseType() {
    const typeNames = [
      "Accommodation",
      "Insurance",
      "Grocery",
      "Utilities",
      "Debt",
      "Transportation",
      "Shopping",
      "Entertainment",
      "Other",
    ];
    let sum = 0;
    let dataTable = [["Expenses", "Amount"]];
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("Database not available.");
      }
      const transaction = this.db.transaction("Expenses", "readonly");
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };
      transaction.oncomplete = (event) => {
        resolve(dataTable);
      };
      const store = transaction.objectStore("Expenses");
      const index = store.index("type");

      typeNames.forEach((typeName) => {
        const name = typeName;
        const request = index.getAll(typeName);
        request.onerror = (event) => {
          reject(event.target.error.message);
        };
        request.onsuccess = (event) => {
          event.target.result.forEach((res) => {
            sum = sum + res.amount;
          });
          dataTable.push([name, sum]);
          sum = 0;
        };
      });
    });
  }

  update(data) {
    let storeName = "";
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("database not open");
      }
      if (data.type === "") {
        storeName = "Income";
      } else {
        storeName = "Expenses";
      }
      const transaction = this.db.transaction(storeName, "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };
      transaction.oncomplete = (event) => {
        console.log(event);
      };
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onerror = (event) => {
        reject(event.target.error.message);
      };
      request.onsuccess = (event) => {
        resolve();
      };
    });
  }

  delete(id, type) {
    let storeName = "";
    if (type == "") {
      storeName = "Income";
    } else {
      storeName = "Expenses";
    }
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("Database not available.");
      }
      const transaction = this.db.transaction(storeName, "readwrite");
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };
      transaction.oncomplete = (event) => {
        console.log(event);
      };
      const store = transaction.objectStore(storeName);
      const storeRequest = store.delete(id);
      storeRequest.onerror = (event) => {
        reject(event.target.error.message);
      };
      storeRequest.onsuccess = (event) => {
        resolve();
      };
    });
  }

  checkLogin() {
    let result = [];
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("Database not available.");
      }

      const transaction = this.db.transaction("Users", "readonly");
      transaction.onerror = (event) => {
        reject(event.target.error.message);
      };
      transaction.oncomplete = (event) => {
        resolve(result);
      };
      const store = transaction.objectStore("Users");
      const storeRequest = store.getAll();
      storeRequest.onerror = (event) => {
        reject(event.target.error.message);
      };
      storeRequest.onsuccess = (event) => {
        event.target.result.forEach((res) => {
          result.push(res);
        });
      };
    });
  }
}
