export default function handler(req, res) {
  res.status(200).json({ 
    status: "ok", 
    message: "Standalone Vercel function is working",
    time: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
}
