"use strict";

$(document).ready(function() {
    // Global Variables
    const newSubmitBtn = $("#submit-new-movie-btn");
    const newTitleInput = $("#new-title");

    // Static Event Listeners
    $(newSubmitBtn).on("click", submitNewMovieForm);
    $(newTitleInput).on("input", toggleNewMovieFormBtn);


    // TODO build out function
    function submitNewMovieForm(e){
        e.preventDefault()
        console.log("submit button was clicked");
    }

    function toggleNewMovieFormBtn(){
        if($(newTitleInput).val() !== "" && $(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).removeClass("disabled");
        } else if($(newTitleInput).val() === "" && !$(newSubmitBtn).hasClass("disabled")){
            $(newSubmitBtn).addClass("disabled");
        }
    }

});