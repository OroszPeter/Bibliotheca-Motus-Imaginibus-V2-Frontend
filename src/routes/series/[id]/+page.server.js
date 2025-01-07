import fetch from 'node-fetch';
import https from 'https';
import { API_Url } from '../../../store.js';

export async function load({ params }) {
    const { id } = params;
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
        // Film adatok lekérése
        const movieResponse = await fetch(`${API_Url}Movie/${id}`, { agent });
        if (!movieResponse.ok) throw new Error('Failed to fetch movie');

        const movie = await movieResponse.json();

        // Értékelések lekérése
        const ratingsResponse = await fetch(`${API_Url}Ratings`, { agent });
        if (!ratingsResponse.ok) throw new Error('Failed to fetch ratings');

        const allRatings = await ratingsResponse.json();

        // Adott filmhez tartozó értékelések kiszűrése
        const movieRatings = allRatings.filter(rating => rating.movieId === Number(id));

        // Átlag kiszámítása
        const averageRating = 
            movieRatings.reduce((sum, rating) => sum + rating.ratingNumber, 0) / movieRatings.length || 0;

        return { movie, movieRatings, averageRating };

    } catch (error) {
        console.error('Error loading data:', error);
        return { movie: null, movieRatings: [], averageRating: 0 };
    }
}
