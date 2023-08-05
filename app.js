const express = require('express');
const cors = require('cors')

const connection = require('../backend/db/connection')

const app = express()

//json
app.use(express.json())

// rotas
const userRouter = require('../backend/routes/userRouter')
const petRouter = require('../backend/routes/petRouter')
app.use('/users',userRouter)
app.use('/pets',petRouter)

// cors
app.use(cors({credentials: true,origin:'http://localhost:3000'}))

//estaticos
app.use(express.static('public'))

//servidor
app.listen(5000)