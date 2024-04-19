const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "play",
    description: "Joue de la musique",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (!message.member.voice.channel) return message.reply(":x: Vous n'êtes pas en vocal !")
            if (message.guild.me.voice.channel && message.member.voice.channel !== message.guild.me.voice.channel) return message.reply(":x: Je suis déjà utilisé dans un salon vocal !")
            if (args[0]) {
                message.reply(":recycle: Chargement en cours...").then(async m =>{

                let guildQueue = client.player.getQueue(message.guild.id);

                let queue = client.player.createQueue(message.guild.id);
                await queue.join(message.member.voice.channel);
                let song = await queue.play(args.join(' ')).catch(err => {
                    if (!guildQueue) queue.stop();
                });
                try {
                    if (!queue.connection) await queue.connect(message.member.voice.channel);
                } catch {
                    queue.destroy();
                    return await message.reply({ content: ":x: Je ne peux pas rejoindre votre salon !" });
                }
                var embed = new Discord.MessageEmbed()
                    .setDescription(`J'ai ajouté [${song.name}](${song.url}) à la file d'attente !\n**Durée:** ${song.duration}`)
                    .setThumbnail(song.thumbnail)
                    .setColor(db.fetch(`${message.guild.id}.color`))
                m.edit({ content: " ", embeds: [embed] }).catch(e => {console.log(e)})
            })
            } else return message.reply(":x: Vous devez préciser une musique à jouer !")
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}