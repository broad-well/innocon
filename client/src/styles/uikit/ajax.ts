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
{
    let wrapper = $('#rep-products');
    let card = wrapper.html();
    let parent = wrapper.parent();

    function dataToCard(id: string, data: ProductResponse) {
        return card
            .replace('[[name]]', data.displayName)
            .replace('[[description]]', data.description)
            .replace('[[id]]', id)
            .replace('[[burnType]]', data.burnerType)
            .replace('@@Opt_Type@@', data.burnerType === 'alternative' ? 'primary' : 'secondary');
    }

    Base.get('/product', data => {
        for (let id of (<ListingResponse>data).listing) {
            Base.get(`/product/${id}`, productInfo => {
                parent.append(dataToCard(id, <ProductResponse>productInfo));
            });
        }
    });
}