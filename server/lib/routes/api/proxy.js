var url = require('url');
var qs = require('querystring');
var https = require('https');

module.exports = function(config, isForCurrentUser) {
    console.log( "Proxying MongoLab" );

    var mongo = config.database.mongo;
    var basePath =  mongo.apiUrl,
    apiKey = mongo.apiKey,
    basePath  = basePath + '/' + mongo.dbName + '/collections' ;

  console.log('Proxying MongoLab at', basePath, 'with', apiKey);
  basePath = url.parse(basePath);

  // Map the request url to the mongolab url
  // @Returns a parsed Url object
  var mapUrl = module.exports.mapUrl = function(req, isForCurrentUser) {
    var reqUrl = url.parse(req.url, true);
    var newUrl = {
      hostname: basePath.hostname,
      protocol: basePath.protocol
    };

      console.log(isForCurrentUser + ', ' + reqUrl);
    var query = { apiKey: apiKey};
      var hasQ=false;
    for(var key in reqUrl.query) {
        query[key] = reqUrl.query[key];
        if(key == 'q' && isForCurrentUser && query[key]){
            hasQ = true;
            var x = JSON.parse(query[key]);
            x.userId =  req.user._id.$oid;
            query[key] = JSON.stringify(x);
        }
    }
      if(hasQ == false && isForCurrentUser){
          query.q = JSON.stringify ({userId :  req.user._id.$oid});
      }
    // https request expects path not pathname!
    var collection =   reqUrl.pathname.replace(isForCurrentUser ? config.dataApi.currentUserPath : config.dataApi.path, '');
    newUrl.path = basePath.pathname + collection + '?' + qs.stringify(query);

      console.log('Mongo Lab request at : ' + newUrl.protocol +'//' +  newUrl.hostname + newUrl.path);
    return newUrl;
  };


  // Map the incoming request to a request to the DB
  var mapRequest = module.exports.mapRequest = function(req) {
    var newReq = mapUrl(req, isForCurrentUser);
    newReq.method = req.method;
    newReq.headers = req.headers || {};
    // We need to fix up the hostname
    newReq.headers.host = newReq.hostname;
    return newReq;
  };

  var proxy = function(req, res, next) {
    try {
      var options = mapRequest(req);
      // Create the request to the db
      var dbReq = https.request(options, function(dbRes) {
        var data = "";
        res.headers = dbRes.headers;
        dbRes.setEncoding('utf8');
        dbRes.on('data', function(chunk) {
          // Pass back any data from the response.
          data = data + chunk;
        });
        dbRes.on('end', function() {
        //  res.header('Content-Type', dbRes.'application/json');
          res.statusCode = dbRes.statusCode;
          res.httpVersion = dbRes.httpVersion;
          res.trailers = dbRes.trailers;
          res.send(data);
          res.end();
        });
      });
      // Send any data the is passed from the original request
      dbReq.end(JSON.stringify(req.body));
    } catch (error) {
      console.log('ERROR: ', error.stack);
      res.json(error);
      res.end();
    }
  };

  // Attach the mapurl fn (mostly for testing)
  proxy.mapUrl = mapUrl;
  proxy.mapRequest = mapRequest;
  return proxy;
};