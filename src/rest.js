var http = require("httpplease");
var apijs = require("tnt.api");
var promises = require('httpplease-promises');
var Promise = require('es6-promise').Promise;
var json = require("httpplease/plugins/json");
http = http.use(json).use(promises(Promise));

//var url = require("./url.js");

tnt_rest = function () {
    var config = {
        prefix: "",
        protocol: "http",
        domain: "",
        port: ""
    };
    var rest = {};
    rest.url = require("./url.js");

    var api = apijs (rest)
        .getset(config);

    api.method ('call', function (url, data) {
        var myurl;
        if (typeof(url) === "string") {
            myurl = url;
        } else { // It is a tnt.rest.url
            url
                ._prefix(config.prefix)
                ._protocol(config.protocol)
                ._domain(config.domain)
                ._port(config.port);

            myurl = url();
        }
        if (data) { // POST
            return http.post ({
                "url": myurl,
                "body": data
            });
        }
        return http.get ({
            "url": myurl
        });
    });

    return rest;
};

module.exports = exports = tnt_rest;
