import { App } from "../page_objects/app";
import patientOne from "../fixtures/patientOne.json";

const app = new App();

describe("Appointment functionality", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("Book appointment and cancel appointment", () => {
    const date = app.getDateWithChanges(20);
    const expectedConsultationType = "Urgent Consultation";
    const symptomsText = "123Test%";
    const postalCode = "J0B1M0";
    const patient = "patientOne";

    cy.log("WHEN: User goes to patien page");
    app.patientInformationPage.navigate();
    cy.log("AND: User fills out the patient form");
    app.patientInformationPage.fillInFormByPatientData(patient);
    cy.log("AND: Click agreement checkbox and continue button");
    app.patientInformationPage.agreementCheckbox.click();
    cy.intercept("POST", "hub/GetAppointmentTypeGroups").as("getAppointment");
    app.patientInformationPage.continueButton.click();
    cy.wait("@getAppointment");
    cy.log("Then: Modal page for choosing the reason for visit is open and contains patient name");
    app.patientInformationPage.reasonForVisitModal
      .getPageLabel(patientOne.firstName)
      .should("be.visible");

    cy.log("When: User selects reason for visit in dropdown");
    app.patientInformationPage.reasonForVisitModal.reasonForVisitDropdown.click();
    app.patientInformationPage.reasonForVisitModal.scrollBar
      .contains(expectedConsultationType)
      .click();
    app.patientInformationPage.reasonForVisitModal.postalCodeInput.type(postalCode);
    cy.log("And: User selects date in datePicker and clicks search");
    app.patientInformationPage.reasonForVisitModal.datePicker
      .invoke("val", date)
      .should("have.value", date);
    app.patientInformationPage.reasonForVisitModal.searchButton.click();
    cy.log("Then: Appointment selection page is open");
    app.appointmentSelectionPage.pageLabel.should("be.visible");

    cy.log("When: User select timespot for appointment and provider");
    app.appointmentSelectionPage.setAppoinment();
    cy.log("Then: Review and book page is open");
    app.reviewAndBookPage.pageLabel.should("be.visible");

    cy.log('When: User selects "Select a different appointment" option');
    app.reviewAndBookPage.selectDifferentAppointmentButton.click();
    cy.log(
      "Then: Modal page for choosing the reason for visit is open and contains patient name"
    );
    app.patientInformationPage.reasonForVisitModal
      .getPageLabel(patientOne.firstName)
      .should("be.visible");

    cy.log("When: User clicks search");
    app.patientInformationPage.reasonForVisitModal.searchButton.click();
    cy.log("Then: Appointment selection page is open");
    app.appointmentSelectionPage.pageLabel.should("be.visible");

    cy.log("When: User select timespot for appointment and provider");
    app.appointmentSelectionPage.setAppoinment();
    cy.log("Then: Review and book page is open");
    app.reviewAndBookPage.pageLabel.should("be.visible");

    cy.log("When: User restarts timer");
    cy.log("Then: Timer is reseted");
    app.reviewAndBookPage.checkTimer();

    cy.log(
      'When: User fills in the symptom description field and click "Book this appointment"'
    );
    app.reviewAndBookPage.describeSimptomsTextBox
      .type(symptomsText)
      .should("have.value", symptomsText);
    app.reviewAndBookPage.bookThisAppointmentButton.click();
    cy.log("Then: Confirmation of appointment is displayed");
    app.confirmationPage.confirmationMessage.should("be.visible");

    cy.log("When: User cancels appointment");
    app.confirmationPage.cancelAppointmentButton.click();
    cy.intercept("POST", "/events/preprod").as("event");
    app.appointmentCancellationPage.confirmCancelAppointmentButton.click();
    cy.wait("@event").its("response.statusCode").should("eq", 200);
    cy.log("Then: Message about cancel confirmation is displayed");
    app.appointmentCancellationPage.cancellationMessage.should("be.visible");
    cy.log("When: User clicks back to Home Page");
    app.appointmentCancellationPage.backToHomePageButton.click();
    cy.log("Then: User is taken back to the patient information page");
    app.patientInformationPage.pageLabel.should("be.visible");
  });
});
