var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    app: {
      name: 'pmc-server-node'
    },
    port: 8080,
    db: {
      database: "pmc2",
      username: "root",
      password: "",
      options: {
        dialect: "mysql",
        host: "localhost",
        port: 3306
      }
    }
  },

  test: {
    app: {
      name: 'pmc-server-node'
    },
    port: 8080,
    db: {
      database: "pmc2",
      username: "root",
      password: "",
      options: {
        dialect: "mysql",
        host: "localhost",
        port: 3306
      }
    }
  },

  production: {
    app: {
      name: 'pmc-server-node'
    },
    port: 8080,
    db: {
      database: "pmc2",
      username: "root",
      password: "",
      options: {
        dialect: "mysql",
        host: "localhost",
        port: 3306
      }
    }
  }
};

module.exports = config[env];