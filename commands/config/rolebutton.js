const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "rolebutton",
  description: "Ajoutes un rôle selon la réaction ajoutée",
  aliases: ["buttonrole"],

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message, cmd.name)
    let updated = null
    let array = []
    let channel = message.channel.id
    let opt = "auto"
    let multi = null
    let id = 0
    if (perm == true) {
      const embed = new Discord.MessageEmbed()
        .setColor(db.fetch(`${message.guild.id}.color`))
        .setTitle("Chargement...")
      message.reply({ embeds: [embed] }).then(mm => {
        console.log("bite")
        update(mm)
        const filter = m => message.author.id === m.author.id;
        const collector = mm.createMessageComponentCollector({
          componentType: "SELECT_MENU",
          time: 1800000
        })
        collector.on("collect", async (select) => {
          if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
          let value = select.values[0]
          await select.deferUpdate()
          if (value === "add") {
            await message.channel.send(`📝 Veuillez mentionner le rôle à donner:`).then(async question => {
              await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                .then(cld => {
                  var msg = cld.first();
                  let newrole = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.content) || msg.guild.roles.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                  if (!newrole || newrole.name === "@everyone" || newrole.name === "@here") { update(mm); return message.channel.send(`:x: Rôle invalide`) }
                  const memberPosition = message.member.roles.highest.position;
                  const authorPosition = newrole.position;
                  if (authorPosition >= memberPosition) { update(mm); return message.reply(":x: Vous ne pouvez pas ajouter un rôle supérieur au votre !"); }

                  message.channel.send(`📝 Veuillez envoyer le message du button:\nEnvoyer \`off\` si vous ne voulez pas de texte`).then(async question => {
                    await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                      .then(cld => {
                        let msg = cld.first();
                        if (msg.content.toLowerCase() === "off") msg.content = undefined
                        message.channel.send(`📝 Veuillez envoyer l'émoji du bouton:\nEnvoyer \`off\` si vous ne voulez pas d'émoji`).then(async questionn => {
                          await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                            .then(cld => {
                              var msgg = cld.first();
                              if (msgg.content.toLowerCase() === "off") {
                                if (!msg.content) { update(mm); return message.channel.send(":x: Le bouton doit au moins contenir du texte et/ou un emoji !") }
                                array.push({ id: newrole.id, content: `rolemenu-${msg.content}`, label: msg.content })
                                msgg.delete()
                                questionn.delete()
                                msg.delete()
                                question.delete()
                                update(mm)
                              } else {
                                cld.first().react(msgg.content).then(() => {
                                  if (msg.content && msg.content.length < 1 || !msg.content && !msgg.content) { update(mm); return message.channel.send(":x: Le bouton doit au moins contenir du texte et/ou un emoji !") }
                                  array.push({ id: newrole.id, content: `rolemenu-${msg.content && msg.content.length > 0 ? msg.content : id}`, label: msg.content, react: msgg.content })
                                  id++
                                  msgg.delete()
                                  questionn.delete()
                                  msg.delete()
                                  question.delete()
                                  update(mm)
                                }).catch((e) => {
                                  update(mm)
                                  return message.channel.send(`:x: Je n'ai pas accès à cet emoji !`)
                                })
                              }
                            })
                        })
                      })
                  })

                  msg.delete().catch(e => { })
                  question.delete().catch(e => { })
                  update(mm)
                })
            })
          }
          if (value === "multi") {
            if (!multi) {
              multi = true
            } else multi = null
            update(mm)

          }
          if (value === "channel") {
            await message.channel.send(`📝 Veuillez envoyer le salon:`).then(async question => {
              await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                .then(cld => {
                  var msg = cld.first();
                  let newchan = msg.mentions.channels.first() || msg.guild.channels.cache.get(msg.content) || msg.guild.channels.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                  if (!newchan) { update(mm); return message.channel.send(`:x: Salon invalide`) }
                  channel = newchan.id

                  msg.delete().catch(e => { })
                  question.delete().catch(e => { })
                  update(mm)
                })
            })
          }
          if (value === "lastmsg") {
            opt = "lastmsg"
            update(mm)

          }
          if (value === "auto") {
            opt = "auto"
            update(mm)

          }
          if (value === "msgid") {
            let newchan = message.guild.channels.cache.get(channel)
            if (!newchan) { update(mm); return message.channel.send(`:x: Le salon d'origine est invalide !`) }
            await message.channel.send(`📝 Veuillez l'ID du message:`).then(async question => {
              await message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                .then(cld => {
                  var msgd = cld.first();
                  newchan.messages.fetch(msgd.content)
                    .then(message => {
                      if (message.author.id !== client.user.id) { update(mm); return msgd.channel.send(`:x: Je dois être l'auteur du message, sinon je ne peux pas ajouter de bouton !`) }
                      opt = message.id
                      msgd.delete().catch(e => { })
                      question.delete().catch(e => { })
                      update(mm)
                    }).catch(e => { console.log(e); message.channel.send(":x: Message introuvable"); return update(mm) });
                })
            })

          }
        })
        const collectorr = mm.createMessageComponentCollector({
          componentType: "BUTTON",
          time: 1800000
        })
        collectorr.on("collect", async (i) => {
          if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
          await i.deferUpdate()

          if (i.customId === 'valid') {

            channel = message.guild.channels.cache.get(channel)
            if (!channel) return message.reply(`:x: Salon invalide ou innexistant !`)
            if (!array || array.length < 1) return message.reply(`:x: Vous n'avez pas ajouté d'options !`)
            let msgid
            if (isNaN(opt)) {
              if (opt === "auto") {
                let reacts = array.map(a => `Cliques sur ${a.react ? `${a.react} ` : ""}${a.label ? a.label : ""}pour obtenir le rôle <@&${a.id}>`).join("\n")
                channel.send({
                  embeds: [new Discord.MessageEmbed()
                    .setTitle("🤡 Role-React")
                    .setColor(db.fetch(`${message.guild.id}.color`))
                    .setDescription(`${reacts}`)]
                }).catch(e => { return message.channel.send(`:x: Je n'ai pas la permission d'envoyer des messages dans ce salon !`) })
                  .then(m => {
                    msgid = m.id
                    start(m)
                  })
              }
            } else {
              channel.messages.fetch(opt)
                .then(message => {
                  msgid = message.id
                  start(message)
                }).catch(e => { return message.channel.send(":x: Message introuvable !") });
            }

            function start(msgreact) {
              if (!isNaN(msgid)) {
                if (msgreact.author.id !== client.user.id) return message.channel.send(`:x: Le message doit être le miens pour que je puisse ajouter un bouton`)
                let roletoadd = db.fetch(`${message.guild.id}.rolebutton.${msgid}`)
                if (roletoadd) db.delete(`${message.guild.id}.rolebutton.${msgid}`)
                db.set(`${message.guild.id}.rolebutton.${msgid}`, { multi: multi, options: array })
                message.channel.send(`rolebutton créé ${channel} !`)
                const row = new Discord.MessageActionRow()
                for (i in array) {
                  if (array[i].react && array[i].label) {
                    row.addComponents(
                      new Discord.MessageButton()
                        .setCustomId(`rolemenu-` + array[i].content)
                        .setLabel(array[i].label)
                        .setEmoji(array[i].react)
                        .setStyle("PRIMARY"),
                    );
                  } else if (array[i].label && !array[i].react) {
                    row.addComponents(
                      new Discord.MessageButton()
                        .setCustomId(`rolemenu-` + array[i].content)
                        .setLabel(array[i].label)
                        .setStyle("PRIMARY"),
                    );
                  } else if (!array[i].label && array[i].react) {
                    row.addComponents(
                      new Discord.MessageButton()
                        .setCustomId(`rolemenu-` + array[i].content)
                        .setEmoji(array[i].react)
                        .setStyle("PRIMARY"),
                    );
                  }
                }
                msgreact.edit({ components: [row] })
              }
            }
          }
        })
        collector.on("end", async () => {
          return mm.edit({ content: "Expiré !", components: [] }).catch(() => { })
        })
      })

    } else if (perm === false) if (!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    async function update(msg) {
      const roww = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageSelectMenu()
            .setCustomId('config')
            .setPlaceholder('Ajouter une option')
            .addOptions([
              {
                label: 'Ajouter',
                value: 'add',
              },
              {
                label: 'Retirer',
                value: 'remove',
              }

            ])
        )
      const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageSelectMenu()
            .setCustomId('configg')
            .setPlaceholder('Modifier un paramètre')
            .addOptions([
              {
                label: 'Salon',
                value: 'channel',
              },
              {
                label: 'Multiples rôles',
                value: 'multi',
              }

            ])
        )

      if (!isNaN(opt)) {
        if (!updated) {
          let roletoadd = db.fetch(`${message.guild.id}.rolebutton.${opt}`)
          if (roletoadd && roletoadd.options) {
            array = []
            for (i in roletoadd.options) {
              array.push({ id: roletoadd.options[i].id, content: roletoadd.options[i].content, react: roletoadd.options[i].react })
            }
            if (roletoadd.multi) multi = true
            updated = true
          }
        }
      }
      let reacts = array.map(a => `*${a.react ? `${a.react} ` : ""}${a.label ? a.label : ""}* - <@&${a.id}>`).join("\n")
      let ch = message.guild.channels.cache.get(channel)

      if (ch) {
        row.components[0].addOptions([
          {
            label: `Message Automatique`,
            value: `auto`,
          },
          {
            label: `Choisir un message`,
            value: `msgid`,
          }
        ]);
      }
      let button1 = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('valid').setLabel("✔️ Valide le rolebutton")
      let button2 = new Discord.MessageButton().setStyle('DANGER').setCustomId('delete').setLabel("❌ Supprime le rolebutton")
      let button_row = new Discord.MessageActionRow().addComponents([button1, button2])
      const msgembed = new Discord.MessageEmbed()
        .setTitle("🤡 Role-Button")
        .setColor(db.fetch(`${message.guild.id}.color`))
        .addField("Salon du rolebutton", ch ? `${ch}` : ":x:")
        .addField("Multiples Rôles Possibles", multi ? `:white_check_mark:` : ":x:")
        .addField("Message", isNaN(opt) ? opt.replace("auto", "Message Automatique") : `[${opt}](https://discord.com/channels/${message.guild.id}/${ch.id})`)
        .addField("Options", array && array.length > 0 ? `${reacts}` : ":x:")
      await msg.edit({ embeds: [msgembed], components: [roww, row, button_row] })
    }
  }
}