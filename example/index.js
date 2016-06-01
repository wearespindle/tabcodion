const Tabcordions = require('../index');

window.onload = function() {
    document.querySelectorAll('.tabcordions').forEach(function(tabElement, i) {
        new Tabcordions({container: tabElement, tabsindex: i});
    });
}
