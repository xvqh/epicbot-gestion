const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "bringall",
    description: "Déplace tous les membres dans le salon vocal",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            let channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel
            if (!channel || !channel.type.includes("GUILD_VOICE" || "GUILD_STAGE_VOICE")) return message.reply(`:x: Veuillez rejoindre un vocal ou préciser un salon vocal valide`)
            let vc = message.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE' || c.type === 'GUILD_STAGE_VOICE');
            const voiceChannels = vc

            for (const [id, voiceChannel] of voiceChannels) {
                if (voiceChannel !== channel) {
                    voiceChannel.members.forEach(member => {
                        member.voice.setChannel(channel).catch()
                    });
                }
            }

            await message.reply(`Je déplace les membres...\nCe processus peut prendre du temps en fonction de la taille de votre serveur`)
            rslow.action[message.author.id] = true;
            setTimeout(() => {
                rslow.action[message.author.id] = false;
            }, db.fetch(`${message.guild.id}.actionslow`));
            let logchannel = db.fetch(`${message.guild.id}.modlogs`)
            logchannel = message.guild.channels.cache.get(logchannel)
            if (logchannel) logchannel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${message.author} a **bringall** vers le salon ${channel}`)]
            }).catch(e => { e })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}
