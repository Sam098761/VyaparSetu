const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected Successfully!"))
  .catch(err => console.log("MongoDB Connection Error: ", err));

// 1. Product Schema (Junu ane Majbut)
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    sellerId: String,
    sellerName: String
});
const Product = mongoose.model('Product', productSchema);

// 2. NAVI CHAT SCHEMA (Asali Messaging mate) 🚀
const messageSchema = new mongoose.Schema({
    senderId: String,
    senderName: String,
    receiverId: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// --- API ROUTES ---

// Homepage mate Local Stores
app.get('/api/stores', (req, res) => {
    res.json([
        { id: "store_1", name: "Sarthak Tutors", type: "Education", distance: "1.2 km", ownerId: "user_2iX" }, // Aapne aagal jata aane pan asali karishu
        { id: "store_2", name: "Dr. Khengar Pandya Clinic", type: "Health", distance: "2.5 km", ownerId: "user_2iY" },
        { id: "store_3", name: "Sarthak Real Estate", type: "Real Estate", distance: "3.0 km", ownerId: "user_2iZ" }
    ]);
});

// Products Gotva mate
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/seller/:sellerId', async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.params.sellerId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    const { name, price, sellerId, sellerName } = req.body;
    try {
        const newProduct = new Product({ name, price, sellerId, sellerName });
        await newProduct.save();
        res.json({ message: "Item Cloud ma Save thai gai!", product: newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NAVA CHAT API ROUTES ---

// 1. Navo Message moklava mate (Send)
app.post('/api/messages', async (req, res) => {
    try {
        const { senderId, senderName, receiverId, text } = req.body;
        const newMessage = new Message({ senderId, senderName, receiverId, text });
        await newMessage.save();
        res.json({ success: true, message: newMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Chat history jova mate (Buyer ane Seller vacche ni vaato)
app.get('/api/messages/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort('timestamp'); // Juna message upar, nava niche
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Seller ne aaveli badhi Leads (Chats no list) gotva mate
app.get('/api/chats/:userId', async (req, res) => {
    try {
        // Find all messages where this user is the receiver
        const messages = await Message.find({ receiverId: req.params.userId }).sort('-timestamp');
        
        // Filter unique senders (ek na ek manas na 10 message hoy to list ma ek j vaar naam aavvu joiye)
        const uniqueSenders = [];
        const map = new Map();
        for (const msg of messages) {
            if(!map.has(msg.senderId)){
                map.set(msg.senderId, true);
                uniqueSenders.push({
                    senderId: msg.senderId,
                    senderName: msg.senderName,
                    lastMessage: msg.text,
                    time: msg.timestamp
                });
            }
        }
        res.json(uniqueSenders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`VyaparSetu Backend chalalu chhe Port ${PORT} par`);
});
