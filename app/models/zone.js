module.exports = function(sequelize, DataTypes) {

	var Zone = sequelize.define('Zone', {
		latitude: DataTypes.FLOAT,
		longitude: DataTypes.FLOAT,
		density: {
            type:   DataTypes.ENUM,
            values: ['LOW', 'MEDIUM', 'HIGH']
        }
	});

	Zone.findZonesByPositionAfterDate = function(latitude, longitude, date, radius, callback) {
		findZonesByPositionBetweenDates(latitude, longitude, date, new Date(), radius, callback);
	};

	Zone.findZonesByPositionBetweenDates = function(latitude, longitude, dateStart, dateStop, radius, callback) {
        sequelize.query(
    		"SELECT * FROM zones WHERE " +
            radius + " > (" + getRequestDistanceCalculatePart(latitude, longitude) + ")" +
            " AND '" + new Timestamp(dateStart.getTime()) + "' < createdAt" +
            " AND '" + new Timestamp(dateStop.getTime()) + "' > createdAt" ,

		Zone).then(function(zones){
        	callback(null, zones);
        }).catch(function(err){
        	callback(err, null);
        });
    }

    Zone.findZonesOfHourAndDay = function(latitude, longitude, date, radius, callback){
    	sequelize.query(
    		"SELECT * FROM zones WHERE " +
            radius + " > (" + getRequestDistanceCalculatePart(latitude, longitude) + ")" +
            " AND WEEKDAY('" + date.getTime() + "') = WEEKDAY(createdAt)" +
            " AND HOUR('" + date.getTime() + "')*60+MINUTE('" + date.getTime() + "')-30 < HOUR(createdAt)*60+MINUTE(createdAt)" +
            " AND HOUR('" + date.getTime() + "')*60+MINUTE('" + date.getTime() + "')+30 > HOUR(createdAt)*60+MINUTE(createdAt)",

		Zone).then(function(zones){
        	callback(null, zones);
        }).catch(function(err){
        	callback(err, null);
        });
    }

    function getRequestDistanceCalculatePart(latitude, longitude){
        return "(12756274 * ATAN(SQRT(SIN((latitude - " + latitude + " ) * PI() / 180/2) * SIN((latitude - " + latitude + " ) * PI() / 180/2) + " +
                "COS( " + latitude + " * PI() / 180) * COS(latitude * PI() / 180) * " +
                "POW(SIN((longitude - " + longitude + " ) * PI() / 180/2),2)) , " +
                "SQRT(1-(SIN((latitude - " + latitude + " ) * PI() / 180/2) * SIN((latitude - " + latitude + " ) * PI() / 180/2) + " +
                "COS(" + latitude + " * PI() / 180) * COS(latitude * PI() / 180) * " +
                "POW(SIN((longitude - " + longitude + " ) * PI() / 180/2),2)))))";
    }

	return Zone;
};