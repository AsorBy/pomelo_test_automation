import { App } from "../page_objects/app";
import patientOne from '../fixtures/patientOne.json'

const app = new App();


describe('Book appoinment', () => {
  it('Fill patient form', () => {
    const date = app.getDateWithChanges(20)
    const expectedConsultationType = 'Urgent Consultation'    
    const symptomsText = "123Test%"
    const postalCode = 'G1K1G3';    

    cy.log('WHEN: User goes to patien page')
    app.partientInformationPage.navigate()
    cy.log('AND: User fills out the patient form')
    app.partientInformationPage.fillInFormByPatientData('patientOne')
    cy.log('AND: Click agreement checkbox and continue button')
    app.partientInformationPage.agreementCheckbox.click();
    app.partientInformationPage.continueButton.click();    
    cy.intercept('POST', 'hub/GetAppointmentTypeGroups').as('getAppointment')   
    cy.wait('@getAppointment', {timeout: 10000}).its('response.statusCode').should('eq', 200);
    cy.log('Then: Modal page for choosing the reason for visit is open and contains patient name')
    app.partientInformationPage.reasonForVisitModal.getPageLabel(patientOne.firstName).should('be.visible')

    cy.log('When: User selects reason for visit in dropdown')
    app.partientInformationPage.reasonForVisitModal.reasonForVisitDropdown.click()
    app.partientInformationPage.reasonForVisitModal.scrollBar.contains(expectedConsultationType).click()
    app.partientInformationPage.reasonForVisitModal.postalCodeInput.type(postalCode)
    cy.log('And: User selects date in datePicker and clicks search')
    app.partientInformationPage.reasonForVisitModal.datePicker.invoke('val', date).should('have.value', date)
    app.partientInformationPage.reasonForVisitModal.searchButton.click();
    cy.log('Then: Appointment selection page is open')
    app.appointmentSelectionPage.pageLabel.should('be.visible')
    
    cy.log('When: User select timespot for appointment and provider')
    app.appointmentSelectionPage.setAppoinment()
    cy.log('Then: Review and book page is open')
    app.appointmentSelectionPage.waitUntilIntercept()
    app.reviewAndBookPage.pageLabel
   
    cy.log('When: User selects "Select a different appointment" option')
    app.reviewAndBookPage.selectDifferentAppointmentButton.click()
    cy.log('Then: Modal page for choosing the reason for visit is open and contains patient name')
    app.appointmentSelectionPage.waitUntilIntercept()
    app.partientInformationPage.reasonForVisitModal.getPageLabel(patientOne.firstName).should('be.visible')

    cy.log('When: User clicks search')
    app.partientInformationPage.reasonForVisitModal.searchButton.click()
    cy.log('Then: Appointment selection page is open')
    app.appointmentSelectionPage.pageLabel.should('be.visible')
    
    cy.log('When: User select timespot for appointment and provider')
    app.appointmentSelectionPage.setAppoinment()
    cy.log('Then: Review and book page is open')
    app.appointmentSelectionPage.waitUntilIntercept()
    app.reviewAndBookPage.pageLabel.should('be.visible')

    cy.log('When: User restarts timer')
    cy.log('Then: Timer is reseted')
    app.reviewAndBookPage.checkTimer()

    cy.log('When: User fills in the symptom description field and click "Book this appointment"')
    app.reviewAndBookPage.describeSimptomsTextBox.type(symptomsText).should('have.value', symptomsText);
    app.reviewAndBookPage.bookThisAppointmentButton.click()
    cy.log('Then: Confirmation of appointment is displayed')
    app.confirmationPage.confirmationMessage.should('be.visible')
    
    cy.log('When: User cancels appointment')
    app.confirmationPage.cancelAppointmentButton.click()
    app.appointmentCancellationPage.confirmCancelAppointmentButton.click()
    cy.log('Then: Message about cancel confirmation is displayed')
    app.appointmentCancellationPage.cancelationMessage.should('be.visible')
    cy.log('When: User clicks back to Home Page')
    app.appointmentCancellationPage.backToHomePageButton.click();
    cy.log('Then: User is taken back to the patient information page')
    app.partientInformationPage.pageLabel.should('be.visible')
  })
})