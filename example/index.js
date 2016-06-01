const Tabs = require('../index');

window.onload = function() {
    document.querySelectorAll('.tabs').forEach(function(tabElement, i) {
        new Tabs({container: tabElement, tabsindex: i});
    });
}
