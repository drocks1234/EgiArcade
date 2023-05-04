// Game variables
let prestigeBonusMultiplier = 1;
let money = 0;
let moneyPerClick = 1;
let moneyPerSecond = 0;
let upgradeCost = 10;
let upgradeMultiplier = 2;
let passiveUpgradeCost = 25;
let passiveUpgradeMultiplier = 1.5;
let prestigePoints = 0;

// Business information
let businesses = [
  {
    name: "Lemonade Stand",
    cost: 50,
    initialCost: 50,
    income: 5,
    quantity: 0,
  },
  {
    name: "Ice Cream Truck",
    cost: 500,
    initialCost: 500,
    income: 50,
    quantity: 0,
  },
];

// Achievements
let achievements = [
  {
    name: "First Upgrade",
    description: "Buy your first click upgrade.",
    condition: () => moneyPerClick > 1,
    unlocked: false,
  },
  {
    name: "Entrepreneur",
    description: "Own at least one of each business.",
    condition: () => businesses.every((business) => business.quantity > 0),
    unlocked: false,
  },
];

// UI elements
let clickButton;
let upgradeButton;
let passiveUpgradeButton;
let prestigeButton;
let prestigeText;
let moneyText;
let upgradeClickCostText;
let upgradePassiveIncomeCostText;
let incomeText;
let businessButtons = [];

// Click sound effect
const clickSound = new Audio('click.mp3');

// Setup function
function setup() {
  // UI elements setup
  clickButton = select('#clickButton');
  clickButton.mousePressed(addMoney);
  clickSound.volume = 0.2;

  upgradeButton = select('#upgradeButton');
  upgradeButton.mousePressed(upgradeClick);

  prestigeButton = select("#prestigeButton");
  prestigeButton.mousePressed(prestige);

  passiveUpgradeButton = select('#passiveUpgradeButton');
  passiveUpgradeButton.mousePressed(upgradePassiveIncome);

  moneyText = select('#moneyText');
  upgradeClickCostText = select('#upgradeClickCostText');
  upgradePassiveIncomeCostText = select('#upgradePassiveIncomeCostText');
  incomeText = select('#incomeText');
  prestigeText = select("#prestigeText");

  // Business buttons setup
  businesses.forEach((business, index) => {
    const button = createButton(`Buy ${business.name} ($${business.cost})`);
    button.mousePressed(() => buyBusiness(index));
    button.parent('businessContainer');
    businessButtons.push(button);
  });
}

// Draw function
function draw() {
  // Increment money by passive income
  money += moneyPerSecond * deltaTime / 1000;

  // Update UI text
  moneyText.html("Money: $" + money.toFixed(2));
  upgradeClickCostText.html("Upgrade click cost: $" + upgradeCost);
  upgradePassiveIncomeCostText.html("Upgrade passive income cost: $" + passiveUpgradeCost);
  incomeText.html("Income: $" + moneyPerSecond.toFixed(2) + "/sec");
  prestigeText.html(`Prestige Points: ${prestigePoints}`);

  // Update business buttons text
  businessButtons.forEach((button, index) => {
    button.html(
      `Buy ${businesses[index].name} ($${businesses[index].cost.toFixed(
        2
      )}) - Owned: ${businesses[index].quantity}`
    );
  });

  checkAchievements();
}

// Function definitions

function addMoney() {
  // Increment money by moneyPerClick * prestigeBonusMultiplier
  money += moneyPerClick * prestigeBonusMultiplier;

  // Play click sound effect
  clickSound.currentTime = 0;
  clickSound.play();
}

function buyBusiness(index) {
  // Check if player has enough money to buy business
  if (money >= businesses[index].cost) {
    money -= businesses[index].cost;
    businesses[index].quantity += 1;
    // Apply the prestige bonus multiplier to the income
    moneyPerSecond += businesses[index].income * prestigeBonusMultiplier;

    // Improve business upgrade cost calculation
    businesses[index].cost *= 1 + (upgradeMultiplier - 1) / 2;
  } else {
    showAlertPopup("You don't have enough money to buy this business!");
  }
}

function upgradePassiveIncome() {
  // Check if player has enough money to upgrade passive income
  if (money >= passiveUpgradeCost) {
    money -= passiveUpgradeCost;
    moneyPerSecond += 1;
    passiveUpgradeCost *= passiveUpgradeMultiplier;
  } else {
    showAlertPopup("You don't have enough money to upgrade passive income!");
  }
}

function upgradeClick() {
  // Check if player has enough money to upgrade
  if (money < upgradeCost) {
    showAlertPopup("You don't have enough money to upgrade!");
  } else {
    money -= upgradeCost;
    moneyPerClick *= upgradeMultiplier;
    upgradeCost *= upgradeMultiplier;
  }
}

function checkAchievements() {
  achievements.forEach((achievement, index) => {
    if (!achievement.unlocked && achievement.condition()) {
      achievement.unlocked = true;
      const div = createDiv(`${achievement.name} - ${achievement.description}`);
      div.parent("achievementContainer");
      div.addClass("achievement");

      // Fade out the div after the fadeIn animation duration (2s)
      setTimeout(() => {
        div.addClass("fadeOut");
      }, 2000);

      // Remove the div after the total animation duration (4s)
      setTimeout(() => {
        div.remove();
      }, 4000);
    }
  });
}

function prestige() {
  if (money >= 10000) {
    prestigePoints += 1;
    money = 0;
    moneyPerClick = 1;
    moneyPerSecond = 0;
    upgradeCost = 10;
    passiveUpgradeCost = 25;
    businesses.forEach((business) => {
      business.quantity = 0;
      business.cost = business.initialCost; // Reset the cost to its initial value
    });
    // Update the prestige bonus multiplier
    prestigeBonusMultiplier = 1 + (prestigePoints * 0.1); // Increase income by 10% for each prestige point
  }
}

function showAlertPopup(message) {
  var alertPopup = document.getElementById("alertPopup");
  var alertMessage = document.getElementById("alertMessage");
  alertMessage.innerHTML = message;
  alertPopup.style.display = "block";
  setTimeout(function () {
    alertPopup.style.display = "none";
  }, 3000);
}
