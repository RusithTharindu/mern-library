import express from 'express';
import {PORT , MONGO_URL} from './config.js';
import mongoose from 'mongoose';
import { Book } from "./models/bookModel.js"

const app = express();

//middleware for parsing json data
app.use(express.json());

app.get('/', (req, res) => {
    console.log(req);
    return res.status(200).send("Welcome to the MERN Bookstore");
})

//route for saving a new book
app.post('/books', async (req,res) => {
    try {
        if(!req.body.title || !req.body.author || !req.body.publishYear) {
            return response.status(400).send({
                message: "Send required fields, title, author and publishYear in the request body"
            })
        }

        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };

        const book = await Book.create(newBook);

        return res.status(201).send(book);

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: error.message
        })
    }
})

//route for getting all books
app.get('/books', async (req,res) => {
    try {
        const books = await Book.find({})

        return res.status(200).json({
            count: books.length, //number of books
            data: books //array of books
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        }) 
    }
})

//get a single book by id
app.get('/books/:id', async (req,res) => {
    try {
        const { id } = req.params; //get the id from the request parameter
        const book = await Book.findById(id); //find the book by id
        return res.status(200).json(book); //return the book

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        }) 
    }
})

//update a book by id
app.put('/books/:id', async (req, res) => {
    try {
        if(!req.body.title || !req.body.author || !req.body.publishYear) {
            return res.status(400).send({
                message: "Send required fields, title, author and publishYear in the request body"
            })
        }
    
        const { id } = req.params; //get the id from the request parameter

        const result = await Book.findByIdAndUpdate(id, req.body); //find the book by id and update it

        if(!result) {
            return res.status(404).json({message: "BOOK NOT FOUND"});
        }

        return res.status(200).send({message: "Book Updated Successfully"});

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        })
    }
})

//delete a book by id
app.delete("/books/:id", async (req, res) => {
    try {
        
        const {id} = req.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result) {
            return res.status(404).json({message: "BOOK NOT FOUND"});
        }

        return res.status(200).send({message: "Book Deleted Successfully"});

    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        })
    }
})


mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("Database Successfully connected");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`); //CALLBACK FUNCTION
        })
        
    })
    .catch((error) => {
        console.log(error);
    })

