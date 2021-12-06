// Enter JavaScript for the exercise here...
let transactions = document.querySelector(".transactions tbody");

// create a variable for the transaction form
let transactionForm = document.querySelector(".frm-transactions");

// form that will contain all the data
let transactionArray = [];

// handling error messages
let errors = document.querySelector(".error");

// function for submitting the form
transactionForm.addEventListener("submit", function (evt) {
    evt.preventDefault();

    let transactionName = "";
    if (evt.currentTarget.elements.description.value.trim() != "") {
        transactionName = evt.currentTarget.elements.description.value;
    } else {
        errors.textContent = "Must enter a transaction name";
    }

    let transactionType = "";
    if (evt.currentTarget.elements.type.value != "") {
        transactionType = evt.currentTarget.elements.type.value;
    } else {
        errors.textContent = "Must select an appropriate transaction type";
    }

    let transactionAmountDebit = 0;
    if (
        parseFloat(evt.currentTarget.elements.currency.value).toFixed(2) > 0.0
    ) {
        if (transactionType === "debit") {
            transactionAmountDebit = parseFloat(
                evt.currentTarget.elements.currency.value
            ).toFixed(2);
        }
    } else {
        errors.textContent = "Must enter an amount greater $0.00";
        return false;
    }

    let transactionAmountCredit = 0;
    if (
        parseFloat(evt.currentTarget.elements.currency.value).toFixed(2) > 0.0
    ) {
        if (transactionType === "credit") {
            transactionAmountCredit = parseFloat(
                evt.currentTarget.elements.currency.value
            ).toFixed(2);
        }
    } else {
        errorMessage.textContent = "Must enter an amount greater $0.00";
        return false;
    }

    // create a data object
    let transaction = {
        transactionName,
        transactionType,
        transactionAmountDebit,
        transactionAmountCredit,
    };

    // Reset any errors if data is successfully submitted
    errors.textContent = "";

    // Call functions to run new transactions and others
    appendTransaction(transaction);
    updateTotals();

    // On submit, clear all fields
    evt.target.reset();
});

const appendTransaction = function (transaction) {
    // Create the required nodes to build the DOM fragment
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    tdName.textContent = transaction.transactionName;
    let tdType = document.createElement("td");
    tdType.textContent = transaction.transactionType;
    let tdAmountDebit = document.createElement("td");
    tdAmountDebit.textContent = `$${transaction.transactionAmountDebit}`;
    let tdAmountCredit = document.createElement("td");
    tdAmountCredit.textContent = `$${transaction.transactionAmountCredit}`;
    let tdDelete = document.createElement("td");
    let deleteIcon = document.createElement("i");

    // Set the required attributes
    tr.setAttribute("class", `${transaction.transactionType}`);
    tdAmountDebit.classList.add("amount");
    tdAmountCredit.classList.add("amount");
    tdDelete.classList.add("tools");
    deleteIcon.classList.add("delete", "fa", "fa-trash-o");

    // Build the DOM fragment (assemble the parts)
    tr.appendChild(tdName);
    tr.appendChild(tdType);
    if (transaction.transactionType === "debit") {
        tr.appendChild(tdAmountDebit);
    } else if (transaction.transactionType === "credit") {
        tr.appendChild(tdAmountCredit);
    }
    tr.appendChild(tdDelete);
    tdDelete.appendChild(deleteIcon);

    // Add the DOM fragment to the document (append to the tbody)
    transactions.appendChild(tr);

    // Add transaction data to the array
    transactionArray.push(transaction);

    deleteIcon.addEventListener("click", function (evt) {
        // Create variable  to return the selected item found in the array depending on what the user clicked on\
        let removeItem = transactionArray.find(function (item, index) {
            if (
                item.transactionName ===
                evt.target.parentElement.parentElement.firstChild.textContent
            ) {
                item.index = index;
                return item;
            }
        });
        if (confirm("Do you want to delete this transaction?") === true) {
            // Remove selected item from array
            transactionArray.splice(removeItem.index, 1);
            // Remove selected item from DOM
            transactions.removeChild(transactions.children[removeItem.index]);
            // Update total debits and total credits accordingly
            updateTotals();
        }
    });
};

// Update the totals
const updateTotals = function () {
    // Save total debits and total credits value on DOM
    let totalsDisplay = document.querySelectorAll(".total");

    // Create an object to save and update user inserted values as they are entered
    let totalsObject = transactionArray.reduce(
        function (totalsObject, transaction) {
            totalsObject.totalDebit += parseFloat(
                transaction.transactionAmountDebit
            );
            totalsObject.totalCredit += parseFloat(
                transaction.transactionAmountCredit
            );
            return totalsObject;
        },
        { totalDebit: 0, totalCredit: 0 }
    );

    // Update the display on the DOM
    totalsDisplay[0].textContent = `$${totalsObject.totalDebit.toFixed(2)}`;
    totalsDisplay[1].textContent = `$${totalsObject.totalCredit.toFixed(2)}`;
};

const inactivityTimer = function () {
    let time;

    // Events to stop inactivity
    window.addEventListener("mousemove", function (evt) {
        resetTime();
    });

    window.addEventListener("click", function (evt) {
        resetTime();
    });

    window.addEventListener("mousedown", function (evt) {
        resetTime();
    });

    window.addEventListener("keypress", function (evt) {
        resetTime();
    });

    // Function to notify user has been inactive and session expired
    function alertUser() {
        alert("User has been inactive for 2 minutes, session timed out.");
        window.location = self.location.href;
    }

    // Function to reset the timer if certain conditions are met
    function resetTime() {
        clearTimeout(time);
        time = setTimeout(alertUser, 120000);
    }
};

// Run the inactivity function
inactivityTimer();
