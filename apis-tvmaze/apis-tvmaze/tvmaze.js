//https://api.tvmaze.com endpoint
// http://api.tvmaze.com/search/shows?q=<search query>
//http://api.tvmaze.com/shows/<show id>/episodes
"use strict";

//div
const $showsList = $("#showsList");
//section
const $episodesArea = $("#episodesArea");
const $episodesList = $('#episodesList');
const $searchForm = $("#searchForm");
const noImg = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const link = `http://api.tvmaze.com/search/shows?q=${term}`;
  const res = await axios.get(link);

  return res.data.map(function(result){
    return {
      id: result.show.id,
      name: result.show.name,
      summary: result.show.summary,
      image: result.show.image ? result.show.image.medium : noImg,
  };
})
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${show.image}
              alt=${show.name}
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  // console.log(shows)

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

 async function getEpisodes(id){
  const link = `http://api.tvmaze.com/shows/${id}/episodes`
  const res = await axios.get(link);
  // console.log(res.data)
  return res.data.map(result =>({
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number
  }));
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();

  for(let episode of episodes){
    const $episode = $(
      `<li>
       ${episode.name}
       (season ${episode.season}, episode ${episode.number})
     </li>
    `);
    $episodesList.append($episode);
  }
  //https://www.w3schools.com/jquery/eff_show.asp
  $episodesArea.show();
 }

 async function getEpisodesAndDisplay(e){
   //search the closest ancestor with the class of .Show that has a specific data attribute
   const showID = $(e.target).closest(".Show").data("show-id");
   const episodes = await getEpisodes(showID);
  //  console.log(episodes)
   populateEpisodes(episodes)
 }

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);