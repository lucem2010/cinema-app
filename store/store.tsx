import userReducer from '@/app/features/User/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import filmReducer from '@/app/features/Filmtype/filmSlice';
import foodReducer from '@/app/features/Food/foodSlice';
import screeningRoomReducer from '@/app/features/ScreeningRoom/screeningSlice';
import showtimeRoomReducer from '@/app/features/Showtime/showtimeSlice';
import movieReducer from '@/app/features/TestMovie/TestMovieSlice';
import seatReducer from '@/app/features/Seat/seatSlice';
import ticketReducer from '@/app/features/Ticket/ticketSlice';
import newsReducer from '@/app/features/News/NewsSlice';
import performerReducer from '@/app/features/Performer/PerformerSlice';









export const store = configureStore({
    reducer: {
        user: userReducer,
        filmType: filmReducer,
        food: foodReducer,
        screeningRoom: screeningRoomReducer,
        showtime: showtimeRoomReducer,
        movie: movieReducer,
        seat: seatReducer,
        ticket: ticketReducer,
        news: newsReducer,
        performer: performerReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Thay thế `ignoredActions` và `ignoredPaths` theo nhu cầu của bạn
                ignoredActions: ['yourActionType'],
                ignoredPaths: ['yourStatePath'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
