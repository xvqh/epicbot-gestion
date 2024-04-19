const getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; }
const db = require("quick.db")
module.exports = {
    name: 'messageUpdate',

    run: async (client, oldMessage, newMessage) => {
        if (newMessage.author) {
            if (oldMessage.content === newMessage.content) return;
            if (oldMessage.author && oldMessage.author.bot) return;
            let str_chan = db.fetch(`${newMessage.guild.id}.messagelogs`)
            str_chan = newMessage.guild.channels.cache.get(str_chan)
            if (str_chan) {
                if(oldMessage.author){
                str_chan.send({ embeds: [{ description: `**${oldMessage.author.username}**#${oldMessage.author.discriminator} (\`${oldMessage.author.id}\`) a modifié son message dans [\`${oldMessage.channel.name}\`](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}) \n  **Avant**: \`\`\`${oldMessage.content}\`\`\` **Après:** \`\`\`${newMessage.content}\`\`\``, color: db.fetch(`${newMessage.guild.id}.color`), author: { name: "📝 Editions" }, footer: { text: `🕙 ${getNow().time}` } }] })
                }
            }
        }
    }
}