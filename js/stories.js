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
  <section id="${story.storyId}">
      <li id="${story.storyId}">
     <span class="star"><i class="far fa-star ${cls}"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
      <button type="button" id="${story.storyId}" class="btn btn-primary">Remove</button>
     </section> 
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

async function putFavoritesOnPage() {
  console.debug('putFavoritesOnPage');
  try {

    
    let favorites = await User.getFavorites(currentUser.loginToken, currentUser.username);

    $allStoriesList.empty();

    if (favorites == []) {
      let msg = '<p>Hmm, you have no favorites</p>';
      $allStoriesList.append(msg)
      return;
    }

    // loop through all of our stories and generate HTML for them

    favorites.forEach((favorite) => {
      let $markup = $(`
      <section id="${favorite.storyId}">
          <li id="${favorite.storyId}">
         <span class="star"><i class="far fa-star fas"></i></span>
            <a href="${favorite.url}" target="a_blank" class="story-link">
              ${favorite.title}
            </a>
            <small class="story-hostname">(${favorite.url})</small>
            <small class="story-author">by ${favorite.author}</small>
            <small class="story-user">posted by ${favorite.username}</small>
          </li>
         </section> 
        `);
      $allStoriesList.append($markup)
    })
    return $markUp

  } catch (e) {
    return e
  }
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
  currentUser.ownStories = result;
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

async function removeStory(evt) {
  try {

    let $tg = $(evt.target);
    let storyId = $tg.attr('id')
    let response = await storyList.removeStory(storyId, currentUser.loginToken)
    currentUser.ownStories= currentUser.ownStories.filter(s => s.storyId !== storyId)
    console.log(currentUser.ownStories)
    let $section = $(`section[id="${storyId}"]`);
    $section.remove();

    return response

  } catch (e) {
    return e
  }
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
    return currentUser.removeFavorite(storyId, currentUser.loginToken);

  } else {
    $i.addClass('fas')
    let favorite = await currentUser.addFavorite(storyId, currentUser.loginToken);
  }
}
$favPage.on('click', putFavoritesOnPage)

$('#all-stories-list').on('click',async (evt)=>{
  
  if(evt.target.type == 'button'){
    removeStory(evt)
    return;
  }
  if(evt.target.attributes[0].value == "far fa-star fas" || "far fa-star"){
    currentUser.favorites = await changeIcon(evt)
  }



})