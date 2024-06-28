const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const nunjucks = require('nunjucks');
const fs = require('fs');
const bodyParser = require('koa-bodyparser');

// Initialize Koa app and router
const app = new Koa();
const router = new Router();

// Configure Nunjucks templating engine
nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
});

// Middleware for rendering views with .njk extension
app.use(views(__dirname + '/views', {
  extension: 'njk',
  map: { njk: 'nunjucks' }
}));

// Middleware for parsing request bodies
app.use(bodyParser());

// Define routes
router.get('/', async (ctx) => {
  await ctx.render('index', { title: 'Home' });
});

// Use the routes defined
app.use(router.routes()).use(router.allowedMethods());

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
