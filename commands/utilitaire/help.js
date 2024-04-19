const { stripIndents } = require("common-tags");
const Discord = require('discord.js')
const db = require("quick.db");
const { checkperm } = require("../../base/functions");
const fs = require('fs')
module.exports = {
  name: "help",
  description: "Affiche les commandes du bot",
  aliases: ["aide"],

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message, "help")
    if (perm == true) {

      const prefix = await db.get(`prefix.${message.guild.id}`)
      if (!db.fetch(`${message.guild.id}.color`)) {
        db.set(`${message.guild.id}.color`, client.config.color)
     }
      const color = db.fetch(`${message.guild.id}.color`)

      if (!args[0]) {

        let button_next = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('next').setEmoji("▶️")
        let button_back = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('back').setEmoji("◀️")

        let button_row = new Discord.MessageActionRow().addComponents([button_back, button_next])
        const subFolders = fs.readdirSync('././commands')


        let page0 = embed(`:bust_in_silhouette: **• ${client.user.username}**`, `Prefix du serveur: \`${prefix}\`\n\n**Ce bot à pour objectif de gérer facilement votre serveur ainsi que ses permissions.**\n\n[\`Support du bot\`](https://discord.gg/DEyr5YYEQ2)  |  [\`Lien pour m'ajouter\`](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=24)\n\n_Appuyez sur les flèches ci-dessous pour changer de page !_`, undefined, `https://cdn.discordapp.com/attachments/1001147082125606983/1001912671429472316/unknown.png`)
        let page1 = embed(':scales: **• Modération**', undefined, subFolders[5])
        let page2 = embed('🛡️ **• Protection**', undefined, subFolders[10])
        let page3 = embed('💎 **• Configuration**', undefined, subFolders[1])
        let page10 = embed('🎓 **• Gestion Permissions**', undefined, subFolders[8])
        let page5 = embed('👤 **• Utilitaire**', undefined, subFolders[11])
        let musik = embed('🎶 **• Musique**', undefined, subFolders[6])
        let gw = embed('🎉 **• Giveaway**', undefined, subFolders[3])
        let page7 = embed('📍 **• Owner**', undefined, subFolders[7])
        let bot = embed('⚙️ **• Bot**', undefined, subFolders[0])
        let page8 = embed('📃 **• Logs**', undefined, subFolders[4])
        let page6 = embed('🎭 **• Fun**', undefined, subFolders[2])
        let page9 = embed('🔪 **• Prison**', undefined, subFolders[9])

        let page = [
          page0,
          page1,
          page2,
          page8,
          page10,
          page5,
          gw,
          musik,
          page3,
          page6,
          page7,
          bot,
          page9
        ]


        let apage = 0
        page[apage].setFooter({ text: `©️ E-Gestion | By Millenium is here#4444` })
        await message.reply({
          embeds: [page[apage]],
          components: [button_row],
          allowedMentions: { repliedUser: false }
        }).then(async msg => {
          const collector = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 150000
          })
          collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id) return i.reply({ content: "Désolé, mais vous n'avez pas la permission d'utiliser ces boutons !", ephemeral: true }).catch(() => { })
            await i.deferUpdate()

            if (i.customId === 'next') {
              if (apage >= page.length - 1) { apage = 0 } else {
                apage++
              }
              page[apage].setFooter({ text: `Page ${apage + 1}/${page.length} | By Millenium is here#4444`, iconURL: client.user.displayAvatarURL() })
              msg.edit({ embeds: [page[apage]] })
            }

            if (i.customId === 'back') {
              if (apage <= 0) { apage = page.length - 1 } else {
                apage--
              }
              page[apage].setFooter({ text: `Page ${apage + 1}/${page.length} | By Millenium is here#4444`, iconURL: client.user.displayAvatarURL() })
              msg.edit({ embeds: [page[apage]] })
            }
          })

          collector.on("end", async () => {
            button_row.components[0].setDisabled(true);
            button_row.components[1].setDisabled(true);
            return msg.edit({ embeds: [page[apage]], components: [button_row] }).catch(() => { })
          })
        })

        function embed(title, description, category, image) {
          let array = []
          if(category) {
            const commandsFiles = fs.readdirSync(`././commands/${category}`).filter(file => file.endsWith('.js'))
          for (const commandFile of commandsFiles) {
            const command = require(`../../commands/${category}/${commandFile}`)
            array.push(`\`${prefix}${command.name}\`\n${command.description}`)
          }
        }
          return new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(title ? title : "Aucun auteur pour l'embed !")
            .setImage(image ? image : "")
            .setDescription(description ? `Utilisez \`${prefix}help [commande]\` pour obtenir des informations sur une commande\n\n` + description : category && array.length > 0 ? `Utilisez \`${prefix}help [commande]\` pour obtenir des informations sur une commande\n\n`+ array.map(e => e).join("\n\n") : "Pas de description précisée")
        }
      } else {
        const embed = new Discord.MessageEmbed()
          .setColor(color)

          .setAuthor({ name: "Page d'aide de la commande " + args[0], iconURL: "https://cdn.discordapp.com/attachments/851876715835293736/852647593020620877/746614051601252373.png" })

        let command = client.commands.get(client.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
        if (!command) return message.channel.send(":x: Commande innexistante !")

        embed.setDescription(stripIndents`
          ** Commande -** [    \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`   ]\n
          ** Description -** [    \`${command.description || "Pas de description renseignée."}\`   ]\n
          ** Usage -** [   \`${command.usage ? `\`${command.usage}\`` : "Pas d'utilisation conseillée"}\`   ]\n
          ** Aliases -** [   \`${command.aliases ? command.aliases.join(" , ") : "Aucun"}\`   ]`)
        embed.setFooter({ text: `©️ E-Gestion | By Millenium is here#4444` })

        return message.channel.send({ embeds: [embed] })
      }
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`help\` !`)
  }
}

