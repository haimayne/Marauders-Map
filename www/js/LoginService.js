app.factory("LoginService", function($rootScope,$firebaseObject,$firebaseArray,$state,$firebaseAuth,FirebaseService) {

return{
	login:function(tel){
		var self=this;
		var ref = FirebaseService.get();
		var auth=$firebaseAuth(ref)
		var scopeforgoogle={scope:'email'}
		auth.$authWithOAuthPopup('google', scopeforgoogle).then(function (authData, error) {
		    if (error) {
				    console.log("Login Failed!", error);
				  } else {
				  	var emailId=authData.google.email
				  	emailId=emailId.split("@")[0].replace('.','')
				    console.log("Authenticated successfully with payload:",emailId);
				    $rootScope.emailId=emailId
				    window.localStorage['username']=emailId
				    console.log(emailId)
				    console.log(tel)
				     FirebaseService.get('users/'+emailId+"/").once('value',function(snapshot){
				     	if(snapshot.val()==null)
				     	{
				     			console.log(emailId)
						      FirebaseService.get('users/'+emailId+"/").set({'name':emailId,'phNo':tel})
				     	}
				     	else{
				     		console.log("Ina")
				     	}

				     })
				    $state.go('map')
				  }
		});
	}
}

})