import Jimp from 'jimp';
import path from 'node:path';

const avatarsPath = path.resolve('public', 'avatars');

const resizeAvatar = async (file) => {
  const avatar = await Jimp.read(file.path);

  return avatar.resize(250, 250).write(`${avatarsPath}/${file.filename}`);
};

export default resizeAvatar;
