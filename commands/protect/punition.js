const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "punition",
    description: "Modifie les punitions des anti-raid",
    aliases: ["punitions"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message, cmd.name)
        if (perm == true) {

            const embed = new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setTitle("Chargement...")
            message.reply({ embeds: [embed] }).then(mm => {

                update(mm)
                const filter = m => message.author.id === m.author.id;
                const collector = mm.createMessageComponentCollector({
                    componentType: "SELECT_MENU",
                    time: 1800000
                })
                collector.on("collect", async (select) => {
                    console.log(select.user.username)
                    if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
                    let value = select.values[0]
                    await select.deferUpdate()
                    let button1 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('derank').setLabel("Derank le membre")
                    let button2 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('kick').setLabel("Expulser le membre")
                    let button3 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('ban').setLabel("Bannir le membre")
                    let button4 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('timeout').setLabel("Timeout le membre")
                    let button5 = new Discord.MessageButton().setStyle('DANGER').setCustomId("off").setLabel("Pas de sanction")
                    let button_row = new Discord.MessageActionRow().addComponents([button1, button2, button3, button4, button5])
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Quelle sera la sanction ?`)
                        .setColor(db.fetch(`${message.guild.id}.color`))
                        .setFooter({ text: value })
                    mm.edit({ embeds: [embed], components: [button_row] })
                    const collector2 = mm.createMessageComponentCollector({
                        componentType: "BUTTON",
                        time: 150000
                    })
                    collector2.on("collect", async (i) => {
                        if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
                        if (i.customId === 'timeout') {
                            await i.reply(`⏱ Veuillez envoyer la durée du timeout **en seconde**:\nExemple: \`5\``).then(question => {
                                message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                                    .then(cld => {
                                        var msg = cld.first();
                                        if (isNaN(msg.content) || msg.content < 0 || msg.content > 1728000000) {
                                            message.channel.send(":x: Ce n'est pas un chiffre valide")
                                        } else {
                                            db.set(`${message.guild.id}.punition.${value}`, msg.content)
                                        }

                                        msg.delete().catch(e => { })
                                        i.deleteReply().catch(e => { })
                                        update(mm)
                                    })
                            })
                        } else { db.set(`${message.guild.id}.punition.${value}`, i.customId); update(mm); collector2.stop() }

                    })
                })
            })
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
        function update(msg) {
            const roww = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('config')
                        .setPlaceholder('Modifier une punition')
                        .addOptions([
                            {
                                label: 'Anti-Link',
                                value: 'antilink',
                            },
                            {
                                label: 'Anti-Bot',
                                value: 'antibot',
                            },
                            {
                                label: 'Anti-Spam',
                                value: 'antispam',
                            },
                            {
                                label: 'Anti-Channel',
                                value: 'antichannel',
                            },
                            {
                                label: 'Anti-Role',
                                value: 'role',
                            },
                            {
                                label: 'Anti-RoleUpdate',
                                value: 'roleupdate',
                            },
                            {
                                label: 'Anti-GuildUpdate',
                                value: 'guildupdate',
                            },
                            {
                                label: 'Lockurl',
                                value: 'lockurl',
                            },

                        ])
                )
            let link = db.fetch(`${message.guild.id}.punition.antilink`)
            if(!link) link = client.perms.antiraid.antilink

            let bot = db.fetch(`${message.guild.id}.punition.antibot`)
            if(!bot) bot = client.perms.antiraid.antibot

            let spam = db.fetch(`${message.guild.id}.punition.antispam`)
            if(!spam) spam = client.perms.antiraid.antispam

            let channel = db.fetch(`${message.guild.id}.punition.antichannel`)
            if(!channel) channel = client.perms.antiraid.antichannel

            let role = db.fetch(`${message.guild.id}.punition.role`)
            if(!role) role = client.perms.antiraid.role

            let roleupdate = db.fetch(`${message.guild.id}.punition.roleupdate`)
            if(!roleupdate) roleupdate = client.perms.antiraid.roleupdate

            let guildupdate = db.fetch(`${message.guild.id}.punition.guildupdate`)
            if(!guildupdate) guildupdate = client.perms.antiraid.guildupdate
            
            let url = db.fetch(`${message.guild.id}.punition.lockurl`)
            if(!url) url = client.perms.antiraid.lockurl
            const msgembed = new Discord.MessageEmbed()
                .setTitle("Punitions Anti-Raid")
                .setColor(db.fetch(`${message.guild.id}.color`))
                .addField("Anti-Link", link === "off" ? ":x:" : isNaN(link) ? `${link}` : `Timeout [${link}sec]`)
                .addField("Anti-Spam", spam === "off" ? ":x:" : isNaN(spam) ? `${spam}` : `Timeout [${spam}sec]`)
                .addField("Anti-Bot", bot === "off" ? ":x:" : isNaN(bot) ? `${bot}` : `Timeout [${bot}sec]`)
                .addField("Anti-Channel", channel === "off" ? ":x:" : isNaN(channel) ? `${channel}` : `Timeout [${channel}sec]`)
                .addField("Anti-Role", role === "off" ? ":x:" : isNaN(role) ? `${role}` : `Timeout [${role}sec]`)
                .addField("Anti-RoleUpdate", roleupdate === "off" ? ":x:" : isNaN(roleupdate) ? `${roleupdate}` : `Timeout [${roleupdate}sec]`)
                .addField("Anti-GuildUpdate", guildupdate === "off" ? ":x:" : isNaN(guildupdate) ? `${guildupdate}` : `Timeout [${guildupdate}sec]`)
                .addField("Lockurl", url === "off" ? ":x:" : isNaN(url) ? `${url}` : `Timeout [${url}sec]`)
            msg.edit({ embeds: [msgembed], components: [roww] })
        }
    }
}