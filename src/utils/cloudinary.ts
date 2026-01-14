import cloudinary from "../config/cloudinary";
import fs from "fs";

const safeUnlink = (path?: string) => {
  if (path && fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

export const uploadToCloudinary = async (
  localFilePath: string,
  folder: string
) => {
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder,
    });

    safeUnlink(localFilePath);
    return res.secure_url;
  } catch (error) {
    safeUnlink(localFilePath);
    throw error;
  }
};

export const deleteFromCloudinary = async (url: string) => {
  const match = url.match(/upload\/(?:v\d+\/)?(.+)\./);
  if (!match) return;

  await cloudinary.uploader.destroy(match[1]);
};
