const { Song } = require('../models')
const {getResponse, postResponse, deleteResponse} = require('../returnTemplates')
const {definePagination, defineWhereClause} = require('../utilities')

const getAllSongs = async (req, res) => {

    const {limit, page} = req.query
    const whereClause = defineWhereClause(req.query)

    const limitValue = parseInt(limit) || 5
    const pageValue = parseInt(page) || 1

    try {
        const {rows, count} = await Song.findAndCountAll({
            where: whereClause,
            // limit set to 5 if it was undefined
            limit: parseInt(limit) || 5,
            offset: ( Math.abs(pageValue) - 1) * limitValue
        })

        getResponse.pagination = {...getResponse.pagination, ...definePagination(limitValue, pageValue, count) }
        getResponse.status = 200
        getResponse.count = rows.length
        getResponse.data = rows
        getResponse.msg = "List of all songs"

        res.send(getResponse)

    }catch(err) {
        console.log(err)
        getResponse.status = 400
        getResponse.err = err
        getResponse.msg = "Some error occured"
        res.status(400).json({msg: err})
    }
}

const getSongById = async (req, res) => {

    console.log("GETSONGBYID")
    const result = {
        status: null,
        count: null,
        data: null
    }

    const id = parseInt(req.params.id)
    
    if(!id) {
        getResponse.status = 404
        getResponse.count = 0
        getResponse.msg = "Parameter must be of type int"
        res.status(404).json(getResponse)
        return
    }

    try {
        const data = await Song.findOne({where: {id: id}})

        if(!data) {
            getResponse.pagination = null
            getResponse.status = 404
            getResponse.count = 0
            getResponse.msg = "Song not found by id: " + id
            getResponse.err = "Song not found 404"
            res.status(404).json(getResponse)
            // return
        }else if(data) {
            result.status = 200
            result.data = data
            result.count = 1
            res.status(200).json(result)
        }

    }catch(err) {
        getResponse.status = 400
        getResponse.msg = "Some error occured"
        getResponse.err = err
        console.log(err)
        res.status(400).json(getResponse)
    }
}

const getArtists = async (req, res) => {

    try {

        const artists = await Song.findAll({
            attributes: ['artist'],
            group: ['artist'],
            // raw: true,
        })

        const data = artists.map( artist => {
            return artist.artist
        })

        getResponse.count = data.length
        getResponse.data = data
        getResponse.msg = "List of all artists"
        getResponse.status = 200

        res.status(200).send(getResponse)

    }catch(err) {
        getResponse.status = 400
        getResponse.msg = "Some error occured"
        getResponse.err = err
        res.status(400).json(getResponse)
    }

}

const addNewSong = async (req, res) => {
    
    const {title, artist, duration, genre, release_date, url} = req.body

    try {
        const data = await Song.create({
            title: title,
            artist: artist,
            duration: duration,
            genre: genre,
            release_date: release_date,
            url: url
        });

        postResponse.status = 201
        postResponse.msg = "New song has been added"
        postResponse.count = 1
        postResponse.id = data.id
    
        res.status(201).json(postResponse)
    }catch(err) {

        getResponse.status = 400
        getResponse.err = err
        getResponse.msg = "Song failed to be added"
        console.log(err)
        res.status(400).send(getResponse)
    }
}

const updateSongById = async (req, res) => {
    const id = req.params.id
    var info = req.body

    // make sure they cant change the id to one that already exists or dont exist
    info = {...info, id: id}
    console.log({...info})

    try {
        const data = await Song.update({...info}, {where: {
            id: id,
        }})

        postResponse.status = 200
        postResponse.id = id
        postResponse.msg = `${data} row(s) has been updated`
        postResponse.count = data[0]
    
        res.status(200).json(
           postResponse
        )
    }catch(err) {
        postResponse.err = err
        postResponse.status = 400
        postResponse.msg = "An error occured"
        res.status(400).send(postResponse)
    }
}

const deleteSongById = async (req, res) => {

    const id = req.params.id

    try {
        const data = await Song.destroy({where: {
            id: id,
        }})

        deleteResponse.status = 200
        deleteResponse.msg = `${data} row(s) has been deleted`
        deleteResponse.count = data[0]

        res.status(200).send(deleteResponse)
    }catch(err) {
        deleteResponse.err = err
        deleteResponse.status = 400
        deleteResponse.msg = "Failed to delete"
        res.status(400).json(deleteResponse)
   }

}

module.exports = {deleteSongById, addNewSong, getAllSongs, getArtists, getSongById, updateSongById}