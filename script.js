

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





