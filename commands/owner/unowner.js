const db = require("quick.db")
module.exports = {
    name: "unowner",
    description: "Retire un owner",
  run: async (client, message, args) => {
    try {
      const founder = client.config.owners
      if (founder.includes(message.author.id)) {
        let id
        if (isNaN(args[0])) {
          let m = message.mentions.users.first()
          if (!m || m.bot) return message.channel.send(`Aucun membre trouvé pour: \`${args[0] || "rien"}\``)
          id = m.id
        } else {
          if (args[0].length < 18 || isNaN(args[0])) return message.channel.send(`Aucun membre trouvé pour: \`${args[0] || "rien"}\``)
          id = args[0]
        }
        let difarr = db.fetch(`bot.owner`)
        let allmemberlen = ""
        let mm = client.users.cache.get(id)
        if (difarr) {
          allmemberlen = difarr.length
          for (let i = 0; i < allmemberlen; i++) {
            if (id === difarr[i]) {
              const filtered = difarr.filter(e => e !== id);
              db.set(`bot.owner`, filtered);
              return message.channel.send(`${mm ? mm.username : `<@${id}>`} n'est plus owner du bot`)
            }
          }
        } else return message.reply(`:x: Il n'y a pas d'owner bot !`)
      } else return message.reply(`:x: Vous devez être propriétaire du bot !`)
    } catch (error) {
      console.log(error)
    }
  }
}