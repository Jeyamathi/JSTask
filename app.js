   const transactionForm = document.getElementById("transactionForm");
    const transactionHistory = document.getElementById("transactionHistory");
    const totalIncome = document.getElementById("totalIncome");
    const totalExpense = document.getElementById("totalExpense");
    const balance = document.getElementById("balance");

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let currentFilter = localStorage.getItem("currentFilter") || "all";
    document.querySelector(`input[name='filter'][value='${currentFilter}']`).checked = true;

    document.getElementById("title").value = localStorage.getItem("draftTitle") || "";
    document.getElementById("amount").value = localStorage.getItem("draftAmount") || "";

    document.getElementById("title").addEventListener("input", e => {
      localStorage.setItem("draftTitle", e.target.value);
    });

    document.getElementById("amount").addEventListener("input", e => {
      localStorage.setItem("draftAmount", e.target.value);
    });

    function updateSummary() {
      const income = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);
      const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

      totalIncome.textContent = `₹${income}`;
      totalExpense.textContent = `₹${expense}`;
      balance.textContent = `₹${income - expense}`;
    }

    function saveToLocalStorage() {
      localStorage.setItem("transactions", JSON.stringify(transactions));
      localStorage.setItem("currentFilter", currentFilter);
    }

    function renderTransactions() {
      transactionHistory.innerHTML = "";
      transactions
        .filter(t => currentFilter === "all" || t.type === currentFilter)
        .forEach((transaction, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${transaction.title}</td>
            <td class="px-6 py-4 whitespace-nowrap">₹${transaction.amount}</td>
            <td class="px-6 py-4 whitespace-nowrap">${transaction.type}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button class="text-yellow-600 hover:underline mr-4" onclick="editTransaction(${index})">Edit</button>
              <button class="text-red-600 hover:underline" onclick="deleteTransaction(${index})">Delete</button>
            </td>
          `;
          transactionHistory.appendChild(row);
        });
    }

    function deleteTransaction(index) {
      transactions.splice(index, 1);
      saveToLocalStorage();
      renderTransactions();
      updateSummary();
    }

    function editTransaction(index) {
      const transaction = transactions[index];
      document.getElementById("title").value = transaction.title;
      document.getElementById("amount").value = transaction.amount;
      document.querySelector(`input[name='type'][value='${transaction.type}']`).checked = true;
      deleteTransaction(index);
    }

    transactionForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const amount = parseFloat(document.getElementById("amount").value);
      const type = document.querySelector("input[name='type']:checked").value;

      transactions.push({ title, amount, type });
      saveToLocalStorage();
      renderTransactions();
      updateSummary();
      transactionForm.reset();
      localStorage.removeItem("draftTitle");
      localStorage.removeItem("draftAmount");
    });

    document.querySelectorAll("input[name='filter']").forEach(radio => {
      radio.addEventListener("change", () => {
        currentFilter = radio.value;
        saveToLocalStorage();
        renderTransactions();
      });
    });

    // Initialize on load
    renderTransactions();
    updateSummary();