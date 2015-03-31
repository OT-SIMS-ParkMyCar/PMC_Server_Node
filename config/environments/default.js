module.exports = {
	app: {
		name: 'pmc-server-node'
	},
	port: 8080,
	db: {
		database: "pmc2",
		username: "pmcServer",
		password: "pmcServerPwd",
		options: {
			dialect: "mysql",
			host: "localhost",
			port: 3306
		}
	},
	paramCtrl: {
		zoneCtrl: {
			MAX_RADIUS: 5000,
			DEFAULT_RADIUS: 144
		}
	},
	paramService: {
		zoneService: {
			TIMELAPS_MINUTE: 60,
		    SCORE_ADDED_WHEN_ZONE: 10,
		    ZONE_DEFAULT_RADIUS: 24,
		    EARTH_RADIUS: 5000000,
		    INTENSITY_LEVEL2: 0.5,
		    INTENSITY_LEVEL3: 0.2,
		    NB_DAY_BEFORE_LEVEL2: 7,
		    MIN_AROUND_TIME_LEVEL2: 30,
		}
	}
}