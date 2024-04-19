
const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
var rslow = require('../../slow.js');
module.exports = {
    name: "prison",
    description: "Ajoute/Retire un membre de la prison",
    usage: "prison <add/remove/list> <@member>",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
            let prisonon = db.fetch(`${message.guild.id}.prison.active`)
            if (prisonon == true) {
                let prisonrole = db.fetch(`${message.guild.id}.prison.role`)
                prisonrole = message.guild.roles.cache.get(prisonrole)
                if (prisonrole) {
                    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase())
                    if (args[0].toLowerCase() === "add") {
                        if (!member || member.user.bot) return message.channel.send(`:x: Utilisateur invalide !`)
                        const memberPosition = member.roles.highest.position;
                        const authorPosition = message.member.roles.highest.position;
                        if (authorPosition <= memberPosition) return message.reply(":x: Vous ne pouvez pas mettre en prison un membre avec un rôle supérieur au vôtre !");
                        db.push(`${message.guild.id}.prison.members`, member.user.id)
                        member.roles.add(prisonrole.id, "Transféré en prison par " + message.author.tag).catch((e) => console.log(e));
                        message.reply(`**${member.user.username}** a été envoyé en prison !`)
                        rslow.action[message.author.id] = true;
                        setTimeout(() => {
                            rslow.action[message.author.id] = false;
                        }, db.fetch(`${message.guild.id}.actionslow`));
                        let logchannel = db.fetch(`${message.guild.id}.prison.logs`)
                        logchannel = message.guild.channels.cache.get(logchannel)
                        if (logchannel) logchannel.send({
                            embeds: [new Discord.MessageEmbed()
                                .setColor(db.fetch(`${message.guild.id}.color`))
                                .setDescription(`${message.author} a **transféré en prison** ${member} !`)]
                        }).catch(e => { e })
                        return
                    }
                    if (args[0].toLowerCase() === "list") {
                        let membersinprison = message.guild.members.cache.filter(m => m.roles.cache.some(r => r.id === prisonrole.id) && !m.user.bot)
                        let result
                        if (!membersinprison || membersinprison.size < 1) { result = "Pas de prisonnier" } else {
                            result = membersinprison.map(m => `${m.user.username} (id: ${m.user.id}) `).join("\n")
                        }
                        return message.reply({
                            embeds: [new Discord.MessageEmbed()
                                .setTitle(`Membres en prison`)
                                .setColor(db.fetch(`${message.guild.id}.color`))
                                .setDescription(`${result}`)]
                        })
                    }
                    if (args[0].toLowerCase() === "remove") {
                        if (!member || member.user.bot) return message.channel.send(`:x: Utilisateur invalide !`)
                        let membersinprison = db.fetch(`${message.guild.id}.prison.members`)
                        if (membersinprison && membersinprison.length > 0 && membersinprison.includes(member.user.id)) {
                            const filtered = membersinprison.filter(e => e !== member.user.id);
                            db.set(`${message.guild.id}.prison.members`, filtered);
                        }
                        member.roles.remove(prisonrole.id, "Sorti de prison par " + message.author.tag).catch((e) => console.log(e));
                        message.reply(`**${member.user.username}** est bien sorti de prison !`)
                        rslow.action[message.author.id] = true;
                        setTimeout(() => {
                            rslow.action[message.author.id] = false;
                        }, db.fetch(`${message.guild.id}.actionslow`));
                        let logchannel = db.fetch(`${message.guild.id}.prison.logs`)
                        logchannel = message.guild.channels.cache.get(logchannel)
                        if (logchannel) logchannel.send({
                            embeds: [new Discord.MessageEmbed()
                                .setColor(db.fetch(`${message.guild.id}.color`))
                                .setDescription(`${message.author} a **sorti de prison** ${member} !`)]
                        }).catch(e => { e })
                        return
                    }

                } else return message.reply(`:x: Le rôle prisonnier n'est pas config !`)
            } else return message.reply(`:x: Le système de prison est désactivé !`)
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}