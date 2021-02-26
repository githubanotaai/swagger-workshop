const express = require('express')
const nanoid = require('nanoid').nanoid
const bodyParser = require('body-parser')

const app = express()
const data = []

app.use(bodyParser.json())

app.use((req, res, next) => {
    if (req.headers['authorization'] === 'token123') {
        next()
    } else {
        res.status(401).json({ message: "autenticação inválida" })
    }
})

app.get('/pizza', (req, res) => res.status(200).json({ message: 'ok', data }))

app.get('/pizza/:id', (req, res) => {
    const { id } = req.params

    const index = data.findIndex((document) => document.id === id)
    if (index === -1) return res.status(404).json({ message: "pizza nao encontrada" })

    res.status(200).json({ message: 'ok', data: data[index] })
})

app.post('/pizza', (req, res) => {
    const {
        flavor,
        price,
    } = req.body

    if (!flavor) return res.status(400).json({ message: "o parametro flavor é obrigatório" })
    if (!price) return res.status(400).json({ message: "o parâmetro price é obrigatório" })

    const document = { id: nanoid(8), flavor, price }

    data.push(document)

    res.status(201).json({ message: 'ok', data: document })
})

app.put('/pizza/:id', (req, res) => {
    const { id } = req.params
    const { flavor, price } = req.body

    if (!flavor) return res.status(400).json({ message: "o parametro flavor é obrigatório" })
    if (!price) return res.status(400).json({ message: "o parâmetro price é obrigatório" })

    const index = data.findIndex((document) => document.id === id)
    if (index === -1) return res.status(404).json({ message: "pizza nao encontrada" })

    data[index].flavor = flavor
    data[index].price = price

    res.status(200).json({ message: 'ok', data: data[index] })
})

app.delete('/pizza/:id', (req, res) => {
    const { id } = req.params

    const index = data.findIndex((document) => document.id === id)
    if (index === -1) return res.status(404).json({ message: "pizza nao encontrada" })

    delete data[index]
    
    res.status(202).json({ message: 'ok' })
})

app.listen(3000, () => console.log('listening on port 3000'))