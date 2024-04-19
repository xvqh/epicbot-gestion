const db = require('quick.db')
var rate = require('../../slow.js');
module.exports = {
    name: 'messageCreate',
 
    run: async (client, message) => {
       //if (!message || rate.rate === true) return
       if (!message.guild || !message.author) return
       if (message.author.bot) return
       let prefix = db.fetch(`prefix.${message.guild.id}`)
       if(!prefix){ db.set(`prefix.${message.guild.id}`,client.config.prefix); prefix = client.config.prefix}

 
       const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\s*`);
       if (!prefixRegex.test(message.content)) return;
       if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) return message.channel.send(`:astronaut: Prefix: \`${prefix}\``)
       if (message.content.length === prefix.length) return
       const [, matchedPrefix] = message.content.match(prefixRegex)
       //const database = await client.database();
       let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
       const command = args.shift()?.toLowerCase();

       const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
       if (!cmd) return;
 
       cmd.run(client, message, args, cmd)
    }
 }