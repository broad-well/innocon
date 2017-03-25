/**
 * Base utilities for the frontend of Michael P's Innocon project
 * Unlicense: the MIT/X11 license without copyrights
 */
/// <reference path="../typings/index.d.ts" />

export interface FrontRender {
    // AJAX tools
    showAjaxError(xhr: XMLHttpRequest, errType: string, err: Error);
}

export namespace FrontBase {
    export const serverHost = 'http://broaderator.com:5753';
    // Assign to this variable ASAP
    export let renderer: FrontRender | null = null;

    // AJAX tools
    export function handleError(xhr: XMLHttpRequest, errType: string, err: Error) {
        console.error(`Error occurred during AJAX request: type=${errType} err=${err}`);
        renderer.showAjaxError(xhr, errType, err);
    }
    export function get(path: string, success: (data: object) => void, error: (xhr: XMLHttpRequest, errType: string, err: Error) => void = handleError): any {
        $.ajax({
            type: 'GET',
            url: serverHost + path,
            dataType: 'json',
            success: success,
            error: error,
        });
    }
}