
var zoneService = require('../services/zoneService');

var configZoneCtrl = require('../../config/config').paramCtrl.zoneCtrl;

var errorManager = require('../../utils/errorManager');


exports.indicate = function(req, res) {
	var newZone = {
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		density: req.body.density
	}

	if (!newZone.latitude || !newZone.longitude || !newZone.density) { //Check missing value
		return res.status(400).send("parameters not valid");
	}
	
	newZone.latitude = parseFloat(newZone.latitude);
	newZone.longitude = parseFloat(newZone.longitude);
	if(isNaN(newZone.latitude) || isNaN(newZone.longitude)){ //Check latitude and longitude
		return res.status(400).send("longitude and latitude must be float");	
	}

	if(zoneService.getDensityEnum().indexOf(newZone.density) == -1){ //Check density
		return res.status(400).send("density not valid");
	}

	//Create new Zone
	zoneService.createZone(newZone, function(err, zoneCreated){
		if(err) return errorManager.errorServer(err, res);
		else res.status(201).send(zoneCreated);
	});
};

exports.getZones = function(req, res){

	if (!req.body.latitude || !req.body.longitude) { //Check missing latitude or longitude
		return res.status(400).send("parameters not valid");
	}
	var latitude = parseFloat(newZone.latitude);
	var longitude = parseFloat(newZone.longitude);
	if(isNaN(latitude) || isNaN(longitude)){ //Check latitude and longitude
		return res.status(400).send("longitude and latitude must be float");	
	}

	var radius = parseFloat(req.body.radius);
	if (isNaN(radius) || radius < 1 || radius > configZoneCtrl.MAX_RADIUS){
		radius = configZoneCtrl.DEFAULT_RADIUS;
	}

	zoneService.getZone(latitude, longitude, radius, function(err, listZone){
		if(err) return errorManager.errorServer(err, res);
		else res.status(200).send(listZone);
	});
}