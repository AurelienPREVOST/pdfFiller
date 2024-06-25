const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
// const faker = require('faker');

// Path to your PDF file
const pdfPath = './celui-la.pdf';

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
            { name: 'Checkbox1', value: true },
            { name: 'Checkbox2', value: false },
            { name: 'Checkbox3', value: true },
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
