var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.total[type] = sum;
  };

  var data = {
    allItems: {
      inc: [],
      exp: [],
    },
    total: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, description, value) {
      var id, newItem;

      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      if (type === "exp") {
        newItem = new Expense(id, description, value);
      } else if (type === "inc") {
        newItem = new Income(id, description, value);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function () {
      // calculate total incomes and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate budget (incomes - expenses)
      data.budget = data.total.inc - data.total.exp;
      // calculate percentage of income that was spent.
      if (data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getPercentage: function () {
      var all = data.allItems.exp.map(function (current) {
        return current.getPercentage();
      });
      return all;
    },
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (current) {
        current.calcPercentage(data.total.inc);
      });
    },
    getBudget: function () {
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalIncome: data.total.inc,
        totalExpenses: data.total.exp,
      };
    },
    deleteItem: function (id, type) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    test: function () {
      console.log(data);
    },
  };
})();

var UIController = (function () {
  var DOM = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputSubmit: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabels: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    eventContainer: ".container",
    expensesPercentageLabel: ".item__percentage",
  };
  var formatNumber = function (num, type) {
    var numSplit, num, int, dec;
    num = Math.abs(num).toFixed(2);
    // Commas
    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOM.inputType).value, // either income or expense.
        description: document.querySelector(DOM.inputDescription).value,
        value: parseFloat(document.querySelector(DOM.inputValue).value),
      };
    },
    getDOM: function () {
      return DOM;
    },
    addListItem: function (obj, type) {
      var html, newHtml;
      if (type === "inc") {
        element = DOM.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOM.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function (id) {
      var element = document.getElementById(id);
      element.parentNode.removeChild(element);
    },
    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOM.inputDescription + ", " + DOM.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOM.expensesPercentageLabel);
      var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOM.budgetLabels).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOM.incomeLabel).textContent = formatNumber(
        obj.totalIncome,
        "inc"
      );
      document.querySelector(DOM.expenseLabel).textContent = formatNumber(
        obj.totalExpenses,
        "exp"
      );

      if (obj.percentage > 0) {
        document.querySelector(DOM.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOM.percentageLabel).textContent = "---";
      }
    },
  };
})();

var controller = (function (budgetCtrl, uiCtrl) {
  var setupEventListeners = function () {
    var DOM = UIController.getDOM();

    document
      .querySelector(DOM.inputSubmit)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      // Check if the keypress is a Return Key.
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.eventContainer)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function () {
    var budget;

    // Calculate the budget.
    budgetController.calculateBudget();
    // Return the budget.
    budget = budgetController.getBudget();
    // Update the budget UI.
    UIController.displayBudget(budget);
  };

  var updatePercentages = function () {
    // Calculate Percentage.
    budgetController.calculatePercentages();
    // Read percentage from buget controller.
    var percentages = budgetController.getPercentage();
    // Update UI.
    UIController.displayPercentages(percentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;
    // Getting the input data

    input = UIController.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // Adding the data to budget controller.
      newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );
      // Updating the UI
      UIController.addListItem(newItem, input.type);
      // Clear inputs
      UIController.clearFields();
      // Calculate and update the budget calculation.
      updateBudget();
      // Update Percentages.
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemId, itemParts, type, id;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      itemParts = itemId.split("-");
      type = itemParts[0];
      id = parseInt(itemParts[1]);
    }
    // Delete from Data Structure.
    budgetController.deleteItem(id, type);
    // Delete from UI
    UIController.deleteListItem(itemId);
    // Update the budget calculations.
    updateBudget();
    // Update Percentages.
    updatePercentages();
  };

  return {
    init: function () {
      console.log("App Started!");
      UIController.displayBudget({
        budget: 0,
        percentage: -1,
        totalIncome: 0,
        totalExpenses: 0,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
