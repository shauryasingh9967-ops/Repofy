/**
 * Applied to every schema so that API responses expose a clean `id` string
 * instead of Mongoose's `_id` ObjectId, and drop the internal `__v` key.
 * Keeps the REST API contract simple and consistent for the frontend.
 */
export const idTransform = (schema) => {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      return ret;
    },
  });
};
