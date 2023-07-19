// Node constant for nav bar
const movieListNav = document.querySelector("#movie-list");

// Node constants for detail window
const detailImage = document.querySelector('#detail-image');
const detailTitle = document.querySelector('#title');
const detailYearReleased = document.querySelector('#year-released');
const detailDescription = document.querySelector('#description');
const detailWatchedButton = document.querySelector('#watched');
const detailBloodAmount = document.querySelector('#amount');

// Node constants for blood drop form
const bloodForm = document.querySelector('#blood-form');

// Get db; populate nav bar; pre-populate display window
fetch(`http://localhost:3000/movies`)
.then(resp => resp.json())
.then(data => {
    // CHALLENGE 1 -- populate nav bar
    data.forEach(movieObj => {
        const newImg = document.createElement('img');
        newImg.src = movieObj.image;

        // CHALLENGE 3 -- clicking a movie in nav bar opens it in detail window
        newImg.addEventListener('click', () => populateDetail(movieObj));

        movieListNav.appendChild(newImg);
    })
    // CHALLENGE 2 -- pre-populate detail window with first movie in nav bar
    populateDetail(data[0]);
})


function populateDetail(movieObj) {
    detailImage.src = movieObj.image;
    detailTitle.textContent = movieObj.title;
    detailYearReleased.textContent = movieObj.release_year;
    detailDescription.textContent = movieObj.description;
    detailWatchedButton.textContent = movieObj.watched ? 'Watched' : 'Unwatched';
    detailBloodAmount.textContent = movieObj.blood_amount;
    // CHALLENGE 4 -- when clicked, button should toggle between 'Watched' and 'Unwatched
    // And a patch request should be sent
    detailWatchedButton.onclick = () => {
        // Flip value locally
        movieObj.watched = !(movieObj.watched);
        const BUTTON_PATCH_OPTIONS = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                watched: movieObj.watched,
            })
        }
        // Update value in db
        fetch(`http://localhost:3000/movies/`+movieObj.id, BUTTON_PATCH_OPTIONS)
        .then(resp => resp.json())
        .then(patchedMovieObj => {
            // Render updated value
            detailWatchedButton.textContent = patchedMovieObj.watched ? 'Watched' : 'Unwatched';
        })
    }
    // CHALLENGE 5 -- the blood drop stuff
    // We use .onsubmit() rather than .addEventListener() to ensure only one event listener is active at a time
    bloodForm.onsubmit = (e) => {
        // Prevent page from reloading
        e.preventDefault();

        // Get # of blood drops & update locally
        const userSubmittedValue = e.target['blood-amount'].value;
        movieObj.blood_amount = (+movieObj.blood_amount) + (+userSubmittedValue);
        
        // Patch to db & pessimistically render
        const BLOOD_PATCH_OPTIONS = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                blood_amount: movieObj.blood_amount,
            })
        }
        fetch(`http://localhost:3000/movies/`+movieObj.id, BLOOD_PATCH_OPTIONS)
        .then(resp => resp.json())
        .then(patchedMovieObj => {
            // If patch successful, render updated value & reset form
            detailBloodAmount.textContent = patchedMovieObj.blood_amount;
            e.target.reset();
        })
    }
}

