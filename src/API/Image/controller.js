import { getStorage,ref, uploadBytes, getDownloadURL } from "firebase/storage";
import mongoose from "mongoose";

export const uploadImage = async (request, response) => {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `${new mongoose.Types.ObjectId()}-${request.file.originalname}` );

        const metadata = {
            contentType: request.file.mimetype,
        }

        const fileUploadResponse = await uploadBytes(storageRef, request.file.buffer, metadata);
        const downloadURL = await getDownloadURL(fileUploadResponse.ref);

        return response.status(201).json({message: "Image uploaded successfully", imageURL: downloadURL});
    } catch (error) {
        response.status(400).send({error: error.message});
    }
};
