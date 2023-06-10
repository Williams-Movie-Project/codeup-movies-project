"use strict";

$(document).ready(function() {
    // Global Variables
    const newSubmitBtn = $("#submit-new-movie-btn");
    const newTitleInput = $("#new-title");
    const newRatingSelection = $("#new-movie-rating");

    // Static Event Listeners
    $(newSubmitBtn).on("click", submitNewMovieForm);
    $(newTitleInput).on("input", toggleNewMovieFormBtn);


    // TODO build out function
    function submitNewMovieForm(e){
        e.preventDefault()
        console.log("submit button was clicked");
        const formBody = {title: $(newTitleInput).val(), rating: $(newRatingSelection).val()}
        const movAddedResp = addMovies(formBody);
        movAddedResp.then(resp => console.log(resp));
        movAddedResp.catch(err => console.log(err));
    }

    function toggleNewMovieFormBtn(){
        if($(newTitleInput).val() !== "" && $(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).removeClass("disabled");
        } else if($(newTitleInput).val() === "" && !$(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).addClass("disabled");
        }
    }

    const movByID = getMovieByID(5);
    movByID.then(resp => console.log(resp));
    movByID.catch(err => console.error(err));


});