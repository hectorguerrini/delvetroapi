import { config } from "mssql"

export const configDev: config = {
    user: 'node',
    password: 'nodeadmin',
    server: 'DESKTOP-2HSO5CV\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance
    database: 'del_vetro',
    parseJSON: true,   
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000
    }
}
export const jwtSecret = "@DELVM"