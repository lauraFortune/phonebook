const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]


// @ GET ALL PERSONS
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// @ GET INFO PAGE
app.get('/info', (request, response) => {
    const entryCount = persons.length
    const timestamp = new Date().toString()
    const phonebookInfo = `<p>Phonebook has info for ${entryCount} people</p><p>${timestamp}</p>`

    response.send(phonebookInfo)
})

// @ GET PERSON BY ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
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

    if(!name || !number){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = {
        id: generateId(),
        name: name,
        number: number,
    }

    persons = persons.concat(person)
    response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})