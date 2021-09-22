
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noLoop();
}

function draw() {
  background(25);

  // Get data. Sort by ID. Limit to 1000 results to get all rows (ca. 930)
  /* 
  Example object:
  {
    "_id": 1
    "REPORT_ID":158505,
    "TIMESTAMP":"2020-05-21T10:20:00",
    "status":"OK",
    "avgMeasuredTime":118,
    "medianMeasuredTime":118,
    "vehicleCount":1,
    "avgSpeed":63
  }
  *
  */
  fetch("https://admin.opendata.dk/api/3/action/datastore_search?resource_id=b3eeb0ff-c8a8-4824-99d6-e0a3747c8b0d&sort=_id+asc&limit=1000")
    .then(response => response.json())
    .then(data => {
      var data = data.result.records;

      var grid = createGrid(data.length, windowWidth, windowHeight);

      var i = 0;
      data.forEach(entry => {
        let x = grid[i].x;
        let y = grid[i].y;
        let size = entry.vehicleCount * 1.2;
        const opacity = 255 * 0.9;

        if (entry.avgSpeed < 50) {
          // Blue
          fill(14, 48, 99, opacity);
        } else if (entry.avgSpeed < 100) {
          //Red
          fill(149, 10, 29, opacity);
        } else {
          //Yellow
          fill(156, 151, 11, opacity);
        }

        noStroke();
        ellipse(x, y, size, size);

        i++;
      });
    });
}

function mousePressed(e) {
  if (e.target.innerText === "info") {
    const MDCDialog = mdc.dialog.MDCDialog;
    const dialog = new MDCDialog(document.querySelector(".mdc-dialog"));
    dialog.open();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createGrid(datalength, windowWidth, windowHeight) {
  let gridArray = [];

  const height = Math.sqrt((datalength * windowHeight) / windowWidth);
  const width = datalength / height;

  const stepsWidth = windowWidth / width;
  const stepsHeight = windowHeight / height;

  const startX = stepsWidth / 2;
  const startY = stepsWidth / 2;

  let x = startX;
  let y = startY;

  for (let i = 0; i < datalength; i++) {
    var position = { x: 0, y: 0 };

    x = i == 0 ? x : x + stepsWidth;

    if (x >= windowWidth) {
      x = startX;
      y = y + stepsHeight;
    }

    position.x = x;
    position.y = y;

    gridArray.push(position);
  }

  return gridArray;
}

function openFullscreen() {
  var elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}
