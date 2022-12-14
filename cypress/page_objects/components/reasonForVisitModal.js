export class ReasonForVisitModal {

    searchForAvailabilitiesByCriteria(consultationType, postalCode, date) {
        cy.log("When: User selects reason for visit in dropdown");
        this.reasonForVisitDropdown.click();
        this.scrollBar
            .contains(consultationType)
            .click();
        this.postalCodeInput.type(postalCode);
        cy.log("And: User selects date in datePicker and clicks search");
        this.datePicker.invoke("val", date);
        this.searchButton.click();
    }

    get reasonForVisitDropdown() {
        return cy.get('input[id="rfvInput"]');
    }

    get scrollBar() {
        return cy.get('ul[class*=el-scrollbar]');
    }

    get postalCodeInput() {
        return cy.get('input[id="locationAutocompleteInput"]');
    }

    get datePicker() {
        return cy.get('input[placeholder="YYYY-MM-DD"]');
    }

    get nextMonthButton() {
        return cy.get('button[aria-label="Next Month"]').eq(1);
    }

    get searchButton() {
        return cy.get('.pom-btn');
    }   

    getPageLabel(name) {
        return cy.get('div.el-drawer__body h1', { timeout: 10000 }).contains(`Hello ${name}!`);
    }
}