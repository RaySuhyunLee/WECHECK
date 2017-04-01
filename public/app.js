var isPlaying = false;
var randomComment = null;
var isFactChecking = false;

var MyApp = angular.module('MyApp', []);

MyApp.controller('CommentController', ($scope) => {
  $scope.comments = [];
  $scope.best_comments = [];
  $scope.agrees = 0;
  $scope.disagrees = 0;
  var comments = [];
  $.get('/static/comments.csv', (data) => {
    var results = Papa.parse(data);
    results.data.forEach((d) => {
      comments.push({
        agree: d[0],
        author: d[1],
        content: d[2],
        like: d[3]
      });
    });
  });

  $scope.add = function(agree) {
    var content = $('textarea#form_content').val();
    if (!content || content === '') return;
    var comment = {
      agree: agree,
      author: "개발자",
      content: content,
      like: 0
    };
    $scope.comments.unshift(comment);
    $scope.update();
  }

  $scope.randomComment = function() {
    if (!isPlaying) return;
    var newComment = comments.shift();
    if (!newComment) return;
    if (!isFactChecking && newComment.agree != 0) {
      comments.unshift(newComment);
      setTimeout($scope.randomComment, 1000);
      return;
    }

    if (newComment.agree == 1)
      $scope.agrees += 1;
    else if (newComment.agree == -1)
      $scope.disagrees += 1;

    if (newComment.like > 0) {
      $scope.best_comments.push(newComment);
    } else {
      $scope.comments.unshift(newComment);
    }
    $scope.update();
    setTimeout($scope.randomComment, Math.round((Math.random() * 800)));
  }
  randomComment = $scope.randomComment;

  $scope.update = function() {
    $scope.$apply();
   
    // set gauge
    var sum = $scope.agrees + $scope.disagrees;
    var newVal = sum > 0 ? $scope.disagrees/sum*180 : 90;
    $('.gauge--1 .semi-circle--mask').attr({
      style: '-webkit-transform: rotate(' + newVal + 'deg);' +
      '-moz-transform: rotate(' + newVal + 'deg);' +
      'transform: rotate(' + newVal + 'deg);'
    });
  }

  $scope.getPercentage = function(value) {
    var sum = $scope.agrees + $scope.disagrees;
    return sum > 0 ? Math.round((value / sum) * 100) : 0;
  }
});
