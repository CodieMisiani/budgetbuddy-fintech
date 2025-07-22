import axios from "axios";

export default async function handler(req, res) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  if (req.method === "POST") {
    // Login
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, req.body);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    // Get user info
    try {
      const token = req.headers.authorization;
      const response = await axios.get(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: token },
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
