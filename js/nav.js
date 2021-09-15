"use strict";

//const { assertExpressionStatement } = require("@babel/types");

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $navLogin.removeClass('hidden');
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show()
  $signupForm.show()
  //$signupForm.toggle();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navUserProfile.text(`${currentUser.username}`).show();

  $navLogin.hide();
  $navLogOut.show();
  $loginForm.hide();
  $signupForm.hide();
  $login.show()
  $nav_login.show()
}

//** Update DOM to show Story Form */

function showStoryForm() {
  console.debug(`show form`);
  $storyForm.toggle(()=>{
    $storyForm.slide()
  })
}

$navSubmit.on('click', showStoryForm)