const { DataTypes } = require("sequelize");



module.exports = (sequelize, DataTypes) => {

    const Song = sequelize.define("Song", {
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            
            validate: {
                notEmpty: true,
            }
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        },

        artist: {
            type: DataTypes.STRING,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        },

        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        }, 

        genre: {
            type : DataTypes.STRING,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        },

        url: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "https://youtu.be/50VNCymT-Cs",

            validate: {
                notEmpty: true,
            }

        },

        release_date: {
            type: DataTypes.DATE,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        }
    }, {
        tableName: "songs",
    })

    Song.associate = (models) => {
        Song.belongsToMany(models.Playlist, {through: 'playlist_songs'})
        // Song.belongsToMany(models.Playlists)
    }

    return Song
}