
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "snap",
    description: "Affiche le snapcode du snap précisé",
    aliases: ["snapcode"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            const pseudo = args[0]

        const snapcode = `https://feelinsonice.appspot.com/web/deeplink/snapcode?username=${pseudo}&size=320&type=PNG`

        if (!args.length) return message.channel.send(`${message.author}, mettre un pseudo Snap pour faire la recherche.`)

        const embed = new Discord.MessageEmbed()
            .setDescription("Voici votre recherche du snapcode: `"+pseudo+"`")
            .setImage(snapcode)
            .setColor(db.fetch(`${message.guild.id}.color`))

        message.reply({embeds: [embed]})
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}