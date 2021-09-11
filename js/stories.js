"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let favorites=[];
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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
     <span class="star"> <i class="far fa-star"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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


/** Submit story from form */

async function submitStory() {

  let form = $storyForm;
  let newStory = {
    title: `${form[0][0].value}`,
    author: `${form[0][1].value}`,
    url: `${form[0][2].value}`
  }

  console.log(newStory)
  let result = await storyList.addStory(currentUser, newStory);
  $storyForm.slideUp("slow");
  $storyForm.trigger("reset");
}

$storyForm.on('submit', (evt) => {
  evt.preventDefault();
  submitStory()
})


async function changeIcon(evt) {
  console.log(`changeIcon`);
  const $tg=$(evt.target);
  const storyId = $tg.closest('li').attr('id');
  const $i = $tg.closest('i');
  $i.addClass('fas')
  if(!favorites.includes(storyId)){
    let favorite=await storyList.addFavorite(currentUser,storyId);
    favorites.push(favorite.id)
  }
}


$('#all-stories-list').on('dblclick', changeIcon)