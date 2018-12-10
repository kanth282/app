/*
*Create and export environment variables
*
*/

// Container for all the environments
var environments = {};

//Staging (default) environment object
environments.staging = {
  'httpPort' : 3000,
  'httpsPort':3001,
  'envName' : "staging"
}

//Production environment object
environments.production = {
  'httpPort' : 5000,
  'httpsPort': 5001,
  'envName' : "production"
}

//Determine which environment should be send to command line
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ?  process.env.NODE_ENV. toLowerCase() : '';

//Check wheather the given environment is there in the above defined environments
var environmentsToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module
module.exports = environmentsToExport;
