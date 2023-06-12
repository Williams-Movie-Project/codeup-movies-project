"use strict";

$(document).ready(function() {
    // Global Variables
    const newSubmitBtn = $("#submit-new-movie-btn");
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


    // Static Event Listeners
    $(newSubmitBtn).on("click", submitNewMovieForm);
    $(newTitleInput).on("input", toggleNewMovieFormBtn);
    $(deleteMovBtn).on("click", deleteSelectedMovie);
    $(editMovBtn).on("click", editSelectedMovieData);

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
                $(offCanMovGenre).html(`Genre(s): ${resp.genre}`);
                $(offCanMovActors).html(`Actor(s): ${resp.actors}`);
                $(offCanMovYear).html(`Year: ${resp.year}`);
                $(offCanMovRating).html(`Rating: ${resp.rating}`);
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

    function editSelectedMovieData(e){
        e.preventDefault();
        const indexToEdit = parseInt($(offCanMovID).text());

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
                      <p class="card-text d-flex justify-content-between text-body-secondary"><small class="mx-2">Rating</small><small class="mx-2">${movieData.rating}</small></p>
                    </div>
                  </div>
                </div>`;
    }

    function addMovieCardToMovieDiv(cardString){
        $(movieRow).append(cardString);
    }

    getAllMovies();
});