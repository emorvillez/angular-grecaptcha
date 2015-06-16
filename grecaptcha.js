'use strict';

angular.module('grecaptcha', [])
    .provider('grecaptcha', function() {
        var _p = {},
            _l,
            self = this,
            onloadMethod = 'onRecaptchaScriptLoaded';

        this.setParameters = function(parameters) {
            _p = parameters;
        };

        this.setLanguage = function(languageCode) {
            _l = languageCode;
        };

        /**
         * Add script for Google recaptcha
         */
        this._createScript = function($document) {
            var scriptTag = $document.createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.defer = true;
            scriptTag.src = '//www.google.com/recaptcha/api.js?onload=' + onloadMethod + '&render=explicit' + (_l ? '&hl=' + _l : '');
            var s = $document.getElementsByTagName('body')[0];
            s.appendChild(scriptTag);
        };

        this.$get = ['$q', '$window', '$document', '$rootScope', function($q, $window, $document, $rootScope) {

            return {
                init: function() {
                    if ($window.grecaptcha) {
                        return $q.when();
                    }
                    var deferred = $q.defer();
                    // Define method called in global scope when recaptcha script is loaded.
                    $window[onloadMethod] = function() {
                        deferred.resolve();
                    };
                    self._createScript($document[0]);
                    return deferred.promise;
                },
                setLanguage: function(languageCode) {
                    if (_l === languageCode) return;

                    _l = languageCode;
                    delete $window.grecaptcha; // force reload scripts with new language
                },
                updateParameters: function(parameters) {
                    angular.extend(_p, parameters);
                },
                create: function(element, ngModelCtrl, params) {
                    params = angular.extend({}, _p, params);
                    if (!params.sitekey) {
                        throw new Error('Please provide your sitekey via setParameters');
                    }

                    function setValue(value) {
                        $rootScope.$apply(function() {
                            ngModelCtrl.$setViewValue(value);
                        });
                    }

                    _p.callback = setValue;
                    _p['expired-callback'] = setValue; // without arguments, value will be undefined
                    $window.grecaptcha.render(element, params);
                },
                reset: function() {
                    $window.grecaptcha.reset();
                }
            };
        }];

    })
    .directive('grecaptcha', ['grecaptcha', function(grecaptcha) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                params: '=?grecaptchaParams'
            },
            link: function(scope, element, attrs, ngModelCtrl) {

                grecaptcha.init()
                    .then(function() {
                        // Create Element
                        grecaptcha.create(element[0], ngModelCtrl, scope.params);

                        // Destroy Element
                        scope.$on('$destroy', grecaptcha.reset);
                    });
            }
        };
    }]);
