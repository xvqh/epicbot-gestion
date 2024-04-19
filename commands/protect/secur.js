const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "secur",
    description: "Affiche les paramètres anti-raid",
    usage: "secur <*on/off/max*>",
    aliases: ["secure", "settings"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {

            const secur = client.config.secur
            let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            let adminlogs = db.fetch(`${message.guild.id}.adminlogs`)
            adminlogs = message.guild.channels.cache.get(adminlogs)
            let serverlock = db.fetch(`${message.guild.id}.serverlock`)
            if (!args[0]) {
                const Embed = new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle(`Secur`)
                let array = []
                for (i in secur) {
                    let p = db.fetch(`${message.guild.id}.anti.${secur[i]}`)
                    let sensi = db.fetch(`${message.guild.id}.anti.${secur[i]}_sensi`)
                    array.push(`**Anti${secur[i]}:** ` + (p ? "``" + p + "``" : "``off``") + (sensi ? " - ``" + sensi + "``" : ""))
                }
                let lockedurl = db.fetch(`${message.guild.id}.lockedurl`)
Embed.setDescription(`**Logs de raid**: ${logchannel ? logchannel : ":x:"}
**Logs d'alerte**: ${adminlogs ? adminlogs : ":x:"}
${serverlock ? ":warning: " : ""}**Lock Server**: ${serverlock ? serverlock : ":x:"}
**Lock URL**: ${lockedurl && message.guild.vanityURLCode ? `\`on\` - \`${lockedurl}\`` : "`off`"}
` + array.map(object => object).join("\n"))
                message.reply({ embeds: [Embed] })
            } else {
                const parameters = ["on", "max", "off"]
                let setup = args[0].toLowerCase()
                if (parameters.includes(setup)) {
                    for (i in secur) {
                        db.set(`${message.guild.id}.anti.${secur[i]}`, setup)
                    }
                    message.reply(`:shield: Toutes les sécurités ont été mises sur \`\`${setup}\`\` !`)
                }
            }

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}