
describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });
  it("should navigate to Tuesday", () => {
    cy.visit("/");
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
});

// should book an interview
/* 
visit the root
click on "add" in second appointment
enter name
Choose interviewer
click save
sees booked appt
 */

// should edit an interview
/*
Visit root
Click edit for existing
change name and interviewer
click save
see the edit
*/

// should cancel an interview
/*
visit root
click delete on existing
click confirm
see empty appt slot
*/