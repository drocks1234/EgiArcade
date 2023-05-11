// Game variables
let prestigeBonusMultiplier = 1;
let money = 0;
let moneyPerClick = 1;
let moneyPerSecond = 0;
let upgradeCost = 10;
let upgradeMultiplier = 1.15;
let CostMultiplier = 2;
let passiveUpgradeCost = 25;
let passiveUpgradeMultiplier = 1.5;
let prestigePoints = 0;
let prestigeCost = 1000000;


// Business information
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
    name: "IceCream Truck",
    cost: 500,
    initialCost: 500,
    income: 50,
    quantity: 0,
  },
  {
    name: "Coffee Shop",
    cost: 1000,
    initialCost: 1000,
    income: 100,
    quantity: 0,
  },
  {
    name: "Fast Food Chain",
    cost: 5000,
    initialCost: 5000,
    income: 250,
    quantity: 0,
  },
  {
    name: "Movie Theater",
    cost: 15000,
    initialCost: 15000,
    income: 750,
    quantity: 0,
  },
  {
    name: "Shopping Mall",
    cost: 50000,
    initialCost: 50000,
    income: 2000,
    quantity: 0,
  },
  {
    name: "Supermarket",
    cost: 100000,
    initialCost: 100000,
    income: 4000,
    quantity: 0,
  },
  {
    name: "Hotel Chain",
    cost: 500000,
    initialCost: 500000,
    income: 10000,
    quantity: 0,
  },
  {
    name: "Airline",
    cost: 1000000,
    initialCost: 1000000,
    income: 20000,
    quantity: 0,
  },
  {
    name: "Cruise Line",
    cost: 5000000,
    initialCost: 5000000,
    income: 50000,
    quantity: 0,
  }
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

let researches = [
  {
    name: "Efficient Operations",
    description: "Increase income from all businesses by 10%.",
    cost: 500,
    timeToComplete: 60, // 60 seconds
    progress: 0, // Progress towards completion (0 to 100)
    completed: false,
    applyEffect: () => businesses.forEach((business) => business.income *= 1.1),
  },
  {
    name: "Marketing Campaign",
    description: "Increase income from clicks by 20%.",
    cost: 500,
    timeToComplete: 30, // 30 seconds
    progress: 0, // Progress towards completion (0 to 100)
    completed: false,
    applyEffect: () => moneyPerClick *= 1.2,
  },
  {
    name: "Eco-Friendly Packaging",
    description: "Reduce costs of all businesses by 5%.",
    cost: 750,
    timeToComplete: 120, // 120 seconds
    progress: 0, // Progress towards completion (0 to 100)
    completed: false,
    applyEffect: () => businesses.forEach((business) => business.cost *= 0.95),
  },
  {
    name: "Innovative Marketing",
    description: "Increase income from clicks by 30%.",
    cost: 750,
    timeToComplete: 60, // 60 seconds
    progress: 0, // Progress towards completion (0 to 100)
    completed: false,
    applyEffect: () => moneyPerClick *= 1.3,
  },
  {
    name: "Workforce Training",
    description: "Increase passive income by 10%.",
    cost: 1500,
    timeToComplete: 90, // 90 seconds
    progress: 0, // Progress towards completion (0 to 100)
    completed: false,
    applyEffect: () => moneyPerSecond *= 1.1,
  },
  {
    name: "Supply Chain Optimization",
    description: "Reduce cost of future business upgrades by 5%.",
    cost: 2000,
    timeToComplete: 180, // 180 seconds
    progress: 0, // Progress towards completion (0 to 100)
    completed: false,
    applyEffect: () => CostMultiplier *= 0.95,
  }
  
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
let researchButtons = [];

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

  let researchContainer = select('#researchContainer')
  researches.forEach((research, index) => {
    const button = createButton(`Start ${research.name} ($${research.cost})`);
    button.mousePressed(() => startResearch(index));
    let div = createDiv().parent(researchContainer);
    div.addClass("col-lg-2 col-md-4 col-sm-6"); 
    button.parent(div);
    researchButtons.push(button);
  });

  let businessContainer = select('#businessContainer');
  businesses.forEach((business, index) => {
    const button = createButton(`Buy ${business.name} ($${business.cost})`);
    button.mousePressed(() => buyBusiness(index));
    let div = createDiv().parent(businessContainer);
    div.addClass("col-lg-2 col-md-4 col-sm-6"); 
    button.parent(div);
    button.addClass("my-button"); // Add class
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
  prestigeButton.html(`Prestige ($${prestigeCost}) - Prestige Points: ${prestigePoints}`);
  businessButtons.forEach((button, index) => {
    button.html(
      `${businesses[index].name} ($${businesses[index].cost.toFixed(
        2
      )}) - Owned: ${businesses[index].quantity}`
    );
  });

  researches.forEach((research) => {
    // If research is in progress and not completed
    if (research.progress > 0 && research.progress < 100) {
      // Increase progress based on time and research duration
      research.progress += (deltaTime / 1000) * (100 / research.timeToComplete);

      // Check if research is completed
      if (research.progress >= 100) {
        research.progress = 100;
        research.completed = true;
        research.applyEffect();
        showAlertPopup(`${research.name} completed!`);
      }
    }
  });

  // Update research buttons text
  researchButtons.forEach((button, index) => {
    button.html(
      `Start ${researches[index].name} ($${researches[index].cost.toFixed(2)}) - Progress: ${researches[index].progress.toFixed(2)}%`
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
    businesses[index].cost *= 1 + (CostMultiplier - 1) / 2;
  } else {
    showAlertPopup("You don't have enough money to buy this business!");
  }
}

function startResearch(index) {
  const research = researches[index];

  // Check if player has enough money and the research is not already completed or in progress
  if (money < research.cost || research.progress > 0 || research.completed) {
    showAlertPopup("You can't start this research!");
  } else {
    money -= research.cost;
    research.progress = 0.01; // Start research
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
    upgradeCost *= CostMultiplier;
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
  if (money >= prestigeCost) {
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
  } else {
    showAlertPopup("You don't have enough money to prestige!");
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
