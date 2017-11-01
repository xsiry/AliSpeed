define(function (require) {
    require('checkbix');
    Checkbix.init();
    var module = require('./module');
    module.init();
});
