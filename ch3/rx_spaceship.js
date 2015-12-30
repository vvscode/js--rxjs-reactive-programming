var canvas = document.createElement('canvas');
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var SPEED = 40;
var STAR_NUMBER = 250;
var StarStream = Rx.Observable.range(1, STAR_NUMBER)
  .map(function() {
    return {
      x: parseInt(Math.random() * canvas.width),
      y: parseInt(Math.random() * canvas.height),
      size: Math.random() * 3 + 1
    };
  })
  .toArray()
  .flatMap(function(starArray) {
    return Rx.Observable.interval(SPEED).map(function() {
      starArray.forEach(function(star) {
        if (star.y >= canvas.height) {
          star.y = 0; // Reset star to top of the screen
        }
        star.y += 3; // Move star
      });
      return starArray;
    });
  });

var ENEMY_FREQ = 1500;
var Enemies = Rx.Observable.interval(ENEMY_FREQ)
  .scan(function(enemyArray) {
    var enemy = {
      x: parseInt(Math.random() * canvas.width),
      y: -30,
    };
    enemyArray.push(enemy);
    return enemyArray;
  }, []);

var HERO_Y = canvas.height - 30;
var mouseMove = Rx.Observable.fromEvent(canvas, 'mousemove');
var SpaceShip = mouseMove
  .map(function(event) {
    return {
      x: event.clientX,
      y: HERO_Y
    };
  })
  .startWith({
    x: canvas.width / 2,
    y: HERO_Y
  });

var playerFiring = Rx.Observable
  .merge(
    Rx.Observable.fromEvent(canvas, 'click'),
    Rx.Observable.fromEvent(canvas, 'keydown')
      .filter(function(evt) {
        return evt.keycode === 32;
      })
  )
  .sample(200)
  .timestamp();

var HeroShots = Rx.Observable
  .combineLatest(
    playerFiring,
    SpaceShip,
    function(shotEvents, spaceShip) {
      return {
        timestamp: shotEvents.timestamp,
        x: spaceShip.x
      };
    })
  .distinctUntilChanged(function(shot) {
    return shot.timestamp;
  })
  .scan(function(shotArray, shot) {
    shotArray.push({ x: shot.x, y: HERO_Y });
    return shotArray;
  }, []);

var ENEMY_FREQ = 1500;
var ENEMY_SHOOTING_FREQ = 750;
var Enemies = Rx.Observable.interval(ENEMY_FREQ)
  .scan(function(enemyArray) {
    var enemy = {
      x: parseInt(Math.random() * canvas.width),
      y: -30,
      shots: []
    };
    Rx.Observable.interval(ENEMY_SHOOTING_FREQ).subscribe(function() {
      if (!enemy.isDead) {
        enemy.shots.push({ x: enemy.x, y: enemy.y });
      }
      enemy.shots = enemy.shots.filter(isVisible);
    });
    enemyArray.push(enemy);
    return enemyArray
      .filter(isVisible)
      .filter(function(enemy) {
        return !(enemy.isDead && enemy.shots.length === 0);
      });
  }, []);

var ScoreSubject = new Rx.Subject();
var score = ScoreSubject.scan(function (prev, cur) {
    return prev + cur;
  }, 0)
  .concat(Rx.Observable.return(0));

Rx.Observable.combineLatest(
  StarStream, SpaceShip, Enemies, HeroShots,
  function(stars, spaceship, enemies, heroShots) {
    return {
      stars: stars,
      spaceship: spaceship,
      enemies: enemies,
      heroShots: heroShots
    };
  })
  .sample(SPEED)
  .takeWhile(function(actors) {
    return gameOver(actors.spaceship, actors.enemies) === false;
  })
  .subscribe(renderScene);