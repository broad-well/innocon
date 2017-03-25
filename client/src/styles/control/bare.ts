/**
 * Bare (lack of library) frontend implementation script for Michael P's Innocon project
 * Unlicense: No lengthy EULAs to "agree" to
 */

import { Render, Base, ProductResponse, ListingResponse } from '../../base';

class BareRenderer implements Render {
    static readonly colors: string[] = ['red', 'orange', 'green', 'blue', 'purple', 'indigo'];

    readonly name: string = 'ControlGroup';

    constructor() {
        Base.renderer = this;

        {
            let browseRepeater = $('#browse-repeater');
            let repeatContent = browseRepeater.html();
            Base.get('/product', (data) => {
                for (let productId of (<ListingResponse>data).listing) {
                    Base.get(`/product/${productId}`,
                        (data) => browseRepeater.parent().append(
                            repeatContent.replace('[[name]]', (<ProductResponse>data).displayName)
                                .replace('[[desc]]', (<ProductResponse>data).description)
                                .replace('[[ident]]', productId)
                                .replace('[[sev-color]]', (<ProductResponse>data).burnerType === 'alternative' ? 'green': 'red')));
                }
            });
        }
        // Activate repeaters, then do this
        setTimeout(() => {
            $('*[bg="random"]').forEach(item => $(item).attr('bg', BareRenderer.colors[Math.floor(Math.random() * BareRenderer.colors.length)]));
            $('NavButton').click(evt => window['frontendMan'].tabs.switchTo(Number(evt.srcElement!.getAttribute('bind'))));
        }, 500);
    }

    public showAjaxError() {
        console.error('AJAX ERROR');
        console.trace();
    }
}
$('body').ready(() => new BareRenderer());

class TabManager {
    // Both of below are selectors fed into Zepto.
    protected parent: string; // <Tabs>
    protected tabs: string; // <Tab>

    protected activeTabIndex = -1;
    debug: boolean = false;

    constructor(parentSelector: string) {
        this.parent = parentSelector;
        this.tabs = parentSelector + '>Tab';
        this.switchTo(0);
    }

    switchTo(tabIndex: number) {
        if (this.activeTabIndex !== tabIndex) {
            $(this.tabs).forEach((item, index) => {
                $(item).css('display', index === tabIndex ? 'flex' : 'none');
            });
            this.activeTabIndex = tabIndex;
        }
    }
}
let mainTabs = new TabManager('Tabs');

window['frontendMan'] = {
    tabs: mainTabs
};