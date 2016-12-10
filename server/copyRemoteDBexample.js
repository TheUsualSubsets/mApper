//to copy over the deployed database to the local databse, run the mongo shell and then run the following command from within the shell

// db.copyDatabase('mapper', 'mapper', '104.236.129.131', <USERNAME>, <PASSWORD>);

//the following are the users that were created on the deployed droplet

// for admin db --> db.createUser({user: <USERNAME>, pwd: <PASSWORD>, roles: ['root']})
// for mapper db --> db.createUser({user: <USERNAME>, pwd: <PASSWORD>, roles: ['userAdmin', 'dbOwner', 'dbAdmin', 'readWrite']})