const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "setvolume",
    description: "Modifie le volume de la musique",
    aliases: ["volume"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            let size = args[0]
            if (!message.member.voice.channel) return message.reply(":x: Vous n'êtes pas en vocal !")
            if (message.guild.me.voice.channel && message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(":x: Je suis déjà utilisé dans un salon vocal !")
            let guildQueue = client.player.getQueue(message.guild.id);
            if (!guildQueue || !guildQueue.isPlaying) return message.reply(":x: Je ne joue pas de musique actuellement !")
            if (!size || isNaN(size) || size < 1 || size > 200) return message.reply(":x: Veuillez préciser un volume valide (1 < 200)")
            guildQueue.setVolume(parseInt(args[0]));
            var embed = new Discord.MessageEmbed()
                .setDescription(`Le volume est maintenant sur ${size} !`)
                .setColor(db.fetch(`${message.guild.id}.color`))
            message.reply({ embeds: [embed] })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}