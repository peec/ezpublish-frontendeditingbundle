
siterApp.factory('fieldType_ezobjectrelation', ['objectRelationBrowser',function (objectRelationBrowser) {
    var type = {
        template: SiterEditorialTemplates.fieldtypes.ezobjectrelation,
        link: function (scope) {

            scope.openRelationBrowser = function () {
                objectRelationBrowser.open({
                    stateActions: {
                        'pick_single': function (location) {
                            console.log(location);
                        }
                    },
                    startLocation: '/1/2/'
                });
            };

        }
    };
    return type;
}]);

siterApp.config(['fieldHandlers', function(fieldHandlers) {
    fieldHandlers.add('ezobjectrelation', 'fieldType_ezobjectrelation');
}]);