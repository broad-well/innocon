/**
 * The fossil fuel usage calculator component of Michael P's Innocon Project (nouvEnergy), server side.
 * Unlicense: (Almost) freedom
 */

let config = require('./config');
const calcForm = (config as any).calcForm;

function getAttributeById(id: string, attr: string): any {
    for (let element of calcForm) {
        if (element.id === id) {
            return element[attr];
        }
    }
    return null;
}

function getScore(answers: {[id: string]: number|boolean|string}): number {
    console.info(`getScore called with ${answers}`);
    let out = 100;
    for (let id in answers) {
        let handler = getAttributeById(id, 'handle');
        let expectedDataType = getAttributeById(id, '@type');
        if (handler !== null) {
            out = handler(out, answers, expectedDataType === 'string' ? answers[id] : Number(answers[id]));
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