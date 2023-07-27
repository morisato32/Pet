const express = require('express');
const cors = require('cors')

const connection = require('../backend/db/connection')

const app = express()

//json
app.use(express.json())

// rotas
const userRouter = require('../backend/routes/userRouter')
app.use('/users',userRouter)

// cors
app.use(cors({credentials: true,origin:'http://localhost:3000'}))

//estaticos
app.use(express.static('public'))

//servidor
app.listen(5000)