siterApp.config(['fieldHandlers', function(fieldHandlers) {

    var type = {
        template: SiterEditorialTemplates.fieldtypes.ezxmltext
    };


    fieldHandlers.add('ezxmltext',type);
}]);