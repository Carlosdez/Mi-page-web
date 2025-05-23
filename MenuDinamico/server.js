const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Handle all routes
app.get('*', (req, res) => {
    const fullPath = path.join(__dirname, '..', req.path);
    res.sendFile(fullPath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});