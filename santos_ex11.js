const price = {
  Salad: 100,
  "Bread w/ Dip": 70,
  "Tomato Surprise": 120,
  "Mushroom Bites": 150,
  "Roast Beef": 300,
  "Beef Steak": 270,
  "Pork Spareribs": 240,
  "Pork Marbella": 250,
  "Grilled Chicken": 190,
  "Roast Chicken": 190,
  "Broiled Salmon": 170,
  "Grilled Salmon": 180,
  "Molten Chocolate Cake": 120,
  "Red Velvet Cake": 90,
  "Lemon Bars": 50,
  "Peanut Butter Bars": 60,
  "Buko Pie": 50,
  "Lemon Meringue Pie": 70,
  Plain: 30,
  Garlic: 40,
  Bagoong: 35,
  "Cucumber Lemonade": 60,
  "Red Iced Tea": 50,
  "Ripe Mango Juice": 70,
};

function removeErrorText(container) {
  let errorText = container.querySelector("h6");
  if (errorText) {
    container.querySelector("h6").remove();
  }
}

function validatePartyDate() {
  const container = document.getElementById("container__date");
  const partyInput = document.getElementById("party-date");

  // if input is disabled, it doesn't have to be validated so we end the function already
  if (partyInput.disabled == true) {
    removeErrorText(container);
    return;
  }

  const date = new Date();
  // converts date from input to a Date object for comparison
  const partyDate = new Date(partyInput.value);

  // if date from input is later than current date, it is valid
  if (partyDate > date) {
    removeErrorText(container);
    return partyDate.toLocaleDateString();
  }

  // makes the error message only appear once
  if (container.childElementCount > 2) {
    // returns false so that the program knows that the input is still invalid
    return false;
  }

  // displays the error message
  const errorText = document.createElement("h6");
  const textNode = document.createTextNode("Please provide a future date!");
  errorText.appendChild(textNode);
  container.appendChild(errorText);

  // returns false so that the program knows that the input is still invalid
  return false;
}

function validatePartyTime() {
  // a function to determine if the input time is between 6 AM to 6 PM
  const isTimeValid = (targetTime) => {
    // dates used in these objects don't matter because we only want the actual time
    // any date in any year is acceptable
    const startTime = new Date("2023-12-02T06:00:00");
    const endTime = new Date("2023-12-02T18:00:00");

    return targetTime >= startTime && targetTime <= endTime;
  };

  const container = document.getElementById("container__time");
  const partyInput = document.getElementById("party-time");
  const partyTime = new Date(`2023-12-02T${partyInput.value}`);

  // if input is disabled, it doesn't have to be validated so we end the function already
  if (partyInput.disabled == true) {
    removeErrorText(container);
    return;
  }

  if (isTimeValid(partyTime)) {
    removeErrorText(container);

    // the partyTime.toLocaleTimeString() returns "10:00:00 AM" (for example only)
    // these functions removes the trailing ":00" from the original string
    return `${partyTime
      .toLocaleTimeString()
      .split(":")
      .slice(0, -1)
      .join(":")} ${partyTime.getHours() < 12 ? "AM" : "PM"}`;
  }

  // makes the error message only appear once
  if (container.childElementCount > 2) {
    // returns false so that the program knows that the input is still invalid
    return false;
  }

  // displays the error message
  const errorText = document.createElement("h6");
  const textNode = document.createTextNode(
    "Delivery times are only from 6 AM to 6 PM."
  );
  errorText.appendChild(textNode);
  container.appendChild(errorText);

  // returns false so that the program knows that the input is still invalid
  return false;
}

