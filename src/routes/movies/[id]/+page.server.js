import fetch from 'node-fetch';
import https from 'https';

export async function load({ params }) {
    const { id } = params;
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
        // Film adatok lekérése
        const movieResponse = await fetch(`https://localhost:7214/api/Movie/${id}`, { agent });
        if (!movieResponse.ok) throw new Error('Failed to fetch movie');

        const movie = await movieResponse.json();

        // Film képének lekérése
        const imageResponse = await fetch(`https://localhost:7214/api/Movie/${id}/kep`, { agent });
        if (!imageResponse.ok) throw new Error('Failed to fetch movie image');

        const imageUrl = await imageResponse.text();

        // Értékelések lekérése
        const ratingsResponse = await fetch('https://localhost:7214/api/Ratings', { agent });
        if (!ratingsResponse.ok) throw new Error('Failed to fetch ratings');

        const allRatings = await ratingsResponse.json();

        // Adott filmhez tartozó értékelések kiszűrése
        const movieRatings = allRatings.filter(rating => rating.movieId === Number(id));

        // Átlag kiszámítása
        const averageRating = 
            movieRatings.reduce((sum, rating) => sum + rating.ratingNumber, 0) / movieRatings.length || 0;

        return { movie, imageUrl, movieRatings, averageRating };

    } catch (error) {
        console.error('Error loading data:', error);
        return { movie: null, imageUrl: '', movieRatings: [], averageRating: 0 };
    }
}
