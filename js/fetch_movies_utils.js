"use strict";

(() => {

// GLOBAL VARIABLES
    const url = "https://fanatical-raspy-ambert.glitch.me/movies"

    let postNewMovie = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: {}
    };

    let updateMovieWithPut = {
        method: "Put",
        headers: {
            'Content-Type': 'application/json',
        },
        body: {}
    };

// API FETCH
    function getMovies() {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });

    }

    function getMovieByID(id) {
        return new Promise((resolve, reject) => {
            fetch(`${url}/${id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(`Got "${data.title}" by searing the index.`)
                    resolve(data)
                })
                .catch(err => reject(err));
        });
    }

    function getMovieByTitle(title) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    return data.filter(d => d.title === title);
                })
                .then(data => {
                    console.log(`got "${data.title}" from db when searing by title.`)
                    resolve(data);
                })
                .catch(err => reject(err));
        })
    };

    function updateMovieByID(id, body) {
        updateMovieWithPut.body = JSON.stringify(body);
        return new Promise((resolve, reject) => {
            fetch(`${url}/${id}`, updateMovieWithPut)
                .then(response => response.json())
                .then(data => {
                    console.log("Movie was updated.");
                    resolve(data)
                })
                .catch(err => reject(err));
        });

    }

    function addMovies(body) {
        postNewMovie.body = JSON.stringify(body);
        return new Promise((resolve, reject) => {
            fetch(url, postNewMovie)
                .then(response => response.json())
                .then(resp => {
                    console.log("just added a move check it out below!")
                    resolve(resp);
                })
                .catch(err => reject(err));
        });
    }


    function populateMovies() {
        //create HTML strings for populating Page with movies
        const listOfMovies = getMovies();
        listOfMovies.then(resp => console.log(resp));
        listOfMovies.catch(err => console.error(err));
    }

// TESTING FUNCTIONALITY
    populateMovies();

// const body = {title: "Jack The Ripper", rating: "5"};
// const newMovieAdded = addMovies(body);
// newMovieAdded.then(resp => console.log(resp));
// newMovieAdded.catch((err => console.error(err)));
//
// const movieByID = getMovieByID(3);
// movieByID.then(resp => console.log(resp));
// movieByID.catch(err => console.error(err));
//
// const testBodyForPut = {title: "Test Title -5", rating: "-5"};
// const testID = 10;
// const updatedMovieByID = updateMovieByID(testID, testBodyForPut);
// updatedMovieByID.then(response => console.log(response));
// updatedMovieByID.catch((err => console.error(err)));
//
// const movieByTitle = getMovieByTitle("Rush Hour");
// movieByTitle.then(response => console.log(response));
// movieByTitle.catch(err => console.error(err));


    populateMovies();

})();