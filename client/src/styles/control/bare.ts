/**
 * Bare (lack of library) frontend implementation script for Michael P's Innocon project
 * Unlicense: No lengthy EULAs to "agree" to
 */

import { Render, Base } from '../../base';

class BareRenderer implements Render {
    static readonly colors: string[] = ['Red', 'Orange', 'Green', 'Blue', 'Purple', 'Indigo'];

    readonly name: string = 'ControlGroup';

    constructor() {
        Base.renderer = this;

        {
            let browseRepeater = $('Repeater#browse-repeater');
            let repeatContent = browseRepeater.contents();
            Base.get('/product', data => {
                for (let productId of (<{listing: string[]}>data).listing) {
                    Base.get(`/product/${productId}`, data => browseRepeater.parent().append(repeatContent.html().replace('[[name]]', (<{displayName: string}>data).displayName)));
                }
            });
        }
        // Activate repeaters, then do this
        $('*[bg="random"]').attr('bg', BareRenderer.colors[Math.floor(Math.random() * BareRenderer.colors.length)]);
    }

    public showAjaxError() {
        console.error('AJAX ERROR');
        console.trace();
    }
}
new BareRenderer();

class TabManager {
    // Both of below are selectors fed into Zepto.
    protected parent: string; // <Tabs>
    protected tabs: string; // <Tab>

    protected activeTabIndex = 0;
    debug: boolean = false;

    constructor(parentSelector: string) {
        this.parent = parentSelector;
        this.tabs = parentSelector + '>Tab';
    }

    switchTo(tabIndex: number) {
        if (this.activeTabIndex !== tabIndex) {
            $(this.tabs).forEach((item, index) => {
                $(item).css('display', index === tabIndex ? 'flex':'none');
            });
            this.activeTabIndex = tabIndex;
        }
    }
}