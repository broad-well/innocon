/**
 * config.ts
 *
 * Configuration file for MPInnocon server
 */
/// <reference path="../typings/index.d.ts" />

module.exports = {
    // Product metadata
    'productName': 'nouvEnergy',
    'productVersion': 1,

    // Filesystem paths
    'homePath': '/projects/innocon/',
    'productFolder': 'products/',

    // Adjustable parameters
    'calcForm': [
        { '@type': 'header',
          display: 'Transportation' },

        {   id: 'mpg',
           '@type': 'range',
            display: 'What is the average Miles Per Gallon (MPG) of your family vehicle(s)?',
            tip: 'Check manufacturer website(s) for this information',
            low: 1, high: Infinity,
            handle: (score, context, val) => {} },

        { id: 'mpd',
         '@type': 'range',
          display: 'How many miles do your family vehicle(s) achieve per day?',
          low: 0, high: 300,
          handle: (score, context, val) => score -= val * 3.6525 / context.values.mpg },

        {   id: 'air-mpm',
           '@type': 'range',
            display: 'On average, how many miles do you travel on a jet airplane per month?',
            low: 0, high: 300000,
            handle: (score, context, val) => score -= val * .04},

        { id: 'taxi-mpw',
         '@type': 'number',
          display: 'On average, how many miles do you travel in a taxi per week?',
          tip: 'This includes Uber, Lyft, etc.',
          handle: (score, context, val) => score -= val / 40 * 0.01 },

        {  '@type': 'header',
            display: 'Home Heating' },

        { id: 'gas-heater',
         '@type': 'boolean',
          display: 'Does your home use a gas heater?',
          tip: 'If the gas bill is significantly higher in the winter than in the summer, you most likely use a gas heater at home.',
          handle: (score, context, val) => score -= (val ? 1:0) * 10}
    ],
};
