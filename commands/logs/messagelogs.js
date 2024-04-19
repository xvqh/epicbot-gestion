const db = require("quick.db")
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "messagelogs",
    description: "Défini les logs message",
    aliases: ['messagelog', "msglogs", "msglog"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "logs")
        if (perm == true) {

            let m = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel
            if (!m || m.type !== "GUILD_TEXT") return message.reply(`:x: Salon invalide !`)
            let actual = db.fetch(`${message.guild.id}.messagelogs`)
            if (actual === m.id) {
                db.delete(`${message.guild.id}.messagelogs`)
                return message.reply(`:clipboard: Les logs message sont désactivés !`)
            }
            db.set(`${message.guild.id}.messagelogs`, m.id)
            return message.reply(`:clipboard: Les logs message seront maintenant envoyés dans <#${m.id}> !`)


        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`logs\` !`)
    }
}