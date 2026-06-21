// Backend application entry point
import { app } from "./routes/routes.js"

const PORT = process.env.PORT || 3000
app.listen(PORT,() => {
    console.log(`✅ Server running on port ${PORT}`)
})

