class AnimationManager {
    constructor() {
        this.currentAnimation = null;
    }

    runAnimation(animation, duration) {
        this.stop();
        this.currentAnimation = animation;

        animation.animate();

        // Stop animation after given interval
        if (duration && !isNaN(duration)) {
            setTimeout(() => {
                this.currentAnimation.stop()
            }, duration);
        }
    }

    stop() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }

        this.currentAnimation = null;
    }
}

module.exports = AnimationManager;
