export class AppointmentSelectionPage {

    setAppoinment() {
        cy.intercept('POST','/events/preprod').as('event')     
        this.nextAvailablities.click({force: true})
        cy.wait('@event');
        cy.intercept('POST','/events/preprod').as('event')  
        this.firstTimeslot.click({force: true})
        cy.wait('@event');
        this.firstProvider.click({force: true})
        cy.url().should('contain', '/review')
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
        return cy.contains('Appointment selection')
    }
}