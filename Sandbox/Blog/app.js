(function () {
    "use strict";
    angular.module("BlogApp", [])
        .controller("BlogController", BlogController)
        .controller("PostListController", PostListController)
        .service("PostService", PostService)
        .filter('trusted',
            function ($sce) {
                return function (ss) {
                    return $sce.trustAsHtml(ss)
                };
            }
        );


    BlogController.$inject = ["$scope", "$timeout", "PostService"];

    function BlogController($scope, $timeout, PostService) {
        var blogCtrl = $scope;
        blogCtrl.currentPost = {
            title: "default",
            published: "unknown",
            htmlBody: "loading"
        };

        // init
        PostService.loadPosts();
        $timeout(function () {
            blogCtrl.loadPost();
        }, 250);

        blogCtrl.loadPost = function (index) {
            blogCtrl.currentPost = PostService.loadPost(index);
            //location.hash += "/" + blogCtrl.currentPost.slug;
        };
    }

    PostListController.$inject = ["$scope", "$timeout", "PostService"];

    function PostListController($scope, $timeout, PostService) {
        var listCtrl = this;
        listCtrl.posts = [];

        listCtrl.loadPost = function (index) {
            $scope.$parent.loadPost(index);
        };

        $timeout(function () {
            listCtrl.posts = PostService.getPosts();
        }, 100);
    }


    PostService.$inject = ["$http"];

    function PostService($http) {

        var service = this;

        // List of blog posts
        var posts = [];

        // template
        var currentPost = {
            "title": "",
            "slug": "",
            "published": "",
            "htmlBody": ""
        };

        service.loadPosts = function () {
            $http.get(getUrl("posts/posts.json"))
                .then(function (response) {
                    posts = response.data;
                });
        };

        service.getPosts = function () {
            return posts;
        };

        service.loadPost = function (index) {
            index = index || 0;
            var post = service.getPosts()[index];
            post.slug =
                "/" + (index || 0) +
                "/" + slugify(post.published) +
                "/" + slugify(post.title);
            service.fetchPostBody(post);
            return post;
        };

        service.fetchPostBody = function (post) {

            post.htmlBody = post.htmlBody || "";
            $http.get(getUrl(post.file))
                .then(function (response) {
                    post.htmlBody = response.data;
                });
        };

        service.getCurrentPost = function () {
            return currentPost;
        };

        function getUrl(path) {
            var baseUrl = location.href.substr(0, location.href.lastIndexOf("/")) + "/";
            if (!path) return baseUrl;
            return baseUrl + path;
        }

        function slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }
    }
})();
