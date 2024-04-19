const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "rolereact",
  description: "Ajoutes un rôle selon la réaction ajoutée",
  aliases: ["reactrole", "rolemenu"],

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message, cmd.name)
    let updated = null
    let array = []
    let channel = message.channel.id
    let opt = "auto"
    let multi = null
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
          if (select.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
          let value = select.values[0]
          
          await select.deferUpdate()
          //console.log(await select.fetchReply())
          if (value === "add") {
            await message.channel.send(`📝 Veuillez mentionner le rôle à donner:`).then(async question => {
              message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                .then(cld => {
                  var msg = cld.first();
                  let newrole = msg.mentions.roles.first() || msg.guild.roles.cache.get(msg.content) || msg.guild.roles.cache.find(r => r.name.toLowerCase() === msg.content.toLocaleLowerCase())
                  if (!newrole || newrole.name === "@everyone" || newrole.name === "@here") return message.channel.send(`:x: Rôle invalide`)
                  const memberPosition = message.member.roles.highest.position;
                  const authorPosition = newrole.position;
                  if (authorPosition >= memberPosition) return message.reply(":x: Vous ne pouvez pas ajouter un rôle supérieur au votre !");

                  message.channel.send(`📝 Veuillez envoyer l'emoji:`).then(question => {
                    message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                      .then(cld => {
                        var msg = cld.first();
                        cld.first().react(msg.content).then(() => {
                          let check = array.filter(item => item.react === msg.content)
                          console.log(check.length > 0)
                          if(check.length > 0) return message.channel.send(`:x: Cet émoji est déjà utilisé dans ce reactrole !`)
                          array.push({ id: newrole.id, react: msg.content })
                          msg.delete()
                          question.delete()
                          update(mm)
                        }).catch(() => {
                          update(mm);
                          return message.channel.send(`:x: Je n'ai pas accès à cet emoji !`)
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
            await message.channel.send(`📝 Veuillez envoyer le salon:`).then(question => {
              message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
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
            await message.channel.send(`📝 Veuillez l'ID du message:`).then(question => {
              message.channel.awaitMessages({ filter: filter, max: 1, time: 60000, errors: ['time'] })
                .then(cld => {
                  var msg = cld.first();
                  newchan.messages.fetch(msg.content)
                    .then(message => {
                      opt = message.id
                      msg.delete().catch(e => { })
                      question.delete().catch(e => { })
                      update(mm)
                    }).catch(e => { update(mm); return message.channel.send(":x: Message introuvable") });
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
                let reacts = array.map(a => `Cliques sur ${a.react} pour obtenir le rôle <@&${a.id}>`).join("\n")
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
                }).catch(e => { update(mm); return message.channel.send(":x: Message introuvable !") });
            }
            function start(msgreact) {
              if (!isNaN(msgid)) {
                let roletoadd = db.fetch(`${message.guild.id}.rolereact.${msgid}`)
                if (roletoadd) db.delete(`${message.guild.id}.rolereact.${msgid}`)
                db.set(`${message.guild.id}.rolereact.${msgid}`, { multi: multi, options: array })
                message.channel.send(`Rolereact créé ${channel} !`)
                for (i in array) {
                  msgreact.react(array[i].react)
                }
              }
            }
          }
        })
        collector.on("end", async () => {
          return mm.edit({ content: "Expiré !", components: [] }).catch(() => { })
        })
      })

    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    function update(msg) {
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
          let roletoadd = db.fetch(`${message.guild.id}.rolereact.${opt}`)
          if (roletoadd && roletoadd.options) {
            array = []
            for (i in roletoadd.options) {
              array.push({ id: roletoadd.options[i].id, react: roletoadd.options[i].react })
            }
            if (roletoadd.multi) multi = true
            updated = true
          }
        }
      }
      let reacts = array.map(a => `${a.react} - <@&${a.id}>`).join("\n")
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
      let button1 = new Discord.MessageButton().setStyle('SUCCESS').setCustomId('valid').setLabel("✔️ Valide le rolereact")
      let button2 = new Discord.MessageButton().setStyle('DANGER').setCustomId('delete').setLabel("❌ Supprime le rolereact")
      let button_row = new Discord.MessageActionRow().addComponents([button1, button2])
      const msgembed = new Discord.MessageEmbed()
        .setTitle("🤡 Role-React")
        .setColor(db.fetch(`${message.guild.id}.color`))
        .addField("Salon du rolereact", ch ? `${ch}` : ":x:")
        .addField("Multiples Rôles Possibles", multi ? `:white_check_mark:` : ":x:")
        .addField("Message", isNaN(opt) ? opt.replace("auto", "Message Automatique") : `[${opt}](https://discord.com/channels/${message.guild.id}/${ch.id})`)
        .addField("Options", array && array.length > 0 ? `${reacts}` : ":x:")
      msg.edit({ embeds: [msgembed], components: [roww, row, button_row] })
    }
  }
}