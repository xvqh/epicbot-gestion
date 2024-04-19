const db = require("quick.db")
const Discord = require("discord.js")
var { permsize } = require("../../config")
var { defaultperm } = require("../../perm.json")
const { checkperm } = require("../../base/functions");
module.exports = {
  name: "set-perm",
  description: `Permets de configurer une commande sur un/des rôle(s)`,
  usage: "setperm <command> <@role>",
  aliases: ["setperm"],

  run: async (client, message, args, cmd) => {
    let perm = await checkperm(message,cmd.name)
    if (perm == true) {
      let cmds = []
      for (i in defaultperm) {
        cmds.push(defaultperm[i].name)
      }
      if (!args[0]) return message.reply(`Vous devez précisez une commande !\nEx: \`setperm <1/2/.../${permsize}/<command_name> @role\` !\n_Utilisez la \`commands\` pour voir toutes les commandes_`)
      if (isNaN(args[0])) {
        let command = args[0].toLowerCase()
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
        if (args[0] === "all") {
          if(args[1] === "clear"){
            for (i in defaultperm) {
              db.delete(`${message.guild.id}.perm.${defaultperm[i].name}`)
            }
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setDescription(`🚨 Les commandes ont été retiré de tous les rôles !`)]
            })
          }
          if (!role) return message.reply(`:x: Rôle invalide`)
          for (i in defaultperm) {
            db.push(`${message.guild.id}.perm.${defaultperm[i].name}`, role.id)
          }
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(db.fetch(`${message.guild.id}.color`))
              .setDescription(`🚨 Le rôle ${role} a maintenant toutes les permissions !`)]
          })
        }
        if (command && cmds.includes(command.toLowerCase())) {
          if (!role) return message.reply(`:x: Rôle invalide`)
          let ralert = db.fetch(`${message.guild.id}.perm.${command}`)
          if (ralert && ralert.includes(role.id)) {
            const filtered = ralert.filter(e => e !== role.id);
            db.set(`${message.guild.id}.perm.${command}`, filtered);
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setDescription(`🚨 Le rôle ${role} n'a plus la permission \`${command}\`!`)]
            })
          }
          db.push(`${message.guild.id}.perm.${command}`, role.id)
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(db.fetch(`${message.guild.id}.color`))
              .setDescription(`🚨 Le rôle ${role} a maintenant la permission \`${command}\`!`)]
          })
        } else message.reply(`:x: Commande invalide`)
      } else {
        if (parseInt(args[0]) > 0 && parseInt(args[0]) <= permsize) {
          let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
          if (!role) return message.reply(`:x: Rôle invalide`)
          let check = db.fetch(`${message.guild.id}.permission${args[0]}`)
          if (check && check.includes(role.id)) {
            const filtered = check.filter(e => e !== role.id);
            db.set(`${message.guild.id}.permission${args[0]}`, filtered);
            return message.reply({
              embeds: [new Discord.MessageEmbed()
                .setColor(db.fetch(`${message.guild.id}.color`))
                .setDescription(`🚨 Le rôle ${role} n'a plus la permission \`${args[0]}\`!`)]
            })
          }
          db.push(`${message.guild.id}.permission${args[0]}`, role.id);
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(db.fetch(`${message.guild.id}.color`))
              .setDescription(`🚨 Le rôle ${role} a maintenant la permission \`${args[0]}\`!`)]
          })
        } else return message.reply(`:x: Permission invalide (1 < ${permsize})`)
      }
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)
  }
}