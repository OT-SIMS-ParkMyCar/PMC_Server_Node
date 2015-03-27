var env = process.env.NODE_ENV || 'development';


var _ = require('lodash');

//Load default config
var config = require('./environments/default');

//Update config with the environnement
try{
	switch(env){
		case 'development':
			_.assign(config, require('./environments/development'));
			//If development update with the user config
			_.assign(config, require('./environments/dev-user'));
		break;
		case 'test':
			_.assign(config, require('./environments/test'));
		break;
		case 'production':
			_.assign(config, require('./environments/production'));
		break;
	}
}
catch(err){
	console.log("Config: " + err);
}
console.log(config);
module.exports = config;