const db = require("quick.db");
const Discord = require("discord.js");
module.exports = {
    name: 'voiceStateUpdate',

    run: async (client, oldState, newState) => {
        let gld
        if (oldState) {
            gld = oldState.guild.id
        } else if (newState) {
            gld = newState.guild.id
        }
        if (db.fetch(`${gld}.tempvoc.active`) === true) {
            // -- Si qlq rej le salon
            
            if (oldState.channel === null || oldState.channel !== null && newState.channel !== null && newState.channel.id === db.fetch(`${gld}.tempvoc.channel`)) {
                if (newState.channel && newState.channel.id === db.fetch(`${gld}.tempvoc.channel`)) {
                    // -- Obtiens la catégorie 
                    var category = oldState.guild.channels.cache.get(db.fetch(`${gld}.tempvoc.category`));
                    if (!category) return;
                    // -- Crée un salon de type vocal avec comme nom le pseudo de la personne et le définis dans la catégorie
                    oldState.guild.channels.create(`${db.fetch(`${gld}.tempvoc.emoji`)} ${newState.member.user.username}`, {
                        type: 'GUILD_VOICE',
                        userLimit: 5,
                        parent: category,
                        reason: `Salon temporaire - Création d'un nouveau salon`
                        // -- Après
                    }).then(c => {
                        c.permissionOverwrites.create(newState.member, {
                            MANAGE_CHANNELS: true,
                            MANAGE_ROLES: false
                        });
                        newState.member.voice.setChannel(c)
                    })
                }
                // -- leave
            } else if (newState.channel === null || oldState.channel !== null && newState.channel !== null) {
                if (oldState.selfMute !== newState.selfMute) return;
                if (oldState.selfDeaf !== newState.selfDeaf) return;
                if (oldState.channel.parentId === db.fetch(`${gld}.tempvoc.category`)) {
                    // -- Vérifie aussi que personne est dans le salon
                    if (oldState.channel.id === db.fetch(`${gld}.tempvoc.channel`)) return;
                    if (oldState.channel.members.size === 0) {
                        // -- Supprime le salon si personne est dedans
                        oldState.channel.delete({ reason: `Salon temporaire - Plus personne dans le salon` })
                    }
                }
                // -- déplacement
            } else if (oldState.Channel !== null && newState.channel !== null) {
                // -- Vérifie si l'ancien salon appartient a la catégorie et que le nouveau salon n'est pas le salon de création
                if (oldState.channel.parentID === db.fetch(`${gld}.tempvoc.category`) && newState.channel.id !== db.fetch(`${gld}.tempvoc.channel`)) {

                    // -- Vérifie si l'ancien salon est le salon de création (pour éviter de le supprimer)
                    if (oldState.channel && oldState.channel.id === db.fetch(`${gld}.tempvoc.channel`)) {
                        null;
                        // -- Ou alors si le salon n'est pas le salon de création:
                    } else {
                        // -- Vérifie que le salon est vide
                        if (oldState.channel.members.size === 0) {
                            // -- Supprime le salon
                            if (oldState.channel.id === db.fetch(`${gld}.tempvoc.channel`)) return;
                            oldState.channel.delete({ reason: `Salon temporaire - Plus personne dans le salon` })
                        }
                    }

                    // -- Ou alors vérifie que l'ancien salon appartient a la catégorie, que l'ancien salon n'est pas celui de la création de salon et que le nouveau salon est le salon de création
                } else if (oldState.channel && oldState.channel.parentID === db.fetch(`${gld}.tempvoc.category`) && oldState.channel !== db.fetch(`${gld}.tempvoc.channel`) && newState.channel.id === db.fetch(`${gld}.tempvoc.channel`)) {
                    // -- Vérifie que l'ancien salon est vide
                    if (oldState.channel.members.size === 0) {
                        // -- Supprime le salon
                        oldState.channel.delete({ reason: `Salon temporaire - Plus personne dans le salon` })
                    }
                    // -- 
                    // -- Obtiens la catégorie 
                    var category = oldState.guild.channels.cache.get(db.fetch(`${gld}.tempvoc.category`));
                    // -- Crée un salon de type vocal avec comme nom le pseudo de la personne et le définis dans la catégorie
                    oldState.guild.channels.create(`${db.fetch(`${gld}.tempvoc.emoji`)} ${newState.member.user.username}`, {
                        type: 'GUILD_VOICE',
                        parent: category,
                        reason: `Salon temporaire - Création d'un nouveau salon`
                        // -- Après
                    }).then(c => {
                        // -- Ajoute des permissions au salon pour le membre en lui attribuant toutes les permissions sur le salon
                        c.permissionOverwrites.create(newState.member, {
                            MANAGE_CHANNELS: true,
                            MANAGE_ROLES: false
                        });
                        // -- Déplace l'utilisateur dans le salon
                        newState.member.voice.setChannel(c)
                    })

                } else if (newState.channel.parentID === db.fetch(`${gld}.tempvoc.category`) && oldState.channel !== db.fetch(`${gld}.tempvoc.channel`) && newState.channel.id === db.fetch(`${gld}.tempvoc.channel`)) {

                    // -- Obtiens la catégorie 
                    var category = oldState.guild.channels.cache.get(db.fetch(`${gld}.tempvoc.category`));
                    // -- Crée un salon de type vocal avec comme nom le pseudo de la personne et le définis dans la catégorie
                    oldState.guild.channels.create(`${db.fetch(`${gld}.tempvoc.emoji`)} ${newState.member.user.username}`, {
                        type: 'GUILD_VOICE',
                        parent: category,
                        reason: `Salon temporaire - Création d'un nouveau salon`
                        // -- Après
                    }).then(c => {
                        // -- Ajoute des permissions au salon pour le membre en lui attribuant toutes les permissions sur le salon
                        c.permissionOverwrites.create(newState.member, {
                            MANAGE_CHANNELS: true,
                            MANAGE_ROLES: false
                        });
                        // -- Déplace l'utilisateur dans le salon
                        newState.member.voice.setChannel(c)
                    })

                }
            }
        }
    }
}