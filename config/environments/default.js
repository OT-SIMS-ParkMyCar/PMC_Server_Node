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
	}
}