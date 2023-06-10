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
            hideLoader();
        });
        movies.catch((err => console.error(err)));
    }


    // TODO build out function
    function submitNewMovieForm(e){
        e.preventDefault()
        showLoader();
        console.log("submit button was clicked");
        const formBody = {title: $(newTitleInput).val(), rating: $(newRatingSelection).val()}
        const movAddedResp = addMovies(formBody);
        movAddedResp.then(resp => {
            console.log(resp)
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

    const movByID = getMovieByID(1);
    movByID.then(resp => console.log(resp));
    movByID.catch(err => console.error(err));


    getAllMovies();
});