const $ = require('jquery');
const io = require('socket.io-client')
const textNotification = require('./notification/text');
const playAudio = require('./notification/audio');
const fixLayout = require('./layout-fix');
const counteractImageRetention = require('./counteractImageRetention');

// Inline CSS via webpack
require('./style.css');

function init() {
    // Fix viewport
    fixLayout();
    counteractImageRetention();

    const socket = io(window.pickware_automation_url)
    socket.on('authenticate', () => {
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
