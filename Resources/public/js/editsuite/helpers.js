

siterApp.factory('siterViewHelpers', function() {
    return {
        getDropables: function () {
            return jQuery('*[data-dropablecontent]');
        },
        getAllDropableContentTypes: function () {
            var dropables = this.getDropables();
            var types = [];
            dropables.each(function () {
                var data = $(this).data('allowed_contenttypes');
                angular.forEach(data, function (item) {
                    if (types.indexOf(item) === -1) {
                        types.push(item);
                    }
                });
            });
            return types;
        },
        getCloestChildPanel: function (childParent) {
            if (childParent.data().hasOwnProperty("dropablecontent")) {
                return childParent;
            } else {
                // Traverse upwards.
                return childParent.closest('[data-dropablecontent]');
            }
        }
    };
});

