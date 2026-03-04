
export default function (req: any, res: any) {
  res.status(200).json({ status: "ok", type: "isolated-health-check", timestamp: new Date().toISOString() });
}
