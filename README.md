
[![Build Status](https://travis-ci.org/emepyc/tnt.rest.svg?branch=master)](https://travis-ci.org/emepyc/tnt.rest)
[![npm version](https://badge.fury.io/js/tnt.rest.svg)](http://badge.fury.io/js/tnt.rest)

# TnT Rest
`tnt.rest` is a library to retrieve data from RESTful APIs.

## Installation

Installation can be made with npm:
```
npm install --save tnt.rest
```

or from Git:
```bash
git clone https://github.com/emepyc/tnt.rest
cd tnt.rest
npm install
npm build-browser
```

# Usage
Example of usage:

```javascript
<head>
    <script src="build/tnt.rest.js"></script>
</head>

<body>
    <div id="mydiv"></div>
    <script>
    var rest = tnt.rest();
    var url = rest.url()
        .domain("rest.ensembl.org")
        .endpoint("xrefs/symbol/:species/:id")
        .parameters({
            "species": "human",
            "id": "BRCA1",
        });

    rest.call(url)
        .then (function (resp) {
            var data = resp.body;
            // use data
        });
    </script>
</body>
```
See the <i>examples</i> folder for more examples.

## API

`tnt.rest()` returns a new rest instance that exposes the following methods:

#### call
Performs a call using the provided <i>url</i>. By default a <i>GET</i> request is made. The first argument is mandatory and can be a string specifying the complete <i>URI</i> for the resource to fetch or a `tnt.rest.url` instance (see below). If a second argument is provided and is an object a <i>POST</i> request is made using this object as its post data. In both cases, this method returns an <i>ES6-compliant promise</i> that can be chained via its <i>then</i> method.

Example of <i>GET</i> request:
```javascript
var rest = tnt.rest();
rest.call("http://rest.ensembl.org/xrefs/symbol/homo_sapiens/BRCA2?content-type=text/xml")
    .then (function (resp) {
        // do something with resp
    })
```

Example of <i>POST</i> request:
```javascript
var rest = tnt.rest();
rest.call("http://rest.ensembl.org/lookup/id?content-type=application/json", {
    "ids" : ["ENSG00000157764", "ENSG00000248378" ]
})
    .then (function (resp) {
        // do something with resp
    })
```

#### tnt.rest.url

`tnt.rest.url` provides an interface to build <i>URI</i>s using its API. Using this API is not mandatory since you can pass directly the URI string to the ```call``` method (see above for examples).
The returned ```url``` instance exposes several methods explained below.

##### prefix
Specifies any prefix to be added to the URI. This is useful the calls are proxyed through a web server that expects a given prefix in the URIs. This prefix is inserted even before the protocol

```javascript
var rest = tnt.rest();
var url = rest.url()
    .prefix ("/proxy/");

```

##### protocol
Specifies the protocol to be used (<i>http</i> by default).

##### domain
Specifies the domain for the URI.

```javascript
var rest = tnt.rest();
var url = rest.url()
    .domain("rest.ensembl.org");
```

##### port
Specifies the port to use for the <i>URI</i>.

```javascript
var rest = tnt.rest();
var url = rest.url()
    .port(9988);
```

##### endpoint
Specifies the <i>path</i> field in the <i>URI</i>. If the endpoint string contains arguments (ie, parts starting with a ":") they are substituted by their corresponding options in the ```parameters``` method.
```javascript
var rest = tnt.rest();
var url = rest.url()
    .endpoint(""xrefs/symbol/:species/:id"")
    .parameters({
        "species" : "human",
        "id"      : "BRCA1"
    });
```

##### parameters
Fills the optional arguments specified in the ```endpoint``` method.

##### fragment
Sets an optional fragment for the URI (ie, the anchor after the "#" in a URI).


## Feedback

Please, send any comments to emepyc@gmail.com. Bug reports and feature requests are welcome in the [issue tracker](https://github.com/emepyc/tnt.rest/issues)
