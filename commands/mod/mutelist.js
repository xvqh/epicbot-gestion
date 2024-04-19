const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "mutelist",
    description: "Affiche tous les membres timeout du serveur",
    aliases: ["mutes", "mute-list"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            await message.guild.members.fetch()
            let members = message.guild.members.cache.filter((m) => m.communicationDisabledUntilTimestamp !== null && m.communicationDisabledUntilTimestamp > Date.now())
            message.reply({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setTitle(`Voici tous les membres timeout sur le serveur`)
                    .setDescription(members && members.size > 0 ? members.map(m => `${m} (id: ${m.id}) (<t:${Date.parse(new Date(m.communicationDisabledUntilTimestamp)) / 1000}:R>)`).join(`\n`) : "**Aucun membre mute !**")]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}