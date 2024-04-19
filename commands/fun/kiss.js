const db = require("quick.db")
const Discord = require('discord.js');
const { checkperm } = require("../../base/functions");
module.exports = {
    name: "kiss",
    description: "Embrassse un membre",

    run: async (client, message, args, cmd) => {
        let perm = await checkperm(message,cmd.name)
        if (perm == true) {
            let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member
            if (!member || member.user.bot) return message.channel.send(`:x: Utilisateur invalide !`)
            let kiss = ['https://cdn.weeb.sh/images/rymvn6_wW.gif', 'https://cdn.weeb.sh/images/H1a42auvb.gif', 'https://cdn.weeb.sh/images/H1Gx2aOvb.gif', 'https://cdn.weeb.sh/images/rJrCj6_w-.gif', 'https://cdn.weeb.sh/images/B13D2aOwW.gif', 'https://cdn.weeb.sh/images/BJLP3a_Pb.gif', 'https://cdn.weeb.sh/images/Hy-oQl91z.gif', 'https://cdn.weeb.sh/images/SJINn6OPW.gif', 'https://cdn.weeb.sh/images/ByiMna_vb.gif', 'https://cdn.weeb.sh/images/rymvn6_wW.gif', 'https://cdn.weeb.sh/images/BJSdQRtFZ.gif', 'https://cdn.weeb.sh/images/S1PCJWASf.gif', 'https://cdn.weeb.sh/images/SJ3dXCKtW.gif', 'https://cdn.weeb.sh/images/HJlWhpdw-.gif', 'https://cdn.weeb.sh/images/rkde2aODb.gif', 'https://cdn.weeb.sh/images/SybPhp_wZ.gif', 'https://cdn.weeb.sh/images/rkFSiEedf.gif', 'https://cdn.weeb.sh/images/r1cB3aOwW.gif', 'https://cdn.weeb.sh/images/BJv0o6uDZ.gif', 'https://cdn.weeb.sh/images/B13D2aOwW.gif', 'https://cdn.weeb.sh/images/Skv72TuPW.gif', 'https://cdn.weeb.sh/images/S1qZksSXG.gif', 'https://cdn.weeb.sh/images/Sk1k3TdPW.gif', 'https://cdn.weeb.sh/images/S1-KXsh0b.gif', 'https://cdn.weeb.sh/images/B1yv36_PZ.gif', 'https://cdn.weeb.sh/images/BJx2l0ttW.gif']
            var randomkiss = kiss[Math.floor(Math.random()*kiss.length)]
            var embed = new Discord.MessageEmbed()
                .setDescription(`💋 **${message.author.username}** fait un bisou à **${member.user.username}**`)
                .setImage(randomkiss)
                .setColor(db.fetch(`${message.guild.id}.color`))
            message.reply({embeds: [embed]})

        } else if(perm === false) if(!db.fetch(`${message.guild.id}.vent`)) return message.reply(`:x: Vous n'avez pas la permission d'utiliser la commande \`${cmd.name}\` !`)

    }
}