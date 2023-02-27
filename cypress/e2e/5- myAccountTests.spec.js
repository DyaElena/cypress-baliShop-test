describe("My account tests", () => {
  beforeEach("Login", () => {
    cy.session("user-luzefegy@finews.biz", () => {
      cy.visit("https://balifoodstore.com/en/login?back=my-account");
      cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
      cy.get('[placeholder="Password"]').type("itsmeHello1!");
      cy.get("#submit-login").click();
      cy.get(".notification_cookie-accept").click();
      cy.url().should("contain", "/my-account");

      cy.get('[aria-label="Logout dropdown"]').click();
      cy.get(".logout").should("contain", "Sign out");
    });

    cy.visit("https://balifoodstore.com/en/login?back=my-account");
  });

  it(" verify add new address", () => {
    cy.contains("Addresses").click();
    cy.get('[data-link-action="add-address"]').click();
    cy.get('[name="alias"]').type("work");
    cy.get('[name="address1"]').type("Jl. Canggu Padang Linjong No.12a");
    cy.get('[name="postcode"]').type("80351");
    cy.get('[name="city"]').type("Kuta Utara");
    cy.get("select")
      .eq(0)
      .select("385")
      .should("contain", "Canggu to Pererenan");
    cy.get('[name="phone_mobile"]').type("+6282147372752");
    cy.contains("Save").click();
    cy.get("#address-438").should("contain", "work");
  });

  it(" verify update address", () => {
    cy.contains("Addresses").click();
    cy.get("[data-link-action='edit-address']").eq(0).click();
    cy.get('[name="alias"]').clear().type("home");
    cy.contains("Save").click();
    cy.get("#address-436").should("contain", "home");
  });

  it(" verify delete address", () => {
    cy.contains("Addresses").click();
    cy.get("[data-link-action='delete-address']").eq(1).click();
    cy.get("#content").should("have.length", "1");
  });
});
