siterApp.config(['fieldHandlers', function(fieldHandlers) {

    var type = {
        template: SiterEditorialTemplates.fieldtypes.ezstring
    };


    fieldHandlers.add('ezstring',type);
}]);