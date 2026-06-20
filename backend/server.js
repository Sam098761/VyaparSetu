const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 

const app = express();
app.use(cors()); 
app.use(express.json());

// TAMARI SACHI CONNECTION LINK
const mongoURI = "mongodb+srv://parmarsarthak06_db_user:SarthakVyapar99@cluster0.foe6boj.mongodb.net/VyaparSetu?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("🟢 JORDAR! MongoDB Cloud sathe judai gayu!"))
    .catch((err) => console.log("🔴 MongoDB Connection Error: ", err));

// --- 1. THE BLUEPRINT (Schema & Model) ---
// Database ne khabar padse ke dukan ni item kevi hoy
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Boolean
});
const Product = mongoose.model('Product', productSchema);


// --- API ROUTES ---

app.get('/api/status', (req, res) => {
    res.json({ message: "VyaparSetu Backend Engine is LIVE! 🚀" });
});

// --- 2. ASLI DATA LAVVANO RASTO (Read from Cloud) ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find(); // Asli Database mathi item gotse
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Data lavvama bhul thai" });
    }
});

// --- 4. NAVO DATA NAKHVANO RASTO (Create / POST) ---
app.post('/api/products', async (req, res) => {
    try {
        // App mathi aavelo navo data (name, price) catch karo
        const newItem = new Product({
            name: req.body.name,
            price: req.body.price,
            stock: true // Default stock chalu rakhisu
        });
        
        // Cloud Database ma Save karo
        await newItem.save(); 
        
        res.status(201).json({ message: "Item Cloud ma save thai gai!", product: newItem });
    } catch (error) {
        res.status(500).json({ error: "Item save karvama bhul thai" });
    }
});

// --- 3. MAGIC BUTTON: Database ma data nakhvano rasto (Seed Data) ---
app.get('/api/seed', async (req, res) => {
    try {
        await Product.deleteMany({}); // Juna kachra ne saaf karo
        await Product.insertMany([
            { name: "Cloud Aashirvaad Atta (5kg)", price: 260, stock: true },
            { name: "Cloud Amul Milk (500ml)", price: 34, stock: true },
            { name: "Cloud Maggi Noodles", price: 14, stock: true },
            { name: "Cloud Parle-G Biscuit", price: 5, stock: false }
        ]);
        res.send("<h1>✅ MAGIC DONE! Data Cloud Database ma Save thai gayo! Have tamari App check karo.</h1>");
    } catch (error) {
        res.send("Error: " + error);
    }
});

// (Buyer stores atyare dummy rakhya chhe, pachi database ma nakhi daisu)
app.get('/api/stores', (req, res) => {
    res.json([
        { id: 1, name: "Manoj Provisions", type: "Grocery", distance: "1.2 km" },
        { id: 2, name: "Dr. Khengar Pandya Clinic", type: "Health", distance: "2.5 km" },
        { id: 3, name: "Patel Dining Hall", type: "Food", distance: "3.0 km" }
    ]);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running perfectly on http://localhost:${PORT}`);
});
