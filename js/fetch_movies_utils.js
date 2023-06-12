"use strict";

// GLOBAL VARIABLES
const url = "https://fanatical-raspy-ambert.glitch.me/movies"
const urlOMDb = "http://www.omdbapi.com/?apikey=1b613e4b&t="

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
                resolve(data);
            })
            .catch(err => reject(err));
    })
}

function updateMovieByID(id, body) {
    console.log(id);
    updateMovieWithPut.body = JSON.stringify(body);
    console.log(body);
    console.log(updateMovieWithPut);
    console.log(updateMovieWithPut.body);
    return new Promise((resolve, reject) => {
        fetch(`${url}/${id}`, updateMovieWithPut)
            .then(response => response.json())
            .then(data => {
                resolve(data)
            })
            .catch(err => reject(err));
    });
}

function addMovies(body) {
    return new Promise((resolve, reject) => {
        fetch(`${urlOMDb}${body.title}`)
            .then(response => response.json())
            .then(resp => {
                const movieData = {
                    title: resp.Title,
                    poster: resp.Poster,
                    plot: resp.Plot,
                    genre: resp.Genre,
                    actors: resp.Actors,
                    year: resp.Year,
                    rating: body.rating
                }
                postNewMovie.body = JSON.stringify(movieData);
                fetch(url, postNewMovie)
                    .then(response => {
                        if(response.status >= 300){
                            reject(`Status: ${response.status}`);
                        }
                        return response.json()
                    })
                    .then(resp => resolve(resp))
                    .catch(err => reject(err));
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

//
// function getOMDbMovieData(title){
//     return new Promise((resolve, reject) => {
//         fetch(`${urlOMDb}${title}`)
//             .then(response => response.json())
//             .then(resp => {
//                 const movieData = {
//                     title: resp.Title,
//                     poster: resp.Poster,
//                     plot: resp.Plot,
//                     genre: resp.Genre,
//                     actors: resp.Actors,
//                     year: resp.Year,
//                     rating: resp.imdbRating
//                 }
//                 resolve(movieData);
//             })
//             .catch(err => reject(err));
//     });
// }
