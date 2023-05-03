personal project

v0.4.0
\*Administrator and Moderator dashboards:
-API changes:
·added another layer of user's roles (in the past, only logged user and guest user -mostly on the frontend-). Moderators can review and softDeleted flagged memes. Administrators can delete any meme and ban users.
·added endpoints to give mod/admin powers to users (with Mod and Admin middleware checkers).
·added new properties to Memes and User collections (isReviewed, isFlagged, flagCounter, isBanned).
·added methods and endpoints to give administrator and moderators the ability to Review, soft Delete memes and the ability to ban an user (admin only).
·added tags, memes and user collection's counter to help the frontend to track data in the admin dashboard.
·added flagged memes, and softdeleted&&flaggedMemes&&reviewedMemes counter to help the frontend to track data useful for the pagination.
·Changed user data sended to the frontend with a new endpoint for get top5/10 user data. No private data is shared this way with guests and logged users. TODO: check the other endpoints to avoid send private data to the frontend.
-WebClient changes:
·Added Mod and Admin options to the lateral menu. Added admin/mod dashboards with tables to help them to manage the site (moderate memes and manage user data). TODO: think about how moderators can ban users.
·Added admin/mod checker in router to avoid guest/logged users to enter each other dashboards' routes.
·Removed the right lateral menu in admin dashboard view to get more space to visualize data.
·Added the ability to check flagged memes and remove/review them (review is a way to distinct already moderated memes from those memes without moderation).
·Added the ability to give users mod/admin powers.
·Added the ability to ban users in admin dashboard.

        -Fixes / UX-UI changes:
            ·Removed fixed css style from the laterals menus to allow the ability to make a better responsive desing.
            ·Removed tailwind custom screen sizes to defaults ones to ajust the general responsive design.
            ·Removed overflow-x-scroll bar from main view.
            ·Fixed top user not showing after user's authorization changes.
            ·Many minor bug fixes.

v0.3.0

\*Meme generator:
-WebClient changes:
·Added the first implementation of the meme generator. Users now can choise a image and added some text dialog on them. Then, can add tags and create a new meme (powered by dom-to-image library).
·Changed the meme generator dialog layout to add the tag section.

v0.2.2

\*Bug fixes and UX-UI changes:
-WebClient changes:
·Fixed loop counter mismatch.
·Added @ icon in user profile editor.
·Added not user modal to inform guest users they have to log in to use features like loop, comment, publish, like, follow users, etc.
·Fixed a lot of responsive design bugs.
·Change the lateral menu to hide profile options for guest users.
·Changed "Subir Meme" label in upload image modal to avoid confusion with the upper button with the same label in the modal.
·Fixed nav login/logout button doesnt working.

v0.2.1
\*Bug fixes and UX-UI changes:
-WebClient changes:
·Changed styles and layout in the callback component.
·Added validations to user profile editor and callback form.
·Added infinite scroll to memeList component to ease the load of data from the API (changed to load 10 memes per cycle).
·Refactir code to do less queries to the API.
·Changed like and loop meme functions to instantly change their icon's style to get give a instant feedback to the user (without waiting for the API response).
·Fixed tag selector look and feel in the upload meme modal in small screens.
·Added a rule to avoid select the same tag twice.
·Many quick fixes for many production bugs.
·Fixed custom tags dont showing in memecards.
-API changes:
·Added top tags endpoint to get all tags with at least 1 like

v0.2.0
\*First testeable production version
-WebClient changes:
·Fixed login issues in the frontend in production.
·Added the ability to see followers in user profile (friends modal).
·Added .jpg/.png file validations in upload meme and edit profile.
·Added flowbite's dropdzone components to upload meme and user profile editor.
·LOOP AND FOLLOW!: Added loop meme and follow user implementation.
·TRENDS: Added Trends tracker component to show trending tags and top users.
·SEARCHER: Added a search bar in the lateral bar and a search bar component to search tags and users.
·Added tab navigation in trends and searcher sections.
·Added top 5 tags and users trackers in the right section of the main page.
·NOTIFICATIONS: Added notifications section to track user's new notifications. Added the ability to mark checked notifications. Added a notication tracker pill in the Notification option in the side menu. There are four type of notifications: like and loop (same layout), new followers and new comments. Added meme's previews in meme type notifications.
·Added a 1 min loop to fetch trend data and notifications.
·Added guest user ability to navigate the web without going back to the landing page.
·Changed overall layout style and colors.
·CUSTOM TAGS: Added a new tag section in upload meme with two tabs for the base and the new custom tag implementation. Added a custom tag searcher and the ability to create a custom tag after the search if no exact match was found. Changed base tag to dynamic change style between custom or normal tags.
·Added the ability to go to the user profile in top users lists.
·Added routerlinks to options in navigation side and mobile menues.
·Added tag search on tag click.
·Changed profile user editor style.
·Added axios interceptors and cors headers in main.ts.
·Changed date format for birthdays in profile user view.

    -API changes:
        ·Search: Users can type a text in a input and search for tags, usernames and nicknames.
        ·Top tags and user endpoints to track the trends in the frontend.
        ·Added loop meme function.
        ·Added follow/unfollow users function.
        ·Added follows/followers users counter and an endpoint to retrieve it.
        ·Added the implementation for the custom tags. Users can create tags and save them to the db.
        ·Added loop and like individual counters (instead of fetching all liked/looped memes to make a .length).
        ·Added notification implementation. New models, routs and controllers.
        ·Added a rewrite old values prevention in update user information when the user doesn't new data.
        ·Changed getAll users order from userId to likeCounter.
        ·Added DTO pattern to the user's list the client get.
        ·Changed passport user configuration to send only email and googleId.




    -Bug fixes:
        ·Prevent user to send a notification to himself.
        ·Fixed meme list not uploading after a search.
        ·Fixed selected tags not showing the tag class tyle.
        ·Fixed owner liking his own memes not triggering the like counter.
        ·Fixed userId already declared in user.model.
        ·Fixed responsive design in landing page.
        ·Fixed API's upload image function.
        ·Fixed API's oauth2 related bugs.
        ·Fixed like button making excesive API's calls.
        ·Fixed passport's cookie configuration related bugs.

0.1.0
\*First deployed version with many many issues but basic implementation for main features:
-Main Features:
·Home view with a lateral navigation menu (with home, profile, publish meme, login/logout buttons), main view for the meme list component.
·Added Profile component. With the ability to edit information, a banner, profile picture and user information, a navigation bar to choose between user's memes, likes memes and comments.
·Landing page
·Callback form to fetch some user informaton.
·Upload meme modal. Give to the user the ability to upload a image from his device and pick some tags to make a meme.
·Responsive design: added mobile navigation menu.
·API: MongoDb. Oauth2 with google. Tag, user and meme models, controllers and routes. Basic security configuration. Basic CRUD implementations. Added the connection to the image host to upload and storage images on the cloud.
