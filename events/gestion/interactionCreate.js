const db = require("quick.db")
const { MessageReaction, User, MessageEmbed } = require("discord.js");
module.exports = {
    name: 'interactionCreate',

    run: async (client, interaction ) => {
        if (interaction.isButton()) {
            const button = interaction
            if(button && interaction.customId.startsWith("delete-")){
                let idou = interaction.customId.split("-")[1]
                console.log(interaction.customId)
                if(idou !== interaction.member.id) return
                const WebSocket = require('ws');
                const socket = new WebSocket("ws://194.180.176.254:3000");
                
                socket.on("error", error => {
                    console.log(error);
                });

                socket.on("open", async ws => {
                    console.log("[prevnames] Connection established, ready to delete");
                    socket.send(JSON.stringify({
                        type: 'delete',
                        id: idou,
                        name: null,
                        date: null
                    }));
                    socket.close()
                    interaction.message.delete().catch(e =>{})
                    return interaction.reply({content: `🗑️ Données suprimées avec succès !`}).catch(e => {})
                })
            }
            if (!button || !interaction.customId.startsWith("rolemenu-")) return
            if (button.message.partial) await button.message.fetch();
            if (button.partial) await button.fetch();
            const member = button.member
                if (client.user.id === member.id) return;
                if (member) {
                    let roletoadd = db.fetch(`${button.guild.id}.rolebutton.${button.message.id}`)
                    let canadd = true
                    if (roletoadd && roletoadd.options) {
                        if (roletoadd.options.filter(i => i.content === "rolemenu-"+button.customId)) {
                            let role = member.guild.roles.cache.get(roletoadd.options.filter(i => "rolemenu-"+i.content === button.customId)[0].id)
                            if (role) {
                                if (!roletoadd.multi) {
                                    for (i in roletoadd.options) {
                                        if (member.roles.cache.has(roletoadd.options[i].id)) canadd = false
                                    }
                                }
                                if (!member.roles.cache.has(role.id)) {
                                    if(!canadd) return interaction.reply({ content: `Vous ne pouvez pas avoir les deux rôles !`, ephemeral: true});
                                    member.roles.add(role).catch(console.error);
                                    interaction.reply({ content: `Je vous ai ajouté le rôle <@&${role.id}> !`, ephemeral: true});
                                } else if(member.roles.cache.has(role.id)){
                                    member.roles.remove(role).catch(console.error);
                                    interaction.reply({ content: `Je vous ai retiré le rôle <@&${role.id}> !`, ephemeral: true});
                                }
                            }
                        }
                    }
                }
        }
    }
}