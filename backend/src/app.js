// Backend application entry point
import { app } from "./routes/routes.js"

app.listen(3000,() => {
    console.log("✅ Server running on http://localhost:3000")
    console.log("✅ CORS enabled for all origins")
})

