import { ReasonForVisitModal } from "./components/reasonForVisitModal";

export class PatientInformationPage {
    navigate() {
        cy.visit('https://preprod-go.pomelopatient.com/#/')
    }

    fillInFormByPatientData(patienJson) {
        cy.fixture(patienJson).then((patient) => {
            this.firstNameInput.type(patient.firstName);
            this.lastNameInput.type(patient.lastName);
            this.healthInsuranceNumberInput.type(patient.hin);    
            this.sequentialNumberInput.type(patient.hinSequence);
            this.yearInput.should('have.value', patient.year)
            this.radioButtonByText(patient.sex).click();    
            this.mobilePhoneInput.type(patient.phone);    
            this.radioButtonByText(patient.language).click();
            this.emailInput.type(patient.email);
        })
    }

    radioButtonByText(textBtn){
        return cy.get(".el-radio-button__inner").contains(textBtn)
    }

    get reasonForVisitModal() {
        const reasonModal = new ReasonForVisitModal()
        return reasonModal;
    }

    get firstNameInput() {
        return cy.get("input[name='firstName']")
    }

    get lastNameInput() {
        return cy.get("input[name='lastName']")
    }

    get healthInsuranceNumberInput() {
        return cy.get("input[name='hin']")
    }

    get sequentialNumberInput(){
        return cy.get("input[name='hinSequence']")
    }

    get yearInput(){
        return cy.get("input[id$='24']")
    }

    get emailInput(){
        return cy.get("input[type='email']")
    }

    get mobilePhoneInput(){
        return cy.get("input[name='mobilePhone']")
    }

    get agreementCheckbox(){
        return cy.get(".el-checkbox__inner")
    }

    get continueButton(){
        return cy.contains('button', 'Continue')
    }

    get pageLabel() {
        return cy.get('div.justify-center p').contains('Patient information')
    }

    get pageLabel() {
        return cy.get('div.justify-center p').should('contain', 'Patient information')
    }
}
