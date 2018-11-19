const $ = require('jquery');

function textNotification(text, duration, color) {
    duration = duration || 4;
    color = color || '#2ecc71';

    // Limit display duration to 30 seconds
    duration = (duration > 30) ? 30 : duration;

    $('body').append(
      `<div
          class="notification"
          style="
              background-color: ${color};
              animation-duration: ${duration}s;
      ">${text}</div>`
  );

    const notificationElement = $('.notification').last();
    setTimeout(() => {
        notificationElement.remove();
    }, duration * 1000);
}

module.exports = textNotification;
