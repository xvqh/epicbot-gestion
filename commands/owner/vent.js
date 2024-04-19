
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "vent",
    description: "Si activé le bot met un vent aux membres si ils n'ont pas la permission d'utiliser une commande",
    usage: "vent",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            let check = db.fetch(`${message.guild.id}.vent`)
            if(!check){db.set(`${message.guild.id}.vent`, true)
        return message.reply(":white_check_mark: Je ne répondrai plus aux membres si ils n'ont pas la permission d'utiliser une commande !")} else {
            db.delete(`${message.guild.id}.vent`)
        return message.reply(":white_check_mark: Je répondrai aux membres !")
        }
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}