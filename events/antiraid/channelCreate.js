const db = require("quick.db");
const { sanction, ownersend } = require("../../base/functions");
const Discord = require("discord.js")
module.exports = {
    name: 'channelCreate',

    run: async (client, channel) => {
        if (!channel.guild.me.permissions.has("VIEW_AUDIT_LOG") || !channel.guild.me.permissions.has("MANAGE_CHANNELS")) {
            let logchannel = db.fetch(`${channel.guild.id}.raidlogs`)
            logchannel = channel.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
              embeds: [new Discord.MessageEmbed()
                .setColor(db.fetch(`${channel.guild.id}.color`))
                .setTitle(`📑 Création d'un salon`)
                .setDescription(`Le salon ${channel} vient d'être créé\n:warning: Je n'ai pas la permission VIEW_AUDIT_LOG ou MANAGE_CHANNELS, je n'ai donc pas pu agir`)]
            }).catch(e => { e })
        }
        const entry = await channel.guild.fetchAuditLogs({ type: 'channelCreate' }).then(audit => audit.entries.first()).catch(e => {return})
        if (!entry || entry.executor.id === client.user.id) return;
        let memberr = channel.guild.members.cache.get(entry.executor.id)
        let check = db.fetch(`${channel.guild.id}.anti.channel`)
        let sctn = db.fetch(`${channel.guild.id}.punition.antichannel`)
        if(!sctn) sctn = client.perms.antiraid.antichannel
        if (check === "max") {
            if (!entry.executor) return channel.delete().catch()
            let o = db.fetch(`bot.owner`)
            if (o && o.includes(entry.executor.id)) return
            channel.delete().catch(e => {})
            sanction(memberr, channel.guild, sctn, `[automod] Anti-Channel`)
            let logchannel = db.fetch(`${channel.guild.id}.raidlogs`)
            logchannel = channel.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${channel.guild.id}.color`))
                    .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir créé le salon [\`${channel.name}\`](https://discord.com/channels/${channel.guild.id}/${channel.id}) (je l'ai supprimé) !`)]
            }).catch(e => { e })
        }
        if (check === "on") {
            if (!entry.executor) return channel.delete().catch()
            let o = db.fetch(`bot.owner`)
            if (o && o.includes(entry.executor.id)) return
            let oo = db.fetch(`${channel.guild.id}.botwhitelist`)
            if (oo && oo.includes(channel.author.id)) return
            channel.delete().catch(e => {})
            sanction(memberr, channel.guild, sctn, `[automod] Anti-Channel`)
            let logchannel = db.fetch(`${channel.guild.id}.raidlogs`)
            logchannel = channel.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${channel.guild.id}.color`))
                    .setDescription(`${entry.executor} a été ${sctn ? `\`${isNaN(sctn) ? `${sctn}` : `Timeout [${sctn}sec]`}\`` : "sanctionné"} pour avoir créé le salon [\`${channel.name}\`](https://discord.com/channels/${channel.guild.id}/${channel.id}) (je l'ai supprimé) !`)]
            }).catch(e => { e })
        }
    }
}