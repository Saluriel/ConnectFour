// console.log("Let's get this party started!");
const form = document.querySelector('#searchForm');
const gifSpot = document.createElement('DIV');
gifSpot.classList = 'gifSpot'
form.append(gifSpot);



async function getGif(searchTerm){
    const link = `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym`;
    const res = await axios.get(link);
    // console.log(res.data)
    addGif(res.data)
}

function addGif(res){
    const randomNum = Math.floor(Math.random() * (res.data.length))
    const newImg= document.createElement('IMG')
    //tried just .url at first and it kept giving me an error
    newImg.src = res.data[randomNum].images.original.url
    gifSpot.append(newImg)
}



const input = document.querySelector('#textInput');
form.addEventListener('submit', function(e){
    e.preventDefault();
    getGif(input.value);
    input.value = '';
})

const removeButton = document.querySelector('#removeButton')
removeButton.addEventListener('click', function(e){
    e.preventDefault();
    //https://api.jquery.com/empty/
    $(gifSpot).empty();
})