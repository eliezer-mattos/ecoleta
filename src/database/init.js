//Acessando o banco de dados
const Database = require('./config')

//Criando constante com um Objeto dentro
const initDb = {

    //Init é como se fosse o GET
    async init(){         

        //Iniciando a conexão com o banco de dados
        const db = await Database()

        //Executando comando SQL no banco de dados
        await db.exec(`CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            name TEXT,
            address TEXT,
            address2 TEXT,
            state TEXT,
            city TEXT,
            items TEXT
        )`);

        //Fechando conexão com o banco de dados
        await db.close()
    }
}

//Chama o Objeto e rodo a função INIT
initDb.init()