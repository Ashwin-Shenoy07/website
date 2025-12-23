const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const tshirtRegistrationSchema = new mongoose.Schema(
  {
    regNumber: { type: Number },
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    shirtSize: {
      type: String,
      enum: ['28', '30','32','34', '36', '38', '40', '42','44', '46', '48'],
      required: true
    }
  },
  { timestamps: true }
);

// Auto-increment registration number
tshirtRegistrationSchema.plugin(AutoIncrement, {
  inc_field: "regNumber",
  start_seq: 1001
});

module.exports = mongoose.model(
  "TshirtRegistration",
  tshirtRegistrationSchema
);
