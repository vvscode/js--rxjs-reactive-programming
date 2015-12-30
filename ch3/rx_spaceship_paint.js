function paintStars(stars) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(function(star) {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function drawTriangle(x, y, width, color, direction) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width, y);
  ctx.lineTo(x, direction === 'up' ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width, y);
  ctx.fill();
}

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, '#ff0000', 'up');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function paintEnemies(enemies) {
  enemies.forEach(function(enemy) {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    if (!enemy.isDead) {
      drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
    }

    enemy.shots.forEach(function(shot) {
      shot.y += SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
    });
  });
}

var SHOOTING_SPEED = 15;
function paintHeroShots(heroShots, enemies) {
  enemies = enemies || [];
  heroShots.forEach(function(shot, i) {
    for (var l = 0; l < enemies.length; l++) {
      var enemy = enemies[l];
      if (!enemy.isDead && collision(shot, enemy)) {
        enemy.isDead = true;
        shot.x = shot.y = -100;
        break;
      }
    }
    shot.y -= SHOOTING_SPEED;
    drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
  });
}

function renderScene(actors) {
  console.debug('renderScene');
  paintStars(actors.stars);
  paintEnemies(actors.enemies);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintHeroShots(actors.heroShots, actors.enemies);
  //paintScore(actors.score); // sadly , but can't run with score
}

function isVisible(obj) {
  return obj.x > -40 && obj.x < canvas.width + 40 &&
    obj.y > -40 && obj.y < canvas.height + 40;
}

function collision(target1, target2) {
  return (target1.x > target2.x - 20 && target1.x < target2.x + 20) &&
    (target1.y > target2.y - 20 && target1.y < target2.y + 20);
}

function gameOver(ship, enemies) {
  return enemies.some(function(enemy) {
    if (collision(ship, enemy)) {
      return true;
    }
    return enemy.shots.some(function(shot) {
      return collision(ship, shot);
    });
  });
}

function paintScore(score) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Score: ' + score, 40, 43);
}