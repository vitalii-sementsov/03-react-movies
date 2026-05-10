import axios from "axios";
import { type Movie } from "../types/movie";

interface TMDBHTTPResponse {
  results: Movie[];
}

interface TMDBSearchParams {
  params: {
    query: string;
  };
  headers: {
    Authorization: string;
    accept?: string;
  };
}

export default async function fetchMovies(movieName: string): Promise<Movie[]> {
  const myToken = import.meta.env.VITE_TMDB_TOKEN;
  const config: TMDBSearchParams = {
    params: {
      query: movieName,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myToken}`,
    },
  };
  const response = await axios.get<TMDBHTTPResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    config
  );
  console.log(response.data.results);

  return response.data.results;
}
