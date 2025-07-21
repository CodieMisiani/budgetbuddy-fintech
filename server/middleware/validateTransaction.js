import Joi from "joi";

export const transactionSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  date: Joi.string().isoDate().required(),
  description: Joi.string().min(1).required(),
  vendor: Joi.string().allow("").optional(),
});

export function validateTransaction(req, res, next) {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}
