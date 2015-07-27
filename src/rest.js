var http = require("httpplease");
var apijs = require("tnt.api");
var promises = require('httpplease-promises');
var Promise = require('es6-promise').Promise;
var json = require("httpplease/plugins/json");
http = http.use(json).use(promises(Promise));

tnt_rest = function () {
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

    // Prefixes to use the REST API.
    //var proxyUrl = "https://rest.ensembl.org";
    //var prefix_region = prefix + "/overlap/region/";
    //var prefix_ensgene = prefix + "/lookup/id/";
    //var prefix_xref = prefix + "/xrefs/symbol/";
    //var prefix_homologues = prefix + "/homology/id/";
    //var prefix_chr_info = prefix + "/info/assembly/";
    //var prefix_aln_region = prefix + "/alignment/region/";
    //var prefix_gene_tree = prefix + "/genetree/id/";
    //var prefix_assembly = prefix + "/info/assembly/";
    //var prefix_sequence = prefix + "/sequence/region/";
    //var prefix_variation = prefix + "/variation/";

    // Number of connections made to the database

    var rest = {};

    var api = apijs (rest);
    api.getset (config);

    api.method ('url', function () {
        var url = getUrl();
        return url;
    });


    api.method ('call', function (url, data) {
        if (data) { // POST
            return http.post ({
                "url": url,
                "body": data
            });
        }
        return http.get ({
            "url": url
        });
    });

    function queryString() {
        // We add 'content-type=application/json'
        if (config.parameters["content-type"] === undefined) {
            config.parameters["content-type"] = "application/json";
        }
        var qs = Object.keys(config.parameters).map(function (key) {
            return key + "=" + config.parameters[key];
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

    return rest;
};

module.exports = exports = tnt_rest;
