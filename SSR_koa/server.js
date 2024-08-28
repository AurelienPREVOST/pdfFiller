const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const { koaBody } = require('koa-body');
const nunjucks = require('nunjucks');
const bodyParser = require('koa-bodyparser');
const { createFillableForm } = require('./functions/createFillableForm');
const path = require('path');



/* -------------------------------------------------------------------------- */
/*                        Initialize Koa app and router                       */
/* -------------------------------------------------------------------------- */
const app = new Koa();
const router = new Router();

/* -------------------------------------------------------------------------- */
/*                    Configure Nunjucks templating engine                    */
/* -------------------------------------------------------------------------- */
nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
});

/* -------------------------------------------------------------------------- */
/*               Middleware for rendering views with .njk extension           */
/* -------------------------------------------------------------------------- */
app.use(views(__dirname + '/views', {
  extension: 'njk',
  map: { njk: 'nunjucks' }
}));

/* -------------------------------------------------------------------------- */
/*                    Middleware for parsing request bodies                   */
/* -------------------------------------------------------------------------- */
app.use(bodyParser());

/* -------------------------------------------------------------------------- */
/*           Middleware pour parser les données multipart/form-data           */
/* -------------------------------------------------------------------------- */
app.use(koaBody({
  multipart: true,
  formidable: {
    // Garde les extensions de fichier d'origine
    keepExtensions: true,
    // Limite de taille des fichiers
    maxFileSize: 200 * 1024 * 1024 // 200MB
  }
}));

/* -------------------------------------------------------------------------- */
/*                                  HOME PAGE                                 */
/* -------------------------------------------------------------------------- */
router.get('/', async (ctx) => {
  console.log("jaccede a la racine de l'app '/'")
  await ctx.render('index', { title: 'Home' });
});

/* -------------------------------------------------------------------------- */
/*                                  EXPORTER                                  */
/* -------------------------------------------------------------------------- */
router.post('/buildpdf', async (ctx) => {
  console.log("je passe par route.post/buildpdf")

  try {
    // Récupération des données JSON depuis le corps de la requête et conversion en objet JavaScript
    const jsonData = JSON.parse(ctx.request.body.data);
    console.log("JSON Data:", jsonData);

    // Récupération du fichier PDF depuis les fichiers de la requête
    const pdfFile = ctx.request.files.pdfFile;
    // Création du chemin de stockage futur du fichier généré
    const outputFileDestination = path.join(__dirname, 'pdfFillable', `${path.basename(pdfFile.filepath, '.pdf')}-output.pdf`);

    const inputPath = pdfFile.filepath;

    // Appel à la fonction pour créer le formulaire PDF remplissable
    console.log("################################################")
    console.log("#        DONNEES TRANSMISES A LA FONCTION      #")
    console.log("################################################")
    console.log("inputPath transmis =>", inputPath)
    console.log("outputFileDestination =>", outputFileDestination)
    console.log("jsonData =>", jsonData)
    console.log("################################################")

    await createFillableForm(inputPath, outputFileDestination, jsonData);
    console.log("\x1b[42m", 'Fillable PDF form with checkboxes created.', "\x1b[0m");

    // Réponse à la requête avec un statut de succès ou autre traitement nécessaire
    ctx.status = 200;
    ctx.body = 'Fillable PDF form created successfully';
  } catch (err) {
    console.error("\x1b[41m", 'Error creating fillable PDF form:', err, "\x1b[0m");
    ctx.status = 500; // Internal Server Error
    ctx.body = 'Error creating fillable PDF form';
  }
});

/* -------------------------------------------------------------------------- */
/*                               Activate routes                              */
/* -------------------------------------------------------------------------- */
app.use(router.routes()).use(router.allowedMethods());

/* -------------------------------------------------------------------------- */
/*                              Start the server                              */
/* -------------------------------------------------------------------------- */
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
