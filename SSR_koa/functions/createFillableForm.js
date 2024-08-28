const fs = require('fs');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const { exec } = require('child_process');

async function createFillableForm(inputPath, outputPath, data) {  
    /* ----------------------  Load the existing PDF document ------------------- */
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    /* ------------------------ At least one page needed ------------------------ */
    let page = pdfDoc.getPage(0); 
    const { width: pageWidth, height: pageHeight } = page.getSize();
    /* ----------------------- Load a standard font to use ---------------------- */
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    /* ------------ Loop through the fields and add them to the page ------------ */
    for (const field of data.fields) {
        const { x, y, width, height, name } = field;
        /* --------------------------- Create a form field -------------------------- */
        const form = pdfDoc.getForm();
        const textField = form.createTextField(name);
        textField.setText('');
        textField.addToPage(page, { x, y, width, height });
        /* ------- Optionally, you can set other properties of the text field ------- */
        textField.setFontSize(12);
        textField.updateAppearances(font);
    }
    /* ---------- Loop through the checkboxes and add them to the page ---------- */
    for (const checkbox of data.checkboxes) {
        const { x, y, size, name } = checkbox;
        /* ------------------------- Create a checkbox field ------------------------ */
        const form = pdfDoc.getForm();
        const checkBox = form.createCheckBox(name);
        checkBox.addToPage(page, { x, y, width: size, height: size });
    }
    /* ------------ Serialize the PDFDocument to bytes (a Uint8Array) ----------- */
    const pdfBytes = await pdfDoc.save();
    console.log("\x1b[41m", "pdf généré", "\x1b[0m");
    
    // Write the updated PDF back to the filesystem
    console.log("\x1b[45m", "outputPath :", outputPath, "\x1b[0m");
    fs.writeFileSync(outputPath, pdfBytes);
    
    // Open the PDF file with the default application
    exec(`start "" "${outputPath}"`, (err) => {
        if (err) {
            console.error("\x1b[41m", 'Error opening the PDF file:', err, "\x1b[0m");
        } else {
            console.log("\x1b[42m", 'PDF file opened successfully.', "\x1b[0m");
        }
    });
}

module.exports = {
    createFillableForm
};
