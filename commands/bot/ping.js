const { checkperm } = require("../../base/functions");
const db = require('quick.db')
const Discord = require('discord.js')
module.exports = {
    name: "ping",
    description: "Affiche la latence du bot",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            let m = await message.reply({ content: `:ping_pong: Pong !`, allowedMentions: { repliedUser: false }})

            let ping = (m.createdTimestamp - message.createdTimestamp);
        
            m.edit({
                content: " ",
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`La latence du bot est de \`${ping}ms\``)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}