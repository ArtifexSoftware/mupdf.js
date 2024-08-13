import * as mupdf from 'mupdf';
import { describe, expect, it } from 'vitest';

describe('PDF encryption tests', () => {
  it('should create an encrypted PDF and test owner and user access', async () => {
    const perm = 
        mupdf.PDFDocument.PERMISSION["print"] |
        mupdf.PDFDocument.PERMISSION["copy"] |
        mupdf.PDFDocument.PERMISSION["annotate"];
    
    const ownerPass = "owner";
    const userPass = "user";
    
    
    // Create a new PDF document with a blank A4 size page
    const doc = new mupdf.PDFDocument();
    doc.addPage([0, 0, 595, 842], 0, null, "");
    
    // Encrypt the document
    const encryptionOptions = `compress,encrypt=aes-256,owner-password=${ownerPass},user-password=${userPass},permissions=${perm}`;
    const buffer = doc.saveToBuffer(encryptionOptions);
    
    // Test owner access
    let encryptedDoc = mupdf.Document.openDocument(buffer, "application/pdf") as mupdf.PDFDocument;
    expect(encryptedDoc.needsPassword()).to.be.true;
    const ownerAuth = encryptedDoc.authenticatePassword(ownerPass);
    expect(ownerAuth).to.equal(4); // 4 indicates successful owner authentication
    expect(encryptedDoc.hasPermission("print")).to.be.true;
    expect(encryptedDoc.hasPermission("copy")).to.be.true;
    expect(encryptedDoc.hasPermission("annotate")).to.be.true;
    
    // Test user access
    encryptedDoc = mupdf.Document.openDocument(buffer, "application/pdf") as mupdf.PDFDocument;
    const userAuth = encryptedDoc.authenticatePassword(userPass);
    expect(userAuth).to.equal(2); // 2 indicates successful user authentication
    expect(encryptedDoc.hasPermission("print")).to.be.true;
    expect(encryptedDoc.hasPermission("copy")).to.be.true;
    expect(encryptedDoc.hasPermission("annotate")).to.be.true;
  });
});