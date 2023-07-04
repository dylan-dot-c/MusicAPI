const {Playlist, Song} = require('../models')
// used json templates so all responses have a unified format
const {getResponse, postResponse, deleteResponse} = require('../returnTemplates/index.js')
const { post } = require('../routes/playlistRouter')

const { definePagination} = require('../utilities')


// creating a new playlist
const createPlaylist = async (req, res) => {

    const {name, description} = req.body

    if(name == null || description == null) {
        postResponse.status = 400
        postResponse.msg = "Name and/or Description can't be null."
        res.status(400).send(postResponse)
        return
    }
    try {
        
        const data = await Playlist.create({
            name: name,
            description: description
        })

        postResponse.msg = "New Playlist Created"
        postResponse.status = 200
        postResponse.id = data.id
        postResponse.count = 1

        res.status(200).json(postResponse)
    }catch(err) {
        postResponse.err = err
        postResponse.status = 400
        console.log(err)
        res.status(400).json(postResponse)
    }   
}

// adds a song to a playlist
const addSongToPlaylist = async (req, res) => {
    const {songId, playlistId} = req.body

    try {
        const playlist = await Playlist.findByPk(playlistId)
        if(!playlist) {
            postResponse.status = 404
            postResponse.msg = "Playlist is not found"
            res.status(404).send(postResponse)
        }else {
            // playlist found
            const song = await Song.findByPk(songId)

            if(!song) {
                postResponse.status = 404
                postResponse.msg = "Song is not found"
                res.status(404).send(postResponse)
            }else if(await playlist.hasSong(song)){

                postResponse.status = 404
                postResponse.msg = "Song already exists for this playlist"
                res.status(404).send(postResponse)
            }else {
                await playlist.addSong(song)
                postResponse.status = 200
                postResponse.msg = "New song added to playlist"
                postResponse.id = playlist.id
                postResponse.count = await playlist.countSongs()   
                res.status(200).send(postResponse)
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
        getResponse.msg = "Id cannot be null"
        getResponse.status = 400
        res.status(400).send(getResponse)
        return   
    }
    // res.send("HELLO WORLD"+ req.params.id)
    try {
        const playlist = await Playlist.findByPk(id)
        const songCount = await playlist.countSongs()

        playlist.songCount = songCount

        getResponse.count = 1
        getResponse.data = playlist
        getResponse.songCount = songCount
        getResponse.msg = "Playlist found"
        getResponse.status = 200
    
        res.status(200).send(getResponse)

    }catch(err) {
        getResponse.status = 400
        getResponse.err = err
        getResponse.msg = "Failed to fetch data"
        res.status(400).send(getResponse)
    }
}

const getAllPlaylists = async (req, res) => {

    const {page, limit} = req.query

    const pageValue = parseInt(page) || 1
    const limitValue = parseInt(limit) || 5

    try {
        const {count, rows} = await Playlist.findAndCountAll(
            {
                include: {
                    model: Song,
                    attributes: ['id', 'title'],
                    through: {
                        attributes: []
                    }
                },
                limit: limitValue,
                offset: Math.abs((pageValue - 1)) * limitValue
            })

            const pagination = definePagination(limitValue, pageValue, count)

            getResponse.pagination = {...getResponse.pagination, ...pagination}
            getResponse.status = 200
            getResponse.msg = "All playlists fetched"
            getResponse.count = rows.length
            getResponse.data = rows

            // getResponse.pagination.totalRows = rows.length

        if(rows) {
            res.status(200).send(getResponse)
        }else {
            getResponse.msg = "No playlist found"
            getResponse.status = 400
            res.status(404).send({msg: "No playlist found"})
        }


    }catch(err) {
        res.status(400).send({err})
        console.log(err)
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
                    deleteResponse.status = 200
                    deleteResponse.msg = "Song Removed from playlist"
                    deleteResponse.count = 1
                    res.status(200).send(deleteResponse)
                }else {
                    deleteResponse.status = 404
                    deleteResponse.msg = "Song is not apart of the playlist"
                    res.status(404).send(deleteResponse)
                }
                
            }else {
                deleteResponse.status = 404
                deleteResponse.msg = "Song not found"
                res.status(404).send(deleteResponse)
            }
        }else {
            deleteResponse.status = 404
            deleteResponse.msg = "Playlist not found"
            res.status(404).send(deleteResponse)
        }

    }catch(err) {
        deleteResponse.status = 400
        deleteResponse.err = err
        deleteResponse.msg = "Some error occured."
        res.status(400).send(deleteResponse)
    }
}

module.exports = {createPlaylist, addSongToPlaylist, getPlaylist, getAllPlaylists, deleteFromPlaylist}