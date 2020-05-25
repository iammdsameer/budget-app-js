var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      incomes: [],
      expenses: [],
    },
    total: {
      incomes: 0,
      expenses: 0,
    },
  };
})();

var UIController = (function () {
  var DOM = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputSubmit: ".add__btn",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOM.inputType).value, // either income or expense.
        description: document.querySelector(DOM.inputDescription).value,
        value: document.querySelector(DOM.inputValue).value,
      };
    },
    getDOM: function () {
      return DOM;
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
  };

  var ctrlAddItem = function () {
    // Getting the input data

    var input = UIController.getInput();
    console.log(input);
    // Adding the data to budget controller.
    // Updating the UI
    // Calculate the budget.
    // Update the budget UI.
  };

  return {
    init: function () {
      console.log("App Started!");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
