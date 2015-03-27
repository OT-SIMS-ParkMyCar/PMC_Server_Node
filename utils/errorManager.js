

exports.errorServer = function(res){

	var manager = function(err){
		
		console.log(err);

		if(res){
			res.status(500).send("Server error");
		}
	};

	return manager;
}