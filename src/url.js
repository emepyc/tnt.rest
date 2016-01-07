var apijs = require("tnt.api");

var urlModule = function () {    
    var paramPattern = /:\w+/g;

    var config = {
        prefix: "",
        protocol: "http",
        domain: "",
        port: "",
        endpoint: "",
        parameters: {},
        fragment: ""
    };

    // URL Method
    var url = function () {
        return getUrl();
    };

    var api = apijs (url);
    api.getset(config);

    // Checks if the value is a string or an array
    // If array, recurse over all the available values
    function query1 (key) {
        var val = config.parameters[key];
        if (typeof val ===  "string") {
            return val;
        }
        // Assume array
        var val1 = val.shift();
         if (val.length) {
            return val1 + "&" + key + "=" + query1(key);
        }
        return val1;
    }

    function queryString() {
        // We add 'content-type=application/json'
        if (config.parameters["content-type"] === undefined) {
            config.parameters["content-type"] = "application/json";
        }
        var qs = Object.keys(config.parameters).map(function (key) {
            return key + "=" + query1(key);
        }).join("&");
        return qs ? ("?" + qs) : qs;
    }

    //
    function getUrl() {
        var endpoint = config.endpoint;

        var substEndpoint = endpoint.replace(paramPattern, function (match) {
            match = match.substring(1, match.length);
            var param = config.parameters[match] || "";
            delete config.parameters[match];
            return param;
        });

        var url = config.prefix + config.protocol + "://" + config.domain + (config.port ? ":" + port : "") + "/" + substEndpoint + queryString() + (config.fragment ? "#" + config.fragment : "");
        return url;
    }

    return url;
};

module.exports = exports = urlModule;
