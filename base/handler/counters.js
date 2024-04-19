const db = require("quick.db");
const counters = 4
module.exports = {
    name: 'ready',

    run: async (client) => {
        let inter = between(360000, 600000)
        setInterval(function () {
            inter = between(360000, 600000)
            client.guilds.cache.forEach(async guild => {
                await guild.members.fetch()
                for (let i = 1; i < counters + 1; i++) {
                    let chan = db.fetch(`${guild.id}.counters${i}.channel`)
                    let type = db.fetch(`${guild.id}.counters${i}.type`)
                    let channel = guild.channels.cache.get(chan)
                    if (channel && type) {
                        let format = db.fetch(`${guild.id}.counters${i}.${type}.format`)
                        let rolem
                        if (type === "rolemembers") {
                            rolem = db.fetch(`${guild.id}.counters${i}.membersrole`)
                            rolem = guild.roles.cache.get(rolem)
                            if(rolem) {rolem = rolem.members.size} else rolem = 0
                        }
                        channel.setName(format.replace("<count>", type
                            .replace(`membres`, guild.memberCount)
                            .replace(`online`, guild.members.cache.filter(({ presence }) => presence && presence.status !== 'offline').size)
                            .replace(`vocal`, guild.members.cache.filter(m => m.voice.channel).size)
                            .replace(`channels`, guild.channels.cache.size)
                            .replace(`roles`, guild.roles.cache.size)
                            .replace(`rolemembers`, rolem)
                            .replace(`boosts`, guild.premiumSubscriptionCount))).catch(e => { console.log(e) })
                    } else {
                        db.delete(`${guild.id}.counters${i}.channel`)
                        db.delete(`${guild.id}.counters${i}.type`)
                    }
                }
            })
        }, inter);
    }
}
function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}