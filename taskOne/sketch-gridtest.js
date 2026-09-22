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
  onefish = loadImage("images/onefish.png");
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
  background(40, 195, 245); 

  let practicalWidth = displayWidth*0.95;
  let practicalHeight = displayHeight*0.8;
  drawMainText(practicalWidth*0.05, practicalHeight*0.05, "PEDARE AQUAPONICS DASHBOARD");

  // Display connection status
  textSize(12);
  fill(0, 0, 0);
  text("Last updated: " + (lastUpdated || "Loading..."), practicalWidth*0.5, practicalHeight*0.05);

  if (aquariumData) {
    let practicalWidth = displayWidth*0.95;
    let practicalHeight = displayHeight*0.8;

    let temp = aquariumData[0].exps.temperature.curr;
    let tempStatus = aquariumData[0].exps.temperature.status;
    let tempAvg = aquariumData[0].exps.temperature.avg;

    let ph = aquariumData[0].exps.ph.curr;
    let phStatus = aquariumData[0].exps.ph.status;
    let phAvg = aquariumData[0].exps.ph.avg;
    console.log(ph);
    console.log(phAvg)

    let nh3 = aquariumData[0].exps.nh3.curr;
    let nh3Status = aquariumData[0].exps.nh3.status;
    let nh3Avg = aquariumData[0].exps.nh3.avg;

    let o2 = aquariumData[0].exps.o2.curr;
    let o2Status = aquariumData[0].exps.o2.status;
    let o2Avg = aquariumData[0].exps.o2.avg;

    drawTempWidget(practicalWidth*0.05, practicalHeight*0.5, temp, tempStatus, "Water Temperature");
    drawTempWidget(practicalWidth*0.05, practicalHeight*0.75, temp, tempAvg, "Temperature Average");

    drawGaugeWidget(practicalWidth*0.28, practicalHeight*0.5, "pH Level", ph, 6.0, 8.5, phStatus);
    drawGaugeWidget(practicalWidth*0.28, practicalHeight*0.75, "pH Average", ph, 6.0, 8.5, phAvg);

    drawGaugeWidget(practicalWidth*0.53, practicalHeight*0.5, "Ammonia (NH3)", nh3, 0.0, 0.05, nh3Status);
    drawGaugeWidget(practicalWidth*0.53, practicalHeight*0.75, "Ammonia Average", nh3, 0.0, 0.05, nh3Avg);

    drawGaugeWidget(practicalWidth*0.76, practicalHeight*0.5, "Oxygen (O2)", o2, 0.0, 0.05, o2Status);
    drawGaugeWidget(practicalWidth*0.76, practicalHeight*0.75, "Oxygen Average", o2, 0.0, 0.05, o2Avg);


    drawFish(practicalWidth*0.8, practicalHeight*0.25)

    drawFish2(0, practicalHeight*0.5)

  } else {
    // Loading State
    fill(255, 100, 100);
    textSize(18);
    text("Connecting to sensor stream...", 30, 120);
  }
}

function drawTempWidget(x, y, tempVal, status, label) {
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
  textSize(36);
  text(tempVal + "°C", x + practicalWidth*0.01875, y + practicalHeight *0.1);

  if (status == 1 ) {
    fill("red");
    textSize(36);
    text("Warning!", x + practicalWidth *0.04, y + practicalHeight *0.15);  

  }
}

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
    if (frameCount % 60 < 30) {
    fill("red");
    textSize(36);
    text("Warning!", x + practicalWidth *0.04, y + practicalHeight *0.15);  
    }
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

function drawFish2(x,y) {
  push();
  imageMode(CENTER);
  x = frameCount % (displayWidth*0.95);
  y = sin(frameCount/5)
  translate(x,y)
  image(onefish, x, ((y*2)+(displayHeight*0.5)), 500, 500)
  translate(-x,-y)
  pop();
}

