describe("Login", () => {
  beforeEach("Login", () => {
    cy.visit("https://balifoodstore.com/en/login?back=my-account");
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get("#submit-login").click();

    cy.url().should("contain", "/my-account");
  });

  it("home page", () => {
    cy.get("h1").should("contain", "Your account");
  });

  it("verify nav", () => {
    cy.get(".anav-top").eq(0).find("li").should("have.length", 8);
  });

  it("verify if order more or less than min amount", () => {
    cy.contains("Veggies & Fruits").click();
    cy.get("article").eq(1).contains("Add to cart").click();
    cy.contains("Shopping Cart").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.url().should("contain", "/cart?action=show");

    const price = cy
      .get("#card-subtotal-products .value")
      .invoke("text")
      .then((text) => {
        const priceString = text.replace(/[^\d.-]/g, "");
        const price = parseFloat(priceString);
        cy.wrap(price).as("total-price");
      });

    if (cy.get("@total-price") < 50000) {
      cy.get('[class="alert alert-warning"]').should("be.visible");
      cy.contains("Checkout").should("be.disabled");
    }
    if (cy.get("@total-price") > 50000) {
      cy.contains("Checkout").click();
    }
  });

  it("order broccoli", () => {
    cy.contains("Veggies & Fruits").click();
    cy.contains("Add to cart").eq(0).click();
    cy.contains("Shopping Cart").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.url().should("contain", "/cart?action=show");

    cy.get(".current-price")
      .invoke("text")
      .then((text) => {
        const priceString = text.replace(/[^\d.-]/g, "");
        const price = parseFloat(priceString);
        cy.wrap(price).as("current-price");
      });

    cy.get(".cart-price-row input")
      .invoke("val")
      .then((value) => {
        const quantity = Number(value);
        cy.wrap(quantity).as("quantity");
      });

    cy.get("@current-price").then((currentPrice) => {
      cy.get("@quantity").then((quantity) => {
        const totalPriceCalculated = currentPrice * quantity;

        cy.get(".cart-price-row .product-price")
          .invoke("text")
          .then((text) => {
            const priceString = text.replace(/[^\d.-]/g, "");
            const price = parseFloat(priceString);
            cy.wrap(price);
          })
          .should("eq", totalPriceCalculated);
      });
    });

    cy.contains("Checkout").click();
    /*cy.get('[name="address1"]').type("Mejan");
    cy.get('[name="city"]').type("Canggu");
    cy.get("select").select("385").should("contain", "Canggu to Pererenan");
    cy.get('[name="phone_mobile"]').type("+6282147372752");
    */
    cy.get(".addresses-continue > .btn").click();
    cy.get("#js-delivery > .continue").click();
    cy.get("#payment-option-1").check().should("be.checked");
    cy.get("#conditions_to_approve").click();
    // cy.get('.ps-shown-by-js > .btn').click().should(); // place order
    //cy.url().should('include', '/order-confirmation');
  });

  it("verify search results", () => {
    cy.get(".search-open-btn").click();
    cy.get("form[class='search-form open']").should("be.visible");
    cy.get('[placeholder="Search"]').type("cheese");
    cy.get(".center_wrapper > button.hidden-sm-down").click();

    cy.get('[class="h3 product-title"]').each((item) => {
      cy.wrap(item).should("contain", "Cheese");
    });
  });

  it.only("verify add to favourites", () => {
    cy.contains("Veggies & Fruits").click();

    cy.get("[data-id-product='1']").find(".product-title").click();
    cy.get('[class="an_wishlist-mini js-an_wishlist-container"]').eq(0).click();
    cy.get(".breadcrumb li").eq(2).click();
    cy.get("[data-id-product='289']").find(".product-title").click();
    cy.get('[class="an_wishlist-mini js-an_wishlist-container"]').eq(0).click();
    cy.get(".js-an_wishlist-nav-count").should("contain", "2");
    cy.get("#_desktop_an_wishlist-nav").click();
    cy.get("[class='products row']")
      .and("contain", "Broccoli")
      .and("contain", "Basil Italian (100gr)");
  });
  //check if cart is empty when click on x
  // add, update address
  //create new address
  //more tests with calculations and ===
});
