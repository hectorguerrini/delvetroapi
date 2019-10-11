import App from './app';
const app = new App().app;

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Del Vetro app listening on port ${port}!`))

