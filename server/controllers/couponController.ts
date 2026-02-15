import Coupon from '../models/Coupon';

export const getCoupons = async (req: any, res: any) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
};

export const createCoupon = async (req: any, res: any) => {
  const { code, type, value, minimumPurchase, maximumDiscount, expiresAt, usageLimit } = req.body;

  if (!code || !type || value === undefined) {
    return res.status(400).json({ message: 'Code, type, and value are required.' });
  }

  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    return res.status(400).json({ message: 'Coupon already exists.' });
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    type,
    value,
    minimumPurchase,
    maximumDiscount,
    expiresAt,
    usageLimit
  });

  res.status(201).json(coupon);
};

export const updateCoupon = async (req: any, res: any) => {
  const { isActive, expiresAt, usageLimit } = req.body;
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found.' });
  }

  if (isActive !== undefined) {
    coupon.isActive = isActive;
  }
  coupon.expiresAt = expiresAt || coupon.expiresAt;
  coupon.usageLimit = usageLimit || coupon.usageLimit;

  const updatedCoupon = await coupon.save();
  res.json(updatedCoupon);
};

export const applyCoupon = async (req: any, res: any) => {
  const { code, cartTotal } = req.body;

  if (!code || cartTotal === undefined) {
    return res.status(400).json({ message: 'Coupon code and cart total are required.' });
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) {
    return res.status(404).json({ message: 'Coupon not found.' });
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Coupon has expired.' });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ message: 'Coupon usage limit reached.' });
  }

  if (coupon.minimumPurchase && cartTotal < coupon.minimumPurchase) {
    return res.status(400).json({ message: 'Cart total does not meet minimum purchase.' });
  }

  let discount = coupon.type === 'percentage' ? (cartTotal * coupon.value) / 100 : coupon.value;
  if (coupon.maximumDiscount) {
    discount = Math.min(discount, coupon.maximumDiscount);
  }

  const discountedTotal = Math.max(cartTotal - discount, 0);

  res.json({ code: coupon.code, discount, discountedTotal });
};
