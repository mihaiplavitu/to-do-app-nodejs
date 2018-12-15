var requireIfExists = require('../app_modules/requireIfExists.js')
var localConfigValues = requireIfExists('../config/localConfig');

module.exports = {
    getDbConnectionString: function() {
        var dbUsername = process.env.DBUSERNAME || localConfigValues.username;
        var dbPass = process.env.DBPASS || localConfigValues.pass;
        return 'mongodb://' + dbUsername + ':' + dbPass + '@ds139992.mlab.com:39992/nodetodo';
    }
};
