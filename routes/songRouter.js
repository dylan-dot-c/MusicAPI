const express = require('express')
const sequelize = require('sequelize')

const { Song } = require('../models')

const songRouter = express.Router()

// route to return all songs
songRouter.get('/all', (req, res) => {

    Song.findAll().then( (songs) => {

        if(songs.length === 0) {
            res.status(404).json({msg: "No songs were found"})
            return
        }

        const result = {
            status: 200,
            count: songs.length,
            data: songs
        }

        res.status(200).json(result)
    }).catch((err) => {
        res.status(400).json(err)
    })

})

// gets a specific song using ID
songRouter.get('/:id', (req, res) => {

    const id = req.params.id

    Song.findOne( {where: {id: id} }).then( (songs) => {

        if(songs.length === 0) {
            res.status(404).json({msg: "No songs were found"})
            return
        }

        const result = {
            status: 200,
            count: songs.length,
            data: songs
        }

        res.status(200).json(result)
    }).catch((err) => {
        res.status(400).json(err)
    })

})

// creates a new song
songRouter.post('/create', (req, res) => {
    
    const {title, artist, duration, genre, release_date, url} = req.body

    Song.create({
        title: title,
        artist: artist,
        duration: duration,
        genre: genre,
        release_date: release_date,
        url: url
    }).catch( (err) => {
        if(err) {
            res.status(err.status).json({msg: err.message})
        }
    })

    const result = {
        status: 201,
        msg: "New Song has been Added"
    }

    res.status(201).json(result)

})

// deletes a song by ID

songRouter.delete('/delete/:id', (req, res) => {

    const id = req.params.id
    
    Song.destroy({where: {
        id: id,
    }}).then( (data) => {
        res.status(200).send({msg: "Song Deleted successfully"})
    }).catch(err => {
        res.status(400).send({err})
    })

})

module.exports = songRouter