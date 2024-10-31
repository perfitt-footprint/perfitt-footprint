import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const uploadStorage = async (url: string, file: File) => {
  const storage = getStorage();
  const storageRef = ref(storage, url);
  const snapshot = await uploadBytes(storageRef, file);
  const photoURL = await getDownloadURL(snapshot.ref);
  return photoURL;
};