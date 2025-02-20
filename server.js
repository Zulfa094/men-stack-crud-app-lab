const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
// const morgan = require('morgan')
const methodOverride = require('method-override')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {})

mongoose.connection.on('error', (err) => {
  console.log(err)
})

const Book = require('./models/book')

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
// app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/books', async (req, res) => {
  const allBooks = await Book.find()
  res.render('books/index', { books: allBooks })
})

app.get('/books/new', (req, res) => {
  res.render('books/new')
})

app.get('/books/:id', async (req, res) => {
  try {
    const foundBook = await Book.findById(req.params.id)
    res.render('books/show', { book: foundBook })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

app.get('/books/:id/edit', async (req, res) => {
  try {
    const editBook = await Book.findById(req.params.id)
    res.render('books/edit', { book: editBook })
  } catch (err) {
    console.log(err)
    redirect('/')
  }
})

app.put('/books/:id', async (req, res) => {
  try {
    if (req.body.doneReading) {
      req.body.doneReading = true
    } else {
      req.body.doneReading = false
    }

    await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.redirect(`/books/${req.params.id}`)
  } catch (err) {
    console.log(err)
    res.redirect(`/books/${req.params.id}`)
  }
})

app.post('/books', async (req, res) => {
  if (req.body.doneReading) {
    req.body.doneReading = true
  } else {
    req.body.doneReading = false
  }

  try {
    const addBook = await Book.create(req.body)
    res.redirect('/books')
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
})

app.delete('/books/:id', async (req, res) => {
  try {
    const deleteBook = await Book.findByIdAndDelete(req.params.id)
    res.redirect('/books')
  } catch (err) {
    console.log(err)
    redirect('/')
  }
})

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`)
})
