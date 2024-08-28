// const fs = require('fs');
// const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// async function createFillableForm(inputPath, outputPath, data) {
//   console.log("JE NE PASSE JAMAIS PAR CETTE FONCTION DEPUIS LE FRONT")
//   // Load the existing PDF document
//   const existingPdfBytes = fs.readFileSync(inputPath);
//   const pdfDoc = await PDFDocument.load(existingPdfBytes);

//   // At least one page needed
//   let page = pdfDoc.getPage(0); 
//   const { width: pageWidth, height: pageHeight } = page.getSize();

//   // Load a standard font to use
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//   // Loop through the fields and add them to the page
//   for (const field of data.fields) {
//     const { x, y, width, height, name } = field;

//     // Create a form field
//     const form = pdfDoc.getForm();
//     const textField = form.createTextField(name);
//     textField.setText('');
//     textField.addToPage(page, { x, y, width, height });

//     // Optionally, you can set other properties of the text field
//     textField.setFontSize(12);
//     textField.updateAppearances(font);
//   }

//   // Loop through the checkboxes and add them to the page
//   for (const checkbox of data.checkboxes) {
//     const { x, y, size, name } = checkbox;

//     // Create a checkbox field
//     const form = pdfDoc.getForm();
//     const checkBox = form.createCheckBox(name);
//     checkBox.addToPage(page, { x, y, width: size, height: size });
//   }

//   // Serialize the PDFDocument to bytes (a Uint8Array)
//   const pdfBytes = await pdfDoc.save();

//   // Write the updated PDF back to the filesystem
//   fs.writeFileSync(outputPath, pdfBytes);
// }

// const inputPath = '../Pdf_test/toTransform/testAttest.pdf';
// const outputPath = `${inputPath.replace(".pdf", "")}-AAAAAAAAfillable.pdf`;

// // Define the fields to add (with coordinates and size)
// const fields = [
//   { x: 50, y: 750, width: 200, height: 20, name: 'Name' },
//   { x: 50, y: 700, width: 200, height: 15, name: 'Email' },
//   { x: 50, y: 650, width: 200, height: 10, name: 'Phone' },
//   // Add more fields as needed
// ];

// // Define the checkboxes to add (with coordinates and size)
// const checkboxes = [
//   { x: 50, y: 600, size: 20, name: 'Checkbox1' },
//   { x: 50, y: 570, size: 15, name: 'Checkbox2' },
//   { x: 50, y: 540, size: 10, name: 'Checkbox3' },
//   // Add more checkboxes as needed
// ];

// const data = { fields: fields, checkboxes: checkboxes}

// createFillableForm(inputPath, outputPath, data).then(() => {
//   console.log("\x1b[42m", 'Fillable PDF form with checkboxes created.', "\x1b[0m");
// }).catch(err => {
//   console.error("\x1b[41m", 'Error creating fillable PDF form:', err , "\x1b[0m");
// });
