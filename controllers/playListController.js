const {Playlist, Song} = require('../models')
// used json templates so all responses have a unified format
const {getReturn, postReturn, deleteReturn} = require('../returnTemplates/index.js')
const { post } = require('../routes/playlistRouter')

// creating a new playlist
const createPlaylist = async (req, res) => {

    const {name, description} = req.body

    if(name == null || description == null) {
        postReturn.status = 400
        postReturn.msg = "Name and/or Description can't be null."
        res.status(400).send(postReturn)
        return
    }
    try {
        
        const data = await Playlist.create({
            name: name,
            description: description
        })

        postReturn.msg = "New Playlist Created"
        postReturn.status = 200
        postReturn.id = data.id
        postReturn.count = 1

        res.status(200).json(postReturn)
    }catch(err) {
        postReturn.err = err
        postReturn.status = 400
        console.log(err)
        res.status(400).json(postReturn)
    }   
}

// adds a song to a playlist
const addSongToPlaylist = async (req, res) => {
    const {songId, playlistId} = req.body

    try {
        const playlist = await Playlist.findByPk(playlistId)
        if(!playlist) {
            postReturn.status = 404
            postReturn.msg = "Playlist is not found"
            res.status(404).send(postReturn)
        }else {
            // playlist found
            const song = await Song.findByPk(songId)

            if(!song) {
                postReturn.status = 404
                postReturn.msg = "Song is not found"
                res.status(404).send(postReturn)
            }else if(await playlist.hasSong(song)){

                postReturn.status = 404
                postReturn.msg = "Song already exists for this playlist"
                res.status(404).send(postReturn)
            }else {
                await playlist.addSong(song)
                postReturn.status = 200
                postReturn.msg = "New song added to playlist"
                postReturn.id = playlist.id
                postReturn.count = await playlist.countSongs()   
                res.status(200).send(postReturn)
            }   
        }
    }catch(err) {
        console.log(err)
        res.status(400).json({err})
    }
}

const getPlaylist = async (req, res) => {

    const id = req.params.id

    if(id == null) {
        getReturn.msg = "Id cannot be null"
        getReturn.status = 400
        res.status(400).send(getReturn)
        return   
    }
    // res.send("HELLO WORLD"+ req.params.id)
    try {
        const playlist = await Playlist.findByPk(id)
        const songCount = await playlist.countSongs()

        playlist.songCount = songCount

        getReturn.count = 1
        getReturn.data = playlist
        getReturn.songCount = songCount
        getReturn.msg = "Playlist found"
        getReturn.status = 200
    
        res.status(200).send(getReturn)

    }catch(err) {
        res.status(400).send({err:err})
    }
}

const getAllPlaylists = async (req, res) => {

    try {
        const playlists = await Playlist.findAll(
            {
                include: {
                    model: Song,
                    attributes: ['id', 'title'],
                    through: {
                        attributes: []
                    }
                }
            })

            getReturn.status = 200
            getReturn.msg = "All playlists fetched"
            getReturn.count = playlists.length
            getReturn.data = playlists

        if(playlists) {
            res.status(200).send(getReturn)
        }else {
            getReturn.msg = "No playlist found"
            getReturn.status = 400
            res.status(404).send({msg: "No playlist found"})
        }


    }catch(err) {
        res.status(400).send({err})
    }
}

const deleteFromPlaylist = async (req, res) => {

    const {playlistId, songId} = req.body
    try {

        const playlist = await Playlist.findByPk(playlistId)

        if(playlist) {
            const song = await Song.findByPk(songId)

            if(song) {

                if(await playlist.hasSong(song)) {
                    await playlist.removeSong(song)
                    const count = await playlist.countSongs()
                    deleteReturn.status = 200
                    deleteReturn.msg = "Song Removed from playlist"
                    deleteReturn.count = 1
                    res.status(200).send(deleteReturn)
                }else {
                    deleteReturn.status = 404
                    deleteReturn.msg = "Song is not apart of the playlist"
                    res.status(404).send(deleteReturn)
                }
                
            }else {
                deleteReturn.status = 404
                deleteReturn.msg = "Song not found"
                res.status(404).send(deleteReturn)
            }
        }else {
            deleteReturn.status = 404
            deleteReturn.msg = "Playlist not found"
            res.status(404).send(deleteReturn)
        }

    }catch(err) {
        deleteReturn.status = 400
        deleteReturn.err = err
        deleteReturn.msg = "Some error occured."
        res.status(400).send(deleteReturn)
    }
}

module.exports = {createPlaylist, addSongToPlaylist, getPlaylist, getAllPlaylists, deleteFromPlaylist}