# @suitegeezus/netsuite-tba-oauth
NetSuite Token Based Authentication Module

modification of `netsuite-tba-oauth` which defaults to SHA-256 and optionally allows you
to provide your own signature_method and hash function. 

## Introduction:
This auxiliary module abstracts the authentication mechanism used by NetSuite Restlets.

## Supported authentication methods:
* Token Based Authentication (TBA) via OAuth1.0a
* Note: NLAuth not supported. Use the netsuite-restlet module if you need NLAuth authentication.

## Supported Restlet methods:

GET (get function)
POST (post function)
PUT (put function)

## Installation

via npm:
`npm install @suitegeezus/netsuite-tba-oauth --save-dev`

## Usage

Example of GET request

```js
const NetSuiteOauth = require('@suitegeezus/netsuite-tba-oauth');

const url = 'restlet-url';
const method = 'GET';
const consumerKey = 'your-consumer-key';
const consumerSecret = 'your-consumer-secret';
const tokenId = 'token-id';
const tokenSecret = 'token-secret';
const account = 'account Id'; //aka realm
const signature_method = 'HMAC-256'; // optional -- defaults to HMAC-256

const oauth = new NetSuiteOauth(url, method, consumerKey, consumerSecret, tokenId, tokenSecret, account);

oauth.get().then(response => console.log(response));
```

Example of POST request

```js
const NetSuiteOauth = require('@suitegeezus/netsuite-tba-oauth');

const url = 'restlet-url';
const method = 'POST';
const consumerKey = 'your-consumer-key';
const consumerSecret = 'your-consumer-secret';
const tokenId = 'token-id';
const tokenSecret = 'token-secret';
const account = 'account Id';

const oauth = new NetSuiteOauth(url, method, consumerKey, consumerSecret, tokenId, tokenSecret, account);
const data = {key: 'value'};

oauth.post(data).then(response => console.log(response));
```

# Errors:
`get` will return an error of your request method does not match the `method` parameter
