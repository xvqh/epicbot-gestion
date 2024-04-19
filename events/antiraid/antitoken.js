const db = require("quick.db");
const Discord = require('discord.js');
var join = {}
module.exports = {
    name: 'guildMemberAdd',

    run: async (client, member) => {

        let serverlock = db.fetch(`${member.guild.id}.serverlock`)
        if(serverlock){
            member.send(`:lock: Le serveur est en mode raid, veuillez réessayer plus tard`).catch()
            return member.kick().catch()
        }

        let check = db.fetch(`${member.guild.id}.anti.token`)
        let sensibilite = db.fetch(`${member.guild.id}.anti.token_sensi`)
        if(!sensibilite) {
            db.set(`${member.guild.id}.anti.token_sensi`, "6/5")
            sensibilite = "10/10"}
        let slash = sensibilite.indexOf("/")
        let joins = sensibilite.substring(0, slash)
        let time =  sensibilite.substring(slash+1, sensibilite.length)
        if (check === "max" || check === "on") {
            if (isNaN(join[member.guild.id])) { join[member.guild.id] = 1 } else join[member.guild.id]++
            setTimeout(() => { if (isNaN(join[member.guild.id])) { join[member.guild.id] = 0 } else join[member.guild.id]-- }, parseInt(time*1000));
        }

        if (join[member.guild.id] === parseInt(joins) + 1) {
            let logchannel = db.fetch(`${member.guild.id}.raidlogs`)
            logchannel = member.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${member.guild.id}.color`))
                    .setDescription(`${member.user.tag} a été kick car l'antitoken est activé !`)]
            }).catch(e => { e })
        }
    }
}