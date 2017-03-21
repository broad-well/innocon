/**
 * REST adapter interface for Michael P's Innocon project, server-side.
 */

/// <reference path="../typings/index.d.ts" />

import * as Restify from 'restify';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as logger from 'loglevel';
let conf = require('./config');

export const server = Restify.createServer();

// Utilties

type Status = 'info' | 'success' | 'error';

function createResponse(status_: Status, keyval: Object): Object {
    keyval['status'] = status_;
    return keyval;
}

// Setup loglevel
logger.setLevel(0);

// Product directive

server.get('/product/:identifier', function _getProductById(req, res, next) {
    const filename = conf.homePath + conf.productFolder + req.params.identifier + '.yml';
    if (!fs.existsSync(filename)) {
        res.send(404, createResponse('error', {
            'errorMessage': 'product:idNotFound'
        }));
    }

    res.send(200, yaml.safeLoad(fs.readFileSync(filename, 'utf8')));
});

server.listen(5753, () => logger.info(`Good news: REST server is listening at ${server.url}`));
