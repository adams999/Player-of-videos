function ProductsDisplay(props) {
  var products = props.products;
  var streamObj = props.streamObj;
  var storeDetails = props.storeDetails;
  var videoId = props.streamObj._id;
  var userId = props.userId;
  var productsAvailable = props.productsAvailable;
  var streamer = props.streamer;
  var storeDetails = props.storeDetails;
  var forwardingAddress = props.forwardingAddress;
  var privateIp = props.privateIp;
  var libraryPath = props.libraryPath;
  var analytics = props.analytics;
  var sendGoogleEvents = props.sendGoogleEvents

  var streamBaseAddress = props.streamBaseAddress;
  var stripePublicKey = props.stripePublicKey;
  var stripe = props.stripe;
  var elements = props.elements;

  var countries = props.countries;
  var citiesByCountry = props.citiesByCountry;
  var statesByCountry = props.statesByCountry;

  var countriesListFetchPath = props.countriesListFetchPath;
  var statesListFetchPath = props.statesListFetchPath;
  var citiesListFetchPath = props.citiesListFetchPath;

  //called by formatTime after formatting time to show products
  var listOfProductsShowingMaintained = [];
  var cartItems = [];
  var checkoutResponseCopy = {};
  var updatedCheckoutResponseCopy = {};
  var totalBill = 0;
  var subTotal = 0;
  var totalAmount = 0.0;
  var shippingAddress = {};
  var shippingForm = {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    state: ""
  };
  var billingForm = {
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    state: ""
  };
  var totalAmountCartItems = 0.0;
  var isShippingRequired = true;

  var countries = [];
  var statesByCountry = [];
  var citiesByCountry = [];
  var hideVariantIndexes = [];
var forceHideMenu = false
  getCountries = async function () {
    let countriesData = await fetch(countriesListFetchPath);
    let respJson = await countriesData.json();
    countries = respJson.body.countries;
    await getStatesByCountry(countries[0].id);
  };
  getStatesByCountry = async function (countryId) {
    let statesData = await fetch(statesListFetchPath + countryId);
    let respJson = await statesData.json();
    statesByCountry = respJson.body.states;

    await getCitiesByStates(statesByCountry[0].id);
  };

  getCitiesByStates = async function (stateId) {
    let citiesData = await fetch(citiesListFetchPath + stateId);
    let respJson = await citiesData.json();
    citiesByCountry = respJson.body.cities;
  };

  getCountries();

  var productDisplayContainer = $("#productDisplayContainer");
  var displayContainerHTML =
    `<button class="btn-menu" id="products-opener"><i class="fa fa-bars"></i></button> 
    <div class="box product-box" id="products-wrapper"> 
    <div class="buttons-nav"> 
    <button class="btn-cart" id="cart-button"> 
    <i><img src=${libraryPath}/images/cart.svg></i> 
    <span class="cart-count" id="cart-count">0</span> 
    </button> 
    <button class="btn-share" id="share-button" data-toggle="modal" data-target="#myModal"><i><img src=${libraryPath}/images/share.svg></i></button>
    <button class="btn-close" id="products-closer"><i><img src=${libraryPath}/images/close.svg></i>
    </button>

    </div> 
    <div id="real_product_wrapper"></div> 
    </div>
    <div class="modal" id="myModal">
<div class="modal-dialog modal-dialog-centered">
  <div class="modal-content">

    <!-- Modal Header -->
    <div class="modal-header pb-0">
      <button type="button" class="close" data-dismiss="modal">&times;</button>
    </div>

    <!-- Modal body -->
    <div class="modal-body">
    <h5 class="modal-title mb-4">Share via your social media:</h5>
    <span class="media">
    <img class="share-icon mr-1" id="share-faceBook" src=${libraryPath}/images/facebook.svg alt="">
    <img class="share-icon ml-1" id="share-twitter" src="${libraryPath}/images/twitter.svg" alt="">
    <img class="share-icon ml-1" id="share-linkedin" src="${libraryPath}/images/linkedin.svg" alt="">
    </span>
    </div>
    <!-- Modal footer -->
    <div class="modal-footer">
      <!--<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>-->
    </div>

  </div>
</div>
</div>`
  productDisplayContainer.append(displayContainerHTML);
  document
    .getElementById("cart-button")
    .addEventListener("click", () => showCartProducts());
  document
    .getElementById('share-faceBook')
    .addEventListener('click', () => share('facebook'))
  document
    .getElementById('share-twitter')
    .addEventListener('click', () => share('twitter'))
  document
    .getElementById('share-linkedin')
    .addEventListener('click', () => share('linkedin'))

  function share(type) {
    if (type == "facebook") {
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + streamBaseAddress,
        '_blank'
      );
    }
    if (type == "twitter") {
      window.open(
        'https://twitter.com/intent/tweet?url=' +
        streamBaseAddress,
        '_blank'
      );
    }
    if (type == "linkedin") {
      window.open(
        'https://www.linkedin.com/shareArticle?mini=true&url=' +
        streamBaseAddress,
        '_blank'
      );
    }
  }

  function copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    var tooltip = document.getElementById("myTooltip");
    var tooltip1 = document.getElementById("myTooltip1");
    tooltip1.innerHTML = "Copy to Clipboard"
    tooltip.innerHTML = "Copied";
  }

  function copyInputMessage1(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    var tooltip1 = document.getElementById("myTooltip1");
    var tooltip = document.getElementById("myTooltip");
    tooltip1.innerHTML = "Copied";
    tooltip.innerHTML = "Copy to Clipboard";
  }

  function outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
  }

  this.display = function (min, sec) {
    var listOfProductsShowing = [];

    products.forEach((product, index) => {
      let productTimeInMins = parseInt(product.timeIn.split(":")[0]);
      let productTimeInSecs = parseInt(product.timeIn.split(":")[1]);
      let productTimeOutMins = parseInt(product.timeOut.split(":")[0]);
      let productTimeOutSecs = parseInt(product.timeOut.split(":")[1]);

      if ((((min == productTimeInMins && sec == productTimeInSecs) || (min > productTimeInMins && sec > productTimeInSecs) || (min == productTimeInMins && sec > productTimeInSecs))) && ((min <= productTimeOutMins && sec <= productTimeOutSecs) || (min < productTimeOutMins && sec <= 60))) {
        //  if((min >= productTimeInMins && min <= productTimeOutMins) && (sec >= productTimeInSecs && sec <= productTimeOutSecs)){
        if(!forceHideMenu){
          document.getElementById("products-wrapper").style.display = "block";
        }
        if (listOfProductsShowing.indexOf(product) == -1) {
          listOfProductsShowing.push(product);
          listOfProductsShowingMaintained.push(product);
          productsAvailable = true;
        }
      }

      if (product.timeOut != "00:00") {
        if (
          // ((min <= productTimeInMins && min >= productTimeOutMins) || (sec <= productTimeInSecs && sec >= productTimeOutSecs)){
          ((min >= productTimeOutMins && sec >= productTimeOutSecs) || (min > productTimeOutMins)) ||
          (min <= productTimeInMins && sec < productTimeInSecs) ||
          (min < productTimeInMins && sec <= 60)
        ) {
          jQuery("#" + product.product.id).remove();
        }
      }
    });
   
    listOfProductsShowing.forEach((product, index) => {
      if (!document.getElementById(product.product.id)) {
        jQuery("#real_product_wrapper").append(getHTMLOfProductObject(product));
        console.log(product.product.id, product.productId);
        
        document
          .getElementById(product.product.id )
          .addEventListener("click", () => productDetails(product.productId));
      }
    });
  };

  function getHTMLOfProductObject(product) {
    console.log(product.type);
    
    if(product.type === 'product'){
      return `<div class="row card-p" id=${product.product.id}> 
      <div class="col-12"> 
      <div class="well well-sm"> 
      <div class="row pb-2 border-separator"> 
      <div class="col-sm-3 col-4 pull-right text-sm-center"> 
      <img src=${product.product.image} alt="" class="img-rounded img-responsive product-img tabimageimprove" /> 
      </div> 
      <div class="col-sm-9 col-7 text-left product-text product-alignment"> 
      <h6 class="w-bold tabfontimprove">  ${product.title}  </h6> 
      <p class="stream-product-price">Price: <b class="font-weight-lighter">$  ${product.product.price}  </b></p> 
      </div> 
      </div> 
      </div> 
      </div> 
      </div>`
    }
    if(product.type === 'form'){
      return `<div class="row card-p" id=${product.product.id}> 
      <div class="col-12"> 
      <div class="well well-sm"> 
      <div class="row pb-2 border-separator"> 
      <div class="col-sm-3 col-4 pull-right text-sm-center"> 
      <h4>Lead Generation Form</h4>
      </div> 
      <div class="col-sm-9 col-7 text-left product-text product-alignment"> 
      <h6 class="w-bold tabfontimprove">  ${product.title}  </h6> 
      </div> 
      </div> 
      </div> 
      </div> 
      </div>`
    }
  }

  function productDetails(id) {

    if (document.getElementById("product-details")) {
      document.getElementById("product-details").style.display = "none";
    }
    var product = {};

    listOfProductsShowingMaintained.forEach(e => {
      if (e.productId == id) {
        product = e;
      }
    });

    sendGoogleEvents("Ecommerce", "Product View", "Click on single product");

    analytics.sendawsEvent({
        eventType: "productView",
        productId: product.product._id,
        productAmount: Number(product.product.price),
        productName: product.title
      },
      userId,
      videoId
    );

    document.getElementById("real_product_wrapper").style.display = "none";
    var productHTML =
      '<div class="row products-details-componenet">' +
      '<div class="col-md-12 text-left"><a class="text-white pl-4 product-detail-back" id="productDetailBackToListing"> <i class="fa fa-angle-left" aria-hidden="true"></i>&nbsp Back to Products</a></div>' +
      '<div class="col-md-12 position-center mt-4">' +
      '<img id="prod_img" src="' +
      product.product.image +
      '" alt="" class="img-rounded img-responsive detail-pr-img" />' +
      "</div>" +
      '<div class="col-md-12 text-left"><h5 id="prod_title" class="w-bold text-white pl-4 pt-4 tabfontimprove">' +
      product.title +
      "</h5></div>" +
      // '<div class="col-md-12"><h5 class="w-bold text-white pl-4 tabfontimprove">Cleanser</h5></div>' +
      '<div class="col-md-12 text-left"><h4 id="prod_price" class="w-bold text-white pl-4">$' +
      product.product.price +
      "</h4></div>" +
      // '<div class="col-md-6 pr-0"><label class="text-white pl-4">Color</label></div>' +
      // '<div class="col-md-6 pl-0">   <ul class="container">' +
      // '<li><input type="radio" id="f-option" name="selector"><label for="f-option"></label>' +
      // '<div class="check"></div></li>' +
      // '<li class="left-25px"><input type="radio" id="s-option" name="selector"><label for="s-option"></label>' +
      // '<div class="check"></div></li>' +
      // '<li class="left-50px"><input type="radio" id="g-option" name="selector"><label for="g-option"></label>' +
      // '<div class="check"></div></li>' +
      // '</ul></div>' +
      // '<div class="col-md-6 pr-0"><label class="text-white pl-4">Size</label></div>' +
      // '<div class="col-md-6 pl-0">   <ul class="container">' +
      // '<li><input type="radio" id="f-option" name="selector"><label for="f-option"></label>' +
      // '<div class="check"></div></li>' +
      // '<li class="left-25px"><input type="radio" id="s-option" name="selectors"><label for="s-option"></label>' +
      // '<div class="check"></div></li>' +
      // '<li class="left-50px"><input type="radio" id="g-option" name="selectord"><label for="g-option"></label>' +
      // '<div class="check"></div></li>' +
      // '</ul></div>' +
      '<div class="col-md-12 mt-1 text-left"><label class="pl-4 text-white"  id="productDetailShowDetail"><u class = "product-detail-more-detail">More Details + </u></label></div>' +
      '<div class="col-md-12 product-details text-left text-white" id="product-details"><p id="prod_details" class="pl-4">' +
      product.product.details +
      "<p></div>" +
      '<div class="col-md-12 plr"><button class="btn btn-primary btn-sm w-100-btn submit-btn-improve mt-3 mb-3" id="productDetailAddToCart">Add to Cart</button></div>' +
      "</div>";
    if (document.getElementsByClassName('row products-details-componenet').length == 0) {
      jQuery("#products-wrapper").append(productHTML);
    } else {
      var productDetailsComponent = document.getElementsByClassName(
        "products-details-componenet"
      );
      jQuery('#prod_img').attr("src", product.product.image);
      jQuery('#prod_title').text(product.title)
      jQuery('#prod_price').text('$' + product.product.price)
      jQuery('#prod_details').text(product.product.details)
      for (var i = 0; i < productDetailsComponent.length; i++) {
        productDetailsComponent[i].style.display = "block";
      }
    }
    document
      .getElementById("productDetailBackToListing")
      .addEventListener("click", () => backToProductListing());
    document
      .getElementById("productDetailShowDetail")
      .addEventListener("click", () => showDetails());
    document
      .getElementById("productDetailAddToCart")
      .addEventListener("click", () => addToBag(product.productId));

    document.getElementById("product-details").style.display = "none";
  }
  let detailOpen = true;
  $(document).ready(function () {
    detailOpen = true;
  });

  function showDetails() {
    sendGoogleEvents(
      "Ecommerce",
      "Product Details View",
      "Click on product details"
    );

    if (document.getElementById("product-details").style.display == "none") {
      document.getElementById("product-details").style.display = "block";
      detailOpen = false;
    } else {
      document.getElementById("product-details").style.display = "none";
      detailOpen = true;
    }
  }

  function backToProductListing() {
    if (document.getElementById("cartMessage")) {
      document.getElementById("cartMessage").innerHTML = ""
    }
    if (document.getElementById("paymentFormMessage")) {
      document.getElementById("paymentFormMessage").innerHTML = ""
    }

    document.getElementById("real_product_wrapper").style.display = "block";

    var cObjs = document.getElementsByClassName("cart-obj");
    for (var i = 0; i < cObjs.length; i++) {
      cObjs[i].style.display = "none";
    }

    jQuery(".order-placed-msg").remove();
    jQuery(".products-details-componenet").remove();

  }

  function addToBag(productId) {
    var item = {};

    let id_s = _.map(cartItems, "productId");

    listOfProductsShowingMaintained.forEach(e => {
      if (e.productId == productId) {
        item = e;
      }
    });

    sendGoogleEvents("Ecommerce", "Add to cart", "Product added to card");

    analytics.sendawsEvent({
        eventType: "productAddedToCart",
        productId: item.product._id,
        productName: item.title,
        productAmount: Number(item.product.price)
      },
      userId,
      videoId
    );
    if (id_s.indexOf(item.productId) == -1) {
      cartItems.push(item);
    }

    jQuery("#cart-count").text(cartItems.length);
    backToProductListing();
  }

  function checkQuantity(cartItems) {
    cartItems.forEach((items, i) => {
      if (items.quantity) {
        $("#cartItemId-" + i).val(items.quantity);
      }
    });
  }

  function showCartProducts() {
    sendGoogleEvents("Ecommerce", "View Cart", "View cart");
    if (document.getElementById("cartMessage")) {
      document.getElementById("cartMessage").innerHTML = ""
    }
    jQuery(".order-placed-msg").remove();
    jQuery(".payemtDs").remove();
    jQuery(".ship-infor").remove();
    jQuery(".cart-obj").remove();
    jQuery(".products-details-componenet").remove();
    jQuery(".shipping-selection").remove();
    jQuery(".order-summary").remove();
    jQuery(".order-summary-header").remove();

    document.getElementById("real_product_wrapper").style.display = "none";

    var htmlForCartItems = "";
    totalAmountCartItems = 0.0;
    let backToPL =
      '<div class="row cart-obj my-2"><div class="col-md-12 text-left"><a class="text-white pl-4 product-detail-back" id="cartBackToProducts"> <i class="fa fa-angle-left" aria-hidden="true"></i> Back to Products</a></div></div>';

    cartItems.forEach((element, ind) => {
      let variantHTML = getVariantHTML(element.product.variants);
      if (variantHTML === "") {
        hideVariantIndexes.push(ind)
      }
      htmlForCartItems +=
        '<div class="row card-p mt-5 cart-obj" id="cart-products">' +
        '<div class="col-12">' +
        '<div class="well">' +
        '<div class="row m-sm-0">' +
        '<div class="col-md-3 col-4 pull-right text-sm-center">' +
        '<img src="' +
        element.product.image +
        '" height="80px" width="80px" alt="" class="img-rounded img-responsive tabimageimprove" />' +
        "</div>" +
        '<div class="col-md-8 col-6 text-left product-text pr-0">' +
        '<h5 class="w-bold">$' +
        element.product.price +
        "</h5>" +
        '<h6 class="">' +
        element.title +
        "</h6>" +
        '<div class="row">' +
        '<div class="col-4 pt-2 pr-1">' +
        '<select class="form-control h-35"  id="cartItemId-' +
        ind +
        '">' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4">4</option>' +
        '<option value="5">5</option>' +
        '<option value="6">6</option>' +
        '<option value="7">7</option>' +
        '<option value="8">8</option>' +
        '<option value="9">9</option>' +
        "</select>" +
        "</div>" +
        '<div class="col-7 pt-2 pl-0">' +
        '<select class="form-control h-35 hide-when-zero" id="cartVariantId-' +
        ind +
        '">' +
        variantHTML +
        "</select>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="col-md-1 col-2 pl-0 text-right">' +
        '<button type="button" class="trash-button" id="cartRemoveId-' +
        ind +
        '"><i><img src="' +
        libraryPath +
        '/images/delete.svg"></i></button>' +
        "</div>" +
        "</div>" +
        '<div class="row pl-4 pr-4"><div class="col-md-12 pt-3 mb-3 border-separator"></div></div>';
      "</div>" + "</div>" + "</div>";
      if (element.product.totalPrice > 0.0) {
        totalAmountCartItems += parseFloat(element.product.totalPrice);
      } else {
        totalAmountCartItems += parseFloat(element.product.price);
      }
    });

    let totalAmountHtml =
      '<div class="row total-price-row cart-obj">' +
      '<div class="col-md-12 text-left total-price-wrapper">' +
      '<label class="total-text">Total</label>' +
      '<label class="pull-right change-total-price total-price">$' +
      totalAmountCartItems.toFixed(2) +
      "</label>" +
      "</div>" +
      "</div>"
    let checkoutButton =

      '<div class="row cart-obj mb-3"><span class="msg-err plr-15" id="cartMessage"></span><div class="col-md-12 plr-15 mt-3"><button class="btn btn-primary btn-sm w-100-btn submit-btn-improve" id="cartCheckout">Checkout</button></div></div>';
    jQuery("#products-wrapper").append(
      backToPL + htmlForCartItems + totalAmountHtml + checkoutButton
    );
    hideVariantIndexes.forEach(index => {
      $(document).ready(function () {
        $('#cartVariantId-' + index).hide();
      })
    })
    document
      .getElementById("cartCheckout")
      .addEventListener("click", () => {
        if (!cartItems.length) {
          document.getElementById("cartMessage").innerHTML = "Cart Empty."
          return
        } else {
          shippingDetails()
        }
      });

    var that = this;

    cartItems.forEach((element, ind) => {
      document
        .getElementById("cartItemId-" + ind)
        .addEventListener("change", () => cartQuantityChange(ind));
      document
        .getElementById("cartVariantId-" + ind)
        .addEventListener("change", () => cartVariantChange(ind));
      document
        .getElementById("cartRemoveId-" + ind)
        .addEventListener("click", () => removeCartItem(ind));
    });
    document
      .getElementById("cartBackToProducts")
      .addEventListener("click", () => backToProductListing());

    checkQuantity(cartItems);
  }

  function getVariantHTML(variants) {
    let selectOptions = "";

    variants.forEach(v => {
      if (v.title == "Default Title") {
        v.title = "none";
      } else {
        selectOptions +=
          '<option selected value="' + v.id + '">' + v.title + "</option>";
      }
    });

    return selectOptions;
  }

  function shippingDetails() {
    sendGoogleEvents("Ecommerce", "Checkout", "Cart Checkout");

    jQuery(".shipping-selection").remove();
    jQuery(".order-summary").remove();
    jQuery(".order-summary-header").remove();
    jQuery("#cart-products").remove();
    if (document.getElementsByClassName('ship-infor').length != 0) {
      jQuery(".ship-infor").show();
      document.getElementById("order_summary_button").innerHTML = "Go To Payment";
      document.getElementById("order_summary_button").disabled = false;
      jQuery("#order_summary_button").show();
      return;
    }

    totalBill = 0;
    subTotal = 0;
    salesTax = 0;
    selectCountries = "";
    selectSates = "";
    selectCities = "";
    var co = document.getElementsByClassName("cart-obj");
    for (var i = 0; i < co.length; i++) {
      co[i].style.display = "none";
    }
    countries.forEach(v => {
      if (v.name == "United States") {
        selectCountries += '<option selected value="' + v.id + '">' + v.name + "</option>";
        getStates({
          target: {
            value: v.id
          }
        }, 'shipping')
      } else {
        selectCountries += '<option value="' + v.id + '">' + v.name + "</option>";
      }
    });
    statesByCountry.forEach(v => {
      selectSates += '<option value="' + v.id + '">' + v.name + "</option>";
    });
    citiesByCountry.forEach(v => {
      selectCities += '<option value="' + v.id + '">' + v.name + "</option>";
    });


    var shipInfo =
      '<div class="row mt-3 ship-infor">' +
      '<div class="col-md-12">' +
      '<form id="shippingForm">' +
      '<div class="row ">' +
      '<div class="col-md-12 text-left">' +
      '<h5 class="text-light">Shipping Details</h5>' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">First Name</label>' +
      '<input type="text" class="form-control" value="' +
      shippingForm.firstName +
      '" name="firstname"  id="first_name" aria-describedby="emailHelp" placeholder="john" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row ">' +
      '<div class="col-md-12 text-left">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Last Name</label>' +
      '<input type="text" class="form-control"  value="' +
      shippingForm.lastName +
      '" id="last_name"  aria-describedby="emailHelp" placeholder="Smith" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row border-separator">' +
      '<div class="col-md-12 text-left">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Email Address</label>' +
      '<input type="email" class="form-control"  value="' +
      shippingForm.email +
      '" id="email" aria-describedby="emailHelp" placeholder="john@email.com" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row">' +
      '<div class="col-md-12 text-left">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Country</label>' +
      '<select class="form-control" value="' +
      shippingForm.country +
      '"  id ="country" required>' +
      '<option disabled  value="">Country</option>' +
      selectCountries +
      "</select>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row pt-3">' +
      '<div class="col-8 text-left">' +
      '<div class="form-group">' +
      '<label for="exampleFormControlSelect1"  >State</label>' +
      '<select class="form-control" value="' +
      shippingForm.state +
      '"  id="state" required>' +
      '<option disabled  value="">State</option>' +
      selectSates +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="col-4 text-left">' +
      '<div class="form-group">' +
      '<label for="exampleFormControlSelect1">City</label>' +
      '<select class="form-control" id="city"  value="' +
      shippingForm.city +
      '"  required>' +
      '<option disabled  value="">City</option>' +
      selectCities +
      "</select>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row">' +
      '<div class="col-md-12 text-left">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white" >Address</label>' +
      '<input type="text" class="form-control"  value="' +
      shippingForm.address +
      '" id="address1" aria-describedby="emailHelp" placeholder="126k Street" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row">' +
      '<div class="col-md-12 text-left">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Zip Code</label>' +
      '<input type="text" class="form-control"  value="' +
      shippingForm.zipCode +
      '" style="width: 60%" id="zip" aria-describedby="emailHelp" placeholder="111" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-12 plr-15 pb-2 pl-0"><span class="msg-err" id="shippingFormMessage"></span></div>' +
      '<div class="col-md-12 pr-0 pl-0 mb-4"><button type="submit" class="btn btn-primary btn-sm w-100-btn submit-btn-improve"   id="order_summary_button">Go To Payment</button></div>' +
      "</form>" +
      "</div>" +
      "</div>";

    jQuery("#products-wrapper").append(shipInfo);
    // document
    //   .getElementById("order_summary_button")
    //   .addEventListener("click", () => validateShippingForm());
    if (!citiesByCountry.length || !statesByCountry.length || !countries.length) {
      document.getElementById('order_summary_button').disabled = true
    }
    document.getElementById("shippingForm").addEventListener("submit", () => {
      event.preventDefault();
      paymentDetails();
    });
    document
      .getElementById("first_name")
      .addEventListener("keyUp", () => formChanged());
    document
      .getElementById("last_name")
      .addEventListener("keyUp", () => formChanged());
    document
      .getElementById("email")
      .addEventListener("keyUp", () => formChanged());
    document
      .getElementById("country")
      .addEventListener("keyUp", () => formChanged());
    document
      .getElementById("state")
      .addEventListener("keyUp", () => formChanged());
    document
      .getElementById("city")
      .addEventListener("keyUp", () => formChanged());
    document
      .getElementById("address1")
      .addEventListener("keyUp", () => formChanged());
    document
      .getElementById("zip")
      .addEventListener("keyUp", () => formChanged());

    document
      .getElementById("country")
      .addEventListener("change", () => getStates(event, 'shipping'));
    document
      .getElementById("state")
      .addEventListener("change", () => getCities(event, 'shipping'));

    formChanged();
  }

  function validateShippingForm() {
    sendGoogleEvents("Ecommerce", "Go to Billing", "Shipping details added");

    var fields = [
      "first_name",
      "last_name",
      "email",
      "country",
      "state",
      "city",
      "address1",
      "zip"
    ];
    var labels = [
      "First Name",
      "Last Name",
      "Email",
      "Country",
      "State",
      "City",
      "Address",
      "Zip"
    ];

    var i,
      l = fields.length;
    var fieldname;
    var lab;
    var nameRegex = /^[a-zA-Z_ ]+(?:-[a-zA-Z_ ]+)*$/;
    var fNameBool = nameRegex.test($("#shippingForm #first_name").val());
    var lNameBool = nameRegex.test($("#shippingForm #last_name").val());
    if (!fNameBool) {
      document.getElementById("shippingFormMessage").innerHTML =
        "First Name can only be in text";
      return false;
    } else if (!lNameBool) {
      document.getElementById("shippingFormMessage").innerHTML =
        "Last Name can only be in text.";
      return false;
    }
    for (i = 0; i < l; i++) {
      fieldname = fields[i];
      lab = labels[i];
      if (document.forms["shippingForm"][fieldname].value === "") {
        document.getElementById("shippingFormMessage").innerHTML =
          lab + " cannot be empty.";
        return false;
      }
    }

    return true;
  }

  function validateBillingForm() {
    sendGoogleEvents("Ecommerce", "Go to Payment", "Billing details added");
    var fields = [
      "f_name",
      "l_name",
      "billing_country",
      "billing_state",
      "billing_city",
      "billing_address1",
      "billing_zip"
    ];
    var labels = [
      "First Name",
      "Last Name",
      "Country",
      "State",
      "City",
      "Address",
      "Zip"
    ];

    var i,
      l = fields.length;
    var fieldname;
    var lab;
    var nameRegex = /^[a-zA-Z_ ]+(?:-[a-zA-Z_ ]+)*$/;
    var fNameBool = nameRegex.test($("#billingForm #first_name").val());
    var lNameBool = nameRegex.test($("#billingForm #last_name").val());
    if (!fNameBool) {
      document.getElementById("billingFormMessage").innerHTML =
        "First Name can only be in text";
      return false;
    } else if (!lNameBool) {
      document.getElementById("billingFormMessage").innerHTML =
        "Last Name can only be in text.";
      return false;
    }
    for (i = 0; i < l; i++) {
      fieldname = fields[i];
      lab = labels[i];
      if (document.forms["billingForm"][fieldname].value === "") {
        document.getElementById("billingFormMessage").innerHTML =
          lab + " cannot be empty.";

        return false;
      }
    }
    return true;
  }

  function validatePaymentForm() {
    sendGoogleEvents("Ecommerce", "Cart Purchased", "Cart purchased");

    var fields = ["cardNumber", "cardMonth", "cardYear", "nameOnCard", "cvv"];
    var labels = [
      "Card Number",
      "Expiry Month",
      "Expiry Year",
      "Name on Card",
      "CVV"
    ];

    var i,
      l = fields.length;
    var fieldname;
    var lab;
    var nameRegex = /^[a-zA-Z_ ]+(?:-[a-zA-Z_ ]+)*$/;
    var numberRegex = /^[0-9]+$/;
    var cardNumberBool = numberRegex.test($("#paymentForm #cardNumber").val());
    var cardNameBool = nameRegex.test($("#paymentForm #nameOnCard").val());
    var cvvNumberBool = numberRegex.test($("#paymentForm #cvv").val());
    if (!cardNumberBool) {
      document.getElementById("paymentFormMessage").innerHTML =
        "Card Number only in numbers";
      return false;
    } else if (!cardNameBool) {
      document.getElementById("paymentFormMessage").innerHTML =
        "Name on card can only be in text";
      return false;
    } else if (!cvvNumberBool) {
      document.getElementById("paymentFormMessage").innerHTML =
        "CVV can only be in number";
      return false;
    }
    for (i = 0; i < l; i++) {
      fieldname = fields[i];
      lab = labels[i];
      if (document.forms["paymentForm"][fieldname].value === "") {
        document.getElementById("paymentFormMessage").innerHTML =
          lab + " can not be empty";
        return false;
      }
    }
    return true;
  }

  function getShippingFormValues(form) {
    var i, l
    var fields = []
    if (form == "shippingForm") {
      fields = [
        "first_name",
        "last_name",
        "email",
        "country",
        "state",
        "city",
        "address1",
        "zip"
      ];
      l = fields.length;
    }

    if (form !== "shippingForm") {
      fields = [
        "f_name",
        "l_name",
        "billing_country",
        "billing_state",
        "billing_city",
        "billing_address1",
        "billing_zip"
      ];
      l = fields.length;
    }
    var fieldname;
    var formDetails = {};
    for (i = 0; i < l; i++) {
      fieldname = fields[i]
      formDetails[fields[i]] =
        document.forms[form][fieldname].value;
    }
    return formDetails;
  }

  function getPaymentFormValues() {
    var fields = ["cardNumber", "cardMonth", "cardYear", "nameOnCard", "cvv"];
    var i,
      l = fields.length;
    var fieldname;
    var paymentDetailsObject = {};
    for (i = 0; i < l; i++) {
      fieldname = fields[i];
      paymentDetailsObject[fields[i]] =
        document.forms["paymentForm"][fieldname].value;
    }
    return paymentDetailsObject;
  }

  async function paymentDetails() {
    document.getElementById("order_summary_button").innerHTML =
      '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
    document.getElementById("order_summary_button").disabled = true;
    var shippingInformationObj = {};

    if (validateShippingForm()) {
      document.getElementById("shippingFormMessage").innerHTML = ""
      shippingInformationObj = getShippingFormValues('shippingForm');
      await getStatesByCountry(shippingInformationObj.country)
      await getCitiesByStates(shippingInformationObj.state)

      let shippingCountry = countries.filter(
        element => element.id == shippingInformationObj.country
      );
      let shippingState = statesByCountry.filter(
        element => element.id == shippingInformationObj.state
      );
      let shippingCity = citiesByCountry.filter(
        element => element.id == shippingInformationObj.city
      );

      shippingInformationObj.country_code = shippingCountry[0].sortname;
      shippingInformationObj.province_code = shippingState[0].name;
      if (!shippingCity.length) {
        shippingInformationObj.city = ""
      } else {
        shippingInformationObj.city = shippingCity[0].name;
      }

      shippingInformationObj.phone = "";

      let lineItems = [];

      cartItems.forEach((ci, ind) => {
        let tempO = {};
        (tempO.variant_id = ci.product.variants[0].id),
        (tempO.quantity = ci.quantity ? ci.quantity : 1);
        lineItems.push(tempO);
      });
      shippingAddress = shippingInformationObj;
      let checkoutObj = {
        email: shippingInformationObj.email,
        line_items: lineItems,
        shipping_address: shippingInformationObj,
        storeDetails: storeDetails,
        cartItems: cartItems
      };

      axios
        .post(forwardingAddress + "/checkout", {
          withCredentials: true,
          body: checkoutObj
        })
        .then(res => {
          jQuery("#order_summary_button").hide();
          jQuery(".ship-infor").hide();
          if (res.data.errorMessage) {
            shippingDetails();
            document.getElementById("shippingFormMessage").innerHTML = res.data.errorMessage;
            document.getElementById("order_summary_button").innerHTML =
              "Go To Payment";
            document.getElementById("order_summary_button").disabled = false;
            return
          }
          isShippingRequired = res.data.checkout.requires_shipping;
          var shippingRatesRes = [];

          if (isShippingRequired) {
            shippingRatesRes = res.data.shipping_rates;
          }

          checkoutResponseCopy = res.data.checkout;
          subTotal = checkoutResponseCopy.subtotal_price;
          salesTax = checkoutResponseCopy.total_tax;
          var shipInform = document.getElementsByClassName("ship-infor");
          for (var i = 0; i < shipInform.length; i++) {
            shipInform[i].style.display = "none";
          }

          var opts = "";
          var shippingSelection = "";
          if (isShippingRequired) {
            shippingRatesRes.forEach(ele => {
              opts +=
                '<option value="' +
                ele.handle +
                '">' +
                ele.title +
                "(" +
                ele.price +
                ")" +
                "</option>";
            });
            shippingSelection =
              '<div class="col-md-12 mt-4 pr-4 shipping-selection text-left" id="shipping-selection">' +
              '<h5 class="text-light mb-2">Select Shipping</h5>' +
              '<div class="form-group mb-0">' +
              '<select class="form-control pl-1" id="shippingMethod">' +
              "<option disabled>Select Shipping</option>" +
              opts +
              "</select>" +
              "</div>" +
              "</div>";
          }
          var orderSummaryHeader =
            '<div class="col-md-12 text-light mt-3 order-summary-header text-left" id="order-summary-header"><h5>Order Summary</h5></div>';
          var htmlForCartItems = "";
          checkoutResponseCopy.line_items.forEach((element, ind) => {
            htmlForCartItems +=
              '<div class="row card-p mt-3 cart-obj" id="cart-products">' +
              '<div class="col-12">' +
              '<div class="well">' +
              '<div class="row m-sm-0">' +
              '<div class="col-md-3 col-4 pull-right text-sm-center">' +
              '<img src="' +
              element.image_url +
              '" height="80px" width="80px" alt="" class="img-rounded img-responsive tabimageimprove" />' +
              "</div>" +
              '<div class="col-md-8 col-6 product-text pr-0 text-left">' +
              '<h6 class="mb-0">' +
              element.title +
              "</h6>" +
              '<h6 class="w-bold">' +
              "</h6>" +
              '<div class="row">' +
              '<div class="col-md-6">' +
              '<h6 class="w-bold">' +
              element.quantity +
              " X $" +
              element.price +
              "</h6>" +
              "</div>" +
              '<div class="col-md-6 text-right pr-0">' +
              '<h6 class="w-bold">Total: $' +
              (element.price * element.quantity).toFixed(2) +
              "</h6>" +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>" +
              '<div class="row product-details"><div class="col-md-12 pt-3 mb-3 border-separator"></div></div>';
            "</div>" + "</div>" + "</div>";
          });
          let parseFixesValue = parseFloat(subTotal).toFixed(2);
          var restTotal =
            '<div class="row product-details text-light" id="res-total">' +
            '<div class="col-6 p-0 text-left"><h6 class="w-bold">Subtotal</h6></div>' +
            '<div class="col-6 p-0 text-right">' +
            '<h6 class="w-bold">$' +
            parseFixesValue +
            "</h6>" +
            "</div>" +
            "</div>" +
            '<div class="row product-details text-light">' +
            '<div class="col-6 p-0 text-left"><h6 class="w-bold">Shipping</h6></div>' +
            '<div class="col-6 p-0 text-right">' +
            '<h6 class="w-bold" id="shipping-rate">$0.00</h6>' +
            "</div>" +
            "</div>" +
            '<div class="row product-details text-light">' +
            '<div class="col-6 p-0 text-left"><h6 class="w-bold">Sales Tax</h6></div>' +
            '<div class="col-6 p-0 text-right">' +
            '<h6 class="w-bold"  id="total-order-tax">' +
            salesTax +
            "</h6>" +
            "</div>" +
            "</div>" +
            '<div class="row product-details"><div class="col-md-12 pt-3 mb-3 border-separator"></div></div>' +
            '<div class="row product-details text-light">' +
            '<div class="col-6 p-0 text-left"><h6 class="w-bold">Total</h6></div>' +
            '<div class="col-6  p-0 text-right">' +
            '<h6 class="w-bold total-bill-font" id="total-order-summary">$' +
            "$0.00" +
            "</h6>" +
            "</div>" +
            "</div>";
          var orderSummary =
            '<div class="col-md-12 order-summary text-left" id="order-summary"><a class="text-white product-detail-back" id="go-to-shipping"> <i class="fa fa-angle-left" aria-hidden="true" ></i>&nbsp Back to Shipping Info</a></div>' +
            shippingSelection;
          var gotToBillingInfo =
            '<div class="col-md-12 mt-3 plr-15"><button type="submit" class="btn btn-primary btn-sm w-100-btn submit-btn-improve mb-4" id="go_to_billing_info">Go To Billing Info</button></div>';


          jQuery("#products-wrapper").append(
            orderSummary +
            orderSummaryHeader +
            htmlForCartItems +
            restTotal +
            gotToBillingInfo
          );
          if (isShippingRequired) {
            document
              .getElementById("shippingMethod")
              .addEventListener("change", () => getSelectedShipping('shipping'));
          }

          document
            .getElementById("go_to_billing_info")
            .addEventListener("click", () => billingInformation());

          document.getElementById("total-order-summary").innerHTML =
            '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
          document.getElementById("shipping-rate").innerHTML =
            '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
          getSelectedShipping('shipping');
          document.getElementById("go-to-shipping")
            .addEventListener("click", () => shippingDetails());

        })
        .catch(error => {
          shippingDetails();
          document.getElementById("order_summary_button").innerHTML =
            "Go To Payment";
          document.getElementById("order_summary_button").disabled = false;
        });
    } else {
      document.getElementById("order_summary_button").innerHTML =
        "Go To Payment";
      document.getElementById("order_summary_button").disabled = false;
    }
  }

  function orderPlaced() {
    let paymentDetailsValues = {};
    if (validatePaymentForm()) {
      paymentDetailsValues = getPaymentFormValues();
      let sId = window.location.search.substring(1).split("=")[1];
      var pIdsArray = _.map(cartItems, "_id");
      var data = {
        orderObject: {
          customerName: updatedCheckoutResponseCopy.shipping_address.first_name +
            " " +
            updatedCheckoutResponseCopy.shipping_address.last_name,
          customerEmail: updatedCheckoutResponseCopy.email,
          stream: sId,
          products: pIdsArray,
          user: userId,
          orderNumber: updatedCheckoutResponseCopy.name,
          amount: updatedCheckoutResponseCopy.total_price,
          customerId: updatedCheckoutResponseCopy.customer_id,
          checkout: {
            shippingDetails: updatedCheckoutResponseCopy.shipping_address,
            subTotal: updatedCheckoutResponseCopy.subtotal_price,
            shipping: updatedCheckoutResponseCopy.shipping_rate == null ?
              "0" :
              updatedCheckoutResponseCopy.shipping_rate.price,
            salesTax: updatedCheckoutResponseCopy.total_tax,
            TotalPrice: updatedCheckoutResponseCopy.total_price,
            lineItems: updatedCheckoutResponseCopy.line_items,
            token: updatedCheckoutResponseCopy.token
          }
        },
        stripeDetails: {
          cardNumber: paymentDetailsValues.cardNumber,
          cardMonth: paymentDetailsValues.cardMonth,
          cardYear: paymentDetailsValues.cardYear,
          nameOnCard: paymentDetailsValues.nameOnCard,
          cvv: paymentDetailsValues.cvv,
          shopify_payments_account_id: updatedCheckoutResponseCopy.shopify_payments_account_id
        },
        storeDetails: storeDetails
      };
      document.getElementById("purchase_btn").innerHTML =
        '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
      document.getElementById("purchase_btn").disabled = true;
      createToken(data);


    }
  }

  function removeCartItem(i) {
    cartItems.splice(i, 1);
    jQuery("#cart-count").text(cartItems.length);
    if (cartItems.length == 0) {
      backToProductListing();
    } else {
      showCartProducts();
    }
  }

  function clearCartItems() {
    cartItems = [];
    jQuery("#cart-count").text(cartItems.length);
    jQuery(".billingInfo").remove();
    billingForm = {
      firstName: "",
      lastName: "",
      address: "",
      zipCode: "",
    };
  }

  function cartQuantityChange(i) {
    let cartItemTotalAmount = 0.0;
    var e = document.getElementById("cartItemId-" + i).value;
    cartItems[i].product.totalPrice = cartItems[i].product.price * e;

    cartItems.forEach((element, ind) => {
      if (element.product.totalPrice > 0.0) {
        cartItemTotalAmount += parseFloat(element.product.totalPrice);
      } else {
        cartItemTotalAmount += parseFloat(element.product.price);
      }
    });

    jQuery("#products-wrapper .change-total-price").html(
      "$" + cartItemTotalAmount.toFixed(2)
    );
    cartItems[i].quantity = e;
  }

  function cartVariantChange(i) {
    var e = document.getElementById("cartVariantId-" + i);
    var value = e.options[e.selectedIndex].value;
    cartItems[i].selectedVariant = value;
  }

  async function getSelectedShipping(flag) {
    var shippingLineSelected = "";
    if (isShippingRequired && flag == 'shipping') {
      shippingLineSelected = document.getElementById("shippingMethod").value;
    }

    let checkoutBody = {};
    if (flag == "shipping") {
      if (shippingLineSelected) {
        checkoutBody = {
          checkout: {
            checkout: {
              shipping_line: {
                handle: shippingLineSelected
              }
            }
          },
          storeDetails: storeDetails
        };
      } else {
        checkoutBody = {
          checkout: {
            checkout: {
              shipping_line: ""
            }
          },
          storeDetails: storeDetails
        };
      }
    } else if (flag == "billing") {
      document.getElementById("go_to_payment").disabled = true
      document.getElementById("go_to_payment").innerHTML = '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
      if (!jQuery('#sameAsShipping').is(':checked')) {
        let billingInfo = getShippingFormValues('billingForm');
        let billingCountry = countries.filter(
          element => element.id == billingInfo.billing_country
        );
        let billingState = statesByCountry.filter(
          element => element.id == billingInfo.billing_state
        );
        let billingCity = citiesByCountry.filter(
          element => element.id == billingInfo.billing_city
        );

        billingInfo.country_code = billingCountry[0].sortname;
        billingInfo.province = billingState[0].name;
        billingInfo.city = billingCity[0].name;
        billingInfo.phone = "";
        billingInfo.zip = billingInfo.billing_zip;
        billingInfo.zip = billingInfo.billing_zip;
        billingInfo.address1 = billingInfo.billing_address1;
        billingInfo.last_name = billingInfo.l_name;
        billingInfo.first_name = billingInfo.f_name;

        checkoutBody = {
          checkout: {
            checkout: {
              billing_address: billingInfo
            }
          },
          storeDetails: storeDetails,
        }
      } else {
        checkoutBody = {
          checkout: {
            checkout: {
              billing_address: shippingAddress
            }
          },
          storeDetails: storeDetails,
        }
      }
    }
    let res = await axios
      .post(
        forwardingAddress + "/update-checkout/" + checkoutResponseCopy.token, {
          withCredentials: true,
          body: checkoutBody
        }
      )
    // .then(res => {
    if (flag == "billing") {
      return res;
    }
    updatedCheckoutResponseCopy = res.data.checkout;
    orderSummaryPrice(updatedCheckoutResponseCopy);


    // });
  }

  function orderSummaryPrice(updatedCheckout) {
    if (isShippingRequired) {
      if (updatedCheckout.shipping_line.price) {
        jQuery("#shipping-rate").text("$" + updatedCheckout.shipping_line.price);
      }
      totalBill = updatedCheckout.total_price;
    } else {
      totalBill = updatedCheckout.subtotal_price;
      jQuery("#shipping-rate").text("$0.00");
    }
    salesTax = updatedCheckout.total_tax;
    jQuery("#total-order-summary").text("$" + totalBill);
    jQuery("#total-order-tax").text("$" + salesTax);
  }

  async function purchaseCheckout() {
    if (jQuery('#billingForm').length !== 0 && !jQuery('#sameAsShipping').is(':checked') && !validateBillingForm()) {
      return
    } else {
      let res = await getSelectedShipping('billing')
      if (res) {
        if (res.data.errorMessage) {
          document.getElementById("billingFormMessage").innerHTML = res.data.errorMessage;
          document.getElementById("go_to_payment").innerHTML =
            "Go To Payment";
          document.getElementById("go_to_payment").disabled = false;
        }
        document.getElementById("go_to_payment").innerHTML =
          "Go To Payment";
        document.getElementById("go_to_payment").disabled = false;
      }
      updatedCheckoutResponseCopy = res.data.checkout;
      orderSummaryPrice(updatedCheckoutResponseCopy);
    }
    if (document.getElementById("billingFormMessage")) {
      document.getElementById("billingFormMessage").innerHTML = ""
    }


    sendGoogleEvents("Ecommerce", "Go to Payment", "Order Summary Accepted");
    jQuery('.billingInfo').hide()
    var paymentDetails =
      '<div class="row payemtDs">' +
      '<div class="col-md-12 text-left"><a class="text-white product-detail-back pl-4" id="paymentBackToDetails"> <i class="fa fa-angle-left" aria-hidden="true"></i>&nbsp Back to billing info</a></div>' +
      '<div class="col-md-12  mt-4">' +
      '<form id="paymentForm">' +
      '<div class="row text-left pl-4 pr-4">' +
      '<div class="col-md-12 ">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Card Number</label>' +
      '<input type="text" class="form-control" id="cardNumber" aria-describedby="emailHelp" placeholder="" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row text-left pl-4 pr-4">' +
      '<div class="col-md-12">' +
      '<label for="exampleFormControlSelect1">Expiry Date</label>' +
      "</div>" +
      '<div class="col-md-4 col-4">' +
      '<div class="form-group">' +
      '<select class="form-control" id="cardMonth" required>' +
      "<option>1</option>" +
      "<option>2</option>" +
      "<option>3</option>" +
      "<option>4</option>" +
      "<option>5</option>" +
      "<option>5</option>" +
      "<option>7</option>" +
      "<option>8</option>" +
      "<option>9</option>" +
      "<option>10</option>" +
      "<option>11</option>" +
      "<option>12</option>" +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-5 col-5">' +
      '<div class="form-group">' +
      '<select class="form-control" id="cardYear" required>' +
      "<option disabled value=''>YYYY</option>" +
      "<option>2019</option>" +
      "<option>2020</option>" +
      "<option>2021</option>" +
      "<option>2022</option>" +
      "<option>2023</option>" +
      "<option>2024</option>" +
      "<option>2025</option>" +
      "</select>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row text-left pl-4 pr-4">' +
      '<div class="col-md-12 ">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Name on Card</label>' +
      '<input type="text" class="form-control" id="nameOnCard" aria-describedby="emailHelp" placeholder="" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row text-left pl-4 pr-4">' +
      '<div class="col-md-12 ">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">CVV</label>' +
      '<input type="text" class="form-control" style="width: 60%" id="cvv" aria-describedby="emailHelp" placeholder="" maxlength="4" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-12 plr-15 pb-2"><span class="msg-err" id="paymentFormMessage"></span></div>' +
      '<div class="col-md-12 plr-15"><button type="button" class="btn btn-primary btn-sm w-100-btn mb-4 submit-btn-improve" id="purchase_btn" onclick="orderPlaced()">Purchase</button>' +
      "</div>" +
      "</form>" +
      "</div>" +
      "</div>";

    if (jQuery('.payemtDs').length === 0) {
      jQuery("#products-wrapper").append(paymentDetails);
    } else {
      jQuery('.payemtDs').show()
    }
    document
      .getElementById("purchase_btn")
      .addEventListener("click", () => orderPlaced());

    document
      .getElementById("paymentBackToDetails")
      .addEventListener("click", () => backToBillingInformation());

  }

  function billingInformation() {
    sendGoogleEvents("Ecommerce", "Go to Payment", "Order Summary Accepted");

    document.getElementById("cart-products").style.display = "none";
    document.getElementById("order-summary-header").style.display = "none";
    document.getElementById("res-total").style.display = "none";
    document.getElementById("order-summary").style.display = "none";
    document.getElementById("order-summary").style.display = "none";
    if (isShippingRequired) {
      document.getElementById("shipping-selection").style.display = "none";
    }
    totalBill = 0;
    subTotal = 0;
    salesTax = 0;
    selectCountries = "";
    selectSates = "";
    selectCities = "";
    var co = document.getElementsByClassName("cart-obj");
    for (var i = 0; i < co.length; i++) {
      co[i].style.display = "none";
    }
    countries.forEach(v => {
      if (v.name == "United States") {
        selectCountries += '<option selected value="' + v.id + '">' + v.name + "</option>";
        getStates({
          target: {
            value: v.id
          }
        }, 'billing')

      } else {
        selectCountries += '<option value="' + v.id + '">' + v.name + "</option>";
      }
    });
    var billingInformation =
      `<div class="row billingInfo">
      <div class="col-md-12 text-left"><a class="text-white product-detail-back pl-4" id="backToOrderDetails"> <i
                  class="fa fa-angle-left" aria-hidden="true"></i>&nbsp Back to Order Summary</a></div>
      <div class="col-md-12 mt-4 billingInfoPadding">
          <h5 class="text-white">Billing Information</h5>
          <form id="billingInfoForm">
              <div class="row text-left">
                  <div class="col-md-12 text-white ml-1 mt-2">
                      <div class="form-group">
                          <input type="radio" id="sameAsShipping" value="same_as_shipping" name="billingInfo" checked/>&nbsp;Make billing address
                          same as
                          shipping address
                      </div>
                  </div>
                  <div class="col-md-12 text-white ml-1 mt-2 addbillingInfo">
                      <div class="form-group">
                          <input type="radio" id="newBillingInfo" value="new_billing_info" name="billingInfo" />&nbsp;Add new billing address
                      </div>
                  </div>
              </div>
              <div class="col-md-12 mt-3 plr-15"><button type="button" class="btn btn-primary btn-sm w-100-btn submit-btn-improve mb-4" id="go_to_payment">Go To Payment</button></div>
          </form>
      </div>
  </div>`
    var billInfo =
      '<div class="row mt-3 bill-infor">' +
      '<div class="col-md-12">' +
      '<form id="billingForm">' +
      '<div class="row">' +
      '<div class="col-md-12 ">' +
      '<h5 class="text-light pl-0">Billing details</h5>' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">First Name</label>' +
      '<input type="text" class="form-control" value="' +
      billingForm.firstName +
      '" name="firstname"  id="f_name" aria-describedby="emailHelp" placeholder="john" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row">' +
      '<div class="col-md-12 ">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Last Name</label>' +
      '<input type="text" class="form-control"  value="' +
      billingForm.lastName +
      '" id="l_name"  aria-describedby="emailHelp" placeholder="Smith" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row border-separator">' +
      "</div>" +
      '<div class="row">' +
      '<div class="col-md-12 ">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Country</label>' +
      '<select class="form-control" value="' +
      billingForm.country +
      '"  id ="billing_country" required>' +
      '<option disabled  value="">Country</option>' +
      selectCountries +
      "</select>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row pt-3">' +
      '<div class="col-8">' +
      '<div class="form-group">' +
      '<label for="exampleFormControlSelect1"  >State</label>' +
      '<select class="form-control" value="' +
      billingForm.state +
      '"  id="billing_state" required>' +
      '<option disabled  value="">State</option>' +
      selectSates +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="col-4">' +
      '<div class="form-group">' +
      '<label for="exampleFormControlSelect1">City</label>' +
      '<select class="form-control" id="billing_city"  value="' +
      billingForm.city +
      '"  required>' +
      '<option disabled  value="">City</option>' +
      selectCities +
      "</select>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row">' +
      '<div class="col-md-12 ">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white" >Address</label>' +
      '<input type="text" class="form-control"  value="' +
      billingForm.address +
      '" id="billing_address1" aria-describedby="emailHelp" placeholder="126k Street" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="row">' +
      '<div class="col-md-12 ">' +
      '<div class="form-group">' +
      '<label for="exampleInputEmail1 text-white">Zip Code</label>' +
      '<input type="text" class="form-control"  value="' +
      billingForm.zipCode +
      '" style="width: 60%" id="billing_zip" aria-describedby="emailHelp" placeholder="111" required>' +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-12 plr-15 pb-2 pl-0"><span class="msg-err" id="billingFormMessage"></span></div>' +
      "</form>" +
      "</div>" +
      "</div>";
    if (jQuery(".billingInfo").length === 0) {
      jQuery("#products-wrapper").append(billingInformation);

    } else {
      jQuery('.billingInfo').show();
    }
    jQuery('#newBillingInfo').click(() => {
      if (jQuery('#newBillingInfo').is(':checked')) {
        jQuery(".addbillingInfo").append(billInfo)
        getStates({
          target: {
            value: jQuery('#billing_country')[0].selectedIndex
          }
        }, 'billing')
        statesByCountry.forEach(v => {
          selectSates += '<option value="' + v.id + '">' + v.name + "</option>";
        });
        citiesByCountry.forEach(v => {
          selectCities += '<option value="' + v.id + '">' + v.name + "</option>";
        });

        document
          .getElementById("f_name")
          .addEventListener("keyUp", () => billingformChanged());
        document
          .getElementById("l_name")
          .addEventListener("keyUp", () => billingformChanged());
        document
          .getElementById("billing_country")
          .addEventListener("keyUp", () => billingformChanged());
        document
          .getElementById("billing_state")
          .addEventListener("keyUp", () => billingformChanged());
        document
          .getElementById("billing_city")
          .addEventListener("keyUp", () => billingformChanged());
        document
          .getElementById("billing_address1")
          .addEventListener("keyUp", () => billingformChanged());
        document
          .getElementById("billing_zip")
          .addEventListener("keyUp", () => billingformChanged());

        document
          .getElementById("billing_country")
          .addEventListener("change", () => getStates(event, 'billing'));
        document
          .getElementById("billing_state")
          .addEventListener("change", () => getCities(event, 'billing'));

        billingformChanged();
      }
    })
    jQuery('#sameAsShipping').click(() => {
      if (jQuery('#sameAsShipping').is(':checked')) {
        jQuery(".bill-infor").remove()
      }
    })
    if (!citiesByCountry.length || !statesByCountry.length || !countries.length) {
      document.getElementById('go_to_payment').disabled = true
    }

    document
      .getElementById("go_to_payment")
      .addEventListener("click", () =>
        purchaseCheckout()
      );
    document
      .getElementById("backToOrderDetails")
      .addEventListener("click", () => backToPaymentDetails());
  }

  function backToPaymentDetails() {
    jQuery(".billingInfo").remove();
    billingForm = {
      firstName: "",
      lastName: "",
      address: "",
      zipCode: "",
    };
    document.getElementById("cart-products").style.display = "block";
    document.getElementById("order-summary-header").style.display = "block";
    document.getElementById("res-total").style.display = "block";
    document.getElementById("order-summary").style.display = "block";
    if (isShippingRequired) {
      document.getElementById("shipping-selection").style.display = "block";
    }
  }

  function backToBillingInformation() {
    jQuery(".payemtDs").remove()
    jQuery('.billingInfo').show();
    if (document.getElementById("billingFormMessage")) {
      document.getElementById("billingFormMessage").innerHTML = ""
    }
  }

  function formChanged() {
    shippingForm.firstName = document.getElementById("first_name").value;
    shippingForm.lastName = document.getElementById("last_name").value;
    shippingForm.city = document.getElementById("city").value;
    shippingForm.address = document.getElementById("address1").value;
    shippingForm.zipCode = document.getElementById("zip").value;
    shippingForm.state = document.getElementById("state").value;
    shippingForm.email = document.getElementById("email").value;
    shippingForm.country = document.getElementById("country").value;
  }

  function billingformChanged() {
    billingForm.firstName = document.getElementById("first_name").value;
    billingForm.lastName = document.getElementById("last_name").value;
    billingForm.city = document.getElementById("city").value;
    billingForm.address = document.getElementById("address1").value;
    billingForm.zipCode = document.getElementById("zip").value;
    billingForm.state = document.getElementById("state").value;
    billingForm.country = document.getElementById("country").value;
  }

  async function getStates(event, form) {
    await getStatesByCountry(event.target.value);
    var $el = form == 'shipping' ? $("#state") : $("#billing_state");
    $el.empty();
    $.each(statesByCountry, function (key, value) {
      $el.append(
        $("<option></option>")
        .attr("value", value.id)
        .text(value.name)
      );
    });
    getCitiesByCountry(statesByCountry[0].id, form);
  }

  async function getCities(event, form) {
    await getCitiesByStates(event.target.value);
    var $el = form == 'shipping' ? $("#city") : $("#billing_city");
    $el.empty();
    $.each(citiesByCountry, function (key, value) {
      $el.append(
        $("<option ></option>")
        .attr("value", value.id)
        .text(value.name)
      );
    });
  }

  async function getCitiesByCountry(vl, form) {
    await getCitiesByStates(vl);
    var $el = form == 'shipping' ? $("#city") : $('#billing_city');
    $el.empty();
    $.each(citiesByCountry, function (key, value) {
      $el.append(
        $("<option ></option>")
        .attr("value", value.id)
        .text(value.name)
      );
    });
  }

  function hasClass(element, cls) {
    return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
  }

  document.getElementById("products-opener").addEventListener("click", () => {
    forceHideMenu = false
    document.getElementById("products-wrapper").style.display = "block";
  });

  document.getElementById("products-closer").addEventListener("click", () => {
    forceHideMenu = true
    document.getElementById("products-wrapper").style.display = "none";
  });

  function createToken(data) {
    $.ajax({
      type: "POST",
      url: "https://api.stripe.com/v1/tokens",
      headers: {
        Authorization: "Bearer " + stripePublicKey,
        "Stripe-Account": data.stripeDetails.shopify_payments_account_id
      },
      data: {
        card: {
          number: data.stripeDetails.cardNumber,
          cvc: data.stripeDetails.cvv,
          exp_month: data.stripeDetails.cardMonth,
          exp_year: data.stripeDetails.cardYear
        }
      },
      success: response => {
        delete data.stripeDetails;
        data.token = response;
        axios
          .post(forwardingAddress + "/stripe", {
            withCredentials: true,
            body: data
          })
          .then(res => {
            if (res.data.error) {
              document.getElementById("purchase_btn").innerHTML = 'Purchase';
              document.getElementById("purchase_btn").disabled = false;
              document.getElementById("paymentFormMessage").innerHTML = res.data.error.error.payment.transaction.message || res.data.message;
              return
            }
            
            var shareButtons =
              '<div class="col-md-12 my-3 order-placed-msg border-separator">' +
              '<div class="col-md-12 pl-5 pr-5 my-4"> <p class="text-light text-center sharescreenfontimprove"> Share this awesome deal with <br> your friends:</p></div>' +
              '<div class="row px-5 pb-3 shareiconimprove text-center">' +
              //facebook Share
              '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
              streamBaseAddress +
              '" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' +
              streamBaseAddress +
              '" class="fb-xfbml-parse-ignore"><img src=' + libraryPath + '/images/facebook.svg height="40px"></a></div>' +
              //twitter Share
              '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
              streamBaseAddress +
              '" data-layout="button_count" data-size="small"><a target="_blank" href="https://twitter.com/intent/tweet?url=' +
              streamBaseAddress +
              '" class="fb-xfbml-parse-ignore"><img src=' + libraryPath + '/images/twitter.svg height="40px"></a></div>' +
              //linkedin Share
              '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
              streamBaseAddress +
              '" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=' +
              streamBaseAddress +
              '" class="fb-xfbml-parse-ignore"><img src=' + libraryPath + '/images/linkedin.svg  height="40px"></a></div>' +

              "</div>";

            var shopmore =
              '<div class="col-md-12 plr-15 mt-3"><button class="btn btn-primary btn-sm w-100-btn mb-4 submit-btn-improve" type="button"  id="end_continue_shopping">Continue shopping</button>' +
              "</div>";

            var orderPlacedMessage =
              '<div class="row order-placed-msg">' +
              '<div class="col-md-12 position-center pl-5 pr-5 border-separator">' +
              '<i><img src="' + libraryPath + '/images/checkbox.svg"></i>' +
              '<h5 class="mt-3 text-white font-weight-normal"><b>' +
              data.orderObject.customerName +
              ", <br> Thank you for your order!</b></h5>" +
              '<p class="sharescreenfontimprove mt-3 text-white">We have received your order and will contact you as soon as your package is shipped. We have sent your order detail to <u><br>' +
              data.orderObject.customerEmail +
              "</u>" +
              "</p>" +
              "</div>";

            var pd = document.getElementsByClassName("payemtDs");
            for (var i = 0; i < pd.length; i++) {
              pd[i].style.display = "none";
            }
            if (jQuery('.order-placed-msg').length === 0) {
              jQuery("#products-wrapper").append(
                orderPlacedMessage + shareButtons + shopmore
              );
            }
            document
              .getElementById("end_continue_shopping")
              .addEventListener("click", () => {
                backToProductListing();
                clearCartItems();
              });
            let shippingLine = 0;
            if (isShippingRequired) {
              shippingLine = Number(updatedCheckoutResponseCopy.shipping_line.price);
            }
            let quantity = 0;
            analytics.sendawsEvent({
                eventType: "orderPlaced",
                orderAmount: Number(updatedCheckoutResponseCopy.subtotal_price),
                orderTotal: Number(updatedCheckoutResponseCopy.total_price),
                orderId: updatedCheckoutResponseCopy.name,
                orderTax: Number(updatedCheckoutResponseCopy.total_tax),
                orderShipping: shippingLine
              },
              userId,
              videoId
            );
            cartItems.forEach((items, i) => {
              quantity = items.quantity ? items.quantity : 1;
              analytics.sendawsEvent({
                  eventType: "productOrderPlaced",
                  productId: items.product._id,
                  productName: items.title,
                  productAmount: Number(items.product.price),
                  productQuantity: Number(quantity),
                  orderId: updatedCheckoutResponseCopy.name
                },
                userId,
                videoId
              );
            });
            cartItems = [];
            jQuery("#cart-count").text(cartItems.length);
          });

      },
      error: response => {
        document.getElementById("paymentFormMessage").innerHTML = response.responseJSON.error.message;
        document.getElementById("purchase_btn").innerHTML = 'Purchase';
        document.getElementById("purchase_btn").disabled = false;
      }
    });
  }
}

function EmptyMessages() {
  document.getElementById("paymentFormMessage").innerHTML = ""
  document.getElementById("shippingFormMessage").innerHTML = ""
  document.getElementById("billingFormMessage").innerHTML = ""
}
