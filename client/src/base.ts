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

export type ProductResponse = { displayName: string, description: string, burnerType: string};
export type ListingResponse = { listing: string[] };

export namespace Base {
    export const serverHost = 'http://broaderator.com:5753';
    // Assign to this variable ASAP in the renderer
    export let renderer: Render | null = null;

    // AJAX tools
    export function handleError(xhr: XMLHttpRequest, errType: string, err: Error) {
        console.error(`Error occurred during AJAX request: type=${errType} err=${err}`);
        if (renderer !== null)
            renderer.showAjaxError(xhr, errType, err);
    }

    export function get(path: string, success: (data: object) => void): any {
        $.getJSON(serverHost + path, success);
    }
}