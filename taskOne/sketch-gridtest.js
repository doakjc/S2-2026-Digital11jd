//API link for seneye data
const API_URL = "https://seneye-proxy.ezankov.workers.dev/";

// When set to true, will call false data from sample-data.json
const USE_OFFLINE_MOCK = false;

let aquariumData = null;
let lastUpdated = "";

function preload() {
  // Load initial data before setup() runs
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : API_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
  fish = loadImage("images/fish.png");
}

function setup() {
  let practicalWidth = displayWidth*0.95;
  let practicalHeight = displayHeight*0.8;
  createCanvas(practicalWidth, practicalHeight)
  
  // Refresh live data every 5 minutes (300,000 ms)
  if (!USE_OFFLINE_MOCK) {
    setInterval(() => {
      loadJSON(API_URL, onDataLoaded, onError);
    }, 300000);
  }
}

function onDataLoaded(data) {
  aquariumData = data;
  lastUpdated = new Date().toLocaleTimeString();
  console.log("Data refreshed successfully:", data);
}

function onError(err) {
  console.error("Failed to load aquarium data. Check proxy URL or network.", err);
}

function draw() {
  background(40, 195, 245); // Dark blue aquarium background

  // 1. Draw Title Header
  // fill(255);
  // textSize(24);
  // textAlign(LEFT, TOP);
  // text("Fish Environment Dashboard", 30, 30);

  let practicalWidth = displayWidth*0.95;
  let practicalHeight = displayHeight*0.8;
  drawMainText(practicalWidth*0.05, practicalHeight*0.05, "PEDARE AQUAPONICS DASHBOARD");

  // Display connection status
  textSize(12);
  fill(0, 0, 0);
  text("Last updated: " + (lastUpdated || "Loading..."), practicalWidth*0.5, practicalHeight*0.05);

  // 2. Render Dashboard Graphics
  if (aquariumData) {
    let practicalWidth = displayWidth*0.95;
    let practicalHeight = displayHeight*0.8;

    // NOTE: Update these keys based on your actual Seneye JSON response structure!
    // Example fields commonly found in sensor data:
    let temp = aquariumData[0].exps.temperature.curr;
    let tempStatus = aquariumData[0].exps.temperature.status;
    let ph = aquariumData[0].exps.ph.curr;
    let phStatus = aquariumData[0].exps.ph.status;
    let nh3 = aquariumData[0].exps.nh3.curr;
    let nh3Status = aquariumData[0].exps.nh3.status;
    let o2 = aquariumData[0].exps.o2.curr;
    let o2Status = aquariumData[0].exps.o2.status;

    console.log(tempStatus);

    drawTempWidget(practicalWidth*0.05, practicalHeight*0.5, temp, tempStatus);
    drawGaugeWidget(practicalWidth*0.28, practicalHeight*0.5, "pH Level", ph, 6.0, 8.5, phStatus);
//     if (ph > 8) {
//       textSize(16);
//       fill('red');
//       text("This will surely affect the trout population", 300, 80);
// }
    drawGaugeWidget(practicalWidth*0.53, practicalHeight*0.5, "Ammonia (NH3)", nh3, 0.0, 0.05, nh3Status);
    drawGaugeWidget(practicalWidth*0.76, practicalHeight*0.5, "Oxygen (O2)", o2, 0.0, 0.05, o2Status);

    drawFish(practicalWidth*0.8, practicalHeight*0.25)

  } else {
    // Loading State
    fill(255, 100, 100);
    textSize(18);
    text("Connecting to sensor stream...", 30, 120);
  }
}

// Example Widget Function: Temperature Card
function drawTempWidget(x, y, tempVal, status) {
  let practicalWidth = displayWidth*0.95;
  let practicalHeight = displayHeight*0.8;
  // Background Card
  fill(43, 124, 199);
  strokeWeight(3);
  stroke(0, 0, 0);
  rect(x, y, practicalWidth*0.25*0.8, practicalHeight*0.25*0.8, 10);

  // Label
  noStroke();
  fill(0, 0, 0);
  textSize(18);
  text("Water Temp", x + practicalWidth*0.01875, y + practicalHeight*0.03);

  // Value Display
  fill(0, 0, 0);
  textSize(36);
  text(tempVal + "°C", x + practicalWidth*0.01875, y + practicalHeight*0.1);

  if (status == 1 ) {
    fill("red");
    textSize(36);
    text("Warning", x + practicalWidth *0.04, y + practicalHeight *0.15);  

  }
}

// Example Widget Function: Simple Bar Gauge
function drawGaugeWidget(x, y, label, val, minVal, maxVal, status) {
  let practicalWidth = displayWidth*0.95;
  let practicalHeight = displayHeight*0.8;
  fill(43, 124, 199);
  strokeWeight(3);
  stroke(0, 0, 0);
  rect(x, y, practicalWidth*0.25*0.8, practicalHeight*0.25*0.8, 10);

  noStroke();
  fill(0, 0, 0);
  textSize(18);
  text(label, x + practicalWidth*0.01875, y + practicalHeight*0.03);

  fill(0, 0, 0);
  textSize(28);
  text(val, x + practicalWidth*0.01875, y + practicalHeight*0.1);

  if (status == 1 ) {
    fill("red");
    textSize(36);
    text("Warning", x + practicalWidth *0.04, y + practicalHeight *0.15);  

  }
}

function drawMainText(x,y, label) {
  let practicalWidth = displayWidth*0.95;
  let practicalHeight = displayHeight*0.8;
  colorMode(HSB, 360, 100, 100);
  let currentHue = (frameCount * 2) % 360;
  fill(currentHue, 100, 100);
  colorMode(RGB)
  strokeWeight(3);
  stroke(0, 0, 0);
  rect(x, y, practicalWidth*0.5*0.8, practicalHeight*0.25*0.8, 10);

  noStroke();
  fill(0, 0, 0);
  textSize();
  text(label, x + practicalWidth*0.01875, y + practicalHeight*0.1);

}

function drawSummary(x,y, label) {
  let practicalWidth = displayWidth*0.95;
  let practicalHeight = displayHeight*0.8;
  fill(255, 0, 0);
  strokeWeight(3);
  stroke(0, 0, 0);
  rect(x, y, practicalWidth*0.5*0.8, practicalHeight*0.25*0.8, 10);

  noStroke();
  fill(0, 0, 0);
  textSize(18);
  text(label, x + practicalWidth*0.01875, y + practicalHeight*0.03);

}

function drawFish(x,y) {

  push();
  imageMode(CENTER);
  let angle = frameCount * 0.01;
  translate(x,y)
  rotate(angle);
  translate(-x,-y)
  image(fish, x, y, 500, 500)
  pop();
}