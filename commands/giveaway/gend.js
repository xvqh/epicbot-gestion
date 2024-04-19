
const db = require("quick.db")
const { MessageEmbed } = require('discord.js');
const { checkperm } = require("../../base/functions");
let used = {}
module.exports = {
    name: "gend",
    description: "Arrête un giveaway",
    aliases: ["gstop", "g-end"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            let gwid = args[0] || db.fetch(`${message.guild.id}.last-giveaway.${message.channel.id}`)
            let giveaway = db.fetch(`${message.guild.id}.giveaway.${gwid}`)
            if (!giveaway) return message.reply(`:x: Je ne trouve pas ce giveaway !`)
            db.delete(`${message.guild.id}.giveaway.${giveaway.msgid}`)
            let chan = message.guild.channels.cache.get(giveaway.channelid)
            if (chan) {
                let msgedit = await chan.messages.fetch(giveaway.msgid).catch()
                if (msgedit) {
                    msgedit.edit({
                        embeds: [new MessageEmbed()
                            .setTitle(`:tada: Giveaway: ${giveaway.gain}`)
                            .setDescription(`Giveaway Terminé`)
                            .setColor(db.fetch(`${message.guild.id}.color`))], components: []
                    }).catch()
                    let participants = db.fetch(`${message.guild.id}.participants-giveaway.${giveaway.msgid}`)
                    db.delete(`${message.guild.id}.participants-giveaway.${giveaway.msgid}`)
                    let winnerssize = giveaway.gagnants
                    console.log(participants)
                    if (!participants || participants && participants.length < 1) return chan.send(`Personne n'a participé au giveaway !`)
                    if (!winnerssize || winnerssize && participants.length < winnerssize) return chan.send(`Il n'y a pas eut assez de participants !`)
                    let winners = []
                    for (let p = 0; p < winnerssize; p++) {
                        if (giveaway.impose && giveaway.impose[p]) {
                            winners.push(giveaway.impose[p])
                        } else {
                            let participant = aleatoire(participants, message.guild, giveaway)
                            if (!participant) continue;
                            winners.push(participant)
                        }
                    }
                    if (!winners || winners && winners.length < 1) return chan.send(`Personne n'a respecté les conditions !`)
                    chan.send(`:tada: Félicitations à ${winners.map(u => `<@${u}>`).join(", ")} qui ${winners.length > 1 ? "viennent" : "vient"} de gagner \`${giveaway.gain}\` !`)
                    message.channel.send('Giveaway terminé !')
                }
            }
        } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)


        function aleatoire(array, guild, giveaways) {
            let participant = array.filter(u => used[u] !== true && guild.members.cache.get(u) && (giveaways.vocal ? guild.members.cache.get(u).voice.channel : u) && (giveaways.role ? guild.members.cache.get(u).roles.cache.has(giveaways.role) : u))[Math.floor(Math.random() * array.length)]
            if (!participant) return null

            if (used[participant] === true) aleatoire(array)
            used[participant] = true
            return participant
        }
    }
}