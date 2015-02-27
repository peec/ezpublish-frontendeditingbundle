siterApp.directive('renderFieldType', ['fieldHandlers', '$injector', function(fieldHandlers, $injector) {

    function getFieldHandler(fieldDefinition) {

        var fieldHandler = fieldHandlers.get(fieldDefinition.fieldType);

        if (typeof fieldHandler === 'string') {
            // Its a factory, get it.
            fieldHandler = $injector.get(fieldHandler);
        }

        if (fieldHandler === null) {
            console.log("Could not load '"+fieldDefinition.identifier+"', fieldHandler for type " + fieldDefinition.fieldType + ". ");
        }
        return fieldHandler;
    }


    return {
        restrict: 'A',
        replace: true,
        scope: {
            ngModel: '=',
            type: '=',
            fillDefaults: '='
        },
        link: function(scope, ele, attr) {
            var fieldDefinition = scope.type;
            var fieldHandler = getFieldHandler(fieldDefinition);

            if (scope.fillDefaults) {
                scope.ngModel = {
                    fieldDefinitionIdentifier: fieldDefinition.identifier,
                    languageCode: siterApp.currentLanguage,
                    fieldValue: fieldDefinition.defaultValue
                };
            }
            if (fieldHandler) {
                scope.contentUrl = fieldHandler.template;
                if (typeof fieldHandler.link !== 'undefined') {
                    fieldHandler.link(scope,ele,attr);
                }
            } else {
                this.template = '';
            }


        },
        template:'<div ng-include="contentUrl"></div>'
    }
}]);



siterApp.factory('persistentObject', function () {
    return {
        data: {}
    };
});



siterApp.factory('objectRelationBrowser', ['$state',function($state) {

    return {
        stateActions: {},
        getEnabledStateActions: function () {
            return Object.keys(this.stateActions);
        },
        open: function (options) {
            localStorage.setItem()
            this.stateActions = options.stateActions;
            $state.go('content.location.browse', {startLocation: options.startLocation});
        }
    };
}]);


