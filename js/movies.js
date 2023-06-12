"use strict";

$(document).ready(function() {
    // Global Variables
    const newSubmitBtn = $("#submit-new-movie-btn");
    const newTitleInput = $("#new-title");

    // Static Event Listeners
    $(newSubmitBtn).on("click", submitNewMovieForm);
    $(newTitleInput).on("input", toggleNewMovieFormBtn);
    $("#delete-movie").on("click", deleteSelectedMovie);

    function showLoader(){
        $("#loader-div").removeClass("d-none");
        $("#movie-container").addClass("d-none");
    }

    function hideLoader(){
        $("#loader-div").addClass("d-none");
        $("#movie-container").removeClass("d-none");
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
        showLoader();
        const formBody = {title: $(newTitleInput).val()}
        const movAddedResp = addMovies(formBody);
        movAddedResp.then(resp => {
            addMovieCardToMovieDiv(createAMovieCard(resp));
            addClickEventToCards(resp.id);
            hideLoader();
            $(newTitleInput).val("");
        });
        movAddedResp.catch(err => console.error(err));
    }

    function addClickEventToCards(cardID){
        $(`#${cardID}`).on("click", function (){
            $("#open-canvas").click();
            let movieByID = getMovieByID(cardID);
            movieByID.then(resp => {
                $("#offcanvas-movie-title").html(`${resp.title}`);
                $("#offcanvas-movie-plot").html(`${resp.plot}`);
                $("#offcanvas-movie-genre").html(`Genre(s): ${resp.genre}`);
                $("#offcanvas-movie-actors").html(`Actor(s): ${resp.actors}`);
                $("#offcanvas-movie-year").html(`Year: ${resp.year}`);
                $("#offcanvas-movie-rating").html(`Rating: ${resp.rating}`);
                $("#offcanvas-movie-id").html(resp.id);
            });
            movieByID.catch(err => console.error(err));
        })
    }

    function deleteSelectedMovie(e){
        e.preventDefault();
        const indexToDelete = parseInt($("#offcanvas-movie-id").text());
        const movieDeleted = deleteMovieByID(indexToDelete);
        movieDeleted.then(resp => {
            $("#open-canvas").click();
            $(`#${indexToDelete}`).remove();
        })
        movieDeleted.catch(err => console.error(err));
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
        $("#movie-row").append(cardString);
    }

    getAllMovies();
});