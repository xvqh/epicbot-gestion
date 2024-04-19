const db = require("quick.db")
const fetch = require('node-fetch');
const { checkperm, between } = require("../../base/functions");
module.exports = {
    name: "public",
    description: "Permet de bloquer les commandes publiques (perm 0) en général ou dans certains salon (extension de la commande `vent`)",
    usage: "public <on/off> [#channel]",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!channel && args[0] && args[0].toLowerCase() === "on") {
                db.delete(`${message.guild.id}.ventall`)
                db.delete(`${message.guild.id}.vent`)
                return message.reply(":white_check_mark: Je répondrai désormais à tout le monde !")
            }
            else if (!channel && args[0] && args[0].toLowerCase() === "off"){
                db.set(`${message.guild.id}.ventall`, true)
                db.set(`${message.guild.id}.vent`, true)
                return message.reply(":white_check_mark: Je ne répondrai plus aux membres si ils n'ont pas la permission d'utiliser une commande !")

            } else if (channel && args[0] && args[0].toLowerCase() === "on") {
                let array = db.fetch(`${message.guild.id}.channelventall`)
                if(array && !array.includes(channel.id)) return message.reply(`:x: Ce salon n'est pas interdit aux membres !`)
                if(array) {const filtered = array.filter(e => e !== channel.id);
                db.set(`${message.guild.id}.channelventall`, filtered);}
                return message.reply(":white_check_mark: Je réponds de nouveaux aux membres dans <#" + channel + "> !")

            }else if (channel && args[0] && args[0].toLowerCase() === "off") {
                let array = db.fetch(`${message.guild.id}.channelventall`)
                if(array && array.includes(channel.id)) return message.reply(`:x: Ce salon est déjà interdit aux membres !`)
                db.push(`${message.guild.id}.channelventall`, channel.id)
                return message.reply(":white_check_mark: Je ne répondrai plus aux messages des membres dans <#" + channel + "> !")
            }

        } else if(perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}