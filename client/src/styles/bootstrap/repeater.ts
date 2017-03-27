/**
 * Michael P's Innocon Project, Bootstrap frontend, AJAX and renderer
 * Unlicense: Unpatent pending
 */

import { Render, Base, ProductResponse, ListingResponse } from '../../base';

class BsRenderer implements Render {
    readonly name: 'Bootstrap';

    showAjaxError() {
        alert('Oopsies, it seems that either you are disconnected from the information superhighway, or Michael\'s server has failed. Please inform him about this, and include the JavaScript console\'s contents.');
    }
}
Base.renderer = new BsRenderer();

const productLevels: {[burnerType: string]: string} = {
    'burns-to-run': 'danger',
    'burns-to-produce': 'warning',
    'alternative': 'success',
};

class Manipulator {
    private str: string;
    constructor(str: string) {
        this.str = str;
    }
    replace(fro: string, to: string): Manipulator {
        return new Manipulator(this.str.split(fro).join(to));
    }
    toString(): string {
        return this.str;
    }
}

(window as any).productData = {};
(window as any).modal = function(id: string) {
    let template = $('#prod-modal-template').html();
    $('#prod-info').html(new Manipulator(template)
        .replace('[[name]]', (window as any).productData[id].name)
        .replace('[[passage]]', (window as any).productData[id].passage)
        .toString());
};

Base.get('/product', (list: ListingResponse) => {
    let repeater = $('#prod-rep');

    for (let id of list.listing) {
        Base.get(`/product/${id}`, (meta: ProductResponse) => {
            repeater.parent().append(new Manipulator(repeater.html())
                .replace('[[level]]', productLevels[meta.burnerType])
                .replace('[[name]]', meta.displayName)
                .replace('[[id]]', id)
                .replace('[[description]]', meta.description)
                .toString());
            (window as any).productData[id] = {
                name: meta.displayName,
                passage: Base.createPassageFromProduct(meta)
            };
        });
    }
});

