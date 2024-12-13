require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Phone = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

//middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
    

})


app.get('/info', (request, response) => {
    Phone.find({}).then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
             <p>${new Date()}</p>`
            )
    })

})

// all persons view
app.get('/api/persons', (request, response) => {
    Phone.find({}).then(persons => {
        response.json(persons)
    })
})
// single person view
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Phone.findById(id).then(persons => {
        response.json(persons)
    })
})


// add a person
app.post('/api/persons', (request, response) => {
    const body = request.body
    const phone = new Phone({
        name: body.name,
        number: body.number
    })


    if(!body.name || !body.number){
        return response.status(404).json({
            error: 'empty field'
        })
    }

    phone.save().then(result => {
        console.log(`added ${body.name} number ${body.number} to phonebook`)
        response.json(phone)
    })


})

// delete person
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phone.findByIdAndDelete(id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

// update a person
app.patch('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    const person = {
        number: body.number
    }

    Phone.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
        response.json(updatedPerson)
    })

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError'){
        return response.status(400).send({error: 'malformed id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

