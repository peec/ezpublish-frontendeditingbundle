// app.js
var siterApp = angular.module('siterApp', ['ngDraggable', 'ui.router']);
siterApp.currentLanguage = 'nor-NO';

siterApp.resizeToolbar = function () {
    var toolbarheight = $(".editor-toolbar").outerHeight();
    $('#wrap').css('padding-top', toolbarheight + 'px');
};



siterApp.constant("fieldHandlers", {
    fieldHandlers: {},
    get: function (identifier) {
        return typeof this.fieldHandlers[identifier] !== 'undefined' ? this.fieldHandlers[identifier] : null;
    },
    add: function (identifier, object) {
        this.fieldHandlers[identifier] = object;
    }
});


/**
 * Vanilla jQuery, Global stuff with toolbar.
 */
$(function () {
    $(window).resize(siterApp.resizeToolbar);
    siterApp.resizeToolbar();
});