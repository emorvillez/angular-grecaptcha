angular-grecaptcha
==================

Angular implementation of Google recaptcha: https://developers.google.com/recaptcha/

bower
-----
`bower install angular-recaptcha --save`

npm
-----
`npm install angular-recaptcha --save-dev`

configuration
-----

>grecaptchaProvider.setLanguage(languageCode)

list of ***languageCode*** : https://developers.google.com/recaptcha/docs/language

>grecaptchaProvider.setParameters(parameters);

parameters = {
	***sitekey***: 'yoursitekey',
	theme: '***light***|dark',
	type: 'audio|***image***,
})

runtime configuration
-----
>grecaptcha.updateParameters(parameters);

##inline configuration

```HTML
<div grecaptcha ng-model="captcha" grecaptcha-params="{theme:'dark'}"></div>
```

example
-----

```HTML
<!doctype html>
<html class="no-js" ng-app="myModule">
<head>
    <meta charset="utf-8">
    <title>angular-grecaptcha</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">    
</head>
<body>
    <div class="container">
        <h1>angular-grecaptcha example</h1>
        <form role="form" name="myForm" ng-controller="FormCtrl" ng-submit="submit()">
            <div class="form-group">
                <div grecaptcha ng-model="captcha"></div>
                <button type="submit" class="btn btn-primary">submit</button>
            </div>
        </fieldset>
    </form>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.4/angular.min.js"></script>
<script src="grecaptcha.js"></script>
<script type="text/javascript">
    angular
    .module('myModule', ['grecaptcha'])
    .config(function(grecaptchaProvider) {
        grecaptchaProvider.setParameters({
            sitekey: 'your key here',
            theme: 'light'
        });
    })
    .controller('FormCtrl', function($scope) {
        $scope.submit = function() {
            console.log("submit : ", $scope.captcha);
        };
    });
</script>
</body>
</html>
````
