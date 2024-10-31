import { FirebaseError } from "firebase/app";
import { deleteObject, getStorage, ref } from "firebase/storage";

export const deleteUserProfileStorage = async (uid: string) => {
  try {
    const storage = getStorage();
    await deleteObject(ref(storage, `user/profile/${uid}`));
    return 'success';
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'storage/object-not-found')
      return 'success';
    else throw error;
  }
};
