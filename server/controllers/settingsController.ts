import SiteSettings from '../models/SiteSettings';

// Fix: Use 'any' for req and res to resolve property access issues with status and json
export const getSettings = async (_req: any, res: any) => {
  const settings = await SiteSettings.findOne({});
  if (!settings) {
    const created = await SiteSettings.create({});
    return res.json(created);
  }
  res.json(settings);
};

// Fix: Use 'any' for req and res to resolve property access issues with body, status, and json
export const updateSettings = async (req: any, res: any) => {
  const payload = req.body;
  const existing = await SiteSettings.findOne({});

  if (!existing) {
    const created = await SiteSettings.create(payload);
    return res.status(201).json(created);
  }

  Object.assign(existing, payload);
  const updated = await existing.save();
  res.json(updated);
};
