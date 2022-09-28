import { App } from "../page_objects/app";
import patientOne from "../fixtures/patientOne.json";

const app = new App();

describe("Appointment functionality", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("Book appointment and cancel appointment", () => {
    const date = app.getDateWithChanges(20);
    const consultationType = "Urgent Consultation";
    const postalCode = "J0B1M0";
    const patient = "patientOne";

    cy.log("WHEN: User goes to patient page");
    app.patientInformationPage.navigate();
    cy.log("AND: User fills out the patient form and click Continue");
    app.patientInformationPage.fillInFormByPatientData(patient);
    cy.log("Then: Modal page for choosing the reason for visit is open and contains patient name");
    app.patientInformationPage.reasonForVisitModal
      .getPageLabel(patientOne.firstName)
      .should("be.visible");
    app.patientInformationPage.reasonForVisitModal.searchForAvailabilitiesByCriteria(consultationType, postalCode, date)

    cy.log("Then: Appointment selection page is open");
    app.appointmentSelectionPage.pageLabel.should("be.visible");

    cy.log("When: User select first timeslot for appointment and provider");
    app.appointmentSelectionPage.setAppoinmentByNumber(0);
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

    cy.log("When: User select another timeslot for appointment and provider");
    app.appointmentSelectionPage.setAppoinmentByNumber(6);
    cy.log("Then: Review and book page is open");
    app.reviewAndBookPage.pageLabel.should("be.visible");

    cy.log("When: User restarts timer");
    cy.log("Then: Timer reset");
    app.reviewAndBookPage.checkTimer();

    cy.log('When: User click "Book this appointment"');
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
    cy.pause()
    app.appointmentCancellationPage.backToHomePageButton.click();
    cy.log("Then: User is taken back to the patient information page");
    app.patientInformationPage.pageLabel.should("be.visible");
  });
});
