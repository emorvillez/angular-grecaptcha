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

        this.$get = ['$q', '$window', '$document', function($q, $window, $document) {
            var deferred = $q.defer();
            
            // Define method called in global scope when recaptcha script is loaded.   
            $window[onloadMethod] = function() {
                deferred.resolve();
            };
            
            if (!$window.grecaptcha) {
                self._createScript($document[0]);
            } else {
                deferred.resolve();
            }

            return {
                create: function(element, ngModelCtrl) {
                    if (!_p || !_p.sitekey) {
                        throw new Error('Please provide your sitekey via setParameters');
                    }
                    deferred.promise.then(function() {
                        _p.callback = function(response) {
                            // set the response value in ngModel
                            ngModelCtrl.$setViewValue(response);
                        };
                        $window.grecaptcha.render(element, _p);
                    });
                },
                destroy: function() {
                    $window.grecaptcha.reset();
                }
            };
        }];

    }).directive('grecaptcha', ['grecaptcha', function(grecaptcha) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            link: function(scope, element, attrs, ngModelCtrl) {

                // Create Element
                grecaptcha.create(element[0], ngModelCtrl);

                // Destroy Element
                scope.$on('$destroy', grecaptcha.destroy);
            }
        };
    }]);