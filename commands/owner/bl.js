
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "bl",
    description: "Blacklist un membre du serveur",
    aliases: ["blacklist"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (!args[0] || args[0] && args[0].toLowerCase() === "list") {
                message.reply("Listage des membres en cours...").then(async m => {
                    let list = db.fetch(`bot.bl`)
                    if (list && list.length > 0) {
                        let urray = []
                        for (i in list) {
                            let member = await client.users.fetch(list[i])
                            let author = db.fetch(`bl.${list[i]}.author`)
                            if (author) {
                                author = await client.users.fetch(author)
                            } else author = "_aucune donnée_"
                            urray.push(member.username + `#${member.discriminator} (id: ${list[i]}) (BL par ${author.toString()})`)
                        }
                        list = urray.map(i => i).join("\n")
                    } else list = "Pas de membres blacklist !"
                    return m.edit({
                        content: " ",
                        embeds: [new Discord.MessageEmbed()
                            .setColor(db.fetch(`${message.guild.id}.color`))
                            .setTitle(`Voici les membres blacklist`)
                            .setDescription(`${list}`)
                            .setFooter({ text: `Ces membres sont banni de l'ensemble des serveurs où le bot est` })]
                    }).catch(e => { })
                })
            } else {
                let member
                if (isNaN(args[0])) {
                    member = message.mentions.users.first()
                } else {
                    member = await client.users.fetch(args[0])
                }
                if (!member) return message.reply(":x: Utilisateur invalide !")
                let b = db.fetch(`bot.owner`) 
                if (b && b.includes(member.id)) return message.reply(":x: Vous ne pouvez pas blacklist un owner !")
                let actualbl = db.fetch("bot.bl")
                if (actualbl && actualbl.includes(member.id)) return message.reply(":x: Le membre est déjà blacklist !")
                db.push("bot.bl", member.id)
                db.set(`bl.${member.id}.author`, message.author.id)
                let m = message.guild.members.cache.get(member.id)
                if (m) {
                    m.send(`Vous avez été blacklist de ${message.guild.name} par ${message.author.tag} !`).catch(e => { e })
                }
                await message.guild.bans.create(member.id, {
                    "reason": `Blacklist by ${message.author.tag}`
                }).catch(e => { })
                client.guilds.cache.forEach(async guild => {
                    if (guild.id !== message.guild.id) {

                        await guild.bans.create(member.id, {
                            "reason": `Blacklist by ${message.author.tag}`
                        });

                    }
                })
                message.reply(`${member.username} a été ajouté à la blacklist et a été ban de l'ensemble de mes serveurs !`)
                let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
                logchannel = message.guild.channels.cache.get(logchannel)
                if (logchannel) logchannel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setColor(db.fetch(`${message.guild.id}.color`))
                        .setDescription(`${message.author} a **blacklist** ${member.toString()}`)]
                }).catch(e => { e })
            }
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}