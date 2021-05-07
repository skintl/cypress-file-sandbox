describe('File compare', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('snap test of the /secret', () => {
    cy.getTestId('download-secret').click()
    snapAssertOnDownloadedFile('secret')
    cy.getTestId('upload-secret').then(attachFile('secret'));

    cy.wait(1000)
    cy.getTestId('uploaded-length').then(el => {
      cy.getTestId('existing-length').should((el1) => {
        expect(el.text()).equal(el1.text())
      })
    })
  })

  const snapAssertOnDownloadedFile = (pathToSnap) => {
    cy.task('waitForNewFile').then((downloadedFile) => {
      cy.fixture(pathToSnap).should('eq', downloadedFile)
    })
  }

  const attachFile = (filename) => (subject) => {
    cy.fixture(filename)
      .then(Cypress.Blob.binaryStringToBlob)
      .then((blob) => {
        const el = subject[0];
        const file = new File([blob], filename, { type: '' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        el.files = dataTransfer.files;
        cy.wrap(subject).trigger('change', {force: true});
      });
  }
})
