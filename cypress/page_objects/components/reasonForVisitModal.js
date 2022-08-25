export class ReasonForVisitModal {
    get reasonForVisitDropdown() {
        return cy.get('input[id="rfvInput"]')
    }

    get scrollBar() {
        return cy.get('ul[class*=el-scrollbar]')
    }

    get postalCodeInput() {
        return cy.get('input[id="locationAutocompleteInput"]')
    }

    get datePicker() {
        return cy.get('input[placeholder="YYYY-MM-DD"]')
    }

    get nextMonthButton() {
        return cy.get('button[aria-label="Next Month"]').eq(1)
    }

    get searchButton() {
        return cy.get('.pom-btn')
    }   

    getPageLabel(name) {
        return cy.get('div.el-drawer__body h1', { timeout: 10000 }).contains(`Hello ${name}!`)
    }
}