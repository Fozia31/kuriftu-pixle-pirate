import { predictDemand } from "../services/demand.service.js";

export const predictDemandHandler = async (req, res) => {
  try {
    const result = await predictDemand(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to predict demand" });
  }
};
