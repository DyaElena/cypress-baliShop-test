describe("Sorting tests", () => {
  beforeEach("Login", () => {
    cy.visit("https://balifoodstore.com/en/login?back=my-account");
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get("#submit-login").click();
    cy.get(".notification_cookie-accept").click();

    cy.url().should("contain", "/my-account");
  });

  it("should display products sorted by ascending price", () => {
    cy.get(".search-open-btn").click();
    cy.get('[placeholder="Search"]').type("chocolate");
    cy.get(".center_wrapper > button.hidden-sm-down").click();

    cy.get(".select-title").click();
    cy.get(".dropdown-menu > a").eq(3).click();

    cy.get(".money").then(($prices) => {
      const prices = [];
      $prices.each((index, element) => {
        prices.push(Number(element.getAttribute("data-currency-idr")));
      });
      expect(prices).to.deep.equal(prices.slice().sort((a, b) => a - b));
    });
  });

  it.only("should display products sorted by descending price", () => {
    cy.get(".search-open-btn").click();
    cy.get('[placeholder="Search"]').type("chocolate");
    cy.get(".center_wrapper > button.hidden-sm-down").click();

    cy.get(".select-title").click();
    cy.get(".dropdown-menu > a").eq(4).click();

    cy.get(".money").then(($prices) => {
      const prices = [];
      $prices.each((index, element) => {
        prices.push(Number(element.getAttribute("data-currency-idr")));
      });
      expect(prices).to.deep.equal(prices.slice().sort((a, b) => b - a));
    });
  });
});
