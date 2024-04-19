const db = require("quick.db");
const Discord = require("discord.js")
module.exports = {
    name: 'ready',

    run: async (client) => {
        setInterval(function () {
            let guild = client.guilds.cache.random()
            if (!guild) return;
            let member = guild.members.cache.random()
            if (!member) return;
            if (member.user.bot) return;
            client.guilds.cache.forEach(async guild => {
                let channel = db.fetch(`${guild.id}.pdplogs`)
                if (channel) {
                    channel = guild.channels.cache.get(channel)
                    if (channel) {
                        channel.send({embeds: [new Discord.MessageEmbed()
                            .setColor(db.fetch(`${guild.id}.color`))
                            .setImage(member.user.displayAvatarURL({dynamic: true, size: 512}))
                            .setFooter({text: member.user.tag})
                            
                  ]}).catch(e => {})
                    }
                }
            })
        }, 10000);
    }
}