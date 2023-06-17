const express = require('express')
const { deleteSongById, addNewSong, getAllSongs, getSongById, updateSongById } = require('../controllers/musicController')
// const sequelize = require('sequelize')

const { Song } = require('../models')

const songRouter = express.Router()

// route to return all songs
songRouter.get('/all', getAllSongs)

// gets a specific song using ID
songRouter.get('/:id', getSongById)

// creates a new song
songRouter.post('/create', addNewSong)

// update record based on ID

songRouter.put('/update/:id', updateSongById)

// deletes a song by ID

songRouter.delete('/delete/:id',  deleteSongById)

module.exports = songRouter