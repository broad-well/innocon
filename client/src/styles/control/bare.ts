/**
 * Bare (lack of library) frontend implementation script for Michael P's Innocon project
 * Unlicense: No lengthy EULAs to "agree" to
 */

import { Render, Base } from '../../base';

class BareRenderer implements Render {
    readonly name: string = "ControlGroup";

    constructor() {
        Base.renderer = this;
    }

    public showAjaxError() {

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