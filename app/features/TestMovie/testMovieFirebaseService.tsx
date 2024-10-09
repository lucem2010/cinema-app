import { collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebaseConfig';
import { Movie } from '@/app/model/Movie';

// 1. Thêm mới Movie
export const addMovie = async (movie: Movie): Promise<void> => {
    try {
        const movieRef = doc(firestore, 'movies', movie.id);
        await setDoc(movieRef, {
            id: movie.id,
            FilmTypeID: movie.FilmTypeID,
            Name: movie.Name,
            Duration: movie.Duration,
            Rating: movie.Rating,
            Poster: movie.Poster,
            Trailer: movie.Trailer,
            Language: movie.Language,
            Status: movie.Status,
            Director: movie.Director,
            ActorID: movie.ActorID,
            ScreeningRoomsID: movie.ScreeningRoomsID,
            Introduction: movie.Introduction,
            ReleaseDate: movie.ReleaseDate,
            AgeRating: movie.AgeRating,
        });  // Thêm mới movie vào Firestore
    } catch (error) {
        throw new Error(`Failed to add Movie: ${error.message}`);
    }
};

// 2. Cập nhật Movie
export const updateMovie = async (movie: Movie): Promise<void> => {
    try {
        const movieRef = doc(firestore, 'movies', movie.id);
        await updateDoc(movieRef, {
            FilmTypeID: movie.FilmTypeID,
            Name: movie.Name,
            Duration: movie.Duration,
            Rating: movie.Rating,
            Poster: movie.Poster,
            Trailer: movie.Trailer,
            Language: movie.Language,
            Status: movie.Status,
            Director: movie.Director,
            ActorID: movie.ActorID,
            ScreeningRoomsID: movie.ScreeningRoomsID,
            Introduction: movie.Introduction,
            ReleaseDate: movie.ReleaseDate,
            AgeRating: movie.AgeRating,
        });  // Cập nhật movie vào Firestore
    } catch (error) {
        throw new Error(`Failed to update Movie: ${error.message}`);
    }
};

// 3. Xóa Movie
export const deleteMovie = async (movieId: string): Promise<void> => {
    try {
        const movieRef = doc(firestore, 'movies', movieId);
        await deleteDoc(movieRef);  // Xóa movie khỏi Firestore
    } catch (error) {
        throw new Error(`Failed to delete Movie: ${error.message}`);
    }
};

// 4. Lấy tất cả Movies
export const getAllMovies = async (): Promise<Movie[]> => {
    try {
        const movieCollection = collection(firestore, 'movies');
        const movieSnapshot = await getDocs(movieCollection);

        const movies: Movie[] = movieSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                FilmTypeID: data.FilmTypeID || [],
                Name: data.Name,
                Duration: data.Duration,
                Rating: data.Rating,
                Poster: data.Poster,
                Trailer: data.Trailer,
                Language: data.Language,
                Status: data.Status,
                Director: data.Director,
                ActorID: data.ActorID,
                ScreeningRoomsID: data.ScreeningRoomsID || [],
                Introduction: data.Introduction,
                ReleaseDate: data.ReleaseDate,
                AgeRating: data.AgeRating,
            } as Movie;
        });

        return movies;  // Trả về danh sách tất cả các movies
    } catch (error) {
        throw new Error(`Failed to fetch Movies: ${error.message}`);
    }
};

// 5. Lấy Movie theo ID
export const getMovieById = async (movieId: string): Promise<Movie | null> => {
    try {
        const movieRef = doc(firestore, 'movies', movieId);
        const movieDoc = await getDoc(movieRef);

        if (movieDoc.exists()) {
            const data = movieDoc.data();
            return {
                id: movieDoc.id,
                FilmTypeID: data.FilmTypeID || [],
                Name: data.Name,
                Duration: data.Duration,
                Rating: data.Rating,
                Poster: data.Poster,
                Trailer: data.Trailer,
                Language: data.Language,
                Status: data.Status,
                Director: data.Director,
                ActorID: data.ActorID,
                ScreeningRoomsID: data.ScreeningRoomsID || [],
                Introduction: data.Introduction,
                ReleaseDate: data.ReleaseDate,
                AgeRating: data.AgeRating,
            } as Movie;
        } else {
            return null;  // Trả về null nếu không tìm thấy movie
        }
    } catch (error) {
        throw new Error(`Failed to fetch Movie: ${error.message}`);
    }
};
export const updateMovieStatus = async (movieId: string, newStatus: string): Promise<void> => {
    try {
        const movieRef = doc(firestore, 'movies', movieId);

        // Cập nhật trạng thái mới cho movie
        await updateDoc(movieRef, {
            Status: newStatus
        });

        console.log(`Movie status updated successfully to ${newStatus}`);
    } catch (error) {
        throw new Error(`Failed to update movie status: ${error.message}`);
    }
};