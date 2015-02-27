siterApp.config(['fieldHandlers', function(fieldHandlers) {

    var type = {
        template: SiterEditorialTemplates.fieldtypes.ezboolean
    };


    fieldHandlers.add('ezboolean',type);
}]);