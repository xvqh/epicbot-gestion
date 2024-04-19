
const db = require('quick.db');
const Discord = require('discord.js')
const config = require('../config');
module.exports = {
  async checkperm(message, cmd) {
    let check = false
    let o = db.fetch(`${message.guild.id}.perm.${cmd}`)
    await message.member.roles.cache.forEach(r => {
      if (o && o.includes(r.id)) return check = true
    })

    let cmdperm = db.fetch(`${message.guild.id}.change.${cmd}`)

    if (check !== true) {
      if (!cmdperm && cmdperm !== 0) { cmdperm = 6 }
      let authorperm = []
      if (cmdperm === 0) check = true
      for (let i = cmdperm; i < config.permsize + 1; i++) {
        let tet = db.fetch(`${message.guild.id}.permission${i}`)
        for (size in tet) {
          authorperm.push(tet[size])
        }
      }
    await message.member.roles.cache.forEach(r => {
      if (authorperm && authorperm.includes(r.id)) return check = true
    })
  }
    let array = db.fetch(`${message.guild.id}.ventall`)
    if(array && cmdperm === 0) check = undefined
    let forbiden = db.fetch(`${message.guild.id}.channelventall`)
    if(forbiden && forbiden.includes(message.channel.id)) check = undefined
      let b = db.fetch(`bot.owner`)
      if (b && b.includes(message.author.id) && cmdperm !== "buyer") check = true
      const founder = config.owners
      if (founder.includes(message.author.id)) check = true
return check
  },
  ownersend(client, m) {
    let owners = db.get('bot.owner')
    if (owners === null || owners === undefined) { return } else {
      for (let i = 0; i < owners.length; i++) {
        if (owners === null) continue;
        let g = client.users.cache.get(owners[i])
        if (g) {
          g.send(m).catch(e => { })
        }
      }
    }
  },

  sanction(member, guild, sanction, reason) {
    if (sanction === "off") return
    if(guild.me.permissions.has("KICK_MEMBERS")){
    if (sanction === "kick") {
      member.kick({
        "reason": reason
      }).catch(e => { })
    }
  }
    if(guild.me.permissions.has("BAN_MEMBERS")){
    if (sanction === "ban") {
      guild.bans.create(member, {
        "reason": reason
      }).catch(e => { })
    }
  }
    if(member.roles.highest.position < guild.me.roles.highest.position && guild.me.permissions.has("MANAGE_ROLES")){
    if (sanction === "derank") {
      member.roles.cache.forEach(r => {
        if (r.id === guild.roles.everyone.id) return;
        member.roles.remove(r.id).catch(e => { })
      })
    }
  }
    if (!isNaN(sanction)) member.timeout(sanction * 1000, reason).catch(e => { })
  },
  between(min, max) {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  },
  msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60)
      , minutes = parseInt((duration / (1000 * 60)) % 60)
      , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = hours;
    minutes = minutes;
    seconds = seconds;
    return `${hours ? `${hours} heure(s), ` : ""}${hours || minutes ? `${minutes} minute(s) et ` : ""}${hours || minutes || seconds ? `${seconds} seconde(s)`: ""}`
  }
}