angular.module('apiResource', [
    'ngCookies'
])
 .factory('apiResource', ['API_CONFIGS','$http', '$q','$cookies', function (API_CONFIGS, $http, $q,$cookies) {

     function ApiResourceFactory(collectionName) {

         var Resource = function (data) {
             if(data){
                 if(data.createdAt && data.createdAt != null)
                     data.createdAt = new Date(data.createdAt);

                 if(data.updatedAt && data.updatedAt != null)
                     data.updatedAt = new Date(data.updatedAt);

                 if(data.deletedAt && data.deletedAt != null)
                     data.deletedAt = new Date(data.deletedAt);
                 angular.extend(this, data);
             }
         };

         Resource.Configs = API_CONFIGS();

         Resource.IsForCurrentUser = true;

         //load additional variables if is not server side processing
         // pass session id and api key in each request
         var operationType = {INSERT :1, UPDATE:2, DELETE :3, GET:4};
         var defaultParams = {};

         var addDefaultInfo = function(data,type){
             switch(type){
                 case operationType.INSERT:
                     data.createdAt = Resource.dateToString(new Date());
                     data.deleted = false;
                     break;
                 case operationType.UPDATE:
                     data.updatedAt = Resource.dateToString(new Date());
                     break;
                 case operationType.DELETE:
                     data.deleted = true;
                     data.deletedAt = Resource.dateToString(new Date());
                     break;
             }
             return  data;
         };

         Resource.dataApi = API_CONFIGS().dataApi;

         Resource.getUrl = function(isForCurrentUser){
              return (isForCurrentUser === true ? Resource.dataApi.currentUserPath : Resource.dataApi.path) + '/' + collectionName ;
         };

         var onSuccessOrError = function(response, status, headers, config){
             return response;
         };

         var getError = function (response, errorcb) {
             var ecb = errorcb || onSuccessOrError;
             return ecb(response, response.status, response.headers, response.config);
         }

         var thenFactoryMethod = function (httpPromise, successcb, errorcb, withoutResourceObject, additionalParam) {
             var scb = successcb || onSuccessOrError;

             return httpPromise.then(function (response) {
                 if (response && response.data) {
                     response = response.data;
                     var result;
                     if (response instanceof Array) {
                         result = [];
                         for (var i = 0; i < response.length; i++) {
                             result.push(new Resource(response[i]));
                         }
                     }
                     else {
                         //MongoLab has rather peculiar way of reporting not-found items, I would expect 404 HTTP response status...
                         if (response === " null ") {
                             return $q.reject({
                                 code: 'resource.notfound',
                                 collection: collectionName
                             });
                         } else {
                             if (withoutResourceObject) {
                                 result = response;
                             }
                             else {
                                 result = new Resource(response);
                             }
                         }
                     }

                     return scb(result, response.status, response.headers, response.config, additionalParam);
                 }
                 else {
                     return getError(response, errorcb);
                 }

             }, function (error) {
                 return getError(error, errorcb);
             });
         };

         Resource.prototype.$get = function (isForCurrentUser, params, successcb, errorcb, withoutResourceObject) {
             params.deleted = false;
             var httpPromise = $http.get(Resource.getUrl(isForCurrentUser), {params: angular.extend({}, defaultParams, params)});
             return thenFactoryMethod(httpPromise, successcb, errorcb, withoutResourceObject);
         };

         Resource.prototype.$post = function ( data,  params, successcb, errorcb) {
             var httpPromise = $http.post(Resource.getUrl(false), addDefaultInfo(data, operationType.INSERT), {params: angular.extend({}, defaultParams, params)});
             return thenFactoryMethod(httpPromise, successcb, errorcb);
         };

         Resource.prototype.$put = function ( data, params, successcb, errorcb) {
             var httpPromise = $http.put(Resource.getUrl(false) + "/" + this.$id(), addDefaultInfo(data, operationType.UPDATE), {params: angular.extend({}, defaultParams, params)});
             return thenFactoryMethod(httpPromise, successcb, errorcb);
         };

         Resource.prototype.$partialDelete = function ( data, params, successcb, errorcb) {
             var httpPromise = $http.put(Resource.getUrl(false) + "/" + this.$id(), addDefaultInfo(data, operationType.DELETE), {params: angular.extend({}, defaultParams, params)});
             return thenFactoryMethod(httpPromise, successcb, errorcb);
         };

         Resource.prototype.$delete = function ( url, params, successcb, errorcb) {
             var httpPromise = $http['delete'](Resource.getUrl(false) + "/" + this.$id(), {params: angular.extend({}, defaultParams, params)});
             return thenFactoryMethod(httpPromise, successcb, errorcb);
         };

         Resource.query = function (isForCurrentUser, queryJson, successcb, errorcb, withoutResourceObject) {
             return this.queryPaged(isForCurrentUser, queryJson, null, null,successcb, errorcb, withoutResourceObject);
         };

        /*
         q=<query> - restrict results by the specified JSON query
         c=true - return the result count for this query
         f=<set of fields> - specify the set of fields to include or exclude in each document (1 - include; 0 - exclude)
         fo=true - return a single document from the result set (same as findOne() using the mongo shell
         s=<sort order> - specify the order in which to sort each specified field (1- ascending; -1 - descending)
         sk=<num results to skip> - specify the number of results to skip in the result set; useful for paging
         l=<limit> - specify the limit for the number of results (default is 1000)
         */

         var pageSize = Resource.Configs.pageSize;
         Resource.queryPaged = function (isForCurrentUser, queryJson, pageNo, sortingFields, successcb, errorcb, additionalParam) {
             if(queryJson == null )
                 queryJson = {};

             queryJson.deleted = false;

             var params = {};
             params.q = JSON.stringify(queryJson) ;

             if(pageNo != null) {
                 params.sk = pageNo * pageSize;
                 params.l = pageSize;
             }

             if(sortingFields != null) {
                 params.s = JSON.stringify(sortingFields);
             }

             var httpPromise = $http.get(Resource.getUrl(isForCurrentUser), {params: angular.extend({}, defaultParams, params)});
             return thenFactoryMethod(httpPromise, successcb, errorcb, false, additionalParam);
         };

         Resource.all = function (isForCurrentUser, cb, errorcb) {
             return Resource.query(isForCurrentUser,{}, cb, errorcb);
         };

         //instance methods // to be set for each object inherited from this
         Resource.prototype.$id = function () {
             if (this._id && this._id.$oid) {
                 return this._id.$oid;
             }
         };

         Resource.prototype.$getById = function ( id, successcb, errorcb) {
             return this.$get(Resource.getUrl(false) + "/" + id, {deleted: false}, successcb, errorcb);
         };

         Resource.getByIds = function (ids, successcb, errorcb) {
             var qin = [];
             angular.forEach(ids, function (id) {
                 qin.push({$oid: id});
             });
             return Resource.query({_id:{$in:qin}}, successcb, errorcb);
         };

         Resource.prototype.$save = function ( successcb, errorcb) {
             return this.$post( this, {}, successcb, errorcb);
         };

         Resource.prototype.$update = function (  successcb, errorcb) {
             return this.$put( angular.extend({}, this, {_id:undefined}), {}, successcb, errorcb);
         };

         Resource.prototype.$remove = function ( successcb, errorcb) {
             return this.$delete( {}, successcb, errorcb);
         };

         Resource.prototype.$partialRemove = function ( successcb, errorcb) {
             return this.$partialDelete( angular.extend({}, this, {_id:undefined}), {}, successcb, errorcb);
         };

         Resource.prototype.$saveOrUpdate = function ( savecb, updatecb, errorSavecb, errorUpdatecb) {
             if (this.$id()) {
                 return this.$update( updatecb, errorUpdatecb);
             } else {
                 return this.$save( savecb, errorSavecb);
             }
         };

         Resource.addZero = function(date){
             date = date + '';
             if(date && date.length == 1){
                 date = '0' + date;
             }
             return date;
         };

         Resource.dateToString = function(dateObject){
             if(dateObject ){
                 return Resource.addZero(dateObject.getMonth() + 1 )+ "/" +
                     Resource.addZero(dateObject.getDate()) + "/" + dateObject.getFullYear() + " " +
                     Resource.addZero(dateObject.getHours()) + ":" +
                     Resource.addZero(dateObject.getMinutes());
             }

             return "";
         };

         Resource.randomString = function (length) {
             var s = '';
             var randomchar = function () {
                 var n = Math.floor(Math.random() * 62);
                 if (n < 10) return n; //1-10
                 if (n < 36) return String.fromCharCode(n + 55); //A-Z
                 return String.fromCharCode(n + 61); //a-z
             }
             while (s.length < length) s += randomchar();
             return s;
         };

         return Resource;
     }

     return ApiResourceFactory;
 }]);
