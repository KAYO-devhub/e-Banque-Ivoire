// Backend application entry point
import { app } from "./routes/routes.js"

app.listen(3000,() => {
    console.log("✅ Server running on http://192.168.1.29:3000")
    console.log("✅ CORS enabled for all origins")
})

