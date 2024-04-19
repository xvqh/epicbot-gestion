const db = require("quick.db");
const Discord = require('discord.js')
module.exports = {
    name: 'guildMemberAdd',

    run: async (client, member) => {

        let actualbl = db.fetch("bot.bl")
        if (actualbl && actualbl.includes(member.id)) {
            member.send(`Vous êtes blacklist de ${member.guild.name} !`).catch(e => { e })
            await member.guild.bans.create(member.id, {
                "reason": `A rejoint en étant blacklist`
            }).catch(e => { })
            let logchannel = db.fetch(`${member.guild.id}.raidlogs`)
            logchannel = member.guild.channels.cache.get(logchannel)

            if (member.guild.members.cache.get(member.id)) {
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${member.guild.id}.color`))
                        .setDescription(`${member.user.tag} a rejoint le serveur alors qu'il était **blacklist**, je n'ai pas pu le ban :warning: !`)]
                }).catch(e => { e })
            } else {
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${member.guild.id}.color`))
                        .setDescription(`${member.user.tag} a rejoint le serveur alors qu'il était **blacklist**, il a été ban !`)]
                }).catch(e => { e })
            }
            return
        }
        let serverlock = db.fetch(`${member.guild.id}.serverlock`)
        if(serverlock) return
        if (member.presence && member.presence.activities[0]) {
            let role = db.fetch(`${member.guild.id}.soutien.role`)
            let statut = db.fetch(`${member.guild.id}.soutien.statut`)
            if (role && statut && statut.length > 0) {
                role = member.guild.roles.cache.get(role)
                if (!role) db.delete(`${member.guild.id}.soutien.role`)

                let give = false
                for (i in statut) {
                    if (member.presence.activities[0] && member.presence.activities[0].state.includes(statut[i])) give = true
                }
                if (give == true) {
                    if (!member.roles.cache.some(r => r.id === role.id)) {
                        member.roles.add(role.id, "[SOUTIEN]").catch((e) => console.log(e));
                    }
                }
            }
        }
        let prisonon = db.fetch(`${member.guild.id}.prison.active`)
        if (prisonon == true) {
            let membersinprison = db.fetch(`${member.guild.id}.prison.members`)
            if (membersinprison && membersinprison.length > 0 && membersinprison.includes(member.user.id)) {
                let prisonrole = db.fetch(`${member.guild.id}.prison.role`)
                prisonrole = member.guild.roles.cache.get(prisonrole)
                if (prisonrole) {
                    member.roles.add(prisonrole.id, "[Ancien prisonnié remis en prison]").catch((e) => console.log(e));
                    let logchannel = db.fetch(`${member.guild.id}.prison.logs`)
                    logchannel = member.guild.channels.cache.get(logchannel)
                    if (logchannel) logchannel.send({
                        embeds: [new Discord.MessageEmbed()
                            .setColor(db.fetch(`${member.guild.id}.color`))
                            .setDescription(`${member} a rejoint le serveur alors qu'il était en prison, il y a été remis !`)]
                    }).catch(e => { e })
                }
            }
        }

        let wrole = db.fetch(`${member.guild.id}.join.role`)
        if (wrole) {
            wrole = member.guild.roles.cache.get(wrole)
            if (wrole) {
                member.roles.add(wrole.id, "[Rôle membre]").catch(e => { })
            }
        }
        let channel = db.fetch(`${member.guild.id}.join.wchannel`)
        if (channel) {
            channel = member.guild.channels.cache.get(channel)
            if (channel) {
                let wmsg = db.fetch(`${member.guild.id}.join.wmsg`)
                channel.send(wmsg.replaceAll("{user}", member.user)
                    .replaceAll("{username}", member.user.username)
                    .replaceAll("{usertag}", member.user.tag)
                    .replaceAll("{guildname}", member.guild.name)
                    .replaceAll("{membercount}", member.guild.memberCount)).then(m => {
                        let joindelete = db.fetch(`${member.guild.id}.join.wdelete`)
                        if(joindelete && !isNaN(joindelete)){
                        setTimeout(async () => { m.delete().catch(e => { }) }, joindelete)
                        }
                    }).catch(e => { })
            }
        }
        let mpmsg = db.fetch(`${member.guild.id}.join.mpmsg`)
        if (mpmsg) {
            member.send(mpmsg.replaceAll("{user}", member.user)
                .replaceAll("{username}", member.user.username)
                .replaceAll("{usertag}", member.user.tag)
                .replaceAll("{guildname}", member.guild.name)
                .replaceAll("{membercount}", member.guild.memberCount)).catch(e => { })
        }

    }
}
