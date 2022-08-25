export class AppointmentSelectionPage {

    setAppoinment() {
        this.waitUntilIntercept()     
        this.nextAvailablities.click({force: true})
        this.waitUntilIntercept()
        this.firstTimeslot.click({force: true})
        this.waitUntilIntercept()
        this.firstProvider.click({force: true})
    }

    waitUntilIntercept() {
        cy.intercept('POST','/events/preprod').as('event')
        cy.wait('@event', {timeout: 10000})
    }

    get nextAvailablities() {        
        return cy.get('button[name="next-availabilities"]').should('be.visible')
    }

    get firstTimeslot() {
        return cy.get('div[class=mt-2] p').should('be.visible').first()
    }

    get firstProvider() {
        return cy.get('button[name="select-appointment"]').should('be.visible').first()
    }    
    
    get pageLabel() {
        return cy.get('div.justify-center p', { timeout: 10000 }).contains('Appointment selection')
    }
}