function onAuthenticated(token, authWindow) {
  if (token) {

    (function($){
      
      var odurl = "https://api.onedrive.com/v1.0/drive/root:/Documents/:";
      var odquery = "?expand=thumbnails,children(expand=thumbnails(select=large,c200x150_Crop))&access_token=" + token;

      $.ajax({
        url: odurl + odquery,
        dataType: 'json',
        success: function(data) {
          if (data) {
            var children = data.children;
            $.each(children, function(i, item) {
              var url = item['@content.downloadUrl'];
              $.get(url, function(text){console.log(text);});
            });
          } else {
            alert("Data not recieved");
          }
        }
      });
    })(jQuery);
  }
  else {
    alert("Error signing in");
  }
}
odauth();