/* -------------------------------------------------------------------------- */
/*                                What is does?                               */
/* -------------------------------------------------------------------------- */
/*  Run with command line : 'node fillPdfForm'                                */
/*  From an object fill input thanks to it name with data in value            */
/*  Text or boolean depends of which  kind of input it is                     */
/* -------------------------------------------------------------------------- */


const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

// Choose your PDF
const pdfPath = './testfilling.pdf';

async function fillPdfForm() {
    try {
        // Load existing PDF
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        // Fields to fill (adjust these based on your PDF form)
        const fieldsToFill = [
            { name: 'Name', value: "NameInputField" },
            { name: 'Email', value: "EmailInputField" },
            { name: 'Phone', value: "FormInputField" },
            { name: 'corner-bottom-left', value: true }, // ⚠ If value expected == boolean; value.toString() automatically
            { name: 'corner-bottom-right', value: false },
            { name: 'corner-top-left', value: true },
        ];

        // Fill each field
        fieldsToFill.forEach(({ name, value }) => {
            const field = form.getTextField(name);
            if (field) {
                field.setText(value.toString());
            } else {
                console.warn(`Field ${name} not found in PDF form.`);
            }
        });

        // Save filled PDF to a new file
        const filledPdfBytes = await pdfDoc.save();
        fs.writeFileSync('./filledPdf.pdf', filledPdfBytes);
        
        console.log('PDF form filled successfully.');
    } catch (error) {
        console.error('Error filling PDF form:', error);
    }
}

// Execute the function
fillPdfForm();
