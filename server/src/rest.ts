/**
 * REST adapter interface for Michael P's Innocon project, server-side.
 * Unlicense: full dedication to public domain.
 */

/// <reference path="../typings/index.d.ts" />

import * as Restify from 'restify';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as logger from 'loglevel';
import * as path from 'path';
let conf = require('./config');

export const server = Restify.createServer();

// Utilties

type Status = 'info' | 'success' | 'error';

function createResponse(status_: Status, keyval: Object): Object {
    keyval['code'] = status_;
    return keyval;
}

// Setup loglevel
logger.setLevel(0);

// Directive folder-based service

export class DirectoryMirror {
    dirPath: string;
    fileExt: string; // Note: includes the fullstop ('.yml', for example)
    restPath: string; // Example: product/burner goes to /product/burner and /product/burner/:id

    // CACHE - UPDATE UPON REQUEST
    listing: string[];
    objects: {[id: string]: any};

    constructor(path: string, ext: string, rest: string) {
        this.dirPath = path;
        this.fileExt = ext;
        this.restPath = rest;
        this.updateCache();

        server.get(`/${this.restPath}`, (req, res, next) => {
            res.send(200, createResponse('info', {
                'listing': this.listing,
            }));
            return next();
        });
        server.get(`/${this.restPath}/:id`, (req, res, next) => {
            if (!(req.params.id in this.objects)) {
                res.send(404, createResponse('error', {
                    'errorMessage': 'directory:enoent',
                }));
                return;
            }
            res.send(200, this.objects[req.params.id]);
            return next();
        });
    }

    updateCache() {
        this.listing = fs.readdirSync(this.dirPath).filter(val => val.charAt(0) !== '.' && val.charAt(0) !== '_')
            .map(val => val.substr(0, val.length - this.fileExt.length));
        for (let id of this.listing) {
            this.objects[id] = this.getDataById(id);
        }
    }

    getDataById(id: string): any|null {
        let filePath = path.join(this.dirPath, id + this.fileExt);
        if (fs.existsSync(filePath)) {
            return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
        } else {
            return null;
        }
    }
}

// [root] directive

namespace Globals {
    server.get('/', function _greet(req, res) {
        res.send(200, createResponse('success',{
            message: `Welcome to the ${conf.productName} REST interface`,
            version: conf.productVersion,
        }));
    });
}

// Product directive

namespace Products {
    const productFolderPath = conf.homePath + conf.productFolder;

    const dirMirror = new DirectoryMirror(productFolderPath, '.yml', 'product-dir');

    function getFilenameByProductId(id: string): string {
        return productFolderPath + id + '.yml';
    }

    function getProductList(): string[] {
        return fs.readdirSync(productFolderPath)
            .filter(fn => fn[0] !== '.' && fn[0] !== '_')
            .map(fn => fn.slice(0, fn.length - 4));
    }

    server.get('/product', function _getProducts(req, res, next) {
        res.send(200, createResponse('info', {
            'listing': getProductList()
        }));
    });

    server.get('/product/:identifier', function _getProductById(req, res, next) {

        let filename = getFilenameByProductId(req.params.identifier);
        if (!fs.existsSync(filename)) {
            res.send(404, createResponse('error', {
                'errorMessage': 'product:idNotFound'
            }));
        }

        res.send(200, yaml.safeLoad(fs.readFileSync(filename, 'utf8')));
    });

}

server.listen(5753, () => logger.info(`Good news: REST server is listening at ${server.url}`));
