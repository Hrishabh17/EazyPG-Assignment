const pg = require('pgtools')
const fs = require("fs")
const path = require("path")
const  crypto = require('crypto')

const createNewDatabase = (host, user, dbname, password, port) =>{
    const config = {
        user: user,
        password: password,
        port: port,
        host: host
    }
    pg.createdb(config, dbname, (err, res)=>{
        if(err){
            console.log(err)
            process.exit(-1)
        }
        else{
            console.log('DB created successfully')
            saveCredentials(host, user, dbname, password, port)
        }
    })
}

const DropExistingDatabase = (host, user, dbname, password, port) =>{
    const config = {
        user: user,
        password: password,
        port: port,
        host: host
    }
    pg.dropdb(config, dbname, (err, res)=>{
        if(err){
            console.log(err)
            process.exit(-1)
        }
        else{
            console.log('DB deleted successfully')
        }
    })
}

const saveCredentials = (host, user, dbname, password, port) => {

    const jwt_key = crypto.randomBytes(30).toString('hex')

    fs.writeFileSync(
      path.join(__dirname, ".", ".env"),
      `DB_USER=${user}\n` +
      `DB_NAME=${dbname}\n` +
      `DB_PASSWORD=${password}\n` +
      `DB_HOST=${host}\n` +
      `DB_PORT=${port}\n` +
      `PASSWORD_ENCRYPT_LEN=10\n`+
      `USERNAME_ENCRYPT_LEN=5\n`+
      `JWT_KEY=${jwt_key}\n`
    );
    console.log("Credentials saved to .env file")
}

if (require.main === module) {
    if (process.argv.length === 7) {
      createNewDatabase(
        process.argv[2],
        process.argv[3],
        process.argv[4],
        process.argv[5],
        process.argv[6]
      );
    }
    else if(process.argv.length === 8) {
        DropExistingDatabase(
          process.argv[2],
          process.argv[3],
          process.argv[4],
          process.argv[5],
          process.argv[6]
        );
    }
    else{
      console.log("Provide the following arguments: Host, User, DB-Name, Password, Port")
      process.exit(1)
    }
}
  