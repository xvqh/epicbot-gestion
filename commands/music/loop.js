const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
const { RepeatMode } = require('discord-music-player');
module.exports = {
    name: "loop",
    description: "Joue en boucle la musique atuelle",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (!message.member.voice.channel) return message.reply(":x: Vous n'êtes pas en vocal !")
            if (message.guild.me.voice.channel && message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(":x: Je suis déjà utilisé dans un salon vocal !")
            let guildQueue = client.player.getQueue(message.guild.id);
            if (!guildQueue || !guildQueue.isPlaying) return message.reply(":x: Je ne joue pas de musique actuellement !")
            const currentTrack = guildQueue.nowPlaying;
            console.log(currentTrack)
            if (!guildQueue.repeatMode) {
                guildQueue.setRepeatMode(RepeatMode.SONG);
                var embed = new Discord.MessageEmbed()
                    .setDescription(`Je joue maintenant  [${currentTrack.name}](${currentTrack.url}) en boucle !`)
                    .setColor(db.fetch(`${message.guild.id}.color`))
                message.reply({ embeds: [embed] })
            } else {
                guildQueue.setRepeatMode(RepeatMode.DISABLED);
                var embed = new Discord.MessageEmbed()
                    .setDescription(`Je ne joue plus [${currentTrack.name}](${currentTrack.url}) en boucle !`)
                    .setColor(db.fetch(`${message.guild.id}.color`))
                message.reply({ embeds: [embed] })
            }
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}