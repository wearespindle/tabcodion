# Tabcordions
A multi-tab plugin with minimal dependencies.
On small devices it switches to accordion mode. Loaded as Jquery plugin, if Jquery
is included.

## Why?
* Minimal dependencies: 2.6kb minified/gzipped (including [query-string](https://www.npmjs.com/package/query-string))
* Integrates well with npm/browserify
* Navigable without javascript enabled
* Radio/checkbox gives better focus control over anchor approach
* Tested with IE>=9, Chrome, Firefox and Safari


## Checkout minimal example
    git clone https://github.com/wearespindle/tabcordions
    cd tabcordions
    npm install
    # Requires browserify/watchify installed globally.
    npm run build
    cd example
    # Serve files
    python2 -m SimpleHTTPServer
    # Point the browser to localhost:8000


## Usage in projects
    npm install git+https://github.com/wearespindle/tabcordions --save
    # In your project files, include the plugin. Make sure you have Babel and
    # Browserify in your (gulp) build workflow. See example/index.html for
    # the required html layout.
    const Tabs = require('tabcordions');

    window.onload = function() {
        # Without jquery
        document.querySelectorAll('.tabs').forEach(function(tabElement, i) {
            new Tabs({container: tabElement, tabsindex: i});
        });
        # With jquery
        $('.tabs').tabs();
    }



## Options
* container {element} - This is the element containing the tabs class.
* breakpoint {Number} - The screen width at which tabcordions switch between accordions and tabs.
* tabsindex {String} - Used to keep track of tabs state.

## Bugs?
File an issue and we will look into it!
