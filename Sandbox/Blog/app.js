(function () {
    "use strict";
    angular.module("BlogApp", [])
        .controller("PostListController", PostListController)
        .controller("PostShowController", PostShowController)
        .service("PostService", PostService)
        .filter('trusted',
            function ($sce) {
                return function (ss) {
                    return $sce.trustAsHtml(ss)
                };
            }
        );


    PostListController.$inject = ["$scope", "PostService"];

    function PostListController($scope, PostService) {
        var listCtrl = this;
        listCtrl.posts = PostService.getPosts();

        listCtrl.loadPost = function (index) {
            PostService.loadPost(index);
        };
    }

    PostShowController.$inject = ["$interval", "PostService"];

    function PostShowController($interval, PostService) {
        var showCtrl = this;
        showCtrl.post = PostService.loadPost(0); // init, load up the first post;
        showCtrl.progress = {value: 0};

        /* HOW do I get showCtrl.post to update after PostService.loadPost is called? */
        $interval(function () {
            //showCtrl.progress.value = 100;
            showCtrl.post = PostService.getCurrentPost();
            // $interval(function(){
            //     showCtrl.progress.value = 0;
            // }, 500, 1);

        }, 1000)
    }

    function PostService() {

        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = onAjaxRecieved;

        var service = this;

        // template
        var currentPost = {
            "title": "",
            "published": "",
            "htmlBody": ""
        };

        // List of shopping items
        var posts = [];
        posts.push({"title": "Pi ^ 96", "published": "Feb-16-2018", "file": "posts/1.html"});
        posts.push({"title": "2nd Post", "published": "Feb-16-2018", "file": "posts/2.html"});
        posts.push({"title": "Chicken Dinner!", "published": "Feb-16-2018", "file": "posts/3.html"});

        service.getPosts = function () {
            return posts;
        };

        service.loadPost = function (index) {
            index = index || 0;
            var post = service.getPosts()[index];

            currentPost = {
                "title": post.title,
                "published": post.published,
                "htmlBody": "-- reading --"
            };

            ajax.open("GET", (location.href.substr(0, location.href.lastIndexOf("/")) + "/" + post.file), true);
            ajax.send();
        };

        service.getCurrentPost = function () {
            return currentPost;
        };

        function onAjaxRecieved() {
            if (ajax.status == 200 && ajax.readyState == 4) {
                currentPost.htmlBody = ajax.responseText;
            }
        }
    }
})();
