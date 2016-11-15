

// get SDK on website
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1169046513184555',
      xfbml      : true,
      version    : 'v2.8',
      status     : true
    });

    FB.Event.subscribe('auth.statusChange', statusChange_callback);

    function statusChange_callback(response) {
      console.log("auth_response_change_callback");
      console.log(response);
    }

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log(response);
      }
      else if (response.status === 'not_authorized') {
        console.log(response);
      }
      else {
        console.log(response);
      }
    })
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  var accessToken = function getAccessToken(){
    FB.getLoginStatus(function(response){
      if (response.status === 'connected') {
        accessToken = response.authResponse.accessToken;
      }
      else {
        FB.login();
      }
    });
  };

  function postNewFeed() {
    FB.api('/me/feed', 'post', {access_token: accessToken, message:"I am a new post!"}, function(response) {
      if (response.error) {
        FB.login(function(response) {
          console.log("updated access token");
        }, {scope:'publish_actions'});
        postNewFeed();
      }
    });
  }

  function commentFeed() {
    FB.api('/me/feed', 'get', function(response) {
      if (response.error) {
        FB.login(function(response) {
          console.log("updated access token");
        }, {scope:'user_posts'});
        commentFeed();
      }
      else {
        var feedID = response.data[0].id + "/comments";
        FB.api(feedID, 'post', {access_token: accessToken, message: "I am a comment to a post"});
      } 
    });
  }

  function commentToComment() {
    FB.api('/me/feed', 'get', {fields:'comments'}, function(response) {
      if (response.error) {
        FB.login(function(response) {
          console.log("updated access token");
        }, {scope:'user_posts'});
        commentToComment();
      }
      else {
        var commentID = response.data[0].comments.data[0].id;
        var commentIDString = commentID + "/comments";
        FB.api(commentIDString, 'post', {access_token: accessToken, message:"I am a comment to a comment", parent: commentID});
      }
    })
  }







