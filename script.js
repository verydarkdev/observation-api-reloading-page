const movieContainer = document.getElementById('movieContainer');
const loading = document.getElementById('loading');
const search = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
let currentPage = 1;
let observer;

const API_KEY = '2820c1f7'; // Replace with a real API key

async function fetchMovies(query, page) {
    loading.style.display = 'block';
    
    const API_URL = `http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}&page=${page}`;
    const response = await fetch(API_URL);
    const data = await response.json();
    
    loading.style.display = 'none';

    displayMovies(data.Search); // Assuming the API returns an array of movies
}

function displayMovies(movies) {
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        movieItem.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p><strong>imdbID:</strong> ${movie.imdbID}</p>
                <p><strong>Year:</strong> ${movie.Year}</p>
            </div>
        `;
        
        movieContainer.appendChild(movieItem);
    });

    // Reattach the observer to the last movie item
    if (observer) observer.disconnect();
    const lastMovieItem = document.querySelector('.movie-item:last-child');
    if (lastMovieItem) observer.observe(lastMovieItem);
}

// Set up the Intersection Observer
observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        currentPage++;
        const query = searchInput.value.trim();
        if (query) {
            fetchMovies(query, currentPage);
        }
    }
}, { threshold: 1 });

search.addEventListener('click', () => {
    currentPage = 1; // Reset to the first page on new search
    movieContainer.innerHTML = ''; // Clear previous results
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query, currentPage);
    }
});