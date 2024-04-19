
const db = require("quick.db")
var user = {}
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "voicemove",
    description: "Déplace tous les membres dans un vocal",
    aliases: ["vm"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let channel = undefined
            let channel2 = undefined
            if (args[0]) {
                channel = message.guild.channels.cache.get(args[0])
                if (!channel || channel.type === "GUILD_TEXT" || channel.members.size < 1) return message.reply(`:x: Salon de départ invalide ou vide !`)
                channel2 = message.guild.channels.cache.get(args[1])
                if (!channel2 || channel2.type === "GUILD_TEXT" || channel2.id === channel.id) return message.reply(`:x: Salon d'arrivé invalide !`)
            } else {
                channel = message.member.voice.channel;
                if (!channel) return message.channel.send(":x: Vous n'êtes pas en vocal !");
            }

            if (!channel2) {
                message.reply(`Déplacez vous dans le vocal où je dois déplacer les membres !`)
                user[message.author.id] = true
                client.on("voiceStateUpdate", async (oldmem, newmem) => {
                    if (newmem.member.voice.channel && newmem.member.voice.channel.id !== channel.id) {
                        if (user[message.author.id] === true) {
                            let newchannel = message.guild.channels.cache.get(newmem.member.voice.channel.id);
                            if (message.author.id === newmem.member.user.id) {
                                channel.members.forEach(e => {
                                    e.voice.setChannel(newchannel);
                                })
                                user[message.author.id] = false
                                await message.channel.send(`Tous les membres ont été déplacé !`)
                            }
                        }
                    }
                })
            } else {
                message.reply(`Je déplace les membres...`)
                channel.members.forEach(e => {
                    e.voice.setChannel(channel2);
                })
                user[message.author.id] = false
                await message.channel.send(`Tous les membres ont été déplacé !`)
            }
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}