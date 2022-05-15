"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showTrash = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showTrash ? makeTrashcan() : ""}
      ${showStar ? makeStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function makeStar(story, user){
  console.debug('makeStar')
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
  <span id="star">
    <i class="${starType} fa-star"></i>
  </span>`
}

function makeTrashcan(){
  return `
  <span id="trash">
    <i class="fas fa-trash-alt"></i>
  <span>`
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function deleteStory(evt){
  console.debug("deleteStory");

  const $li = $(evt.target).closest("li");
  const storyId = $li.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putStoriesOnPage();
}

$body.on("click", "#trash", deleteStory);

async function submitStoryForm(e){
  console.debug("submitStoryForm", e);
  e.preventDefault();

  const author = $("#new-author").val();
  const title = $("#new-title").val();
  const url = $("#story-url").val();
  const user = currentUser.username;
  const storyInfo = {title, author, url}
  // console.log(storyInfo);

  const newStory = await storyList.addStory(currentUser, storyInfo)
  const postableStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend(postableStory);

  //https://stackoverflow.com/questions/16452699/how-to-reset-a-form-using-jquery-with-reset-method
  $("#new-story-form").trigger('reset')
  $("#new-story-form").hide()
  

}

$submitStoryForm.on("submit", submitStoryForm)

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoriteStories.empty();

  if(currentUser.favorites.length === 0) {
    $favoriteStories.append("<b>There are no favorited stories!</b>")
  } else {
    for (let favorite of currentUser.favorites) {
      const $favorite = generateStoryMarkup(story);
      $favoritedStories.append($favorite);
    }
  }
  $favoriteStories.show();
}


async function favoriteOrUnfavorite(evt){
  console.debug("favoriteOrUnfavorite");

  const $target = $(evt.target);
  const $li = $target.closest('li');
  const storyId = $li.attr("id");
  const story = storyList.stories.find(e => e.storyId === storyId);
  // const story = storyList.stories.find(function(s){
  //   return s.storyId === storyId;
  // });


  if($target.hasClass("fas")){
    await currentUser.deleteFavorite(story);
    $target.closest('i').toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest('i').toggleClass("fas far");
  }
}

$body.on("click", "#star", favoriteOrUnfavorite);


function postUsersOwnStories(){
  console.debug("postUsersOwnStories");

  $myStories.empty();
  console.log(currentUser.ownStories)

  if(currentUser.ownStories.length === 0){
    $myStories.append("<b>No stories yet!</b>");
  } else{
    for(let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
  }
  $myStories.show();
}