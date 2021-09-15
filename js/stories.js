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

function generateStoryMarkup(story, favorites) {
  console.debug("generateStoryMarkup", favorites);
  
  const hostName = story.getHostName();
  let favoriteIds = [];
  favorites.forEach((favStory) => {

    return favoriteIds.push(favStory.storyId);
  })


  let cls;
  if (favoriteIds.includes(story.storyId)) {
    cls = "fas"
  } else {
    cls = " "
  }

  return $(`
      <li id="${story.storyId}">
     <span class="star"><i class="far fa-star ${cls}"></i></span>
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
  
  let favorites;
  if (currentUser) {
    favorites = currentUser.favorites;

  } else {
    favorites = [];
  }

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  console.groupCollapsed()
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story, favorites);
    $allStoriesList.append($story);
  }
  console.groupEnd()

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


  let result = await storyList.addStory(currentUser, newStory);
  $storyForm.slideUp("slow");
  $storyForm.trigger("reset");
  let markUp = generateStoryMarkup(result, []);
  let $markUp = $(markUp);
  $allStoriesList.prepend(markUp)
}

$storyForm.on('submit', (evt) => {
  evt.preventDefault()
  submitStory();
})
/** Remove Story from Form  */

async function removeStory(storyId) {
  console.debug('removeStory');
  await storyList.removeStory(storyId,currentUser.loginToken)
}



async function changeIcon(evt) {
  console.debug(`changeIcon`);
  const $tg = $(evt.target);
  const storyId = $tg.closest('li').attr('id');
  const $i = $tg.closest('i');
  if (!currentUser) {
    alert(`You'll need to sign in to favoite an article :) `)
    return;
  }
  if ($i.attr('class').includes('fas')) {
    $i.removeClass('fas');
    currentUser.removeFavorite(storyId, currentUser.loginToken);

  } else {
    $i.addClass('fas')
    let favorite = await currentUser.addFavorite(storyId,currentUser.loginToken);
  }
}
/*
async function removeFavorite(user,storyId){
  try{
    let result = await axios({
      url:`${BASE_URL}/users/${user.username}/favorites/${storyId}`,
      method:"DELETE",
      data:{token:user.loginToken}
    })
    return result
  }catch(e){

  }
}
*/
$('#all-stories-list').on('dblclick', changeIcon)