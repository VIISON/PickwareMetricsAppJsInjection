class AnimationManager {
    constructor() {
        this.currentAnimation = null;
        this.lastAnimationFrame = new Date().getTime();
        this.createDefaultAnimation = null
        this.waitBeforeRestart = 90;
        this.isDefaultAnimation = false;
    }

    setDefaultAnimation(callback, waitBeforeRestart) {
        this.createDefaultAnimation = callback;
        this.waitBeforeRestart = waitBeforeRestart || 0;

        this.launchDefaultAnimation();
    }

    launchDefaultAnimation() {
        if (!this.createDefaultAnimation) {
            return
        }

        setTimeout(() => {
            if (!this.currentAnimation) {
                let animation = this.createDefaultAnimation();
                this.runAnimation(animation);
                this.isDefaultAnimation = true;
                console.log("run default animation");

            }
        }, this.waitBeforeRestart)
    }

    runAnimation(animation, duration) {
        console.log("run animation");
        this.isDefaultAnimation = false;

        this.stop();
        this.currentAnimation = animation;

        animation.init();
        this.animate(animation);

        // Stop animation after given interval
        if (duration && !isNaN(duration)) {
            setTimeout(() => {
                if (animation == this.currentAnimation) {
                    this.stop();
                } else {
                    animation.stop()
                }
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
                if (animation == this.currentAnimation) {
                    this.stop();
                }
            }
        };

        animateFunction();
    }

    stop() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }

        this.currentAnimation = null;
        this.launchDefaultAnimation();
    }
}

module.exports = AnimationManager;
