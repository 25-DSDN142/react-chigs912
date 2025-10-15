let bgImage;
let particles = [];


function prepareInteraction() {
  bgImage = loadImage('images/background.png'); 
  
}


function drawInteraction(faces, hands) {
  // Draw background image
  if (bgImage) {
    blendMode(SOFT_LIGHT);
    image(bgImage, 0, 0, width, height);
    blendMode(BLEND);
  }

 
  // hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    if (showKeypoints) {
      drawPoints(hand);
      drawConnections(hand);
    }

    let indexFingerTipX = hand.index_finger_tip.x;
    let indexFingerTipY = hand.index_finger_tip.y;

    

    // Draw fingertip circle
    noStroke();
    fill(255, 255, 100, 200);
    ellipse(indexFingerTipX, indexFingerTipY, 30, 30);

    // particles at fingertip
    for (let j = 0; j < 2; j++) {
      particles.push({
        x: indexFingerTipX,
        y: indexFingerTipY,
        dx: random(-1.5, 1.5),
        dy: random(-2, -0.5),
        life: 40,
        col: color(random(150, 255), random(100, 255), random(255))
      });
    }
  }

  // Update/draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    noStroke();
    fill(red(p.col), green(p.col), blue(p.col), map(p.life, 0, 40, 0, 200));
    ellipse(p.x, p.y, map(p.life, 0, 40, 1, 10));
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }

  
  // face
  
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    if (showKeypoints) drawPoints(face);
  

    // Face center for halo
    let faceCenterX = face.faceOval.centerX;
    let faceCenterY = face.faceOval.centerY;

    let haloX = face.keypoints[10].x;
    let haloY = face.keypoints[10].y;

    // Smooth floating halo
    if (haloX === 0 && haloY === 0) {
      haloX = faceCenterX;
      haloY = faceCenterY - 150;
    } else {
      haloX = lerp(haloX, faceCenterX, 0.05);
      haloY = lerp(haloY, faceCenterY - 150, 0.05);
    }

    // Draw glowing halo
    noFill();
    stroke(255, 220, 0);
    strokeWeight(10);
    for (let j = 0; j < 5; j++) {
      ellipse(haloX, haloY - 150, 200 + j * 10, 60 + j * 5);
    }

   

    // drawPoints(face.leftEye);
    // drawPoints(face.rightEye);
    // drawPoints(face.lips);
  }
}

// support functions

function drawConnections(hand) {
  push();
  for (let j = 0; j < connections.length; j++) {
    let pointAIndex = connections[j][0];
    let pointBIndex = connections[j][1];
    let pointA = hand.keypoints[pointAIndex];
    let pointB = hand.keypoints[pointBIndex];
    stroke(255, 0, 0);
    strokeWeight(2);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }
  pop();
}

function drawPoints(feature) {
  push();
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 4);
  }
  pop();
}
