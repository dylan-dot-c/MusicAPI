const express = require('express')
const sequelize = require('sequelize')

const { Song } = require('../models')

const songRouter = express.Router()

// route to return all songs
songRouter.get('/all', async (req, res) => {
    try {
        const data = await Song.findAll()

        const result = {
            status: 200,
            count: data.length,
            data: data
        }

        res.send(result)

    }catch(err) {
        console.log(err)
        res.status(400).json({msg: err})
    }
})

// gets a specific song using ID
songRouter.get('/:id', async (req, res) => {

    const id = req.params.id

    try {
        const data = await Song.findOne({where: {id: id}})
        // res.send(data)

        const result = {
            status: null,
            count: null,
            data: null
        }
        // res.send(id)

        if(!data) {
            result.status = 404
            result.count = 0
            res.status(404).json(result)
            // return
        }else {
            result.status = 200
            result.data = data
            result.count = 1
            res.status(200).json(result)
        }

    }catch(err) {
        console.log(err)
        res.status(400).json(err)
    }

})

// creates a new song
songRouter.post('/create', async (req, res) => {
    
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

        const result = {
            status: 201,
            msg: "New Song has been Added"
        }
    
        res.status(201).json(result)
    }catch(err) {
        res.status(400).json({msg: "Failed to be created!"})

    }
})

// update record based on ID

songRouter.put('/update/:id', async (req, res) => {
    const id = req.params.id
    var info = req.body
    // make sure they cant change the id to one that already exists
    info = {...info, id: id}
    console.log({...info})

    try {
        const data = await Song.update({...info}, {where: {
            id: id,
        }})
    
        res.status(200).json({
            updated: data,
            msg: `${data} row(s) has been updated`
        })
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

// deletes a song by ID

songRouter.delete('/delete/:id',  async (req, res) => {

    const id = req.params.id

    try {
        await Song.destroy({where: {
            id: id,
        }})

        res.status(200).send({status: 200, msg: "Deleted Successfully"})
    }catch(err) {
        res.status(400).json({msg: "Failed to delete"})
    }

})

module.exports = songRouter