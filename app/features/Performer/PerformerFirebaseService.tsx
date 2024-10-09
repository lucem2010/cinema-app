import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { Performer } from '@/app/model/Performer';

// 1. Thêm mới Performer
export const addPerformer = async (performer: Performer): Promise<void> => {
    try {
        const performerRef = doc(firestore, 'performers', performer.id);
        await setDoc(performerRef, {
            id: performer.id,
            img: performer.img,
            name: performer.name
        });
    } catch (error) {
        throw new Error(`Failed to add Performer: ${error.message}`);
    }
};

// 2. Cập nhật Performer
export const updatePerformer = async (performer: Performer): Promise<void> => {
    try {
        const performerRef = doc(firestore, 'performers', performer.id);
        await updateDoc(performerRef, {
            img: performer.img,
            name: performer.name
        });
    } catch (error) {
        throw new Error(`Failed to update Performer: ${error.message}`);
    }
};

// 3. Xóa Performer
export const deletePerformer = async (performerId: string): Promise<void> => {
    try {
        const performerRef = doc(firestore, 'performers', performerId);
        await deleteDoc(performerRef);
    } catch (error) {
        throw new Error(`Failed to delete Performer: ${error.message}`);
    }
};

// 4. Lấy tất cả Performers
export const getAllPerformers = async (): Promise<Performer[]> => {
    try {
        const performerCollection = collection(firestore, 'performers');
        const performerSnapshot = await getDocs(performerCollection);

        const performerList: Performer[] = performerSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                img: data.img,
                name: data.name
            } as Performer;
        });

        return performerList;
    } catch (error) {
        throw new Error(`Failed to fetch Performers: ${error.message}`);
    }
};

// 5. Lấy danh sách Performer theo danh sách ID
export const getPerformersByIds = async (performerIds: string[]): Promise<Performer[]> => {
    try {
        const performers: Performer[] = [];

        for (const id of performerIds) {
            const performerRef = doc(firestore, 'performers', id);
            const performerDoc = await getDoc(performerRef);

            if (performerDoc.exists()) {
                const data = performerDoc.data();
                performers.push({
                    id: performerDoc.id,
                    img: data.img,
                    name: data.name
                } as Performer);
            }
        }

        return performers;
    } catch (error) {
        throw new Error(`Failed to fetch Performers by IDs: ${error.message}`);
    }
};
