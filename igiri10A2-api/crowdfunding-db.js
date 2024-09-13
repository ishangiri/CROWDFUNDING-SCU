import mysql from "mysql2";

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Ishan@2058',
    database: 'crowdfunding_db'
});

connection.connect(
    error => {
        if(error) throw error;
        console.log("Connection to database successful");
        
    }
);

export default connection;

