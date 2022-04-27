$('form').on('submit', function(e){
    e.preventDefault();
    const newMovieInput = $('#movie').val();
    const newRating = $('#rating').val();
    const newLi = $('<li></li>')
    const removeButton = $('<button id= "newButton">Remove</button>')

    $(removeButton).on('click', function(){
        $(removeButton).parent().remove()
    }) 
    
    $(newLi).append('Movie:' + newMovieInput, ' Rating:' + newRating);
    $(newLi).append(removeButton);
    $('ul').append(newLi);
})


