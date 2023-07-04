const { DataTypes} = require('sequelize')
// const { sequelize } = require('sequelize')
// const sequelize = require('sequelize')


module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define("Playlist", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,

            validate: {
                notEmpty: true,
            }
        }
    }, 
    {
        tableName: "playlists"
    })

    Playlist.associate = (models) => {
        Playlist.belongsToMany(models.Song, {through: 'playlist_songs'})
        
    }

    

    return Playlist
}