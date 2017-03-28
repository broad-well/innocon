/**
 * Base utilities for the frontend of Michael P's Innocon project
 * Unlicense: the MIT/X11 license without copyrights
 */
/// <reference path="../typings/index.d.ts" />

export interface Render {
    readonly name: string;

    // AJAX tools
    showAjaxError(xhr: XMLHttpRequest, errType: string, err: Error): void;
}

export type ProductResponse = {
    displayName: string,
    description: string,
    moreInfo: {[title: string]: string},
    burnerType: string,
    citations: string[],
};
export type ListingResponse = { listing: string[] };

export namespace Base {
    export const serverHost = 'http://broaderator.com:5753';
    // Assign to this variable ASAP in the renderer
    export let renderer: Render | null = null;

    // AJAX tools
    export function handleError(xhr: XMLHttpRequest, errType: string, err: Error) {
        console.error(`Error occurred during AJAX request: type=${errType} err=${err}`);
        if (renderer !== null) {
            renderer.showAjaxError(xhr, errType, err);
        } else {
            alert('renderer not set and ajax error encountered');
        }
    }

    export function get(path: string, success: (data: object) => void): any {
        $.getJSON(serverHost + path, success);
    }

    export function post(path: string, data: any, success: (data: object) => void): any {
        $.ajax({
            url: serverHost + path,
            type: 'POST',
            data: data,
            dataType: 'json',
            contentType: 'application/json',
            success: success
        });
    }

    export function createPassageFromProduct(product: ProductResponse): string {
        let bodyText = '';

        for (let passage in product.moreInfo) {
            bodyText += `<h3>${passage}</h3><p>${product.moreInfo[passage]}</p>`;
        }
        if ('alternatives' in product && product['alternatives'].length !== 0) {
            bodyText += `<br><h2>Alternatives</h2><ul><li>${product['alternatives'].join('</li><li>')}</li></ul>`;
        }
        if (product.citations.length !== 0) {
            bodyText += `<hr><h4>Citations</h4><cite>${product.citations.join('</cite><br><cite>')}</cite>`;
        }

        return bodyText;
    }
}