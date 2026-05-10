import { useState } from "react";
import fetchMovies from "../../services/movieService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const searchMovie = async (value: string): Promise<void> => {
    setMovies([]);
    setError(false);
    setLoader(true);

    try {
      const newMovies = (await fetchMovies(value)) as Movie[];
      if (newMovies.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(newMovies);
    } catch {
      setError(true);
    } finally {
      setLoader(false);
    }
  };
  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setSelectedMovie(null);
    setModalOpen(false);
  };
  const selectMovie = (movie: Movie): void => {
    setSelectedMovie(movie);
    openModal();
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={searchMovie} />
      {movies.length !== 0 && (
        <MovieGrid movies={movies} onSelect={selectMovie} />
      )}
      {modalOpen && <MovieModal movie={selectedMovie} onClose={closeModal} />}
      {error && <ErrorMessage />}
      {loader && <Loader />}
    </div>
  );
}
