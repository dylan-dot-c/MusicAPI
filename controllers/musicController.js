const express = require('express')
const { Song, Playlists } = require('../models')
const {getReturn, postReturn, deleteReturn} = require('../returnTemplates/index.js')
const sequelize = require('sequelize')


const defineWhereClause = (query) => {
    // function to get a defined query based on request querys
    const {artist, genre} = query

    const whereClause = {}

    if(artist) {
        whereClause.artist = artist
    }

    if(genre) {
        whereClause.genre = genre
    }

    return whereClause
}


const getAllSongs = async (req, res) => {

    const {limit, page} = req.query
    const whereClause = defineWhereClause(req.query)

    try {
        const data = await Song.findAll({
            where: whereClause,
            // limit set to 5 if it was undefined
            limit: parseInt(limit) || 5,
            offset: ( (parseInt(Math.abs(page)) || 1) - 1) * 5
        })

        getReturn.status = 200
        getReturn.count = data.length
        getReturn.data = data
        getReturn.msg = "List of all songs"

        res.send(getReturn)

    }catch(err) {
        console.log(err)
        getReturn.status = 400
        getReturn.err = err
        getReturn.msg = "Some error occured"
        res.status(400).json({msg: err})
    }
}

const getSongById = async (req, res) => {

    const result = {
        status: null,
        count: null,
        data: null
    }

    const id = parseInt(req.params.id)
    
    if(!id) {
        getReturn.status = 404
        getReturn.count = 0
        getReturn.msg = "Parameter must be of type int"
        res.status(404).json(getReturn)
        return
    }

    try {
        const data = await Song.findOne({where: {id: id}})

        if(!data) {
            getReturn.status = 404
            getReturn.count = 0
            getReturn.msg = "Song found by id: " + id
            res.status(404).json(getReturn)
            // return
        }else if(data) {
            result.status = 200
            result.data = data
            result.count = 1
            res.status(200).json(result)
        }

    }catch(err) {
        getReturn.status = 400
        getReturn.msg = "Some error occured"
        getReturn.err = err
        console.log(err)
        res.status(400).json(getReturn)
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

        getReturn.count = data.length
        getReturn.data = data
        getReturn.msg = "List of all artists"
        getReturn.status = 200

        res.status(200).send(getReturn)

    }catch(err) {
        getReturn.status = 400
        getReturn.msg = "Some error occured"
        getReturn.err = err
        res.status(400).json(getReturn)
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

        getReturn.status = 201
        getReturn.msg = "New song has been added"
    
        res.status(201).json(getReturn)
    }catch(err) {

        getReturn.status = 400
        getReturn.err = err
        getReturn.msg = "Song failed to be added"
        console.log(err)
        res.status(400).send(getReturn)
    }
}

const updateSongById = async (req, res) => {
    const id = req.params.id
    var info = req.body
    // make sure they cant change the id to one that already exists
    info = {...info, id: id}
    console.log({...info})

    try {
        const data = await Song.update({...info}, {where: {
            id: id,
        }})

        getReturn.status = 200
        getReturn.msg = `${data} row(s) has been updated`
        getReturn.count = data[0]
    
        res.status(200).json({
           getReturn
        })
    }catch(err) {
        getReturn.err = err
        getReturn.status = 400
        getReturn.msg = "An error occured"
        res.status(400).json(getReturn)
    }
}

const deleteSongById = async (req, res) => {

    const id = req.params.id

    try {
        const data = await Song.destroy({where: {
            id: id,
        }})

        getReturn.status = 200
        getReturn.msg = `${data} row(s) has been deleted`
        getReturn.count = data[0]

        res.status(200).send(getReturn)
    }catch(err) {
        getReturn.err = err
        getReturn.status = 400
        getReturn.msg = "Failed to delete"
        res.status(400).json(getReturn)
   }

}

module.exports = {deleteSongById, addNewSong, getAllSongs, getArtists, getSongById, updateSongById}