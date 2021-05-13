const express = require("express")
const server = express()
const nunjucks = require("nunjucks")
const Database = require('./database/config')

// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

// utilizando template engine
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar rotas da minha aplicação
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título"})
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.get("/search", async (req, res) => {
    const db = await Database();
    const search = req.query.search;
    let sql;

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0});
    }

    // pegar os dados do banco de dados
    sql =`SELECT * FROM places WHERE city LIKE '%${search}%'`;
    const places = await db.all(sql);
    const total = places.length;

    await db.close();

    return res.render("search-results.html", { places: places, total: total})
    
})

server.post("/savepoint", async (req, res) => {
    const db = await Database();

    // inserir dados no banco de dados
    await db.run(`INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (
        "${req.body.image}",
        "${req.body.name}",
        "${req.body.address}",
        "${req.body.address2}",
        "${req.body.state}",
        "${req.body.city}",
        "${req.body.items}"
    )`)

    await db.close()

    return res.render("create-point.html", {saved: true})
    /*function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }*/
})

// ligar o servidor
server.listen(5500)