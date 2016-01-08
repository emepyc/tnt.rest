var tnt_rest = require("../../index.js");

var rest = tnt_rest()
    .domain("rest.ensembl.org");

var url = rest.url()
    .endpoint("xrefs/symbol/:species/:id")
    .parameters({
	"species": "human",
	"id": "BRCA1",
	"object_type": "gene"
    });

rest.call(url)
    .then (function (resp) {
	console.log(resp);
    });
