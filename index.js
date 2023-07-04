const express = require('express')
const cors = require('cors')

const songRouter = require('./routes/songRouter.js')
const playListRouter = require('./routes/playlistRouter.js')

const db = require("./models")

const app = express()

app.use(cors())
app.use(express.json())

db.sequelize.sync({alter: true}).then( (req) => {
    app.listen(3000, () => {
        console.log("SERVER IS UP")
    })
})

app.use('/songs', songRouter)
app.use('/playlists', playListRouter)

app.get("/", (req, res) => {
    res.send({msg: "Welcome to my api: Docc https://documenter.getpostman.com/view/26781479/2s93sdYBXg"})
})  