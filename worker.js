importScripts("node_modules/sql.js/js/sql.js");
//Init sqlite database
var db = new SQL.Database();
//Our test function
var run_sql = function (numReq, sql) {
    var n = numReq || 10000;
    var results = [];
    var elapsed = 0;
    var stmt = db.prepare(sql || "select datetime() as dt;");

    var start = (new Date()).getTime();
    for (var i = 0; i < n; i++) {
        var rows = stmt.getAsObject({});
        results.push(rows);
        if (results.length == n) {
            var end = (new Date()).getTime();
            elapsed = "Elapsed sql statement:" + (end - start).toString() + " ms #Rows: " + results.length.toString();
        }
    }
    stmt.free();

    return elapsed;
}
//Run code to init JIT compilation
run_sql();
//Message Handler
onmessage = function (oEvent) {
    postMessage({
        "id": oEvent.data.id,
        "evaluated": process(oEvent.data.code)
    });
}

function process(code) {
    var result = null;
    try {
        result = eval(code);

    } catch (e) {
        result = "Error: " + e.message;
    }
    return result;
}