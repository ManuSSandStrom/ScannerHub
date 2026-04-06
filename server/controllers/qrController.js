import mongoose from 'mongoose';
import { QRCodeEntry } from '../models/QRCode.js';

const getContentType = (content) => {
  try {
    const parsedUrl = new URL(content);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' ? 'url' : 'text';
  } catch {
    return 'text';
  }
};

export const saveQRData = async (req, res, next) => {
  try {
    const content = String(req.body?.content || '').trim();

    if (!content) {
      return res.status(400).json({ message: 'QR content is required.' });
    }

    const qrEntry = await QRCodeEntry.create({
      content,
      type: getContentType(content),
    });

    return res.status(201).json({
      message: 'QR content saved successfully.',
      data: {
        id: qrEntry.id,
        content: qrEntry.content,
        type: qrEntry.type,
        createdAt: qrEntry.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getQRDataById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid share id.' });
    }

    const qrEntry = await QRCodeEntry.findById(id).lean();

    if (!qrEntry) {
      return res.status(404).json({ message: 'QR data not found.' });
    }

    return res.status(200).json({
      message: 'QR content fetched successfully.',
      data: {
        id: qrEntry._id.toString(),
        content: qrEntry.content,
        type: qrEntry.type,
        createdAt: qrEntry.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};
