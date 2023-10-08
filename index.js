const app = require("./config/app");
const port = process.env.SERVER_PORT;

app.listen(port, () => {
    console.log(`Servidor em execução na porta: ${port}`);
});