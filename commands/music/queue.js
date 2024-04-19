const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "queue",
    description: "Relance la musique",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (!message.member.voice.channel) return message.reply(":x: Vous n'êtes pas en vocal !")
            let guildQueue = client.player.getQueue(message.guild.id);
            if (!guildQueue) return message.reply(":x: La queue est vide !")
            let song = guildQueue.songs
            console.log(song[0].isFirst)
            var embed = new Discord.MessageEmbed()
                .setDescription(`${song.map(i => `- [${i.name}](${i.url}) ${i.isFirst ? "**NOW**" : ""}`).join("\n")}`)
                .setColor(db.fetch(`${message.guild.id}.color`))
            message.reply({ embeds: [embed] })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}