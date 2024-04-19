
const db = require("quick.db")
var user = {}
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "join",
    description: "Déplace l'auteur de la commande dans le vocal du membre mentionné",
    usage: "join <@user/#channel>",
    aliases: ["vm"],

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            if (!args[0]) return message.reply(":x: Veuillez mentionner un membre avec qui vous déplacer !")
                let channel = message.member.voice.channel
                if (!channel || channel.type === "GUILD_TEXT") return message.reply(`:x: Vous devez être en vocal !`)

                let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member
                if (!member || member.bot || member.id === message.author.id) return message.channel.send(`:x: Utilisateur invalide !`)
                let channel2 = member.voice.channel
                if (!channel2 || channel2.type === "GUILD_TEXT") return message.reply(`:x: Le membre n'est pas en vocal !`)
                if(channel2.id === channel.id) return message.reply(`:x: Vous êtes déjà dans le vocal de ${member.user.username} !`)

            message.member.voice.setChannel(channel2).catch()
            message.delete().catch()
        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}