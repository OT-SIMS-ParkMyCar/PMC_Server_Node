

exports.errorServer = function(err, res){

	console.log(err);

	if(res){
		res.status(500).send("Server error");
	}
}

exports.routeNotFound = function(res){

	if(res){
		res.status(404).send("Route not found");
	}
}