siterApp.config(['fieldHandlers', function(fieldHandlers) {

    var type = {
        template: SiterEditorialTemplates.fieldtypes.ezurl
    };


    fieldHandlers.add('ezurl',type);
}]);