const readline = require("readline");

function expenseTracker() {
  const transaction = [];

  function addTransaction(type,amt,desc) {
    transaction.push({type,amt,desc});
    console.log("✅ Transaction Added");
  }

  function showSummary() {
    let balance = 0;
    console.log("📄 All Transactions:");
    transaction.forEach((item,index) => {
        console.log(`${index + 1}. ${item.type} $${item.amt} - ${item.desc}`);
        balance += item.type == "income" ? item.amt : -item.amt;
    });
    console.log(`💰 Current Balance : $${balance}`);
  }

  const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function askAction() {
    read.question("Choose (add / view / exit) :", (choice) => {
      if (choice == "add") {
        read.question("Type (income/expense) :", (type) => {
            read.question("Amount : $", (amt) => {
                read.question("Description :", (desc) => {
                    addTransaction(type,parseInt(amt),desc);
                    askAction();
                })
            })
        })
      } else if (choice == "view") {
        showSummary();
        askAction();
      } else {
        console.log("👋 Existing. Data will be lost.");
        read.close();
      }
    });
  }
  askAction();
}

expenseTracker();
