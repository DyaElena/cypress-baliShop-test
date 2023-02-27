describe("Tests", () => {
  beforeEach("Login", () => {
    cy.visit("https://balifoodstore.com/en/login?back=my-account");
    cy.get('[placeholder="Email"]').type("luzefegy@finews.biz");
    cy.get('[placeholder="Password"]').type("itsmeHello1!");
    cy.get("#submit-login").click();
    cy.get(".notification_cookie-accept").click();

    cy.url().should("contain", "/my-account");
  });

  it("verify home page", () => {
    cy.get("h1").should("contain", "Your account");
  });

  it("verify nav bar", () => {
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

  it("verify placing an order", () => {
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

  it("verify add to favourites", () => {
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

  it("verify if cart is empty when click on x(delete) before 'proceed to checkout'", () => {
    cy.contains("Veggies & Fruits").click();
    cy.get("[data-id-product='9']").find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="289"]').find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="11"]').find(".an_productattributes-add").click();
    cy.get("#js-cart-sidebar")
      .find(".cart-items")
      .find("li")
      .should("have.length", "3");
    cy.get("#js-cart-sidebar")
      .find(".cart-items")
      .find(".remove-from-cart")
      .click({ multiple: true });

    cy.get("#js-cart-sidebar").should(
      "contain",
      "There are no more items in your cart"
    );
  });

  it("verify if cart is empty when click on x(delete) in cart", () => {
    cy.contains("Veggies & Fruits").click();
    cy.get("[data-id-product='9']").find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="289"]').find(".an_productattributes-add").click();
    cy.get(".sb-close-btn").click();
    cy.get('[data-id-product="11"]').find(".an_productattributes-add").click();
    cy.get(".cart-action a").eq(1).click({ force: true });
    cy.get('[class="cart-overview js-cart"]')
      .find("li")
      .should("have.length", "3"); // check that all items were added to the cart
    cy.get(".cart-item").find(".remove-from-cart").eq(0).click();
    cy.get(".cart-item").find(".remove-from-cart").eq(1).click();
    cy.get(".cart-item").find(".remove-from-cart").eq(2).click();
    cy.get(".no-items").should("be.visible"); // check if cart is empty
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

  it("verify that out of stock product cannot be added to the cart", () => {
    cy.contains("Dairy & Eggs").click();
    cy.get("h1").should("contain", "Dairy & Eggs");
    cy.get('[data-id-product="164"]')
      .contains("Add to cart")
      .should("be.disabled");
  });

  it("verify price change when change product weight", () => {
    const weight = ["250 gr", "500 gr", "1 kg"];
    const broccoli = ["Rp19,500", "Rp29,500", "Rp48,000"];
    const weightValues = ["366", "367"];
    cy.contains("Veggies & Fruits").click();

    weight.forEach((value, index) => {
      cy.get(".product-prices-block").eq(0).should("contain", broccoli[index]);
      cy.get('[class="an_productattributes-dropdown-toggler"]')
        .eq(0)
        .should("contain", value);

      if (index < 2) {
        cy.get('[class="an_productattributes-dropdown-toggler"]').eq(0).click();
        cy.get(`[data-value="${weightValues[index]}"]`).eq(0).click();
        cy.get(".js-an_productattributes-filter-option").eq(0);
      }
    });
  });
});
