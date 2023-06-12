"use strict";

$(document).ready(function() {
    // Global Variables For HTML Elements by ID
    const newSubmitBtn = $("#submit-new-movie-btn");
    const editSubmitBtn = $("#submit-movie-edits-btn");
    const newTitleInput = $("#new-title");
    const newRatingInput = $("#new-movie-rating");
    const deleteMovBtn = $("#delete-movie");
    const loaderDiv = $("#loader-div");
    const movieContainerDiv = $("#movie-container");
    const openCanvas = $("#open-canvas");
    const movieRow = $("#movie-row");
    const editMovBtn = $("#edit-movie");
    const offCanMovTitle = $("#offcanvas-movie-title");
    const offCanMovPlot = $("#offcanvas-movie-plot");
    const offCanMovGenre = $("#offcanvas-movie-genre");
    const offCanMovActors = $("#offcanvas-movie-actors");
    const offCanMovYear = $("#offcanvas-movie-year");
    const offCanMovRating = $("#offcanvas-movie-rating");
    const offCanMovID = $("#offcanvas-movie-id");
    const editMovTitle = $("#edit-title");
    const editMovPlot = $("#edit-plot");
    const editMovGenre = $("#edit-genres");
    const editMovActors = $("#edit-actors");
    const editMovYear = $("#edit-year");
    const editMovRating = $("#edit-movie-rating");


    // GLOBAL VARIABLES for fetch methods
    const url = "https://fanatical-raspy-ambert.glitch.me/movies"
    const urlOMDb = `http://www.omdbapi.com/?apikey=${OMDB_Key}&t=`
    let postNewMovie = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: {}
    };

    let updateMovieWithPatch = {
        method: "PATCH",
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


    // Static Event Listeners
    $(newSubmitBtn).on("click", submitNewMovieForm);
    $(newTitleInput).on("input", toggleNewMovieFormBtn);
    $(deleteMovBtn).on("click", deleteSelectedMovie);
    $(editMovBtn).on("click", populateSelectedEditMovieDataForm);
    $(editSubmitBtn).on("click", editSelectedMovie);

    function showLoader(){
        $(loaderDiv).removeClass("d-none");
        $(movieContainerDiv).addClass("d-none");
    }

    function hideLoader(){
        $(loaderDiv).addClass("d-none");
        $(movieContainerDiv).removeClass("d-none");
    }

    function getAllMovies(){
        const movies = getMovies();
        movies.then(resp => {
            if(resp){
                for(let i = 0; i < resp.length; i++){
                    addMovieCardToMovieDiv(createAMovieCard(resp[i]));
                    addClickEventToCards(resp[i].id);
                }
            }
            hideLoader();
        });
        movies.catch((err => console.error(err)));
    }

    function submitNewMovieForm(e){
        e.preventDefault();
        const formBody = {title: $(newTitleInput).val(),  rating: $(newRatingInput).val()}
        const movAddedResp = addMovies(formBody);
        movAddedResp.then(resp => {
            addMovieCardToMovieDiv(createAMovieCard(resp));
            addClickEventToCards(resp.id);
            $(newTitleInput).val("");
            $(newRatingInput).val(0);
        });
        movAddedResp.catch(err => console.error(err));
    }

    function addClickEventToCards(cardID){
        $(`#${cardID}`).on("click", function (){
            $(openCanvas).click();
            let movieByID = getMovieByID(cardID);
            movieByID.then(resp => {
                $(offCanMovTitle).html(`${resp.title}`);
                $(offCanMovPlot).html(`${resp.plot}`);
                $(offCanMovGenre).html(`<span>Genre(s): </span><span id="selected-genres">${resp.genre}</span>`);
                $(offCanMovActors).html(`<span>Actor(s): </span><span id="selected-actors">${resp.actors}</span>`);
                $(offCanMovYear).html(`<span>Year: </span><span id="selected-year">${resp.year}</span>`);
                $(offCanMovRating).html(`<span>Rating: </span><span id="selected-rating">${resp.rating}</span>`);
                $(offCanMovID).html(resp.id);
            });
            movieByID.catch(err => console.error(err));
        })
    }

    function deleteSelectedMovie(e){
        e.preventDefault();
        const indexToDelete = parseInt($(offCanMovID).text());
        const movieDeleted = deleteMovieByID(indexToDelete);
        movieDeleted.then(resp => {
            $(openCanvas).click();
            $(`#${indexToDelete}`).remove();
        })
        movieDeleted.catch(err => console.error(err));
    }

    function populateSelectedEditMovieDataForm(e){
        e.preventDefault();
        $(editMovTitle).val($(offCanMovTitle).html());
        $(editMovPlot).val($(offCanMovPlot).html());
        $(editMovGenre).val($("#selected-genres").html());
        $(editMovActors).val($("#selected-actors").html());
        $(editMovYear).val($("#selected-year").html());
        $(editMovRating).val($("#selected-rating").html());
    }

    function editSelectedMovie(e){
        e.preventDefault();
        const indexToEdit = parseInt($(offCanMovID).text());
        const editMovieFormBody = {
            title: $(editMovTitle).val(),
            plot: $(editMovPlot).val(),
            genre: $(editMovGenre).val(),
            actors: $(editMovActors).val(),
            year: $(editMovYear).val(),
            rating: $(editMovRating).val()
        };
        console.log(editMovieFormBody);
        const movieUpdated = updateMovieByID(indexToEdit, editMovieFormBody);
        movieUpdated.then(resp => {
            $(offCanMovTitle).html(resp.title);
            $(offCanMovPlot).html(resp.plot);
            $("#selected-genres").html(resp.genre);
            $("#selected-actors").html(resp.actors);
            $("#selected-year").html(resp.year);
            $("#selected-rating").html(resp.rating);
            $(`#${indexToEdit}-card-rating`).html(resp.rating);
        })
        movieUpdated.catch(err => console.error(err));
    }

    function toggleNewMovieFormBtn(){
        if($(newTitleInput).val() !== "" && $(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).removeClass("disabled");
        } else if($(newTitleInput).val() === "" && !$(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).addClass("disabled");
        }
    }

    function createAMovieCard(movieData){
        if(!movieData.poster){
            movieData.poster = "../images/default-image.jpeg";
        }

        return `<div id="${movieData.id}" class="col my-4">
                  <div class="card text-bg-dark">
                    <img src="${movieData.poster}" class="card-img" alt="${movieData.title}">
                    <div class="card-footer bg-dark-subtle">
                      <p class="card-text d-flex justify-content-between text-body-secondary"><small class="mx-2">Rating</small><small id="${movieData.id}-card-rating" class="mx-2">${movieData.rating}</small></p>
                    </div>
                  </div>
                </div>`;
    }

    function addMovieCardToMovieDiv(cardString){
        $(movieRow).append(cardString);
    }


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
        updateMovieWithPatch.body = JSON.stringify(body);
        console.log(body);
        console.log(updateMovieWithPatch);
        console.log(updateMovieWithPatch.body);
        return new Promise((resolve, reject) => {
            fetch(`${url}/${id}`, updateMovieWithPatch)
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


    getAllMovies();
});