const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

// define morgan token
morgan.token('body', (req) => {
    return JSON.stringify(req.body)
}) 

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')) // body token defined above - logs request body data



// @ GET ALL PERSONS - MONGOOSE
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// @ GET INFO PAGE
app.get('/info', (request, response) => {
    const entryCount = persons.length
    const timestamp = new Date().toString()
    const phonebookInfo = `<p>Phonebook has info for ${entryCount} people</p><p>${timestamp}</p>`

    response.status(200).send(phonebookInfo)
})

// @ GET PERSON BY ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        response.status(200).json(person)
    } else {
        response.status(404).json({ error: 'Person not found' })
    }
})

// @ DELETE PERSON BY ID
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})


// generate id function
const generateId = () => {
    const newId = Math.ceil(Math.random() * 1000)
    const idMatch = persons.find(p => p.id === newId) 

    if(!idMatch) {
        return newId  
    } else {
        return generateId() // recursion - keeps calling function untill unique id generated
    }    
}

// @ CREATE A PERSON
app.post('/api/persons', (request, response) => {
    
    const {name, number} = request.body
    const errors = []

    !name && errors.push({ code: 400, message: 'Name is missing' }) // no name
    !number && errors.push({ code: 400, message: 'Number is missing' }) // no number
    // persons.find(p => p.name === name) && errors.push({ code: 409, message: 'Name must be unique'}) // duplicate name
    console.log(response)
    if(errors.length > 0) {
        return response.status(errors[0].code).json({
            message: errors[0].message
        })
        
    }


    const person = new Person({ name, number })

    person.save().then(savedNote => {
        response.status(201).json(savedNote)
    })


})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})






// // @ CREATE A PERSON
// app.post('/api/persons', (request, response) => {
    
//     const {name, number} = request.body
//     const errors = []

//     !name && errors.push({ code: 400, message: 'Name is missing' }) // no name
//     !number && errors.push({ code: 400, message: 'Number is missing' }) // no number
//     persons.find(p => p.name === name) && errors.push({ code: 409, message: 'Name must be unique'}) // duplicate name
    
//     if(errors.length > 0) {
//         return response.status(errors[0].code).json({
//             errors: errors
//         })
//     }

//     const person = {
//         id: generateId(),
//         name: name,
//         number: number,
//     }

//     persons = persons.concat(person)
//     response.status(201).json(person)

// })