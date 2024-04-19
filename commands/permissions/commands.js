
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
var { defaultperm } = require("../../perm.json")
module.exports = {
    name: "commands",
    description: "Affiche toutes les commandes avec permissions modifiables",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            return message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle('Voici toutes les commandes avec permissions modifiables')
                    .setDescription(`${defaultperm.map(r => "``" + r.name + "``").join(" / ")}`)]
            })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}