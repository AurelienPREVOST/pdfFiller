const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createFillableForm(inputPath, outputPath, fields, checkboxes) {
  // Load the existing PDF document
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Add a page to the document (if needed)
  let page;
  if (pdfDoc.getPages().length === 0) {
    page = pdfDoc.addPage([600, 800]);
  } else {
    page = pdfDoc.getPage(0); // Modify the first page
  }

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

  // Loop through the checkboxes and add them to the page
  for (const checkbox of checkboxes) {
    const { x, y, size, name } = checkbox;

    // Create a checkbox field
    const form = pdfDoc.getForm();
    const checkBox = form.createCheckBox(name);
    checkBox.addToPage(page, { x, y, width: size, height: size });

    // Optionally, draw a rectangle around the checkbox for better visibility
    page.drawRectangle({
      x,
      y,
      width: size,
      height: size,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Write the updated PDF back to the filesystem
  fs.writeFileSync(outputPath, pdfBytes);
}

const inputPath = './test.pdf';
const outputPath = 'fillable_form_from_file.pdf';

// Define the fields to add (with coordinates and size)
const fields = [
  { x: 50, y: 750, width: 200, height: 20, name: 'Name' },
  { x: 50, y: 700, width: 200, height: 15, name: 'Email' },
  { x: 50, y: 650, width: 200, height: 10, name: 'Phone' },
  // Add more fields as needed
];

// Define the checkboxes to add (with coordinates and size)
const checkboxes = [
  { x: 50, y: 600, size: 20, name: 'Checkbox1' },
  { x: 50, y: 570, size: 15, name: 'Checkbox2' },
  { x: 50, y: 540, size: 10, name: 'Checkbox3' },
  // Add more checkboxes as needed
];

createFillableForm(inputPath, outputPath, fields, checkboxes).then(() => {
  console.log("\x1b[42m", 'Fillable PDF form with checkboxes created.', "\x1b[0m");
}).catch(err => {
  console.error("\x1b[41m", 'Error creating fillable PDF form:', err , "\x1b[0m");
});
