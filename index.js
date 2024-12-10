const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


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


let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${phonebook.length} people</p>
        <p>${new Date()}</p>
        `
    )
})

// all persons view
app.get('/api/persons', (request, response) => {
    response.json(phonebook) 
})
// single person view
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find((p) => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
// delete person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter((p) => p.id != id)

    response.status(204).end()
})

// add a person
app.post('/api/persons', (request, response) => {
    const body = request.body
    let id = Math.floor((Math.random() * 100000000000000) + phonebook.length);

    if(!body.name || !body.number){
        return response.status(404).json({
            error: 'empty field'
        })
    }

    phonebook_names = phonebook.map((p) => p['name'])
    
    if(phonebook_names.includes(body.name)){
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    const person = {
        "name": body.name,
        "number": body.number,
        "id": id
    }
    phonebook = phonebook.concat(person)
    response.json(person)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

