const { checkperm } = require("../../base/functions");
const db = require('quick.db')
const Discord = require('discord.js')
module.exports = {
    name: "latence",
    description: "Affiche la latence générale des bots",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, "ping")
        if (perm == true) {
            const SystemPing = Math.round(client.ws.ping);
            message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`La latence globale est de \`${SystemPing}ms\``)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`ping\` !`)
    }
}