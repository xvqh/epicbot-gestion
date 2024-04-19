const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "snipe",
    description: "Affiche le dernier message supprimé",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            const msg = client.snipes.get(message.channel.id)
            if (!msg) return message.channel.send(":x: Il n'y a pas de message à snipe !")
            let slash
            let content = msg.content
            if (msg.content.includes("gg/")) {
                slash = content.indexOf("/")
                content = msg.content.replace(msg.content.substring(slash + 1, msg.content.length), "••••••••")
            }
            const embed = new Discord.MessageEmbed()
                .setAuthor({ name: msg.author, iconURL: msg.profilephoto })
                .setDescription(content)
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setTimestamp(msg.date)
            if (msg.image) embed.setImage(msg.image)

            message.reply({ embeds: [embed] })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}