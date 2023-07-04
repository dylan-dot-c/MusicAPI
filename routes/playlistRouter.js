const express = require('express')

const {createPlaylist, addSongToPlaylist, getPlaylist, getAllPlaylists, deleteFromPlaylist} = require('../controllers/playListController')

const playListRouter = express.Router()

playListRouter.post('/create', createPlaylist )

playListRouter.post('/addSong', addSongToPlaylist)

playListRouter.get('/all', getAllPlaylists)

playListRouter.get('/:id', getPlaylist)

playListRouter.delete('/deleteSong', deleteFromPlaylist)
 
module.exports =  playListRouter