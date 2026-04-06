import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['url', 'text'],
      required: true,
    },
  },
  {
    collection: 'qr_data',
    timestamps: true,
  }
);

export const QRCodeEntry = mongoose.model('QRCodeEntry', qrCodeSchema);
