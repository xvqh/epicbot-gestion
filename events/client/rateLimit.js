var rate = require('../../slow.js');
let r = 0
module.exports = {
    name: 'rateLimit',

    run: async (client, rateLimitData) => {
        r++
        if (rate.rate !== true) {
            if (r >= 15) {
                rate.rate = true;
                client.destroy();
                setTimeout(() => {
                    client.login(client.config.token)
                    rate.rate = false;
                }, 20000);
                r = 0
            }
        }
        setTimeout(() => {
            r = r - 1
        }, 15000);
    }
}