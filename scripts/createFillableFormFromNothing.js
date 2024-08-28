const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * Crée un formulaire PDF remplissable à partir de zéro.
 * 
 * @param {string} outputPath - Le chemin de sortie du fichier PDF.
 * @param {Array<{x: number, y: number, width: number, height: number, name: string}>} fields - Un tableau d'objets représentant les champs du formulaire. Chaque objet doit contenir les propriétés suivantes:
 *   - x: La position x du champ.
 *   - y: La position y du champ.
 *   - width: La largeur du champ.
 *   - height: La hauteur du champ.
 *   - name: Le nom du champ.
 * @param {number} [width=600] - La largeur de la page PDF.
 * @param {number} [height=800] - La hauteur de la page PDF.
 * 
 * @returns {Promise<void>} Une promesse qui est résolue lorsque le PDF est créé et sauvegardé.
 */

async function createFillableFormFromNothing(outputPath, fields, width = 600, height = 800) {
  console.log("JE NE PASSE JAMAIS PAR CETTE FONCTION DEPUIS LE NAVIGATEUR")
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page to the document
  const page = pdfDoc.addPage([width, height]);

  // Load a standard font to use
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Loop through the fields and add them to the page
  for (const field of fields) {
    const { x, y, width, height, name } = field;

    // Create a form field
    const form = pdfDoc.getForm();
    const textField = form.createTextField(name);
    textField.setText('');
    textField.addToPage(page, { x, y, width, height });

    // Optionally, you can set other properties of the text field
    textField.setFontSize(12);
    textField.updateAppearances(font);

    // Optionally, draw a rectangle around the text field for better visibility
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Write the updated PDF back to the filesystem
  fs.writeFileSync(outputPathFull, pdfBytes);
}

const outputPath = "newPdf"
const outputPathFull = `${outputPath}.pdf`;

// Define the fields to add (with coordinates and size)
const fields = [
  { x: 1, y: 1, width: 20, height: 20, name: 'corner-bottom-left' },
  { x: 1, y: 780, width: 20, height: 20, name: 'corner-top-left' },
  { x: 580, y: 780, width: 20, height: 20, name: 'corner-top-right' },
  { x: 580, y: 1, width: 20, height: 20, name: 'corner-bottom-right' },

  { x: 50, y: 750, width: 200, height: 20, name: 'Name' },
  { x: 50, y: 700, width: 200, height: 20, name: 'Email' },
  { x: 50, y: 650, width: 200, height: 20, name: 'Phone' },
  // Add more fields as needed
];






createFillableFormFromNothing(outputPath, fields).then(() => {
  console.log("\x1b[42m", 'Fillable PDF form created.', "\x1b[0m");
}).catch(err => {
  console.error("\x1b[41m", 'Error creating fillable PDF form:', err, "\x1b[0m");
});
