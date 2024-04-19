const db = require('quick.db')
module.exports = {
    name: 'messageCreate',
 
    run: async (client, message) => {
        if(message.author.id === client.user.id) return
        let b = db.fetch(`bot.owner`)
      if (!message.guild || b && b.includes(message.author.id)) return
        let actual = db.fetch(`${message.guild.id}.piconly`)
        if(actual && actual.includes(message.channel.id)){
            if(message.attachments.size < 1) message.delete().catch()
        }
    }
}