function searchMovies() {
    const apiKey = '15315070'; // Replace 'YOUR_API_KEY' with your actual API key
    const searchInput = document.getElementById('searchInput').value;
    const url = `http://www.omdbapi.com/?s=${searchInput}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                const movies = data.Search;
                if (movies && movies.length > 0) {
                    displayResults(movies);
                } else {
                    displayError("No movies found");
                }
            } else {
                displayError(data.Error);
            }
        })
        .catch(error => console.log('Error:', error));
}

async function getMovieDetails(imdbID) {
    const apiKey = '15315070'; // Replace 'YOUR_API_KEY' with your actual API key
    const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function displayResults(movies) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    for (const movie of movies) {
        const { Title, Year, Poster, imdbID } = movie;
        const loader = document.createElement('div');
        loader.classList.add('loader');
        resultsContainer.appendChild(loader);

        const movieDetails = await getMovieDetails(imdbID);

        // Remove the loader once details are fetched
        loader.remove();

        const { Plot, Genre, Director, Actors, Ratings } = movieDetails;

        // Ratings info
        const ratingsInfo = Ratings ? Ratings.map(rating => `${rating.Source}: ${rating.Value}`).join(', ') : 'N/A';

        // Check if Plot, Genre, Director, Actors are falsy, if yes replace with 'N/A'
        const plotText = Plot ? Plot : 'N/A';
        const genreText = Genre ? Genre : 'N/A';
        const directorText = Director ? Director : 'N/A';
        const actorsText = Actors ? Actors : 'N/A';

        const movieCard = `
            <div class="movie">
                <img src="${Poster}" alt="${Title}" />
                <div class="movie-info">
                    <h2 class="movie-title">${Title} (${Year})</h2>
                    <p class="movie-details"><strong>Plot:</strong> ${plotText}</p>
                    <p class="movie-details"><strong>Genre:</strong> ${genreText}</p>
                    <p class="movie-details"><strong>Director:</strong> ${directorText}</p>
                    <p class="movie-details"><strong>Actors:</strong> ${actorsText}</p>
                    <p class="movie-details"><strong>Ratings:</strong> ${ratingsInfo}</p>
                    <a href="https://www.imdb.com/title/${imdbID}" class="more-info-link" target="_blank">More Info</a>
                </div>
            </div>
        `;
        resultsContainer.innerHTML += movieCard;
    }
}

function displayError(errorMessage) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<p>${errorMessage}</p>`;
}