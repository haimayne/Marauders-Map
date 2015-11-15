app.factory("", function(){
	return {
		get:function(query){
			if (typeof query==='undefined'){query='';}
			return new Firebase("https://ubhackathonmap.firebaseio.com/"+query);
		}
	}
});