describe("Registration", () => {
  beforeEach("Registration", () => {
    cy.session("luzefegy@finews.biz", () => {
      cy.visit("https://balifoodstore.com/en/login?create_account=1");
      cy.contains("Mr.").click();
      cy.get("[name='firstname']").type("Carlos");
      cy.get("[name='lastname']").type("Miller");
      cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
      cy.get('[placeholder="Password"]').type("itsmeHello1!");
      cy.get('[name="psgdpr"]').click();
      cy.contains("Save").click();
     // cy.url().should("contain", "/MyAccount");
    });
  });

  it("home page", () => {
    console.log("hello user");
    //cy.get('[data-test-id="product-tile-1304"]').find("button").click();
  });
});