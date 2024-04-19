const db = require("quick.db")
const Discord = require('discord.js');
const superagent = require('superagent')
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "porngif",
    description: "Affiche une image olé olé",
    usage: "porngif [pussy/boobs/ass/hentai/anal/4k]",
    aliases: ["pgif", "porn"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {
            if (message.channel.nsfw) {
                message.reply("Chargement de l'image...").then(msg => {
                    if (!args[0]) {
                        const embed = new Discord.MessageEmbed()

                        superagent.get('https://nekobot.xyz/api/image')
                            .query({ type: 'pgif' })
                            .end((err, response) => {
                                embed.setImage(response.body.message)
                                embed.setTitle("Random Porn Gif")
                                embed.setColor(db.fetch(`${message.guild.id}.color`));
                               msg.edit({ content: " ", embeds: [embed] });
                            });
                    } else if (args[0] === "ass") {
                        const embed = new Discord.MessageEmbed()

                        superagent.get('https://nekobot.xyz/api/image')
                            .query({ type: 'ass' })
                            .end((err, response) => {
                                embed.setImage(response.body.message)
                                embed.setTitle("ass")
                                embed.setColor(db.fetch(`${message.guild.id}.color`));
                               msg.edit({ content: " ", embeds: [embed] });
                            });
                    } else if (args[0] === "anal") {
                        const embed = new Discord.MessageEmbed()

                        superagent.get('https://nekobot.xyz/api/image')
                            .query({ type: 'anal' })
                            .end((err, response) => {
                                embed.setImage(response.body.message)
                                embed.setTitle("Anal Picture")
                                embed.setColor(db.fetch(`${message.guild.id}.color`));
                               msg.edit({ content: " ", embeds: [embed] });
                            });
                    } else if (args[0] === "pussy") {
                        const embed = new Discord.MessageEmbed()

                        superagent.get('https://nekobot.xyz/api/image')
                            .query({ type: 'pussy' })
                            .end((err, response) => {
                                embed.setImage(response.body.message)
                                embed.setTitle("Pussy Picture")
                                embed.setColor(db.fetch(`${message.guild.id}.color`));
                               msg.edit({ content: " ", embeds: [embed] });
                            });
                    } else if (args[0] === "boobs") {
                        const embed = new Discord.MessageEmbed()

                        superagent.get('https://nekobot.xyz/api/image')
                            .query({ type: 'boobs' })
                            .end((err, response) => {
                                embed.setImage(response.body.message)
                                embed.setTitle("Boobs Picture")
                                embed.setColor(db.fetch(`${message.guild.id}.color`));
                               msg.edit({ content: " ", embeds: [embed] });
                            });
                    } else if (args[0] === "hentai") {
                        const embed = new Discord.MessageEmbed()

                        superagent.get('https://nekobot.xyz/api/image')
                            .query({ type: 'hentai' })
                            .end((err, response) => {
                                embed.setImage(response.body.message)
                                embed.setTitle("hentai Picture")
                                embed.setColor(db.fetch(`${message.guild.id}.color`));
                               msg.edit({ content: " ", embeds: [embed] });
                            });
                    } else if (args[0] === "4k") {
                        const embed = new Discord.MessageEmbed()

                        superagent.get('https://nekobot.xyz/api/image')
                            .query({ type: '4k' })
                            .end((err, response) => {
                                embed.setImage(response.body.message)
                                embed.setTitle("4K Picture")
                                embed.setColor(db.fetch(`${message.guild.id}.color`));
                                msg.edit({ content: " ", embeds: [embed] });
                            });
                    }
                })
            } else message.reply(":x: Le salon doit être NSFW !")
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
    }
}