import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { News } from '@/app/model/News';

// 1. Thêm mới News
export const addNews = async (news: News): Promise<void> => {
    try {
        const newsRef = doc(firestore, 'news', news.id);
        await setDoc(newsRef, {
            id: news.id,
            link: news.link,
            information: news.information
        });
    } catch (error) {
        throw new Error(`Failed to add News: ${error.message}`);
    }
};

// 2. Cập nhật News
export const updateNews = async (news: News): Promise<void> => {
    try {
        const newsRef = doc(firestore, 'news', news.id);
        await updateDoc(newsRef, {
            link: news.link,
            information: news.information
        });
    } catch (error) {
        throw new Error(`Failed to update News: ${error.message}`);
    }
};

// 3. Xóa News
export const deleteNews = async (newsId: string): Promise<void> => {
    try {
        const newsRef = doc(firestore, 'news', newsId);
        await deleteDoc(newsRef);
    } catch (error) {
        throw new Error(`Failed to delete News: ${error.message}`);
    }
};

// 4. Lấy tất cả News
export const getAllNews = async (): Promise<News[]> => {
    try {
        const newsCollection = collection(firestore, 'news');
        const newsSnapshot = await getDocs(newsCollection);

        const newsList: News[] = newsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                link: data.link,
                information: data.information
            } as News;
        });

        return newsList;
    } catch (error) {
        throw new Error(`Failed to fetch News: ${error.message}`);
    }
};

// 5. Lấy News theo ID
export const getNewsById = async (newsId: string): Promise<News | null> => {
    try {
        const newsRef = doc(firestore, 'news', newsId);
        const newsDoc = await getDoc(newsRef);

        if (newsDoc.exists()) {
            const data = newsDoc.data();
            return {
                id: newsDoc.id,
                link: data.link,
                information: data.information
            } as News;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(`Failed to fetch News: ${error.message}`);
    }
};
