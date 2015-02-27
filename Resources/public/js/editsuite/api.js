
siterApp.factory('eZAPIDecorator', function($http) {

    var extendCollection = function (data, callee) {
        angular.forEach(data, function (item, key){
            data[key] = angular.extend(item, {computed: callee(item)});
        });
        return data;
    };

    var i18nfield = function (list) {
        return list[0]['#text'];
    }

    return {
        'ContentType': function (data) {
            return {
                name: i18nfield(data.names.value)
            };
        },
        'FieldDefinition': function (data) {
            return {
                name: i18nfield(data.names.value)
            };
        },
        'ContentTypeInfoList.ContentType': function (data) {
            return extendCollection(data, this.ContentType);
        },
        'FieldDefinitions.FieldDefinition': function (data) {
            return extendCollection(data, this.FieldDefinition);
        }
    }
});


siterApp.factory('eZAPI', ['$http', 'eZAPIDecorator', '$q', function($http, eZAPIDecorator, $q) {
    var api = "/api/ezp/v2/";
    var cache = {};
    function adr (uri) {
        return api + uri;
    }
    return {
        getContentTypes: function () {
            return $http.get(adr('content/types'));
        },
        getContentTypeFieldDefinitions: function(id) {
            // /content/types/<ID>/draft
            return $http.get(adr('content/types/' + id + '/fieldDefinitions'));
        },
        getRelation: function(obj) {
            return $http.get(obj._href);
        },
        postContentObject: function (contentObject) {
            return $http({
                method: 'POST',
                url: adr('content/objects'),
                data: contentObject,
                headers: {
                    'Content-type': 'application/vnd.ez.api.ContentCreate+json',
                    'Accept': 'application/vnd.ez.api.ContentInfo+json'
                },
                dataType: 'json'
            });
        },
        createContentObjectVersion: function (contentId, versionNo) {
            return $http({
                method: 'POST',
                url: adr('content/objects/' + contentId + "/versions/" + versionNo),
                headers: {
                    'Accept': 'application/vnd.ez.api.Version+json',
                    'X-HTTP-Method-Override': 'COPY'
                },
                dataType: 'json'
            });
        },
        deleteContentObjectVersion: function (contentId, versionNo) {
            return $http({
                method: 'DELETE',
                url: adr('content/objects/' + contentId + "/versions/" + versionNo),
                dataType: 'json'
            });
        },
        patchContentObjectVersion: function (contentId, versionNo, data) {
            return $http({
                method: 'PATCH',
                url: adr('content/objects/' + contentId + "/versions/" + versionNo),
                data: data,
                headers: {
                    'Content-type': 'application/vnd.ez.api.VersionUpdate+json'
                },
                dataType: 'json'
            });
        },
        getContentObject: function (id, versionNo) {
            return $http.get(adr('content/objects/' + id + '/versions/' + versionNo));
        },
        getChildLocations: function (path, success) {
            return $http.get(adr('content/locations'+path+'children')).success(function (data) {
                var promises = [];
                angular.forEach(data.LocationList.Location, function (location, index) {
                    promises.push($http.get(location._href));
                })



                $q.all(promises).then(function (promises) {
                    var objects = [];
                    var contentPromises = [];

                    angular.forEach(promises, function (promise) {
                        var o = promise.data.Location;

                        contentPromises.push($http.get(o.Content._href));
                        objects.push(o);
                    });

                    $q.all(contentPromises).then(function (contentPromises) {

                        angular.forEach(contentPromises, function (contentPromise, key) {
                            objects[key].Content = contentPromise.data.Content;
                        });
                        success(objects);
                    });
                });
            });
        },
        publishContentObjectVersion: function (id, versionNo) {

            return $http({
                method: 'POST',
                url: adr('content/objects/' + id + '/versions/' + versionNo),
                headers: {
                    'X-HTTP-Method-Override': 'PUBLISH'
                },
                dataType: 'json'
            });
        },
        decorate: function (data, type) {
            var object = data;
            angular.forEach(type.split('.'), function(value) {
                object = object[value];
            });
            return eZAPIDecorator[type](object);
        }
    };
}]);

