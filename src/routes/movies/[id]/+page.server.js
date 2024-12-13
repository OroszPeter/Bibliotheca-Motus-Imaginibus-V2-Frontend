import fetch from 'node-fetch';
import https from 'https';

export async function load({ params }) {
    const { id } = params;
    console.log('Loading movie data for id:', id);

    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
        const movieResponse = await fetch(`https://localhost:7214/api/Movie/${id}`, { agent });
        if (!movieResponse.ok) {
            console.error('Failed to fetch movie:', movieResponse.status);
            return { props: { movie: null } };
        }

        const movie = await movieResponse.json();
        console.log('Movie data fetched:', movie);

        // Additional logic (image and ratings fetching) goes here...

        return { props: { movie } };

    } catch (error) {
        console.error('Error loading movie data:', error);
        return { props: { movie: null } };
    }
}
