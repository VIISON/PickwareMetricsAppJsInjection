const $ = require('jquery');
require('./snow.css');

class Flake {
    constructor(element, animation) {
        this.animation = animation;
        this.element = element;
        this.minSpeed = 0.3;
        this.maxSpeed = 1.5;
        this.maxMovement = 80;
        this.maxFullSines = 10;
        this.markedForRemoval = false;
        this.shuffleConfig();
    }

    markForRemoval() {
        $(this.element).remove()
        this.markedForRemoval = true;
    }

    shuffleConfig() {
        this.fullSineMultiplier = Math.random()*this.maxFullSines;
        this.element.style.fontSize = 0.5+Math.random()*2+'em';
        this.speed = Math.random()*(this.maxSpeed-this.minSpeed)+this.minSpeed;
        this.xOffset = window.innerWidth*Math.random();
        this.xFactor = this.maxMovement*Math.random();
        this.maxRotation=-0.5*this.maxMovement+Math.random()*this.maxMovement;
        this.color = this.animation.colors[Math.floor(Math.random()*this.animation.colors.length)]

        this.y = -50;
        this.x = this.xOffset;
        this.rotation = 0;
    }

    isInView() {
        return !(this.y > window.innerHeight)
    }

    animate() {
        let sin = Math.sin(this.y/window.innerHeight*this.fullSineMultiplier);
        this.x = this.xOffset+sin*this.xFactor;
        this.y += this.speed;
        this.rotation = this.maxRotation*sin;

        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }

    show() {
        this.element.style.color = this.color;
        this.element.style.display = 'block';
    }
}

class LetterSnow {
    constructor(words, maxFlakes, colors, emitProbability) {
        this.words = words;
        this.flakes = [];
        this.flakeCount = 80;
        this.emitProbability = emitProbability || 0.05;
        this.remainingFlakes = maxFlakes || Infinity;
        this.colors = colors || ['#fff']
    }

    animate() {
        this.flakes.map( (flake) => {
            flake.animate();
            if (!flake.isInView()) {
                flake.markForRemoval()
            }
        })
        this.flakes = this.flakes.filter((flake) => !flake.markedForRemoval)
        this.respawnMissingFlakes();

        if (this.remainingFlakes > 0 || this.flakes.length > 0) {
            window.requestAnimationFrame(() => {
              this.animate();
            });
        }
    }

    spawnFlake() {
        if (this.remainingFlakes <= 0) {
            return
        }

        let word = this.words[Math.floor(Math.random()*this.words.length)]
        $("body").append(`<div class="snowFlakeAnimationSnowFlake">${word}</div>`);

        let newestFlake = $('.snowFlakeAnimationSnowFlake').last().get()[0];
        let flake = new Flake(newestFlake, this)
        flake.updatePosition();
        flake.show();
        this.flakes.push(flake)

        this.remainingFlakes -= 1;
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
