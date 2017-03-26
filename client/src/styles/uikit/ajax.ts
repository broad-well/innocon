/**
 * AJAX adapter for the UIKit frontend
 * Unlicense: Synonymous to WTFPL
 */

import { Render, Base, ProductResponse, ListingResponse } from '../../base';

class UIKitRenderer implements Render {
    readonly name: 'UIKit';

    showAjaxError() {
        alert('AJAX Error: The app could not connect to the server! Please tell Michael, and include the JavaScript console if possible.');
    }
}

// Product cards
window['productInfo'] = {};
{
    let wrapper = $('#rep-products');
    let card = wrapper.html();
    let parent = wrapper.parent();

    function dataToCard(id: string, data: ProductResponse) {
        return card
            .replace(/\[\[name\]\]/g, data.displayName)
            .replace(/\[\[description\]\]/g, data.description)
            .replace(/\[\[id\]\]/g, id)
            .replace(/\[\[burnType\]\]/g, data.burnerType)
            .replace(/@@Opt_Type@@/g, data.burnerType === 'alternative' ? 'primary' : 'secondary');
    }

    Base.get('/product', data => {
        for (let id of (<ListingResponse>data).listing) {
            Base.get(`/product/${id}`, productInfo => {
                parent.append(dataToCard(id, <ProductResponse>productInfo));
                window['productInfo'][id] = <ProductResponse>productInfo;
            });
        }
    });
}

// Product Modal management
window['refreshProductModal'] = (id: string) => {
    $('#pi-name').text(window['productInfo'][id].displayName);
    $('#pi-essay').html(`<h3>Description</h3><p>${window['productInfo'][id].description}</p><i>${window['productInfo'][id].burnerType}</i>`);
};