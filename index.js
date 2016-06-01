'use strict';

const queryString = require('query-string');

/**
 * Simulate basic Jquery selector usage without having to rely on jquery.
 * @param {element} parent - The element to start searching from.
 * @param {String} selector - A css selector.
 * @returns {element}
 */
function _$(parent, selector) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
}


class Tabs {

    /**
     * Tabs that act as accordions when the browser width is beneath the
     * breakpoint.
     * @param {element} container - The tabs element that contains the tabs class.
     * @param {Number} breakpoint - The width in pixels at which tabs becomee accordions.
     * @param {String} tabsindex - A unique id to identify this tabs instance within the location hash..
     */
    constructor({container, breakpoint = 480, tabsindex = 0} = {}) {
        this.container = container;
        this.mediaQueryList = window.matchMedia('(max-width: ' + breakpoint + 'px)');
        this.tabsindex = `tc${tabsindex}`;

        this.isIos = navigator.userAgent.match(/(iPod|iPhone|iPad)/) ? true : false;
        this.isAndroid = navigator.userAgent.match(/(Android)/) ? true : false;

        this.container.setAttribute('id', this.tabsindex);
        this.tabMode(this.mediaQueryList);

        // Listen for mediaquery changes and switch mode if necessary.
        this.mediaQueryList.addListener(this.tabMode.bind(this));
        _$(this.container, '.selector').forEach((tabSelector) => {
            tabSelector.addEventListener('click', (e) => {
                this.activate(e.srcElement);
                this.focus(e.srcElement);
            });
        });

        window.onload = (e) => {
            this.focus(this.activeTabElement());
        };
    }


    /**
     * Find the active tab element from the current hash or fall back to
     * the first tab.
     * @returns {element} The active tab element.
     */
    activeTabElement() {
        let tabElement;
        let hashParams = queryString.parse(location.hash.replace('#', ''));
        // Try to get the active tab from the location hash first.
        if ((this.tabsindex in hashParams)) {
            tabElement = _$(this.container, '#' + hashParams[this.tabsindex])[0];
        } else {
            // Fall back to the first tab.
            tabElement = _$(this.container, '.selector')[0];
        }
        return tabElement;
    }


    /**
     * Set the current active tab for accordion and tab modus.
     * @param {element} tabElement - The tab selector element.
     * @returns {element} the active tab element.
     */
    activate(tabElement) {
        let hashParams = queryString.parse(location.hash.replace('#', ''));
        if (!tabElement) {
            tabElement = this.activeTabElement();
            // When in accordion mode, set the checked property of the active
            // accordion when the tabElement is not passed.
            if (tabElement.getAttribute('type') === 'checkbox') {
                tabElement.checked = true;
            }
        }
        // The tab with this id should be active.
        hashParams[this.tabsindex] = tabElement.getAttribute('id');

        if (tabElement.getAttribute('type') === 'checkbox') {
            // Deactivate all other tabs when this tab is clicked.
            _$(this.container, '.selector:not(#' + hashParams[this.tabsindex] + ')').forEach((el) => {el.checked = false;});
        } else {
            tabElement.checked = true;
        }

        location.hash = queryString.stringify(hashParams);
        return tabElement;
    }


    /**
     * Scroll the element represented by the selector to the top of the screen.
     * @param {element} tabElement - The tab selector element.
     */
    focus(tabElement) {
        tabElement ? tabElement : this.activeTabElement();
        // In tab mode, focus is not desirable for non-touch devices.
        if ((tabElement.getAttribute('type') === 'radio') && !(this.isIos || this.isAndroid)) return;
        // Give the browser some space to figure out the correct scroll height.
        setTimeout(function() {
            // On IOS, scrollTop doesn't return the correct value.
            let windowScrolltop = window.pageYOffset || document.documentElement.scrollTop;
            let scrollTop = windowScrolltop + tabElement.nextElementSibling.getBoundingClientRect().top;
            window.scrollTo(0, scrollTop);
        }, 0);
    }


    /**
     * Change the operating mode to tabs or accordion, depending on whether the
     * minimum width breakpoint matches or not.
     * @param {MediaQueryList|MediaQueryListEvent} mediaQueryList - The involved breakpoint mediaquery object.
     */
    tabMode(mediaQueryList) {
        // Accordion mode uses checkboxes, instead of radio buttons.
        _$(this.container, '.selector').forEach((tabSelector) => {
            tabSelector.setAttribute('type', mediaQueryList.matches ? 'checkbox' : 'radio');
        });
        let tabElement = this.activate();
        if(mediaQueryList.matches) {
            this.container.className = this.container.className + ' accordion';
        } else {
            this.container.className = this.container.className.replace(' accordion', '');
        }
        this.focus(tabElement);
    }
}


/**
 * Optional Jquery support.
 */
if (window.$) {
    $.fn.tabcordions = function({breakpoint = 480, tabsindex = 0} = {}) {
        var options = $.extend({}, {breakpoint, tabsindex}, this.data());
        options.container = this.get(0);
        new Tabs(options);
        return this;
    };
}

module.exports = Tabs;
