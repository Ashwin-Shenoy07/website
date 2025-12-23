const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const tshirtRegistrationSchema = new mongoose.Schema(
  {
    tshirtReg: { type: Number },
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    shirtSize: {
      type: String,
      enum: ['24','26','28', '30','32','34', '36', '38', '40', '42','44', '46', '48'],
      required: true
    },
    isActive: {type: Boolean, value: true}
  },
  { timestamps: true }
);

// Auto-increment registration number
tshirtRegistrationSchema.plugin(AutoIncrement, {
  inc_field: "tshirtReg",
  start_seq: 1
});

module.exports = mongoose.model(
  "TshirtRegistration",
  tshirtRegistrationSchema
);