function showOrderSummary(
  pax,
  appetizer,
  mainDishes,
  desserts,
  rice,
  drink,
  deliveryDetails,
  mealCost,
  deliveryFee,
  total
) {
  let orderSummary = "Order Summary\n\n";
  orderSummary += `Number of People\t\t${pax}\n`;
  orderSummary += `Appetizer\t\t\t${appetizer}\n`;

  orderSummary += `Main Dishes\t\t\t${mainDishes[0]}\n`;
  // removed the first element of the array so that it won't be included in the map
  mainDishes.shift();
  // returns a certain object based on what is indicated in every item in the array
  orderSummary += `${mainDishes
    .map((dish) => {
      return `\t\t\t\t\t${dish}\n`;
    })
    .join("")}`;

  orderSummary += `Desserts\t\t\t\t${desserts[0]}\n`;
  // same goes here
  desserts.shift();
  orderSummary += `${desserts
    .map((dessert) => {
      return `\t\t\t\t\t${dessert}\n`;
    })
    .join("")}`;

  orderSummary += `Type of Rice\t\t\t${rice}\n`;
  orderSummary += `Drinks\t\t\t\t${drink}\n`;

  orderSummary += `Delivery Details\t\t${deliveryDetails
    .map((item) => {
      // added a condition for "Store Pickup" method since delivery details in said method are empty
      // if item is not empty, display it, otherwise don't
      return item ? `${item}\n\t\t\t\t\t` : "";
    })
    .join("")}\n`;

  orderSummary += `Meal Cost\t\t\t${mealCost}\n`;
  orderSummary += `Delivery Fee\t\t\t${deliveryFee}\n`;
  orderSummary += `Total\t\t\t\t${total}`;

  alert(orderSummary);
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  let isFormValid = true;

  const deliveryMethod = document.querySelector(
    'input[name="delivery-method"]:checked'
  ).value;

  // checks if address input is disabled
  // if it is, then address is empty
  const address =
    document.getElementById("address").disabled == true
      ? ""
      : document.getElementById("address").value;

  const partyDate = validatePartyDate();
  const partyTime = validatePartyTime();

  // this is where the "return false" from the validation functions comes in
  // if either one of the party details is invalid, then the form is invalid
  // additionally, if both details are disabled meaning it is in "Store Pickup" method,
  // then the form is valid regardless of whatever their value is
  isFormValid =
    (partyDate && partyTime) ||
    (partyDate == undefined && partyTime == undefined)
      ? true
      : false;

  const checkedAppetizer = document.querySelector(
    'input[name="appetizer"]:checked'
  ).value;

  // iterates through all selected items and stores their value in an array
  const checkedMainDishes = [
    ...document.querySelectorAll('input[name="main-dish"]:checked'),
  ].map((dish) => dish.value);
  const checkedDesserts = [
    ...document.querySelectorAll('input[name="desserts"]:checked'),
  ].map((dish) => dish.value);

  const checkedRice = document.querySelector(
    'input[name="rice"]:checked'
  ).value;
  const checkedDrink = document.querySelector(
    'input[name="drink"]:checked'
  ).value;

  // iterates throughout the array and adds up their value
  // basically, prev is the sum of each iteration as it goes
  //
  // If an item doesn't have a defined price, it defaults to 0
  const mainDishesPrice = checkedMainDishes.reduce(
    (prev, curr) => prev + (price[curr] ?? 0),
    0
  );
  const dessertsPrice = checkedDesserts.reduce(
    (prev, curr) => prev + (price[curr] ?? 0),
    0
  );

  const totalCost =
    price[checkedAppetizer] +
    price[checkedRice] +
    price[checkedDrink] +
    mainDishesPrice +
    dessertsPrice;
  const pax = document.getElementById("people").value;

  // "~~" or double Bitwise NOT operator is a substitute for Math.floor() for positive numbers
  const deliveryFee = 1000 + 500 * ~~((pax - 1) / 50);
  const totalPrice = pax * totalCost + deliveryFee;

  // if submission successful, only show the order summary to the user
  if (isFormValid) {
    showOrderSummary(
      pax,
      checkedAppetizer,
      checkedMainDishes,
      checkedDesserts,
      checkedRice,
      checkedDrink,
      [deliveryMethod, address, partyDate, partyTime],
      totalCost,
      deliveryFee,
      totalPrice
    );
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // disables party inputs on load by default
  document.querySelectorAll('[name="party-details"]').forEach((entry) => {
    entry.disabled = document.getElementById("pickup").checked ? true : false;
  });
});

document.getElementById("pickup").addEventListener("change", () => {
  document.querySelectorAll('[name="party-details"]').forEach((entry) => {
    entry.disabled = true;
  });
});

document.getElementById("delivery").addEventListener("change", () => {
  document.querySelectorAll('[name="party-details"]').forEach((entry) => {
    entry.disabled = false;
  });
});
