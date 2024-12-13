const mongoose = require('mongoose')

const password = process.argv[2]
const inputName = process.argv[3]
const inputNumber = process.argv[4]

const url =
    `mongodb+srv://marcellusgerson:${password}@cluster0.detct.mongodb.net/phonebookApp?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Phone = mongoose.model('phone', phoneSchema)

const phone = new Phone({
    name: inputName,
    number: inputNumber
})

if (process.argv.length === 3){
    Phone.find({}).then(result => {
        result.forEach(phone => {
            console.log(phone)
           
        })
        mongoose.connection.close()
    
    })
    
}

else {
    phone.save().then(result => {
        console.log(`added ${inputName} number ${inputNumber} to phonebook`)
        mongoose.connection.close()
    })
}

