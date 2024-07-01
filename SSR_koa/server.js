const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const { koaBody } = require('koa-body');
const nunjucks = require('nunjucks');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

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

// Middleware pour parser les données multipart/form-data
app.use(koaBody({
  multipart: true,
  formidable: {
    // Garde les extensions de fichier d'origine
    keepExtensions: true,
    // Limite de taille des fichiers
    maxFileSize: 200 * 1024 * 1024 // 200MB
  }
}));

// Define routes
router.get('/', async (ctx) => {
  await ctx.render('index', { title: 'Home' });
});


async function createFillableForm(inputPath, outputPath, data) {
  console.log("data=>", data)
  console.log("typeof data =>", typeof data)
  // Load the existing PDF document
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // At least one page needed
  let page = pdfDoc.getPage(0); 
  const { width: pageWidth, height: pageHeight } = page.getSize();
  console.log({ width: pageWidth, height: pageHeight })

  // Load a standard font to use
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Loop through the fields and add them to the page
  console.log("data ==>", data)
  console.log(data.fields[0])
  console.log("data.checkboxes and fields =>", data.checkboxes , data.fields)
  for (const field of data.fields) {
    const { x, y, width, height, name } = field;

    // Create a form field
    const form = pdfDoc.getForm();
    const textField = form.createTextField(name);
    textField.setText('');
    textField.addToPage(page, { x, y, width, height });

    // Optionally, you can set other properties of the text field
    textField.setFontSize(12);
    textField.updateAppearances(font);
  }

  // Loop through the checkboxes and add them to the page
  for (const checkbox of data.checkboxes) {
    const { x, y, size, name } = checkbox;

    // Create a checkbox field
    const form = pdfDoc.getForm();
    const checkBox = form.createCheckBox(name);
    checkBox.addToPage(page, { x, y, width: size, height: size });
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("\x1b[41m", "pdf généré", "\x1b[0m")
  // Write the updated PDF back to the filesystem
  console.log("\x1b[45m", "outputPath :", outputPath, "\x1b[0m")
  fs.writeFileSync(outputPath, pdfBytes);
}


// Route POST pour /buildpdf
router.post('/buildpdf', async (ctx) => {
  console.log("Received a POST request to /buildpdf");

  try {
    // Récupération des données JSON depuis le corps de la requête et conversion en objet JavaScript
    const jsonData = JSON.parse(ctx.request.body.data);
    console.log("JSON Data:", jsonData);

    // Récupération du fichier PDF depuis les fichiers de la requête
    const pdfFile = ctx.request.files.pdfFile;
    const outputFileDestination = `${pdfFile.filepath.replace(".pdf","")}-output.pdf`;
    const inputPath = pdfFile.filepath;

    // Appel à la fonction pour créer le formulaire PDF remplissable
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



// Use the routes defined
app.use(router.routes()).use(router.allowedMethods());

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
