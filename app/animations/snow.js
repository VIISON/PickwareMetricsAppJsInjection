const $ = require('jquery');
require('./snow.css');

class Flake {
    constructor(element, animation) {
        this.animation = animation;
        this.element = element;
        this.minSpeed = 0.3;
        this.maxSpeed = 1.5;
        this.maxMovement = 80;
        this.markedForRemoval = false;
        this.readyForReuse = true;
        this.fontSize = '3em';
        this.shuffleConfig();
    }

    shuffleConfig() {
        let minScale = 0.25;
        // only scale down
        this.scale = minScale + (Math.random() * (1-minScale));
        this.speed = Math.random() * (this.maxSpeed-this.minSpeed) * this.scale + this.minSpeed;
        this.xOffset = window.innerWidth*Math.random();
        this.xFactor = this.maxMovement*Math.random();
        this.maxRotation=-0.5*this.maxMovement+Math.random()*this.maxMovement;
        this.color = this.animation.colors[Math.floor(Math.random()*this.animation.colors.length)]

        // Stack them by size, smaller items are in the background
        this.zIndex = 2000000 - Math.floor((2-this.scale) * 10);
        this.yOffset = -100;
        this.y = 0;
        this.x = this.xOffset;
        this.rotation = 0;
    }

    prepareForReuse() {
        this.element.style.opacity = 0;
        this.shuffleConfig()
        this.readyForReuse = true;
    }

    isInView() {
        return !(this.y > window.innerHeight)
    }

    animate(now) {
        if (this.readyForReuse) {
            this.spawnTime = now;
        }

        const secondsAlive = (now - this.spawnTime)/1000
        const sin = Math.sin(secondsAlive/7);
        this.x = Math.round((this.xOffset + sin * this.xFactor) * 4) / 4;
        this.y = Math.round((this.yOffset + secondsAlive * 30 * this.speed) * 4) / 4;
        this.rotation = Math.round(this.maxRotation*sin * 4)/4;

        this.updatePosition();

        if (this.readyForReuse) {
            this.show();
            this.readyForReuse = false;
        }
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotateZ(${this.rotation}deg) scale(${this.scale})`;
    }

    show() {
        this.element.style.fontSize = this.fontSize;
        this.element.style.color = this.color;
        this.element.style.opacity = 1;
        this.element.style.zIndex = this.zIndex;
    }
}

class LetterSnow {
    constructor(words, maxFlakes, colors, emitProbability) {
        this.words = words;
        this.flakePool = [];
        this.flakes = [];
        this.flakeCount = 80;
        this.emitProbability = Math.min(0.20, emitProbability || 0.05);
        this.remainingFlakes = maxFlakes || Infinity;
        this.colors = colors || ['#fff']

    }

    animate() {
        let deletions = []
        const now = new Date().getTime()

        this.flakes.forEach( (flake, idx) => {
            flake.animate(now);
            if (!flake.isInView()) {
                flake.prepareForReuse()
                deletions.push(idx)
            }
        })

        deletions.forEach((idx) => {
            delete this.flakes[idx]
        })

        this.respawnMissingFlakes();
    }

    animationHasEnded() {
        return !(this.remainingFlakes > 0 || this.flakes.length > 0);
    }

    animationDidFinish() {
        let domElements = this.flakePool.map((flake) => flake.element);
        $(domElements).remove();
    }

    init() {
        let poolSize = this.calculatePoolSize();
        this.flakePool = this.createFlakePool(poolSize);
    }

    // Add as many flakes as ever needed and pool them to avoid unnecessary re-layouting
    createFlakePool(poolSize) {
      let poolHtml = Array.apply(undefined, Array(poolSize))
          .map(() => {
              let randomWord = this.words[Math.floor(Math.random()*this.words.length)]
              return `<div class="snowFlakeAnimationSnowFlake">${randomWord}</div>`
          })
          .join('')


      $('body').append(`<div class="snowflakeConatiner">${poolHtml}</div>`)

      return $('.snowFlakeAnimationSnowFlake')
          .toArray()
          .slice(-poolSize)
          .map((domFlake) => new Flake(domFlake, this))
    }

    calculatePoolSize() {
        let defaultFlake = new Flake(undefined, this);
        let averageSpeed = (defaultFlake.minSpeed + defaultFlake.maxSpeed) / 2; // pixels per frame @ 60fps (ca. 16.66ms)
        let averageLifetimeInFrames = window.innerHeight / averageSpeed; // How many frames an average item is visible
        let expectedAmountOfItemsOnScreen = averageLifetimeInFrames * this.emitProbability;

        // Add 30% reserve
        return Math.floor(expectedAmountOfItemsOnScreen * 1.3);
    }

    spawnFlake() {
        if (this.remainingFlakes <= 0) {
            return
        }

        let flake = this.flakePool.find((flake) => flake.readyForReuse)
        if (flake) {
            this.flakes.push(flake)
            this.remainingFlakes -= 1;
        }
    }

    stop() {
        this.remainingFlakes = 0;
    }

    respawnMissingFlakes() {
        if (Math.random() < this.emitProbability) {
            this.spawnFlake();
        }
    }
}

module.exports = LetterSnow;
