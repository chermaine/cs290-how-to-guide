
  function checkLoginStatus() {
    var accessToken;
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        accessToken= response.authResponse.accessToken;
      }
      else {
        alert('Please login to continue');
        while (flag>0) {
          FB.login(function(res) {
           accessToken= res.authResponse.accessToken;
          });
          flag = 0;
        }
      }
    });
    flag = 1;
    return accessToken;
  }

  function updateAccessToken(value) {
    FB.login(function(response){
    },{scope:value});
    return 0;
  }

  var flag = 1;

  function postNewFeed() {
    var mes = document.getElementById('new-feed').value;
    var accessToken = checkLoginStatus();
    FB.api('/me/feed', 'post', {access_token:accessToken, message:mes}, function(response) {
      if (response.error) {
        alert('Please give permission to post and try again!');
        while (flag > 0) {
          flag = updateAccessToken('publish_actions');
        }
      }
      else {
        alert('Feed posted successfully');
      }
    });
    flag = 1;
  }

  function commentFeed(){
    var accessToken = checkLoginStatus();
    var mes = document.getElementById('feed-comment').value;
    FB.api('/me/feed', 'get', function(response) {
      console.log(response);
      if (response.data.length == 0) {
        alert('Please give permission to access your posts and try again!');
        while (flag > 0) {
          flag = updateAccessToken('user_posts');
        }
      }
      else {
        var feedID = response.data[0].id;
        var feedIDString = feedID + "/comments";
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

  function commentToComment() {
    var accessToken = checkLoginStatus();
    var mes = document.getElementById('comment-comment').value;
    FB.api('/me/feed','get',{fields:'comments'}, function (response) {
      console.log(response);
      if (response.data.length === 0) {
        alert('Please give permissible to access your posts and try again');
        while (flag > 0) {
          flag = updateAccessToken('user_posts');
        } 
      }
      else {
        var commentID = response.data[0].comments.data[0].id;
        var commentIDString = commentID + "/comments";
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
  }


