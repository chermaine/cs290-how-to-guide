//check current login status of user and store access token if connected
  function checkLoginStatus() {
    var accessToken;
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        accessToken= response.authResponse.accessToken;
      }
      else {
        accessToken = '';
      }
    });
    return accessToken;
  }

//update access token with scope passed in
  function updateAccessToken(value) {
    FB.login(function(response){
    },{scope:value});
    return 0; // return 0 to indicate process completed
  }

//flag to ensure completion of function
  var flag = 1;

//post a new feed to user's wall.
  function postNewFeed() {
    //get message to post from input element in DOM
    var mes = document.getElementById('new-feed').value;
    //get user's access token
    var accessToken = checkLoginStatus();
    //POST request to post on user's wall
    FB.api('/me/feed', 'post', {access_token:accessToken, message:mes}, function(response) {
      //handling error occured
      if (response.error) {
        if (response.error.code === 506) {
          alert('Duplicate status update. Please try posting something different.');
        }
        else {
          alert('Please give permission to post on your wall and try again!');
          while (flag > 0) {
            //update access token to allow for publish_actions
            flag = updateAccessToken('publish_actions');
          }
        }
      }
      //feed posted successfully
      else {
        alert('Feed posted successfully');
      }
    });
    //reset flag to 1
    flag = 1;
  }

//add a comment to the most recent feed on user's wall
  function commentFeed(){
    //get access token and comment from DOM
    var accessToken = checkLoginStatus();
    var mes = document.getElementById('feed-comment').value;
    //send a GET request to obtain feed's id
    FB.api('/me/feed', 'get', function(response) {
      console.log(response);
      //if object returned is empty, update user's permission for user_posts
      if (response.data.length == 0) {
        alert('Please give permission to access your posts and try again!');
        while (flag > 0) {
          flag = updateAccessToken('user_posts');
        }
      }
      //handling data returned from GET request
      else {
        //get feed's id 
        var feedID = response.data[0].id;
        //get the path for where the POST request is to be sent
        var feedIDString = feedID + "/comments";
        //send POST request
        FB.api(feedIDString, 'post', {access_token: accessToken, message: mes}, function (res) {
          console.log(res);
          if (res.error) {
            alert('Error occured. Please try again!');
          }
          else {
            alert('Comment posted successfully');
          }
        });
      }
    });
    flag = 1;
  }

//add a comment to the first comment on the newest post
  function commentToComment() {
    var accessToken = checkLoginStatus();
    var mes = document.getElementById('comment-comment').value;
    //send GET request to get list of comments
    FB.api('/me/feed','get',{fields:'comments'}, function (response) {
      console.log(response);
      //if object returned is empty, update user's permission for accessing user_posts
      if (response.data.length === 0) {
        alert('Please give permissible to access your posts and try again');
        while (flag > 0) {
          flag = updateAccessToken('user_posts');
        } 
      }
      //handling object returned from GET request
      else {
        //get comment's id 
        var commentID = response.data[0].comments.data[0].id;
        //set POST request path
        var commentIDString = commentID + "/comments";
        //send POST request 
        FB.api(commentIDString, 'post', {access_token:accessToken, message:mes, parent: commentID}, function(res) {
          if (res.error) {
            alert('Error occured. Please try again');
          }
          else {
            alert('Comment posted successfully');
          }
        });
      }
    });
    flag = 1;
  }


