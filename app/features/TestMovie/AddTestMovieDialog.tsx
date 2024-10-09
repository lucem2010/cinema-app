import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Modal,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchFilmTypes } from '../Filmtype/filmSlice';
import { Movie } from '@/app/model/Movie';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fetchAllPerformers } from '../Performer/PerformerSlice';

interface AddMovieDialogProps {
    visible: boolean;
    onClose: () => void;
    onAddMovie: (movie: Movie) => void;
    onEditMovie: (movie: Movie) => void;
    movieToEdit?: Movie;
}

const AddMovieDialog: React.FC<AddMovieDialogProps> = ({
    visible,
    onClose,
    onAddMovie,
    onEditMovie,
    movieToEdit,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { filmTypes } = useSelector((state: RootState) => state.filmType);
    const { performerList } = useSelector((state: RootState) => state.performer);

    const [name, setName] = useState('');
    const [duration, setDuration] = useState<string | number>('');
    const [poster, setPoster] = useState('');
    const [trailer, setTrailer] = useState('');
    const [language, setLanguage] = useState('');
    const [status, setStatus] = useState('Sắp Chiếu');
    const [director, setDirector] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [releaseDate, setReleaseDate] = useState(new Date());
    const [ageRating, setAgeRating] = useState('');
    const [selectedFilmTypes, setSelectedFilmTypes] = useState<string[]>([]);
    const [selectedActors, setSelectedActors] = useState<string[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filmTypeSearch, setFilmTypeSearch] = useState('');
    const [actorSearch, setActorSearch] = useState('');

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setReleaseDate(selectedDate);
        }
    };

    useEffect(() => {
        dispatch(fetchFilmTypes());
        dispatch(fetchAllPerformers());

        if (movieToEdit) {
            setName(movieToEdit.Name);
            setDuration(movieToEdit.Duration);
            setPoster(movieToEdit.Poster);
            setTrailer(movieToEdit.Trailer);
            setLanguage(movieToEdit.Language);
            setStatus(movieToEdit.Status);
            setDirector(movieToEdit.Director);
            setIntroduction(movieToEdit.Introduction);
            setReleaseDate(new Date(movieToEdit.ReleaseDate));
            setAgeRating(movieToEdit.AgeRating);
            setSelectedFilmTypes(movieToEdit.FilmTypeID || []);
            setSelectedActors(movieToEdit.ActorID || []);
        } else {
            resetForm();
        }
    }, [dispatch, movieToEdit]);

    const resetForm = () => {
        setName('');
        setDuration('');
        setPoster('');
        setTrailer('');
        setLanguage('');
        setStatus('Sắp Chiếu');
        setDirector('');
        setIntroduction('');
        setReleaseDate(new Date());
        setAgeRating('');
        setSelectedFilmTypes([]);
        setSelectedActors([]);
        setFilmTypeSearch('');
        setActorSearch('');
    };

    const handleFilmTypeToggle = (filmTypeId: string) => {
        setSelectedFilmTypes(prevSelectedFilmTypes => {
            if (prevSelectedFilmTypes.includes(filmTypeId)) {
                return prevSelectedFilmTypes.filter(id => id !== filmTypeId);
            } else {
                return [...prevSelectedFilmTypes, filmTypeId];
            }
        });
    };

    const handleActorToggle = (actorId: string) => {
        setSelectedActors(prevSelectedActors => {
            if (prevSelectedActors.includes(actorId)) {
                return prevSelectedActors.filter(id => id !== actorId);
            } else {
                return [...prevSelectedActors, actorId];
            }
        });
    };

    const handleSave = () => {
        const parsedDuration = typeof duration === 'number' ? duration : parseInt(duration, 10);
        const releaseDateValue = releaseDate instanceof Date ? releaseDate.toISOString() : new Date().toISOString();

        const movie: Movie = {
            id: movieToEdit ? movieToEdit.id : Date.now().toString(),
            FilmTypeID: selectedFilmTypes,
            Name: name,
            Duration: !isNaN(parsedDuration) ? parsedDuration : 0,
            Rating: movieToEdit ? movieToEdit.Rating : 0,
            Poster: poster,
            Trailer: trailer,
            Language: language,
            Status: status,
            Director: director,
            ActorID: selectedActors,
            ScreeningRoomsID: [],
            Introduction: introduction,
            ReleaseDate: releaseDateValue,
            AgeRating: ageRating,
        };

        if (movieToEdit) {
            onEditMovie(movie);
        } else {
            onAddMovie(movie);
        }

        onClose();
    };

    const isFormComplete =
        name.trim() !== '' &&
        (typeof duration === 'number' ? !isNaN(duration) : duration.trim() !== '') &&
        poster.trim() !== '' &&
        trailer.trim() !== '' &&
        language.trim() !== '' &&
        director.trim() !== '' &&
        introduction.trim() !== '' &&
        ageRating.trim() !== '' &&
        selectedFilmTypes.length > 0 &&
        selectedActors.length > 0;

    // Filtered film types based on search input
    const filteredFilmTypes = filmTypes.filter(filmType =>
        filmType.name.toLowerCase().includes(filmTypeSearch.toLowerCase())
    );

    // Filtered performers based on search input
    const filteredPerformers = performerList.filter(actor =>
        actor.name.toLowerCase().includes(actorSearch.toLowerCase())
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <SafeAreaView style={styles.overlay}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.title}>{movieToEdit ? 'Edit Movie' : 'Add Movie'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tên phim"
                            placeholderTextColor="#999"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Thời lượng (phút)"
                            keyboardType="numeric"
                            placeholderTextColor="#999"
                            value={typeof duration === 'number' ? duration.toString() : duration}
                            onChangeText={text => setDuration(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Poster URL"
                            placeholderTextColor="#999"
                            value={poster}
                            onChangeText={setPoster}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Trailer URL"
                            placeholderTextColor="#999"
                            value={trailer}
                            onChangeText={setTrailer}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ngôn ngữ"
                            placeholderTextColor="#999"
                            value={language}
                            onChangeText={setLanguage}
                        />
                        <Text style={styles.label}>Trạng thái: {status}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Đạo diễn"
                            placeholderTextColor="#999"
                            value={director}
                            onChangeText={setDirector}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Giới thiệu"
                            placeholderTextColor="#999"
                            value={introduction}
                            onChangeText={setIntroduction}
                        />
                        {/* Release Date Section */}
                        <View>
                            <Text style={styles.label}>Ngày phát hành</Text>
                            <Button
                                title={releaseDate ? format(releaseDate, 'dd/MM/yyyy') : 'Select Date'}
                                onPress={() => setShowDatePicker(true)}
                            />
                            {showDatePicker && (
                                <DateTimePicker
                                    value={releaseDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Độ tuổi"
                            placeholderTextColor="#999"
                            value={ageRating}
                            onChangeText={setAgeRating}
                        />
                        {/* Select Film Types */}
                        <Text style={styles.label}>Thể loại phim:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm kiếm thể loại"
                            value={filmTypeSearch}
                            onChangeText={setFilmTypeSearch}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {filteredFilmTypes.map((filmType) => (
                                <TouchableOpacity
                                    key={filmType.id}
                                    style={[
                                        styles.filmTypeItem,
                                        selectedFilmTypes.includes(filmType.id) && styles.selectedFilmType,
                                    ]}
                                    onPress={() => handleFilmTypeToggle(filmType.id)}
                                >
                                    <Text style={styles.filmTypeText}>{filmType.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {/* Select Actors */}
                        <Text style={styles.label}>Diễn viên:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm kiếm diễn viên"
                            value={actorSearch}
                            onChangeText={setActorSearch}
                        />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {filteredPerformers.map((performer) => (
                                <TouchableOpacity
                                    key={performer.id}
                                    style={[
                                        styles.actorItem,
                                        selectedActors.includes(performer.id) && styles.selectedActor,
                                    ]}
                                    onPress={() => handleActorToggle(performer.id)}
                                >
                                    <Text style={styles.actorText}>{performer.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={movieToEdit ? 'Update' : 'Add'}
                                onPress={handleSave}
                                disabled={!isFormComplete}
                            />
                            <Button title="Cancel" onPress={onClose} />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        fontWeight: '600',
    },
    filmTypeItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
    },
    selectedFilmType: {
        backgroundColor: '#007BFF',
    },
    filmTypeText: {
        color: '#000',
    },
    actorItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
    },
    selectedActor: {
        backgroundColor: '#007BFF',
    },
    actorText: {
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default AddMovieDialog;
