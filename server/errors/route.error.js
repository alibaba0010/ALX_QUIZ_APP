export const routeError = (req, res) =>
  res.status(404).json({ err: "Route does not exist" });
