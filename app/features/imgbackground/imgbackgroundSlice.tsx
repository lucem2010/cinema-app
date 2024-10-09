import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { ImgBackground } from '@/app/model/ImgBackground';

// Hàm lấy đối tượng imgBackground theo id
export const fetchImgBackgroundById = async (id: string): Promise<ImgBackground | null> => {
  try {
    const imgBackgroundDoc = await getDoc(doc(firestore, "imgBackgrounds", id));
    if (imgBackgroundDoc.exists()) {
      return { id: imgBackgroundDoc.id, ...imgBackgroundDoc.data() } as ImgBackground;
    } else {
      console.log("No imgBackground found for ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error fetching imgBackground by ID:", error);
    return null;
  }
};

// Hàm cập nhật đối tượng imgBackground theo id
export const updateImgBackgroundById = async (
  id: string,
  updatedData: Partial<Omit<ImgBackground, 'id'>>
): Promise<void> => {
  try {
    const imgBackgroundDoc = doc(firestore, "imgBackgrounds", id);
    await updateDoc(imgBackgroundDoc, updatedData);
    console.log("imgBackground updated successfully");
  } catch (error) {
    console.error("Error updating imgBackground:", error);
  }
};
