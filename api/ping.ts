
export default function (req: any, res: any) {
  res.status(200).json({ status: "ok", message: "Vercel function is reachable", timestamp: new Date().toISOString() });
}
