import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import * as fs from 'fs';
import { handleError } from '@/utils';

export const SavePhoto = async (
  bot: TelegramBot,
  HallPhoto: TelegramBot.Message,
  filename?: string
) => {
  try {
    const photoId = HallPhoto.photo[HallPhoto.photo.length - 1].file_id;
    const photo = await bot.getFile(photoId);
    const photoUrl = `https://api.telegram.org/file/bot${process.env.BOT_API}/${photo.file_path}`;
    const photoPath = `static/halls/${filename ?? photoId + '.png'}`;

    const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(photoPath, response.data, { flag: 'w' });
    return photoPath;
  } catch (error) {
    handleError('Error on save photo from admin panel:' + error);
    return;
  }
};
export const DeletePhoto = async (filename: string) => {
  try {
    fs.unlinkSync(filename);
  } catch (error) {
    handleError('Error on deletion photo from admin panel:' + error);
  }
};
