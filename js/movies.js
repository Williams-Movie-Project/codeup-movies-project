"use strict";

$(document).ready(function() {
    // Global Variables
    const newSubmitBtn = $("#submit-new-movie-btn");
    const newTitleInput = $("#new-title");
    const newRatingSelection = $("#new-movie-rating");

    // Static Event Listeners
    $(newSubmitBtn).on("click", submitNewMovieForm);
    $(newTitleInput).on("input", toggleNewMovieFormBtn);

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
            console.log(`inside of movies.js\n`);
            console.log(resp);
            if(resp){
                for(let i = 0; i < resp.length; i++){
                    addMovieCardToMovieDiv(createAMovieCard(resp[i]));
                }
            }
            hideLoader();
        });
        movies.catch((err => console.error(err)));
    }


    // TODO build out function
    function submitNewMovieForm(){
        showLoader();
        console.log("submit button was clicked");
        const formBody = {title: $(newTitleInput).val(), rating: $(newRatingSelection).val()}
        const movAddedResp = addMovies(formBody);
        movAddedResp.then(resp => {
            console.log(resp)
            addMovieCardToMovieDiv(createAMovieCard(resp));
            hideLoader();
        });
        movAddedResp.catch(err => console.log(err));
    }

    function toggleNewMovieFormBtn(){
        if($(newTitleInput).val() !== "" && $(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).removeClass("disabled");
        } else if($(newTitleInput).val() === "" && !$(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).addClass("disabled");
        }
    }

    function createAMovieCard(movieData){
        return `<div class="col my-4"
                  <div id="${movieData.id}" class="card text-bg-dark">
                    <img src="../images/default-image.jpeg" class="card-img" alt="No Image Default">
                    <div class="card-img-overlay">
                      <h5 class="card-title">${movieData.title}</h5>
                      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additionacontent. This content is a little bit longer.</p>
                    </div>
                    <div class="card-footer">
                      <p class="card-text text-body-secondary"><small>Rating: ${movieData.rating}</small></p>
                    </div>
                  </div>
                </div>`;
    }

    function addMovieCardToMovieDiv(cardString){
        $("#movie-row").append(cardString);
    }

    const movByID = getMovieByID(1);
    movByID.then(resp => console.log(resp));
    movByID.catch(err => console.error(err));


    getAllMovies();
});