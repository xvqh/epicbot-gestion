const db = require("quick.db")
const { MessageReaction, User, MessageEmbed } = require("discord.js");
let used = {}
const ms = require("ms")
module.exports = {
    name: 'ready',

    run: async (client) => {
        console.log("Initialiation des giveaways en cours...")
        client.guilds.cache.forEach(async guild => {
            let inter = setInterval(async function () {
                let giveaways = db.fetch(`${guild.id}.giveaway`)
                for (i in giveaways) {
                    if (giveaways[i] && giveaways[i].duration && giveaways[i].startdate) {
                        if (giveaways[i].startdate + ms(giveaways[i].duration) <= Date.now()) {
                            db.delete(`${guild.id}.giveaway.${giveaways[i].msgid}`)
                            let chan = guild.channels.cache.get(giveaways[i].channelid)
                            if (chan) {
                                let msgedit = await chan.messages.fetch(giveaways[i].msgid).catch()
                                if (msgedit) {
                                    msgedit.edit({
                                        embeds: [new MessageEmbed()
                                            .setTitle(`:tada: Giveaway: ${giveaways[i].gain}`)
                                            .setDescription(`Giveaway Terminé`)
                                        .setColor(db.fetch(`${guild.id}.color`))], components: []
                                    }).catch()
                                    let participants = db.fetch(`${guild.id}.participants-giveaway.${giveaways[i].msgid}`)
                                    let winnerssize = giveaways[i].gagnants
                                    if (!participants || participants && participants.length < 1) {db.delete(`${guild.id}.giveaway.${giveaways[i].msgid}`); return chan.send(`Personne n'a participé au giveaway !`)}
                                    if (!winnerssize || winnerssize && participants.length < winnerssize){ db.delete(`${guild.id}.giveaway.${giveaways[i].msgid}`);return chan.send(`Il n'y a pas eut assez de participants !`)}
                                    let winners = []
                                    for (let p = 0; p < winnerssize; p++) {
                                        if (giveaways[i].impose && giveaways[i].impose[p]) {
                                            winners.push(giveaways[i].impose[p])
                                        } else {
                                            let participant = aleatoire(participants, guild, giveaways[i])
                                            if (!participant) continue;
                                            winners.push(participant)
                                        }
                                    }
                                    if (!winners || winners && winners.length < 1) return chan.send(`Personne n'a respecté les conditions !`)
                                    chan.send(`:tada: Félicitations à ${winners.map(u => `<@${u}>`).join(", ")} qui ${winners.length > 1 ? "viennent" : "vient"} de gagner \`${giveaways[i].gain}\` !`)
                                }
                            }
                        } else {
                            let chan = guild.channels.cache.get(giveaways[i].channelid)
                            if (chan && giveaways[i].msgid) {
                                let msgedit = await chan.messages.fetch(giveaways[i].msgid).catch(e => {db.delete(`${guild.id}.giveaway.${giveaways[i].msgid}`);db.delete(`${guild.id}.participants-giveaway.${giveaways[i].msgid}`)})
                                if (msgedit) {
                                    let participants = db.fetch(`${guild.id}.participants-giveaway.${giveaways[i].msgid}`)
                                    console.log(new Date(giveaways[i].startdate + ms(giveaways[i].duration)))
                                    await msgedit.edit({
                                        embeds: [new MessageEmbed()
                                            .setTitle(`:tada: Giveaway: ${giveaways[i].gain}`)
                                            .setDescription(`Réagissez avec ${giveaways[i].react} pour participer
Nombre de gagnants: ${giveaways[i].gagnants}\n${giveaways[i].vocal ? "Présence en vocal obligatoire :white_check_mark:\n" : ""}${giveaways[i].role ? `Vous devez avoir le rôle <@&${giveaways[i].role}> :white_check_mark:\n` : ""}
Nombre de participants: ${participants ? participants.length : "0"}
Se termine dans <t:${Date.parse(new Date(giveaways[i].startdate + ms(giveaways[i].duration))) / 1000}:R> (<t:${Date.parse(new Date(giveaways[i].startdate + ms(giveaways[i].duration))) / 1000}:F>)`)
                                            .setFooter({text: `Lancé par ${giveaways[i].author ? giveaways[i].author : "anonyme"}`})
                                            .setColor(db.fetch(`${guild.id}.color`))]
                                    }).catch(e => {console.log(e)})
                                }
                            }
                        }
                    }
                }
            }, 6500)

        })
    }
}
function aleatoire(array, guild, giveaways) {
    let participant = array.filter(u => used[u] !== true && guild.members.cache.get(u) && (giveaways.vocal ? guild.members.cache.get(u).voice.channel : u) && (giveaways.role ? guild.members.cache.get(u).roles.cache.has(giveaways.role) : u))[Math.floor(Math.random() * array.length)]
    if (!participant) return null

    if (used[participant] === true) aleatoire(array)
    used[participant] = true
    return participant
}