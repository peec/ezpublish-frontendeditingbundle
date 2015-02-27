
siterApp.factory('httpRequestInterceptor', ['$q', function ($q) {
    return {
        request: function (config) {

            // use this to destroying other existing headers
            config.headers['X-CSRF-Token'] = siterApp.token;

            return config;
        },

        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (rejection) {
            if(rejection.status === 401) {
                window.location = "/login";
            }
            return $q.reject(rejection);
        }
    };
}]);



siterApp.config(function($httpProvider, $locationProvider) {
    var token = $('meta[name="csrf-token"]').attr('content');
    siterApp.token = token;
    $httpProvider.interceptors.push('httpRequestInterceptor');



    var contentId = $('meta[name="content-id"]').attr('content');
    siterApp.mainContentId = contentId;
    var versionNo = $('meta[name="version-id"]').attr('content');
    siterApp.mainContentVersionNo = versionNo;

});


siterApp.config(function($stateProvider, $urlRouterProvider) {



    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                left: {
                    controller: ['$scope', 'siterViewHelpers', 'eZAPI', function ($scope, siterViewHelpers, eZAPI) {
                        $scope.availableDroppableContentTypes = siterViewHelpers.getAllDropableContentTypes();
                        eZAPI.getContentTypes().success(function (data) {
                            $scope.contentTypes =eZAPI.decorate(data, 'ContentTypeInfoList.ContentType');
                            $scope.pageContentTypes = $scope.contentTypes.filter(function (contentType) {
                                return $scope.availableDroppableContentTypes.indexOf(contentType.identifier) !== -1;
                            });
                        });
                    }],
                    template: '<ul class="sidebar-nav"><li class="drag-object"  ng-repeat="item in pageContentTypes"><a href="#" ng-drag="true" ng-drag-data="item"><span class="contentype-icon-{{ item.identifier }}"></span>{{ item.computed.name }}</a></li> </ul>'
                },
                app: {
                    controller: ['$scope', 'siterViewHelpers', 'eZAPI', function ($scope, siterViewHelpers, eZAPI) {
                        $scope.mainContentId = siterApp.mainContentId;
                        $scope.mainContentVersionNo = siterApp.mainContentVersionNo;

                        $scope.toggleMenu = function() {
                            $("#wrapper").toggleClass("toggled-left");
                            $(this).toggleClass("toggled-left");
                        };

                    }],
                    template: '<a  ng-click="toggleMenu()" id="menu-toggle"></a><ul class="editor-toolbar-actions"><li><a ui-sref="content.versioncreate({id: mainContentId, versionNo: mainContentVersionNo})" class="btn"><span class="fa fa-edit"></span></a></li></ul>'
                }
            }
        })
        .state('content', {
            controller: 'ContentCtrl',
            abstract: true
        })
        .state('content.create', {
            url: '/content/create/:contentTypeId/:parentLocationId',

            views: {
                'app@': {
                    templateUrl: SiterEditorialTemplates.contentedit,
                    controller: 'ContentCreateCtrl'
                },

                'right@': {
                    templateUrl: SiterEditorialTemplates.contentcreate_actions,
                    controller: 'ContentCreateActionCtrl'
                }
            }
        })
        .state('content.versioncreate', {
            url: '/content/edit/:id/:versionNo',
            views: {
                'app@': {
                    controller: 'ContentVersionCreateCtrl'
                }
            }
        })
        .state('content.versionedit', {
            url: '/content/versionedit/:id/:versionNo',
            views: {
                'right@': {
                    templateUrl: SiterEditorialTemplates.contentversionedit_actions,
                    controller: 'ContentVersionEditActionCtrl'
                },
                'app@': {
                    templateUrl: SiterEditorialTemplates.contentversionedit,
                    controller: 'ContentVersionEditCtrl'
                }
            }
        })
        .state('content.location', {
            abstract: true
        })
        .state('content.location.browse', {
            url: '/content/location/browse/:startLocation',
            views: {
                'app@': {
                    templateUrl: SiterEditorialTemplates.location_browse,
                    controller: 'LocationBrowseCtrl'
                }
            }
        });

});

siterApp.run(function ($rootScope) {

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
            if (toState.name.indexOf('content') === 0) {
                $('.editor-toolbar').addClass('content-editing');
                $('#wrapper').addClass('toggled-left');
                $('#wrapper').removeClass('toggled-right');

            } else {
                $('#wrapper').addClass('toggled-left');
                $('#wrapper').addClass('toggled-right');
                $('.editor-toolbar').removeClass('content-editing');
            }
        });
});