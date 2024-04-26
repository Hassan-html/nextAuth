import { Schema, model, models } from "mongoose";

const staffSchema = Schema({
  email: { type: String, required: true, unique: true },
  psw: { type: String, required: true },
  name: { type: String, required: true },
  Role: { type: String, required: true },
  approved: { type: Boolean, default: false },
});

export const staffModel = models.staff || model("staff", staffSchema);
