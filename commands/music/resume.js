const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "resume",
    description: "Relance la musique",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (!message.member.voice.channel) return message.reply(":x: Vous n'êtes pas en vocal !")
            let guildQueue = client.player.getQueue(message.guild.id);
            if (!guildQueue) return message.reply(":x: Je ne joue pas de musique actuellement !")
            if(!guildQueue.paused) return message.reply(":x: Il n'y a pas de musique en pause !")
            guildQueue.setPaused(false);
            var embed = new Discord.MessageEmbed()
                .setDescription(`Je relance la musique !`)
                .setColor(db.fetch(`${message.guild.id}.color`))
            message.reply({ embeds: [embed] })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}