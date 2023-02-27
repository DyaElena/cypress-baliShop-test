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

  it("should display products sorted by descending price", () => {
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

  function assertSortedByName($titles) {
    const titles = $titles.map((index, element) => element.innerText.trim());

    for (let i in titles.length - 1) {
      if (titles[i] > titles[i + 1]) {
        return false;
      }
    }

    return true;
  }

  it("should display products sorted from A-Z", () => {
    cy.get(".search-open-btn").click();
    cy.get('[placeholder="Search"]').type("chocolate");
    cy.get(".center_wrapper > button.hidden-sm-down").click();

    cy.get(".select-title").click();
    cy.get(".dropdown-menu > a").eq(1).click();

    cy.get(".product-title > a", { timeout: 10000 })
      .should("have.length.at.least", 2)
      .should(assertSortedByName);
  });

  function assertSortedByNameDescending($titles) {
    const titles = $titles.map((index, element) => element.innerText.trim());

    for (let j in titles.length - 1) {
      if (titles[j] < titles[j + 1]) {
        return false;
      }
    }
    return true;
  }

  it("should display products sorted from Z-A", () => {
    cy.get(".search-open-btn").click();
    cy.get('[placeholder="Search"]').type("chocolate");
    cy.get(".center_wrapper > button.hidden-sm-down").click();

    cy.get(".select-title").click();
    cy.get(".dropdown-menu > a").eq(2).click();

    cy.get(".product-title > a", { timeout: 10000 })
      .should("have.length.at.least", 2)
      .should(assertSortedByNameDescending);
  });
});
