var tnt_rest = require("../index.js");
var assert = require("chai").assert;
var xmldoc = require('xmldoc');

describe('TnT REST', function () {

    beforeEach (function () {
        rest = tnt_rest()
            .domain("rest.ensembl.org");
    });

    describe ('url', function () {
        beforeEach (function () {
            url = rest.url();
        });
        it ("Exists", function () {
            assert.isDefined(url);
            assert.isFunction(url);
        });

        it ("Has the endpoint method (getter/setter)", function () {
            var endpoint = "/my/:endpoint/";
            assert.isDefined(url.endpoint);
            assert.isFunction(url.endpoint);
            url.endpoint(endpoint);
            assert.equal(url.endpoint(), endpoint);
        });

        it("Has the parameters method (getter/setter)", function () {
            assert.isDefined(url.parameters);
            assert.isFunction(url.parameters);
            url.parameters({
                "option1": 1,
                "option2": 2
            });
            var p = url.parameters();
            assert.property(p, "option1");
            assert.equal(p.option1, 1);
            assert.equal(p.option2, 2);
        });

        it ("Formats the url", function () {
            url
                .endpoint("xrefs/symbol/:species/:id")
                .parameters({
                    "species": "human",
                    "id": "BRCA1",
                    "object_type": "gene"
                });
            var urlStr = url();
            assert.isDefined(urlStr);
            assert.equal(typeof(urlStr), "string");
        });
    });

    describe ("api", function () {
        beforeEach(function () {
            url = rest.url()
                ._domain("rest.ensembl.org")
                .endpoint("xrefs/symbol/:species/:id")
                .parameters({
                    "species": "human",
                    "id": "BRCA1",
                });

        });

        it("Exists and is called rest", function () {
            assert.isDefined(tnt_rest);
        });

        it("Has a call method", function () {
            assert.isDefined(tnt_rest.call);
            assert.isFunction(tnt_rest.call);
        });

        it ("Has the prefix method (getter/setter)", function () {
            var prefix = "my/prefix";
            assert.isDefined(rest.prefix);
            assert.isFunction(rest.prefix);
            rest.prefix(prefix);
            assert.equal(rest.prefix(), prefix);
        });

        it("Has a domain method (getter/setter)", function () {
            var domain = "mydomain";
            assert.isDefined(rest.domain);
            assert.isFunction(rest.domain);
            rest.domain(domain);
            assert.equal(rest.domain(), domain);
        });

        it("Has a port method (getter/setter)", function () {
            var port = 4444;
            assert.isDefined(rest.port);
            assert.isFunction(rest.port);
            rest.port(port);
            assert.equal(rest.port(), port);
        });

        it ("Accepts a string as parameter", function (done) {
            rest.call(url)
                .then(function (resp) {
                    assert.isArray(resp.body);
                    assert.notEqual(resp.body.length, 0);
                    done();
                });
        });

        it ("Accepts a url object as parameter", function (done) {
            rest.call(url)
                .then (function (resp) {
                    assert.isArray(resp.body);
                    assert.notEqual(resp.body.length, 0);
                    done();
                });
        });

        it ("Makes POST request if a second parameter is passed", function (done) {
            var url = rest.url()
                .endpoint("lookup/id");

            rest.call(url, {
                "ids" : ["ENSG00000157764", "ENSG00000248378" ]
            })
                .then (function (resp) {
                    assert.isDefined (resp.body);
                    assert.isDefined (resp.body.ENSG00000157764);
                    assert.isDefined (resp.body.ENSG00000248378);
                    done();
                });
        });


        it ("Can reuse the same rest instance for different urls", function (done) {
            this.timeout(10000);
            var getGene = function () {
                var xrefsUrl = rest.url()
                    .endpoint("xrefs/symbol/:species/:id")
                    .parameters({
                        "species": "human",
                        "id": "BRCA1",
                        "object_type": "gene"
                    });
                return rest.call(xrefsUrl);
            };

            var parseGene = function (resp) {
                var info = resp.body;
                assert.isArray(info);
                assert.notEqual(info.length, 0);
                var genes = info.filter (function (g) {
                    return g.id.substring(0, 4) === "ENSG";
                });
                return genes[0].id;
            };

            var getGeneTree = function (id) {
                var geneTreeUrl = rest.url()
                    .endpoint("genetree/member/id/:id")
                    .parameters({
                        "id": id
                    });
                return rest.call(geneTreeUrl);
            };

            getGene()
                .then(parseGene)
                .then (getGeneTree)
                .then (function (resp) {
                    var tree = resp.body;
                    assert.isDefined(tree);
                    assert.isObject(tree);
                    assert.equal(tree.type, "gene tree");
                    done();
                });

        });

        it("Fires the error callback on wrong url", function (done) {
            rest.call("http://rest.ensembl.org/xxxxx") // wrong url
                .catch (function (err) {
                    assert.isDefined(err);
                    assert.equal(err.status, 404);
                    assert.isTrue(err.isHttpError);
                    done();
                });
        });

    });

});
