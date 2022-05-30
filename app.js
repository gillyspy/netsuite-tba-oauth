// Dependencies
const request = require('request');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

/* eslint-disable camelcase */
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
// eslint-disable-next-line camelcase
function NetSuiteOAuth(url, method, consumerKey, consumerSecret, tokenId, tokenSecret, account, signature_method = 'HMAC-SHA256') {
  const algoToSigMethodMap = {
    'HMAC-SHA256': 'sha256'
  };

  this.request_data = {
    url,
    method
  };

  this.token = {
    key: tokenId,
    secret: tokenSecret
  };

  let hash_function = (base_string, key = tokenId, algo) => crypto.createHmac(algo, key).update(base_string);

  const that = this;
  Object.defineProperties(that, {
    'oauth': {
      enumerable: false,
      configurable: false,
      get: () =>
        OAuth({
          consumer: {
            key: consumerKey,
            secret: consumerSecret
          },
          realm: account,
          signature_method,
          hash_function: (base, key) => hash_function(base, key, algoToSigMethodMap[signature_method]).digest('base64')
        })
    },

    'hash_function': {
      configurable: false,
      get: () => hash_function,
      set: (newHashFn) => {
        if (typeof newHashFn !== 'function') throw new TypeError('must be a function');
        hash_function = newHashFn;
      }
    },
    'headers': {
      get: () => ({
        'Content-Type': 'application/json',
        ...[that.oauth].reduce((out, oauth) => oauth.toHeader(oauth.authorize(that.request_data, that.token)), {})
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
  if (this.request_data.method.toLowerCase() !== 'get') throw new Error(`your connection is for a '${this.request_data.method}' request`);
  return new Promise((resolve, reject) => {
    request(
      {
        url: this.request_data.url,
        method: this.request_data.method,
        headers: this.headers
      },
      (error, response, body) => {
        //
        if (error || !/^2/.test(response.statusCode)) {
          //
          console.log('Body data:', body);
          reject(body || error);
        } else {
          // eslint-disable-next-line no-param-reassign
          if (typeof body === 'string') body = JSON.parse(body);
          resolve(body || error);
        }
      }
    );
  });
};

/**
 * @description post method when relevant
 * @returns {Promise<unknown>}
 * @throws Error when method does not match constructor
 */
NetSuiteOAuth.prototype.post = function (data) {
  if (this.request_data.method.toLowerCase() !== 'post') throw new Error(`your connection is for a '${this.request_data.method}' request`);
  return new Promise((resolve, reject) => {
    request(
      {
        url: this.request_data.url,
        method: this.request_data.method,
        json: data,
        headers: this.headers
      },
      (error, response, body) => {
        if (error || !/^2/.test(response.statusCode)) {
          //
          console.log('Body data:', body);
          reject(body || error);
        } else {
          if (typeof body === 'string') {
            try {
              // eslint-disable-next-line no-param-reassign
              body = JSON.parse(body);
              // eslint-disable-next-line no-shadow
            } catch (error) {
              console.log('unable to parse response body');
              reject(error);
            }
          }
          resolve(body || error);
        }
      }
    );
  });
};

/**
 * @description put method when relevant
 * @returns {Promise<unknown>}
 * @throws Error when method does not match constructor
 */
NetSuiteOAuth.prototype.put = function (data) {
  if (this.request_data.method.toLowerCase() !== 'put') throw new Error(`your connection is for a '${this.request_data.method}' request`);
  return new Promise((resolve, reject) => {
    request(
      {
        url: this.request_data.url,
        method: this.request_data.method,
        json: data,
        headers: this.headers
      },
      (error, response, body) => {
        if (error || !/^2/.test(response.statusCode)) {
          //
          console.log('Body data:', body);
          reject(body || error);
        } else {
          if (typeof body === 'string') {
            try {
              // eslint-disable-next-line no-param-reassign
              body = JSON.parse(body);
              // eslint-disable-next-line no-shadow
            } catch (error) {
              console.log('unable to parse response body');
              reject(error);
            }
          }
          resolve(body || error);
        }
      }
    );
  });
};

module.exports = NetSuiteOAuth;
