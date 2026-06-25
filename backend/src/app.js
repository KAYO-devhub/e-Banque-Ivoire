// Backend application entry point
import { app } from "./routes/routes.js"
import 'dotenv/config'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express'
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));







const PORT = process.env.PORT || 3000
app.listen(PORT,() => {
    console.log(`✅ Server running on port:${PORT}`)
})

