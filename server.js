// usei o express pra criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

// configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))


// configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {  // views é a pasta que eu estou guardando os meus htmls, o segundo parametro é um objeto de configuração.
    express: server,
    noCache: true, // boolean // cache guarda em memória algumas coisas que ele julga ser importante para usar mais tarde. Aqui eu estou desabilitando. Porém depois de pronto dá para desabilitar, pois deixa tudo mais rápido, mas enquanto desenvolvemos, é melhor deixar desabiltiado.
})

// criei uma rota /
// e capturo o pedido do cliente para responder
server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()  

        let lastIdeas = []
        for (let idea of reversedIdeas) {
            if(lastIdeas.length < 2) {
                lastIdeas.push(idea) // push adiciona no meu array algo que eu mandar. Neste caso eu estou add o objeto idea.
            } 
        }

        return res.render("index.html", { ideas: lastIdeas })
    })

    
})

server.get("/ideias", function(req, res) {

    
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()  
        return res.render("ideias.html", {ideas: reversedIdeas})
    })
})


server.post("/", function(req, res) {
    //Inserir dados na tabela
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES(?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,

    ]



    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/ideias")
    }) 

})

// liguei meu servidor na porta 3000
server.listen(3000)
