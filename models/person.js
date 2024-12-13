require('dotenv').config
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error to connect', error.message)
  })

const phoneStructValidator = (value) => {
  const regex = /^\d{2,3}-\d+$/
  return regex.test(value)
}

const phoneSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3
    },
    number: {
      type: String,
      minLength: 8,
      validate: phoneStructValidator,
    }
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = (mongoose.model('Phone', phoneSchema))