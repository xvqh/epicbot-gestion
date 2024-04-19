const db = require("quick.db")
const Discord = require('discord.js');
var rslow = require('../../slow.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "antilink",
    description: "Configure l'anti-link",
    usage: "antilink <off/on/max/allow/deny>",
    aliases: ["anti-link"],

    run: async (client, message, args, cmd) => {
      let b = db.fetch(`${message.guild.id}.botowner`)
      let perm = await checkperm(message, "anti")
      if (perm == true || b && b.includes(message.author.id)) {
      if (rslow.action[message.author.id] == true) return message.channel.send(`:x: Veuillez attendre avant d'effectuer une autre action !`)
      if (args[0] === "on") { db.set(`${message.guild.id}.anti.link`, "on") } else
        if (args[0] === "off") { db.delete(`${message.guild.id}.anti.link`) } else
          if (args[0] === "max") { db.set(`${message.guild.id}.anti.link`, "max") } else
            if (args[0] === "allow") {
              let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
              db.push(`${message.guild.id}.anti.link_allow`, channel.id)
              return message.reply(`:shield: Le salon \`${channel.name}\` est désormais ignoré par l'antilink`)
            } else
              if (args[0] === "deny") {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.channel
                let channels = db.fetch(`${message.guild.id}.anti.link_allow`)
                const filtered = channels.filter(e => e !== channel.id);
                db.set(`${message.guild.id}.anti.link_allow`, filtered);
                return message.reply(`:shield: Le salon \`${channel.name}\` n'est plus ignoré par l'antilink`)
              } else return message.reply(`L'antilink est sur \`${db.fetch(`${message.guild.id}.anti.link`) || "off"}\` !`)

      message.reply(`:shield: L'\`antilink\` est désormais sur \`${args[0]}\`${args[0] === "on" ? " (_les membres wl sont ignorés_)" : ""}`)

      rslow.action[message.author.id] = true;
      setTimeout(() => {
        rslow.action[message.author.id] = false;
      }, db.fetch(`${message.guild.id}.actionslow`));
      let logchannel = db.fetch(`${message.guild.id}.raidlogs`)
      logchannel = message.guild.channels.cache.get(logchannel)
      if (logchannel) logchannel.send({
        embeds: [new Discord.MessageEmbed()
          .setColor(db.fetch(`${message.guild.id}.color`))
          .setDescription(`${message.author} a modifié l'antilink sur \`${args[0]}\` !`)]
      }).catch(e => { e })
    } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`anti\` !`)

  }
}