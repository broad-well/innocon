/**
 * Bare (lack of library) frontend implementation script for Michael P's Innocon project
 * Unlicense: No lengthy EULAs to "agree" to
 */

import { Render, Base, ProductResponse, ListingResponse } from '../../base';

window['productInfo'] = {};
class BareRenderer implements Render {
    static readonly colors: string[] = ['red', 'orange', 'green', 'blue', 'purple', 'indigo'];

    readonly name: string = 'ControlGroup';
    private readonly sevColorMap: {[burnerType: string]: string} = {
        'burns-to-run': 'red',
        'burns-to-produce': 'orange',
        'alternative': 'green',
    };

    constructor() {
        Base.renderer = this;

        {
            let browseRepeater = $('#browse-repeater');
            let repeatContent = browseRepeater.html();
            Base.get('/product', (data) => {
                for (let productId of (<ListingResponse>data).listing) {
                    Base.get(`/product/${productId}`, (data) => {
                            browseRepeater.parent().append(
                            repeatContent.split('[[name]]').join((<ProductResponse>data).displayName)
                                .split('[[desc]]').join((<ProductResponse>data).description)
                                .split('[[ident]]').join(productId)
                                .split('[[sev-text]]').join((<ProductResponse>data).burnerType.split('-').join(' '))
                                .split('[[sev-color]]').join(this.sevColorMap[(<ProductResponse>data).burnerType]));

                        window['productInfo'][productId] = data;
                    });
                }
            });
        }
        {
            Base.get('/calculator/layout', layout => {
                for (let elem of <any[]>layout) {
                    let template = $(`.form-element-template[elem-type="${elem['@type']}"]`);
                    $('#calc-form').append(template.html()
                        .split('[[id]]').join(elem.id)
                        .split('[[display]]').join(elem.display)
                        .split('[[tip]]').join(elem.tip || ''));
                }
            });
        }
        $('#calc-form').on('submit', function (evt: Event): boolean {
            let jsonOut = {};
            $('#calc-form input').forEach(item => {
                if (item.name.length > 0) {
                    jsonOut[item.name] = item.type === 'number' ? Number(item.value): item.value;
                }
            });
            Base.post('/calculator/form', jsonOut, data => {
                alert(`Your score is ${data}`);
            });

            evt.preventDefault();
            return false;
        });
        // Activate repeaters, then do this
        setTimeout(() => {
            $('*[bg="random"]').forEach(item => $(item).attr('bg', BareRenderer.colors[Math.floor(Math.random() * BareRenderer.colors.length)]));
            $('*[tabcontroller], NavButton').click(evt => window['frontendMan'].tabs.switchTo(Number((evt.target as HTMLElement).getAttribute('bind'))));
        }, 500);
    }

    public showAjaxError() {
        console.error('AJAX ERROR');
        console.trace();
    }
}
$('body').ready(() => Base.renderer = new BareRenderer());

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

class OverlayManager {
    protected element: string = 'Overlay';

    constructor(triggerName: string) {
        this.element += `[trigger=${triggerName}]`;
        $(this.element).attr('overlay-state', 'hidden');
    }

    toggleVisibility() {
        let currentVal = $(this.element).attr('overlay-state');
        $(this.element).attr('overlay-state', currentVal === 'hidden' ? 'visible' : 'hidden');
        document.onmousedown = () => {
            this.toggleVisibility();
            document.onmousedown = () => {};
        };
    }
}
let mainOverlay = new OverlayManager('productinfo');

window['frontendMan'] = {
    tabs: mainTabs,
    overlay: mainOverlay,
    triggerOverlay: (productId: string) => {
        let productInfo = <ProductResponse>window['productInfo'][productId];
        $('#productinfo-card > Title').text(productInfo.displayName);
        $('#productinfo-card > Text').html(Base.createPassageFromProduct(productInfo));
        mainOverlay.toggleVisibility();
    }
};