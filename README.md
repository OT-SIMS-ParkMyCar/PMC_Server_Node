# PMC_Server
The application PMC_Server is a Java Spring Rest Server to use with [PMC_Android](https://github.com/OT-SIMS-ParkMyCar/PMC_Android).

## How to setup
You will need:
- Git
- NodeJs and npm
- MySQL

### On Ubuntu

##### Install tools
Start with a global update of the system:
```sh
sudo apt-get update
```
Install Git:
```sh
sudo apt-get install git
```
Install NodeJs and npm:
```sh
sudo apt-get install nodejs npm
```
Install MySQL:
```sh
sudo apt-get install mysql-server
```
##### Download the project
When all tools are installed, you can clone the Git Repository:
```sh
sudo mkdir /home/OT-SIMS
cd /home/OT-SIMS
sudo git clone https://github.com/OT-SIMS-ParkMyCar/PMC_Server_Node.git
```

##### Initialize the Database
First be sure that the service is started `sudo service mysql start`.

To initialize MySQL, you most be connected as root
`mysql --user=root mysql`
If you have assigned a password to the root account, you also need to supply a `--password` or `-p` option.

Create the database with the mysql command: 
```sh
CREATE DATABASE IF NOT EXISTS `pmc` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```
Tables will be created automatically when you run the server first time if you allow it to create tables in the DB.

It's recommended to don't use the root user for the application so you most create one with rights on the pmc database:
```sh
GRANT SELECT, INSERT, UPDATE, DELETE ON pmc.* TO 'pmcServer'@'localhost' IDENTIFIED BY 'pmcServerPwd';
```
If you want it manages tables add 'CREATE, ALTER, DROP' options.

If you want previously remove all table from PMC, use this command:
```
DROP TABLE `logplace`, `place`, `user`, `zone`, `favorite`;
```
The default user for the application is __pmcServer__ with the password __pmcServerPwd__ but you can change that in the file __/home/OT-SIMS/PMC_Server_Node/config/environments/default.js.

You can now disconnect from MySQL with the commmand `exit`.

##### Install the project
Download all dependencies
```sh
cd /home/OT-SIMS/PMC_Server_Node
npm install
```

You can run the server with the command `node app`.
To stop it, use `Ctrl+C`.

##### Create a service for the server
Not yet implement

##### Tests
To run tests, configure a DB with all rights and change config in the file __/home/OT-SIMS/PMC_Server_Node/config/environments/test.js
```sh
cd /home/OT-SIMS/PMC_Server_Node
npm test
```

##### Development
To help development, grunt can be useful to restart server each time you change a file
```sh
cd /home/OT-SIMS/PMC_Server_Node
grunt
```