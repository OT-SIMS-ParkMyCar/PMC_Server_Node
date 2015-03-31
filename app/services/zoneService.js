var moment = require('moment');


var Zone = require('../models').Zone;
var configZoneService = require('../../config/config').paramService.zoneService;


exports.createZone = function(newZone, cb) {
	Zone.create(newZone).then(function(zone) {
		cb(null, zone);
	}).catch(cb);
}

exports.getDensityEnum = function() {
	return Zone.rawAttributes.density.values;
}

exports.getZone = function(latitude, longitude, radius, cb) {

	async.parallel({
		zonesLevel1: function(callback) { // Zones of the last hour (intensity=1)
			var oldestDate = moment().subtract(configZoneService.TIMELAPS_MINUTE, 'minutes');
			var listZoneLevel1 = Zone.findZonesByPositionAfterDate(latitude, longitude, oldestDate, radius, function(err, listZoneLevel1) {
				if (err) return callback(err, []);

				async.each(listZoneLevel1, function(zone, next) {
					//TODO use place occurence
					/*Double occupationRate = placeDAO.getOccupationRate(z.getLatitude(), z.getLongitude(), ZONE_DEFAULT_RADIUS);
					Float intensity = calculateIntensityByOccupationRate(occupationRate, z.getDensity());*/
					zone.intensity = 1.0;
					next();

				}, function(err) {
					callback(err, listZoneLevel1);
				});
			});
		},
		zonesLevel2: function(callback) { // Zones of the previous week the same day around a hour
			var datePreviousWeekStart = moment().subtract(configZoneService.MIN_AROUND_TIME_LEVEL2, 'minutes').subtract(configZoneService.NB_DAY_BEFORE_LEVEL2, 'days');
			var datePreviousWeekStart = moment().add(configZoneService.MIN_AROUND_TIME_LEVEL2, 'minutes').subtract(configZoneService.NB_DAY_BEFORE_LEVEL2, 'days');

			Zone.findZonesByPositionBetweenDates(latitude, longitude, datePreviousWeekStart, datePreviousWeekStop, radius, function(err, listZoneLevel2) {
				if (err) return callback(err, []);

				listZoneLevel2.forEach(function(zone) {
					zone.intensity = configZoneService.INTENSITY_LEVEL2;
				});
				callback(null, listZoneLevel2);
			});
		},
		zonesLevel3: function(callback) { // Zones avg on a grid
			var listZoneLevel3 = [];
			var listPositions = generateGrid(latitude, longitude, radius, configZoneService.ZONE_DEFAULT_RADIUS);
			var currentDate = moment();

			async.each(listPositions, function(position, next) {
				Zone.findZonesOfHourAndDay(position.latitude, position.longitude, currentDate, configZoneService.ZONE_DEFAULT_RADIUS, function(err, listZoneAroundPosition) {
					if (!listZoneAroundPosition.isEmpty()) {
						listZoneLevel3.push({
							latitude: latitude,
							longitude: longitude,
							intensity: configZoneService.INTENSITY_LEVEL3,
							density: calculateAvgDensity(listZoneAroundPosition)
						});
					}
				});
				next();

			}, function(err) {
				callback(err, listZoneLevel3);
			});

		}
	}, function(err, results) {
		if(err) return cb(err);

		//Aggregate all list
		cb(null, results.listZoneLevel1.concat(results.listZoneLevel2).concat(results.listZoneLevel3));
	})
}


function calculateIntensityByOccupationRate(occupationRate, zoneDensity) {
	if (occupationRate == null) return 1;

	var densityOccupation;
	if (occupationRate <= 1.0 / 3) {
		densityOccupation = 'LOW';
	} else if (occupationRate <= 2.0/ 3) {
		densityOccupation = 'MEDIUM';
	} else {
		densityOccupation = 'HIGH';
	}


	if (densityOccupation == zoneDensity) {
		return 1.0;
	} else if (densityOccupation == 'MEDIUM' || zoneDensity == 'MEDIUM') {
		return 0.8;
	} else {
		return 0.6;
	}
}

function calculateAvgDensity(listZoneAroundPosition) {
	var sum = 0;
	listZoneAroundPosition.forEach(function(z) {
		if (z.density == 'LOW') {
			sum += 0;
		} else if (z.density == 'MEDIUM') {
			sum += 1;
		} else if (z.density == 'HIGH') {
			sum += 2;
		}
	});

	var avg = sum / listZoneAroundPosition.length;
	if (avg <= 2.0 / 3) {
		return 'LOW';
	} else if (avg <= 4.0 / 3) {
		return 'MEDIUM';
	} else {
		return 'HIGH';
	}
}

function generateGrid(latitude, longitude, size, gap) {
	var listPositions = [];
	//Add center of the grid
	listPositions.push({
		latitude: latitude,
		longitude: longitude
	});

	var nbPointAround = Math.round(new Float((size / 2) / gap));
	for (var i = 1; i <= nbPointAround; i++) {
		//Points on the left
		listPositions.push(getPosition(latitude, longitude, i * gap, Math.PI / 2));
		//Points on the right
		listPositions.push(getPosition(latitude, longitude, i * gap, -Math.PI / 2));
	}
	for (var i = 0; i < nbPointAround * 2 + 1; i++) {
		for (var j = 1; j <= nbPointAround; j++) { //TODO check this j not used
			//Points on the top
			listPositions.push(getPosition(listPositions[i].latitude, listPositions[i].longitude, i * gap, 0));
			//Points on the bottom
			listPositions.push(getPosition(listPositions[i].latitude, listPositions[i].longitude, i * gap, Math.PI));
		}
	}
	return listPositions;
}

function getPosition(latitude, longitude, distance, direction) {
	var distance2 = distance / configZoneService.EARTH_RADIUS;
	var latRad = latitude * Math.PI / 180;
	var lonRad = longitude * Math.PI / 180;
	var latRadRes = Math.asin(Math.sin(latRad) * Math.cos(distance2) + Math.cos(latRad) * Math.sin(distance2) * Math.cos(direction));
	var lonRadTmp = Math.atan2(Math.sin(direction) * Math.sin(distance2) * Math.cos(latRad), Math.cos(distance2) - Math.sin(latRad) * Math.sin(latRadRes));
	var lonRadRes = ((lonRad - lonRadTmp + Math.PI) % (2 * Math.PI)) - Math.PI;
	return {
		latitude: latRadRes * 180 / Math.PI,
		longitude: lonRadRes * 180 / Math.PI
	};
}