import cors from "cors"

const corsOptions = {
  origin: "http://localhost:5173", // Vite dev server
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}

export default cors(corsOptions)
