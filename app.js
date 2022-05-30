'use strict';
// Dependencies
const request = require('request');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

module.exports = NetSuiteOAuth;

/**
 * @description Constructor
 * @param url
 * @param method
 * @param consumerKey
 * @param consumerSecret
 * @param tokenId
 * @param tokenSecret
 * @param account
 * @param {String} [signature_method] defalts to HMAC-256
 * @returns {PromiseLike<ArrayBuffer>}
 * @constructor
 */
function NetSuiteOAuth(url, method, consumerKey, consumerSecret, tokenId, tokenSecret, account,signature_method='HMAC-SHA256') {
    const algoToSigMethodMap = {
        'HMAC-SHA256' : 'sha256'
    };

    this.request_data = {
        url: url,
        method: method
    };

    this.token = {
        key: tokenId,
        secret: tokenSecret
    };

    let hash_function = (  base_string, key, algorithm = algoToSigMethodMap[signature_method] ) => crypto.createHmac(algorithm, key).update(base_string);


    const that = this;
    Object.defineProperties(that ,{
        'oauth' :{
            enumerable : false,
            configurable: false,
        get: ()=> OAuth({
        consumer: {
            key: consumerKey,
            secret: consumerSecret
        },
        realm: account,
        signature_method,
        hash_function : hash_function.digest('base64')
    })
        },

    'hash_function' :{
            configurable: false,
            get: ()=> hash_function,
        set:(newHashFn)=>{
                if(typeof newHashFn !== 'function') throw new TypeError('must be a function');
                hash_function = newHashFn;
        }
    },
        'headers' : {
            get : ()=>Object.assign({},{
                  'Content-Type': 'application/json',
                  ...[this.oauth].reduce(oauth=>oauth.toHeader(oauth.authorize(that.request_data, that.token)),{});
            })
        }
    });
}

/**
 * @description get method when relevant
 * @returns {Promise<unknown>}
 * @throws Error when method does not match constructor
 */
NetSuiteOAuth.prototype.get = function () {
    if( this.request_data.method !== 'get' ) throw new Error('your connection is for a `get` request');
    return new Promise((resolve, reject) => {
        request({
            url: this.request_data.url,
            method: this.request_data.method,
            headers: this.headers
        }, function (error, response, body) { //
            if (error || !/^2/.test(response.statusCode)){ //
                console.log('Body data:', body);
                reject(body || error);
            }
            else {
                if (typeof body == 'string') body = JSON.parse(body);
                resolve(body || error);
            }
        });

    });
};

/**
 * @description post method when relevant
 * @returns {Promise<unknown>}
 * @throws Error when method does not match constructor
 */
NetSuiteOAuth.prototype.post = function (data) {
    if( this.request_data.method !== 'post' ) throw new Error('your connection is for a `post` request');
    return new Promise((resolve, reject) => {
        request({
            url: this.request_data.url,
            method: this.request_data.method,
            json: data,
            headers: this.headers
        }, function (error, response, body) {
            if (error || !/^2/.test(response.statusCode)){ //
                console.log('Body data:', body);
                reject(body || error);
            }
            else {
                if (typeof body == 'string') {
                    try {
                        body = JSON.parse(body);
                    } catch (error) {
                        console.log('unable to parse response body');
                        reject(error);
                    }
                }
                resolve(body || error);
            }
        });

    });
};

/**
 * @description put method when relevant
 * @returns {Promise<unknown>}
 * @throws Error when method does not match constructor
 */
NetSuiteOAuth.prototype.put = function (data) {
    if( this.request_data.method !== 'put' ) throw new Error('your connection is for a `put` request');
    return new Promise((resolve, reject) => {
        request({
            url: this.request_data.url,
            method: this.request_data.method,
            json: data,
            headers: this.headers
        }, function (error, response, body) {
            if (error || !/^2/.test(response.statusCode)){ //
                console.log('Body data:', body);
                reject(body || error);
            }
            else {
                if (typeof body == 'string') {
                    try {
                        body = JSON.parse(body);
                    } catch (error) {
                        console.log('unable to parse response body');
                        reject(error);
                    }
                }
                resolve(body || error);
            }
        });

    });
};
