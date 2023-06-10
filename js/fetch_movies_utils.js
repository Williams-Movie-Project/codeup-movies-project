"use strict";

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
    method: "PUT",
    headers: {
        'Content-Type': 'application/json',
    },
    body: {}
};

let deleteMovie = {
    method: "DELETE",
    headers: {
        'Content-Type': 'application/json',
    }
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
            .then(response => {
                if(response.status >= 300){
                    reject(`ID is not found in DB of Movies.\nStatus code: ${response.status}\n`);
                }
                return response.json();
            })
            .then(data => {
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
            .then(response => {
                if(response.status >= 300){
                    reject(`Status: ${response.status}`);
                }
                return response.json()
            })
            .then(resp => {
                console.log("just added a move check it out below!")
                resolve(resp);
            })
            .catch(err => reject(err));
    });
}

function deleteMovieByID(id) {
    return new Promise((resolve, reject) => {
        fetch(`${url}/${id}`, deleteMovie)
            .then(response => response.json())
            .then(resp => resolve(resp))
            .catch(err => reject(err));
    });
}


// function populateMovies() {
//     //create HTML strings for populating Page with movies
//     const listOfMovies = getMovies();
//     const mov = listOfMovies.then(resp => {
//         console.log(resp)
//     });
//     listOfMovies.catch(err => console.error(err));
//
//     return mov;
// }

// TESTING FUNCTIONALITY
//     populateMovies();
//
//     populateMovies();
