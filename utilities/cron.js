var cron = require('cron');
var product = require('../controllers/product');
/**
 * Seconds: 0-59
 * Minutes: 0-59
 * Hours: 0-23
 * Day of Month: 1-31
 * Months: 0-11 (Jan-Dec)
 * Day of Week: 0-6 (Sun-Sat)
 * Cada 5 min = "0 asterisco/5 * * * * *"
 */
module.exports = {
    //job1
    job() {
        var job = new cron.CronJob({
            cronTime: '0 0 */2 * * *',
            onTick: function() {
                var fecha = new Date();
                var hora = fecha.getHours() + ":" + fecha.getMinutes() + ":" + (fecha.getSeconds() < 10 ? ('0' + fecha.getSeconds()) : fecha.getSeconds()); 
                console.log('Tarea ejecutada a las: ' + hora);
                product.createWOO();
            },
            start: true,
            timeZone: 'America/Los_Angeles'
            });
        return job;
    },
};
