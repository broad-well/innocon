/**
 * The fossil fuel usage calculator component of Michael P's Innocon Project (nouvEnergy), server side.
 * Unlicense: (Almost) freedom
 */

let config = require('./config');
const calcForm = (config as any).calcForm;

function getHandlerById(id: string): ((score, context, val) => number)|null {
    for (let element of calcForm) {
        if (element.id === id) {
            return element.handle;
        }
    }
    return null;
}

function getScore(answers: {[id: string]: number|boolean|string}): number {
    let out = 100;
    for (let id in answers) {
        let handler;
        if ((handler = getHandlerById(id)) !== null) {
            out = handler(out, answers, answers[id]);
        }
    }
    return out;
}

export namespace CalcRest {
    export function getTransportForm(): object {
        return calcForm;
    }

    export function calculateScore(restInput: {[id: string]: number|boolean|string}): number {
        return getScore(restInput);
    }
}