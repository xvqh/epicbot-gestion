const db = require("quick.db")
const Discord = require("discord.js")
var { defaultperm } = require("../../perm.json")
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "perms",
  description: "Affiche les permissions configurées",
  aliases: ['permissions', 'perm'],
  run: async (client, message, args, cmd) => {
    let button1 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('role').setLabel("Permissions rôle")
    let button2 = new Discord.MessageButton().setStyle('PRIMARY').setCustomId('number').setLabel("Permissions chiffres")
    const button_row = new Discord.MessageActionRow().addComponents([button2, button1])
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {
      const Embed = new Discord.MessageEmbed()
        .setColor(db.fetch(`${message.guild.id}.color`))
        .setTitle(`Chargement...`)
      message.reply({ embeds: [Embed], componentes: [button_row] }).then(async msg => {
        pnumber(msg)
        const collector3 = msg.createMessageComponentCollector({
          componentType: "BUTTON",
          time: 500000
        })
        collector3.on("collect", async (i) => {
          if (i.user.id !== message.author.id) return select.reply({ content: "Vous n'avez pas la permission !", ephemeral: true }).catch(() => { })
          await i.deferUpdate()
          if (i.customId === 'role') {
            prole(msg)
          }
          if (i.customId === 'number') {
            pnumber(msg)
          }
        })
      })

    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    async function prole(msg) {
      const proleembed = new Discord.MessageEmbed()
        .setColor(db.fetch(`${message.guild.id}.color`))
        .setTitle(`Permissions par rôle configurées`)
      for (i in defaultperm) {
        let o = db.fetch(`${message.guild.id}.perm.${defaultperm[i].name}`)
        if(o){
        for (ii in o) {
          let check = message.guild.roles.cache.get(o[ii])
          if (!check) {
            const filtered = o.filter(e => e !== o[ii]);
            db.set(`${message.guild.id}.perm.${defaultperm[i].name}`, filtered);
          }
        }
        o = db.fetch(`${message.guild.id}.perm.${defaultperm[i].name}`)
        await proleembed.addField(defaultperm[i].name, `${o && o.length > 0 ? o.map(r => message.guild.roles.cache.get(o[ii]) ? `<@&${r}>` : "").join("\n") : ":x:"}`, true)
      }
      }
      if(proleembed.fields.length < 1) proleembed.addField("Il n'y a pas de permissions attribuées à un rôle", `Pour en configurer faites \`set-perm <command> <@role>\` !`, true)
      await msg.edit({ embeds: [proleembed], components: [button_row] })
    }

    function pnumber(msg) {
      const proleembed = new Discord.MessageEmbed()
        .setColor(db.fetch(`${message.guild.id}.color`))
        .setTitle(`Permissions chiffrées`)
      const permsize = client.config.permsize
      for (let i = 1; i < permsize + 1; i++) {
        let o = db.fetch(`${message.guild.id}.permission${i}`)
        for (ii in o) {
          let check = message.guild.roles.cache.get(o[ii])
          if (!check) {
            const filtered = o.filter(e => e !== o[ii]);
            db.set(`${message.guild.id}.permission${i}`, filtered);
          }
        }
        o = db.fetch(`${message.guild.id}.permission${i}`)
        proleembed.addField(`Permission ${i}`, `${o && o.length > 0 ? o.map(r => message.guild.roles.cache.get(o[ii]) ? `<@&${r}>` : "").join("\n") : ":x:"}`)
      }
      msg.edit({ embeds: [proleembed], components: [button_row] })
    }
  }
}