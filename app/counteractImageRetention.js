function randomPos() {
  return [Math.floor(Math.random()*maxDelta)-Math.floor(maxDelta/2), Math.floor(Math.random()*maxDelta)-Math.floor(maxDelta/2)];
}

// amount of movement in each direction
let maxDelta = 16;
let currentPos = [0, 0];
let targetPos = randomPos();

function moveDirection(target, current) {
  let delta = target - current
  if (delta > 0) {
    return 1;
  } else if (delta < 0) {
    return -1;
  }

  return 0
}

function moveOneToTarget() {
  let dirX = moveDirection(targetPos[0], currentPos[0]);
  let dirY = moveDirection(targetPos[1], currentPos[1]);

  currentPos = [currentPos[0]+dirX, currentPos[1]+dirY]

  const element = document.getElementById('dashboard-wrapper');
  if (element) {
      element.style.left = `${currentPos[0]}px`;
      element.style.top = `${currentPos[1]}px`;
  }
}

function counteractImageRetention() {
  if (currentPos[0] === targetPos[0] && currentPos[1] === targetPos[1]) {
    targetPos = randomPos();
  }
  moveOneToTarget();

  let oneMinute = 1000 * 60;
  setTimeout(() => counteractImageRetention(), oneMinute);
}

module.exports = counteractImageRetention;
