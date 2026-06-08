// Backend application entry point
import { app } from "./routes/routes.js"
import cors from 'cors'

// ✅ CORS Configuration - Allow all origins for development
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.listen(3000,() => {
    console.log("✅ Server running on http://localhost:3000")
    console.log("✅ CORS enabled for all origins")
})

