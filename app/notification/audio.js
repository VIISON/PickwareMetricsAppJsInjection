const $ = require('jquery');

function playAudio(url) {
    $('audio').remove();
    $('body').append(`<audio src='${url}' autoplay></audio>`);
}

module.exports = playAudio;
