import express from 'express'
import mongoose, { connect, model } from 'mongoose'
import cors from 'cors'

const app = express()
const port = 2000

app.use(cors())
app.use(express.json())


const { Schema } = mongoose

const userSchema = new Schema({
    name: { type: String },
    age: { type: Number },
    basket: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "relationTestBasket" },
            count: { type: Number, default: 1 }
        }
    ]
}, { timestamps: true })

const User = model('relationTestUser', userSchema)




const productSchema = new Schema({
    title: { type: String },
    price: { type: Number }
}, { timestamps: true })

const Product = model('relationTestBasket', productSchema)




// POST USER
app.post('/user', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(200).send("User Created")
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// POST PRODUCT
app.post('/product', async (req, res) => {
    try {
        const basket = new Product(req.body)
        await basket.save()
        res.status(200).send("Basket Created")
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// GET ALL USERS
app.get('/user', async (req, res) => {
    try {
        const users = await User.find({}).populate('basket.product')
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// GET ALL PRODUCTS
app.get('/product', async (req, res) => {
    try {
        const data = await Product.find({})
        res.status(200).send(data)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// ADD TO BASKET
app.post('/users/:userId/addBasket', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send("User not found");
        }
        const product = user.basket.find(x => x.product._id == productId)
        if (product) {
            product.count++
            await user.save()
            res.status(201).send("Product Already Exist. Count Increased")
            return
        }
        user.basket.push({ product: productId })
        await user.save()
        res.status(200).send('Added To Basket')
    } catch (error) {
        res.status(500).send(error.message)
    }
})


// INCREASE COUNT
app.post('/users/:userId/increaseCount', async (req, res) => {
    try {
        const userId = req.params.userId
        const { productId } = req.body
        const user = await User.findById(userId).populate('basket.product')
        if (!user) {
            res.status(404).send("User Not Found!!!")
            return
        }
        const product = user.basket.find(x => x._id == productId)
        if (product) {
            product.count++
            await user.save()
            res.status(200).send('Count Increased')
        } else {
            res.status(404).send("Product Not Found")
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
})

// DECREASE COUNT
app.post('/users/:userId/decreaseCount', async (req, res) => {
    try {
        const userId = req.params.userId
        const { productId } = req.body
        const user = await User.findById(userId).populate('basket.product')
        if (!user) {
            res.status(404).send("User Not Found!!!")
            return
        }
        const product = user.basket.find(x => x._id == productId)
        if (product) {
            if (product.count === 1) {
                res.status(200).send('product count must be minumum 1!!!')
                return
            }
            product.count--
            await user.save()
            res.status(200).send('Count Decreased')
        } else {
            res.status(404).send("Product Not Found")
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
})


// DELETE PRODUCT FROM BASKET
app.post('/users/:userId/delete', async (req, res) => {
    try {
        const userId = req.params.userId
        const { productId } = req.body
        const user = await User.findById(userId).populate('basket.product')
        if (!user) {
            res.status(404).send("User Not Found")
            return
        }
        user.basket = user.basket.filter(x => x._id != productId)
        await user.save()
        res.status(200).send("Product Deleted")

    } catch (error) {
        res.status(500).send(error.message)
    }
})

// GET ALL BASKET PRODUCTS OF USER
app.get('/users/:userId/basket', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('basket.product');
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user.basket);
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Update a user's basket
// app.put('/user/:userId/basket', async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const { productId, count } = req.body;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).send("User not found");
//         }
//         const existingProductIndex = user.basket.findIndex(item => item.product == productId);
//         if (existingProductIndex !== -1) {
//             user.basket[existingProductIndex].count = count;
//         } else {
//             user.basket.push({ product: productId, count });
//         }
//         await user.save();
//         res.status(200).send("Basket updated");
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

connect('mongodb+srv://Test:test123@cluster0.ghwwmer.mongodb.net/').catch(err => console.log('db not connect', err))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
