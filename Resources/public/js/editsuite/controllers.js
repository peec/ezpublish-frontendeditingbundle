

siterApp.controller('SiterEditorialCtrl', [
    '$scope', '$http', 'eZAPI', 'siterViewHelpers', '$state',
    function ($scope, $http, eZAPI, siterViewHelpers, $state) {


    $scope.dropNewChildComplete = function (data,event) {
        var childParent = siterViewHelpers.getCloestChildPanel(jQuery(event.event.target));
        var locationId = childParent.data('location');

        $state.go("content.create", {contentTypeId: data.id, parentLocationId: locationId});

    };

    $scope.dropNewChildHitCheck = function (data,event) {
        var childParent = siterViewHelpers.getCloestChildPanel(jQuery(event.event.target));
        var types = childParent.data('allowed_contenttypes');
        return types.indexOf(data.identifier) !== -1;
    };

    }]
);


siterApp.controller('ContentCtrl',  [
    '$scope', '$stateParams', 'eZAPI',
    function($scope, $stateParams, eZAPI){



    }]
);

siterApp.controller('ContentCreateCtrl',  [
    '$scope', '$stateParams', 'eZAPI', '$state', 'persistentObject',
    function($scope, $stateParams, eZAPI, $state, persistentObject){
        $scope.fillDefaults = true;

        persistentObject.data = {
            ContentType: {
                _href: '/api/ezp/v2/content/types/' + $stateParams.contentTypeId
            },
            mainLanguageCode: siterApp.currentLanguage,
            LocationCreate: {
                ParentLocation: {
                    _href: '/api/ezp/v2/content/locations/' + $stateParams.parentLocationId
                },
                "priority": "0",
                hidden: "false",
                sortField: 'PRIORITY',
                sortOrder: 'ASC'
            },
            alwaysAvailable: 'true',
            fields: {field: []}
        };
        $scope.contentObject = persistentObject.data;




        $scope.getFieldDefs = function (contentTypeId) {
            eZAPI.getContentTypeFieldDefinitions(contentTypeId).success(function (data) {
                $scope.fieldDefinitions = eZAPI.decorate(data, 'FieldDefinitions.FieldDefinition');

            });
        };

        $scope.getFieldDefs($stateParams.contentTypeId);


        $scope.saveContent  = function () {

            eZAPI.postContentObject({ContentCreate: $scope.contentObject}).success(function (data) {
                eZAPI.publishContentObjectVersion(data.Content._id, 1).success(function () {
                    $state.go('home').done(function () {
                        location.reload();
                    });
                })
            });

        };
        $scope.disregardAction = function () {
            $state.go('home');
        };

    }]
);


siterApp.controller('ContentCreateActionCtrl',  [
    '$scope', '$stateParams', 'eZAPI', '$state', 'persistentObject',
    function($scope, $stateParams, eZAPI, $state, persistentObject){

        $scope.saveContent  = function () {

            eZAPI.postContentObject({ContentCreate: persistentObject.data}).success(function (data) {
                eZAPI.publishContentObjectVersion(data.Content._id, 1).success(function () {
                    $state.go('home').done(function () {
                        location.reload();
                    });
                })
            });

        };
        $scope.disregardAction = function () {
            $state.go('home');
        };

    }]
);



siterApp.controller('ContentVersionCreateCtrl',  [
    '$scope', '$stateParams', 'eZAPI', '$state',
    function($scope, $stateParams, eZAPI, $state){

        eZAPI.createContentObjectVersion($stateParams.id, $stateParams.versionNo).success(function (version) {
            $state.go('content.versionedit', {id: $stateParams.id, versionNo: version.Version.VersionInfo.versionNo});
        });
    }]
);


siterApp.controller('ContentVersionEditCtrl',  [
    '$scope', '$stateParams', 'eZAPI', '$state', 'persistentObject',
    function($scope, $stateParams, eZAPI, $state, persistentObject){



        $scope.getFieldDefs = function (contentTypeId) {
            eZAPI.getContentTypeFieldDefinitions(contentTypeId).success(function (data) {
                $scope.fieldDefinitions = eZAPI.decorate(data, 'FieldDefinitions.FieldDefinition');

            });
        };

        eZAPI.getContentObject($stateParams.id, $stateParams.versionNo).success(function (version) {
            eZAPI.getRelation(version.Version.VersionInfo.Content).success(function (content) {
                eZAPI.getRelation(content.Content.ContentType).success(function (contentType) {
                    $scope.getFieldDefs(contentType.ContentType.id);

                    persistentObject.data = version;
                    $scope.versionObject = persistentObject.data;

                });
            });
        });


    }]
);

siterApp.controller('ContentVersionEditActionCtrl',  [
    '$scope', '$stateParams', 'eZAPI', '$state', 'persistentObject',
    function($scope, $stateParams, eZAPI, $state, persistentObject){

        $scope.persistentObject = persistentObject.data;

        $scope.disregardAction = function () {
            eZAPI.deleteContentObjectVersion($stateParams.id, $stateParams.versionNo).success(function () {
                $state.go('home');
            });
        }

        $scope.saveContent  = function () {
            eZAPI.patchContentObjectVersion($stateParams.id, $stateParams.versionNo, {
                VersionUpdate: {
                    fields: {
                        field: persistentObject.data.Version.Fields.field
                    }
                }
            }).success(function () {

            });
        };

        $scope.copyVersionAction = function () {
            $state.go('content.versioncreate', {id: $stateParams.id, versionNo: $stateParams.versionNo});
        };

        $scope.publishAction = function () {
            eZAPI.patchContentObjectVersion($stateParams.id, $stateParams.versionNo, {
                VersionUpdate: persistentObject.data.Version
            }).success(function () {
                eZAPI.publishContentObjectVersion($stateParams.id, $stateParams.versionNo).success(function () {
                    $state.go('home').done(function () {
                        location.reload();
                    });
                });
            });
        };

    }]
);

siterApp.controller('LocationBrowseCtrl',  [
    '$scope', '$stateParams', 'eZAPI', '$state', 'objectRelationBrowser',
    function($scope, $stateParams, eZAPI, $state, objectRelationBrowser){
        var loc = $stateParams.startLocation;

        var pathArray = loc.split('/');
        var parentLoc = pathArray.slice(0, pathArray.length - 2).join('/') + '/';

        $scope.actionEnabled = objectRelationBrowser.getEnabledStateActions();



        $scope.pathArray = pathArray;


        $scope.previousLevel = function () {
            $state.go('content.location.browse', {startLocation: parentLoc});
        };


        $scope.navigateTo = function (location) {
            console.log(location);
            $state.go('content.location.browse', {startLocation: location.pathString});
        };



        eZAPI.getChildLocations(loc, function (data) {
            $scope.childLocations = data;
            console.log(data);
        });


    }]
);



