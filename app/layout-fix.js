module.exports = function fixLayout() {
      document.getElementById('dashboard-wrapper').style.marginTop = '52px';
      document.getElementById('dashboard-wrapper').style.transform = 'scale(1.13)';
      document.getElementById('dashboard-overlay-container').style.bottom = '0';
      document.getElementById('dashboard-resizable-container').style.bottom = '0';
      document.getElementsByClassName('dashboard-footer')[0].remove();
}
