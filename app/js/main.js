var server_endpoint = "http://localhost:8000";
var count = [];
var classified = [];
count['Arts']=0;
count['Games']=0;
count['Computers'] = 0;
count['Recreation'] = 0;
count['Sports']=0;
count['Science']=0;
count['Society'] = 0;
count['Home'] = 0;
count['Health']=0;
count['Business']=0;
var myChart;
function onAuthenticated(token, authWindow) {
  $('#loading').show();
  if (token) {

    (function($){

      var odurl = "https://api.onedrive.com/v1.0/drive/root:/Documents/:";
      var odquery = "?expand=thumbnails,children(expand=thumbnails(select=large,c200x150_Crop))&access_token=" + token;

      $.ajax({
        url: odurl + odquery,
        dataType: 'json',
        success: function(data) {
          if (data) {
            console.log(data);
            var children = data.children;
            // $.each(children, function(i, item) {
            var delay = 500;
            function callAjax() {
                // check to see if there are id's remaining...
                if (children.length > 0)
                {
                    console.log(children.length);
                    // get the next id, and remove it from the array...
                    var item = children[0];
                    console.log(item);
                    children.shift();
                    var item_id = item.id;
                    var name = item.name;
                    var url = item['@content.downloadUrl'];
                    $.get(url, function(text){
                      try{
                        $.ajax({
                            cache : false,
                            type: "POST",
                            url: 'http://127.0.0.1:5000/GetCategories',
                            data: {text: text, name:name},
                            dataType: "json",
                            // jsonp: false,
                            async: false,
                            success: function (response) {
                              if(response['success'] == 1 ){
                                var cat = response['folder_name'];
                                console.log(cat);
                                classified.push([item_id, cat]);
                                var fname = response['name'];
                                var tag_list = response['tags'];
                                var id_name = '#' + cat.toLowerCase() + '-content';
                                var tags = '';
                                $.each(tag_list, function(t,tg){
                                  // tags = tags + '<span> ' + tg + ' </span>'
                                  tags = tags + '<span class="btn btn-default btn-xl" style="float:right;margin:5px;"> ' + tg + ' </span>'
                                  // console.log(tg);
                                });
                                var item = '<div class="listitem"><span> ' + fname + '</span>' + tags + ' </div><hr style="width: 50%; text-align: center;">';
                                $(id_name).append(item);
                                count[cat]++;
                              }
                              else{
                                var cat = 'Arts';
                                var fname = name;
                                var id = '#declutter-content';
                                var tags = '';
                                var item = '<div class="listitem"><span> ' + fname + '</span> couldn\'t be classified </div>';
                                $(id).append(item);
                              }
                              setTimeout(callAjax, delay);
                            },
                            error: function(err) {
                              // alert(err);
                            }
                          });
                      } catch(err) {
                        // console.log('errdone');
                      }
                      console.log(name);
                    });
                  }
                if(children.length == 0){
                  // var cust_url = "https://api.onedrive.com/v1.0/drive/items/";
                  // for (var i = 0; i < classified.length; i++) {
                  //   var id = classified[i][0];
                  //   var access = "?access_token=" + token;
                  //   var path = "/drive/root:/Documents/" + classified[i][1];
                  //   $.ajax({
                  //     headers: {'Content-Type':'application/json'},
                  //     url: cust_url + id + access,
                  //     type: 'PATCH',
                  //     data: { "parentReference" : {"path": path}},
                  //     dataType: "json",
                  //     success: function(response) {
                  //       console.log("Moved to " + response['name']);
                  //     },
                  //     error : function(jqXHR, textStatus, errorThrown) {
                  //       console.log("The following error occured: " + textStatus, errorThrown);
                  //     }
                  //   });
                  // }
                  $('#loading').hide();
                  $('#done').show();
                  var data = {
                    labels: [
                      "Arts",
                      "Business",
                      "Computers",
                      "Games",
                      "Health",
                      "Home",
                      "Society",
                      "Science",
                      "Sports",
                      "Recreation"
                    ],
                    datasets: [
                      {
                        data: [
                        count['Arts'],
                        count['Business'],
                        count['Computers'],
                        count['Games'],
                        count['Health'],
                        count['Home'],
                        count['Society'],
                        count['Science'],
                        count['Sports'],
                        count['Recreation']
                      ],
                        backgroundColor: [
                          "#CE57A0 ",
                          "#00AEEF",
                          "#00FE9C",
                          "#78C5EE",
                          "#00B48D",
                          "#FF6D00",
                          "#8252B1",
                          "#F1583E",
                          "#ABB48D",
                          "#F16690"
                        ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FF6384",
                "#FFCE56"
            ]
        }]
};

                  //          var pieData = [
                  //          {
                  //     value: count['Arts'],
                  //     color:"#ce57a0 ",
                  //     highlight: "#FF5A5E ",
                  //     label: "Art"
                  // },
                  //  {
                  //     value: count['Business'],
                  //     color:"#00aeef ",
                  //     highlight: "#FF5A5E ",
                  //     label: "Business"
                  // },
                  //
                  // {
                  //     value: count['Computers'],
                  //     color: "#00fe9c ",
                  //     highlight: "#FFC870 ",
                  //     label: "Computers"
                  // },
                  // {
                  //     value: count['Society'],
                  //     color:"#78c5ee ",
                  //     highlight: "#FF5A5E ",
                  //     label: "Social"
                  // },
                  // {
                  //     value: count['Science'],
                  //     color:"#00b48d ",
                  //     highlight: "#FF5A5E ",
                  //     label: "Science"
                  // },
                  // {
                  //     value: count['Recreation'],
                  //     color:"#ff6d00 ",
                  //     highlight: "#FF5A5E ",
                  //     label: "Recreation"
                  // },
                  // {
                  //     value: count['Sports'],
                  //     color:"#8252b1 ",
                  //     highlight: "#FF5A5E ",
                  //     label: "Sport"
                  // },
                  //
                  //
                  // {
                  //     value: count['Games'],
                  //     color:"#f1583e ",
                  //     highlight: "#FF5A5E ",
                  //     label: "Games"
                  // },
                  // {
                  //     value: count['Health'],
                  //     color: "#abb48d ",
                  //     highlight: "#5AD3D1 ",
                  //     label: "Health"
                  // },
                  // {
                  //     value: count['Home'],
                  //     color: "#f16690 ",
                  //     highlight: "#FFC870 ",
                  //     label: "Home"
                  // }
                  //
                  //    ];
                     var ctx = document.getElementById("myChart");
                     ctx.innerHTML = "";
                     var myDoughnutChart = new Chart(ctx, {
                       type: 'doughnut',
                       data: data
                     });
                     console.log(myDoughnutChart);
                   $('#myChart').show();
                }
            }
            callAjax();
            // });

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
// odauth();

function list_files() {
  $.get('')
}
// console.log('end');
