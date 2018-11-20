const $ = require('jquery');
const io = require('socket.io-client')
const parseDuration = require('parse-duration')

const textNotification = require('./notification/text');
const playAudio = require('./notification/audio');
const fixLayout = require('./layout-fix');
const counteractImageRetention = require('./counteractImageRetention');
const SnowAnimation = require('./animations/snow');
const AnimationManager = require('./animations/animationManager')

// Inline CSS via webpack
require('./style.css');

function init() {
    // Fix viewport
    fixLayout();
    counteractImageRetention();
    let animationManager = new AnimationManager();

    const socket = io(window.pickware_automation_url)
    socket.on('authenticate', () => {
        console.log('')
        socket.emit('authentication', {
            user: window.pickware_automation_user,
            password: window.pickware_automation_password,
        });
    });

    socket.on('dashboard/notification/audio', (audioUrl) => {
        playAudio(audioUrl);
    });

    socket.on('dashboard/notification/text', (payload) => {
        textNotification(payload.message, payload.duration, payload.color)
    });

    socket.on('dashboard/animation/stop', (payload) => {
        animationManager.stop();
    });

    socket.on('dashboard/animation/snow', (payload) => {
        animationManager.runAnimation(
            new SnowAnimation(payload.items, payload.count, payload.colors, payload.emitProbability),
            payload.duration ? parseDuration(payload.duration) : undefined
        );
    });

    socket.on('dashboard/reload', () => {
        window.location.reload(true);
    });

    textNotification('Extensions loaded', 1.25);
}

if (document.readyState == "complete") {
    init()
} else {
    document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
            init();
        }
    })
}
