var app = angular.module('github',[]);

app.controller('gitController',['$http','$scope','$q',function($http,$scope,$q){

	//initial setup 
	$scope.myFunction = function(){
		$scope.search('derekbanas');
	}
	//when searched
	$scope.setQuery = function(query){
		$scope.search(query)
	}

	$scope.find = function(data){
		var q = $q.defer()
		$http.get('https://api.github.com/users/'+data)
		.success(function(res){
				q.resolve(res)
		})
		.error(function(err){
			q.reject(err)
		})
		return q.promise;
	}

	$scope.findRepo = function(data){
		var q = $q.defer()
		$http.get('https://api.github.com/users/'+data+'/repos')
		.success(function(res){
				q.resolve(res)
		})
		.error(function(err){
			q.reject(err)
		})
		return q.promise;
	}

	$scope.findFollowing = function(data){
		var q = $q.defer()
		$http.get('https://api.github.com/users/'+data+'/followers')
		.success(function(res){
				q.resolve(res)
		})
		.error(function(err){
			q.reject(err)
		})
		return q.promise;
	}

	$scope.search = function(query){
		$scope.find(query)
		.then(function(data){
				$scope.setPersonalData(data)
				var q = $q.defer();
				q.resolve(data.login)
				return q.promise ;
		})
		.then(function(userid){
			$scope.findRepo(userid)
			.then(function(data){
				$scope.setRepoData(data)
				var q = $q.defer();
				q.resolve(userid)
				return q.promise ;
			})
			.then(function(data){
				$scope.findFollowing(data)
				.then(function(data){
					$scope.setFollowing(data);
				})
			})
		})
		.catch(function(err){
			console.log(err)
		})
	}

	$scope.setPersonalData = function(data){
		$scope.user_pic = data.avatar_url
		$scope.username = data.login
		$scope.name = data.name
		$scope.repos = data.public_repos
		$scope.followers = data.followers
		$scope.following = data.following
		$scope.email = data.email
		$scope.created = data.created_at
	}

	$scope.setRepoData = function(data){
		$scope.repositories = data
	}

	$scope.setFollowing = function(data){
		$scope.follower_s = data
		console.log(data);
	}
	$scope.searchs = function(data){
		alert(data);
	}
}]);


app.filter("getTimeOffset", function(){
   		return function(date){
     	return moment(date).fromNow();
   }
});