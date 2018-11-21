class AnimationManager {
    constructor() {
        this.currentAnimation = null;
        this.lastAnimationFrame = new Date().getTime();
    }

    runAnimation(animation, duration) {
        this.stop();
        this.currentAnimation = animation;

        animation.init();
        this.animate(animation);

        // Stop animation after given interval
        if (duration && !isNaN(duration)) {
            setTimeout(() => {
                this.currentAnimation.stop()
            }, duration);
        }
    }

    animate(animation) {
        let animateFunction = () => {
            if (!animation.animationHasEnded()) {
                window.requestAnimationFrame(() => {
                    animation.animate();
                    animateFunction();
                })
            } else {
                animation.animationDidFinish();
            }
        };

        animateFunction();
    }

    stop() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }

        this.currentAnimation = null;
    }
}

module.exports = AnimationManager;
