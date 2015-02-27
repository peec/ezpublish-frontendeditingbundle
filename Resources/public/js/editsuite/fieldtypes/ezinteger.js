siterApp.config(['fieldHandlers', function(fieldHandlers) {

    var type = {
        template: SiterEditorialTemplates.fieldtypes.ezinteger
    };


    fieldHandlers.add('ezinteger',type);
}]);