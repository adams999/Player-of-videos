var ApplePayValue = 0;



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
   var basePath = props.basePath;
   var privateIp = props.privateIp;
   var libraryPath = props.libraryPath;
   var analytics = props.analytics;
   var sendGoogleEvents = props.sendGoogleEvents;

   var streamBaseAddress = props.streamBaseAddress;
   var stripePublicKey = props.stripePublicKey;
   var stripeSecretKey = props.stripeSecretKey;
   //var stripe = props.stripe;
   var stripe = Stripe(stripePublicKey);
   //var stripe = Stripe("pk_live_6qbw7ZTY5NCSZ6PfpLx7696r00H77miNqJ");
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
   globalCartItems = cartItems;
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
      state: "",
   };
   var billingForm = {
      firstName: "",
      lastName: "",
      country: "",
      city: "",
      address: "",
      zipCode: "",
      state: "",
   };
   var totalAmountCartItems = 0.0;
   var isShippingRequired = true;

   var countries = [];
   var statesByCountry = [];
   var citiesByCountry = [];
   var hideVariantIndexes = [];
   var forceHideMenu = false;

   /** 
    * javascript comment 
    * @Author: andersson arellano 
    * @Date: 2021-08-05 16:22:22 
    * @Desc: initial split 
    */
    var factory = splitio({
      core: {
         authorizationKey: "lbpkffs0ks7ra0olte5ff45oir1p28bim2vd",
         key: "user_id", // unique identifier for your user
      },
   });

   var client = factory.client();



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
   var displayContainerHTML = `<button class="btn-menu" id="products-opener"><i class="fa fa-bars"></i></button> 
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
    <img class="share-icon mr-1" id="share-faceBook" src="${libraryPath}/images/facebook.svg" alt="">
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
</div>`;
   productDisplayContainer.append(displayContainerHTML);
   document
      .getElementById("cart-button")
      .addEventListener("click", () => showCartProducts());
   document
      .getElementById("share-faceBook")
      .addEventListener("click", () => share("facebook"));
   document
      .getElementById("share-twitter")
      .addEventListener("click", () => share("twitter"));
   document
      .getElementById("share-linkedin")
      .addEventListener("click", () => share("linkedin"));

   function share(type) {
      if (type == "facebook") {
         window.open(
            "https://www.facebook.com/sharer/sharer.php?u=" + streamBaseAddress,
            "_blank"
         );
      }
      if (type == "twitter") {
         window.open(
            "https://twitter.com/intent/tweet?url=" + streamBaseAddress,
            "_blank"
         );
      }
      if (type == "linkedin") {
         window.open(
            "https://www.linkedin.com/shareArticle?mini=true&url=" +
               streamBaseAddress,
            "_blank"
         );
      }
   }

   function copyInputMessage(inputElement) {
      inputElement.select();
      document.execCommand("copy");
      inputElement.setSelectionRange(0, 0);
      var tooltip = document.getElementById("myTooltip");
      var tooltip1 = document.getElementById("myTooltip1");
      tooltip1.innerHTML = "Copy to Clipboard";
      tooltip.innerHTML = "Copied";
   }

   function copyInputMessage1(inputElement) {
      inputElement.select();
      document.execCommand("copy");
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


   
   this.displayButtonPay = function () {

      var products_loaded = [];
      products.forEach(product=>{
         var product_payment = product.product;
         
         //not permit product duplicate
         var load = true;

         for (let index = 0; index < products_loaded.length; index++) {
           if(product.product.id == products_loaded[index]){
               load = false;
           }
         }

         if(load){
            products_loaded.push(product.product.id);
            
            if (client.getTreatment("google_apple_payments") == "on") {  
               createApplePayProduct({listOfProductsShowingMaintained,stripePublicKey, checkoutResponseCopy, storeDetails, forwardingAddress,product_payment,userId});
               console.log("entro");
            } else if (client.getTreatment("google_apple_payments") == "off") {
               console.log("off")
            } else {
               console.log("control")
            }
         }
      })      
   }

   this.display = function (min, sec) {
      var listOfProductsShowing = [];
      if (
         $("#real_product_wrapper").children(":visible").length == 0 &&
         !jQuery(".form-placed-msg").length &&
         !$(".products-details-componenet").length &&
         !cartItems.length &&
         !jQuery(".order-placed-msg").length &&
         !jQuery(".cart-products")
      ) {
         document.getElementById("products-wrapper").style.display = "none";
      }
      products.forEach((product, index) => {
         
         
         let productTimeInMins = parseInt(product.timeIn.split(":")[0]);
         let productTimeInSecs = parseInt(product.timeIn.split(":")[1]);
         let productTimeOutMins = parseInt(product.timeOut.split(":")[0]);
         let productTimeOutSecs = parseInt(product.timeOut.split(":")[1]);

         if (
            ((min == productTimeInMins && sec == productTimeInSecs) ||
               (min > productTimeInMins && sec > productTimeInSecs) ||
               (min > productTimeInMins && sec <= productTimeInSecs) ||
               (min == productTimeInMins && sec > productTimeInSecs)) &&
            ((min <= productTimeOutMins && sec <= productTimeOutSecs) ||
               (min < productTimeOutMins && sec <= 60))
         ) {
            //  if((min >= productTimeInMins && min <= productTimeOutMins) && (sec >= productTimeInSecs && sec <= productTimeOutSecs)){
            if (
               !forceHideMenu &&
               $("#real_product_wrapper").children(":visible").length
            ) {
               document.getElementById("products-wrapper").style.display =
                  "block";

               if (!product.type || product.type === "product") {
                  if (
                     document.getElementById(product.product.id) &&
                     !!document.getElementById(product.product.id).onclick ===
                        false
                  ) {
                     document.getElementById(product.product.id).onclick = () =>
                        productDetails(product.productId);
                  }
               }
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
               (min >= productTimeOutMins && sec >= productTimeOutSecs) ||
               min > productTimeOutMins ||
               (min <= productTimeInMins && sec < productTimeInSecs) ||
               (min < productTimeInMins && sec <= 60)
            ) {
               jQuery(
                  "#" + (product.product ? product.product.id : product._id)
               ).remove();
            }
         }
      });

      let isFormProduct = listOfProductsShowing.findIndex(
         (x) => x.type === "form"
      );
      let leadForm = products[products.findIndex((x) => x.type === "form")];

      listOfProductsShowing.forEach((product, index) => {
         let elementId = product.product ? product.product.id : product._id;
        
         if (!document.getElementById(elementId)) {
            jQuery("#real_product_wrapper").append(
               getHTMLOfProductObject(product,index)
            );


            if (product.type === "form") {
               createForm(product);
               document
                  .getElementById("hide_form")
                  .addEventListener("click", () => {
                     document.getElementById(product._id).style.display =
                        "none";
                     jQuery("#real_product_wrapper")
                        .children()
                        .not(`#${product._id}`)
                        .show();
                  });
               document.getElementById("products-wrapper").style.display =
                  "block";

               jQuery("#real_product_wrapper")
                  .children()
                  .not(`#${product._id}`)
                  .hide();
            }
            if (!product.type || product.type === "product") {
               if (
                  (leadForm &&
                     parseInt(product.timeIn.split(":")[0]) <=
                        parseInt(leadForm.timeIn.split(":")[0]) &&
                     parseInt(product.timeIn.split(":")[1]) <=
                        parseInt(leadForm.timeIn.split(":")[1])) ||
                  (isFormProduct >= 0 &&
                     jQuery(`#${listOfProductsShowing[isFormProduct]._id}`)
                        .length &&
                     jQuery(`#${listOfProductsShowing[isFormProduct]._id}`).is(
                        ":visible"
                     ))
               ) {
                  jQuery(`#${elementId}`).hide();
               }
               // if (isFormProduct >= 0 && jQuery(`#${listOfProductsShowing[isFormProduct]._id}`).length && jQuery(`#${listOfProductsShowing[isFormProduct]._id}`).is(":visible")) {
               //   document
               //     .getElementById(elementId).style.display = "none";
               // }
               else {
                  document.getElementById("products-wrapper").style.display =
                     "block";

                  if (
                     document.getElementById(product.product.id) &&
                     !!document.getElementById(product.product.id).onclick ===
                        false
                  ) {
                     document.getElementById(product.product.id).onclick = () =>
                        productDetails(product.productId);
                  }
               }
            }
         }
         if (
            isFormProduct >= 0 &&
            jQuery(`#${listOfProductsShowing[isFormProduct]._id}`).length &&
            !jQuery(`#${listOfProductsShowing[isFormProduct]._id}`).is(
               ":visible"
            ) &&
            parseInt(min) ===
               parseInt(
                  listOfProductsShowing[isFormProduct].timeIn.split(":")[0]
               ) &&
            parseInt(sec) ===
               parseInt(
                  listOfProductsShowing[isFormProduct].timeIn.split(":")[1]
               )
         ) {
            jQuery("#real_product_wrapper")
               .children()
               .not(`#${listOfProductsShowing[isFormProduct]._id}`)
               .hide();
            jQuery(`#${listOfProductsShowing[isFormProduct]._id}`).show();
         }

         if (
            listOfProductsShowing[isFormProduct] &&
            jQuery(`#${listOfProductsShowing[isFormProduct]._id}`).is(
               ":visible"
            )
         ) {
            document.getElementById("cart-button").disabled = true;
         } else {
            document.getElementById("cart-button").disabled = false;
         }




      });
      
   };

   function getHTMLOfProductObject(product, index) {
    
   
      if (!product.type || product.type === "product") {
         return `<div class="row card-p" id=${product.product.id}> 
      <div class="col-12"> 
      <div class="well well-sm"> 
      <div class="row pb-2 border-separator"> 
      <div class="col-sm-3 col-4 pull-right text-sm-center"> 
      <img src=${product.product.image} alt="" class="img-rounded img-responsive product-img tabimageimprove" /> 
      </div> 
      <div class="col-sm-9 col-7 text-left product-text product-alignment"> 
      <h6 class="w-bold tabfontimprove">${product.title}</h6> 
      <p class="stream-product-price">Price: <b class="font-weight-lighter">$${product.product.price}  </b></p> 
      <div class="float-right;" id="payment-request-button-product-${product.product.id}"></div>
      </div> 
      </div>
      </div>
   
      </div> 
      </div>`;
      }
      if (product.type === "form") {
         return `<div class="row card-p" id="${product._id}"> 
      <div class="col-md-12 text-left">
      <div class="row">
      <div class="col-10">
      <h4 id="prod_title" class="w-bold text-white pl-4 pt-4 "> 
      ${product.title} </h4> 
      </div>
      <div class="col-2">
      <img class="close-form" src="../../lib/src/images/close.svg" id="hide_form"/>
      </div>
      </div>
      </div>
      <div class="col-12">
      <form id="leadForm" class=" leaddss pl-4 pr-4">
      <div id="form-body"></div>
      <div class="col-md-12 plr-15 pb-2 pl-0"><span class="msg-err" id="leadFormMessage"></span></div>
      <div class="mb-4" id="submit-button-container"><button type="submit" class="btn btn-primary btn-sm w-100-btn mt-3 mb-3"   id="submit_lead_form">Submit</button></div>
      </form>
      </div>
      </div>`;
      }
   }

   function createInputFields(type, id, label, validation, name) {
      var y = document.createElement("LABEL");
      var t = document.createTextNode(label);
      y.setAttribute("for", id);
      y.appendChild(t);
      var x = document.createElement("INPUT");
      x.setAttribute("type", type);
      x.required = validation.isRequired;
      x.id = `${label}_${id}`;

      if (validation.regex) {
         x.pattern = validation.regex;
         x.title = `Please enter ${label} with valid format.`;
      }

      x.classList.add("form-control");
      document.getElementById(`inputField_${id}`).appendChild(x);
      if (name === "phoneNumber") {
         x.maxLength = 12;
         x.minLength = 10;
         document
            .getElementById(`form-body`)
            .insertBefore(y, document.getElementById(`inputField_${id}`));
      } else {
         document
            .getElementById(`form-body`)
            .insertBefore(y, document.getElementById(`inputField_${id}`));
      }
   }

   function createForm(product) {
      document.getElementById("leadForm").addEventListener("submit", (e) => {
         e.preventDefault();
         submitLeadForm(product);
      });

      let form = document.getElementById("form-body");
      product.leadsForm.forEach((element) => {
         let inputFieldDiv = document.createElement("div");
         inputFieldDiv.id = `inputField_${element._id}`;
         form.appendChild(inputFieldDiv);
         if (element.name === "phoneNumber") {
            inputFieldDiv.classList.add("input-group");
            let inputFieldDivChild = document.createElement("div");
            inputFieldDiv.appendChild(inputFieldDivChild);
            inputFieldDivChild.classList.add("input-group-prepend");
            inputFieldDivChild.id = "phone_number-container";

            let dropDown = `
        <select class="form-control phone-code-select" id="countryCodeSelect">
        </select>`;
            jQuery("#phone_number-container").append(dropDown);
            mapCountryCodes();
         }

         createInputFields(
            "text",
            element._id,
            element.label,
            element.validation,
            element.name
         );
      });
   }

   function mapCountryCodes() {
      countries.forEach((element) => {
         if (element.sortname === "US") {
            jQuery("#countryCodeSelect").append(
               `<option selected value = "${element.phoneCode}">${element.sortname}-${element.phoneCode}<option/>`
            );
         }
         jQuery("#countryCodeSelect").append(
            `<option value = "${element.phoneCode}">${element.sortname}-${element.phoneCode}<option/>`
         );
      });
   }

   function productDetails(id) {
      if (document.getElementById("product-details")) {
         document.getElementById("product-details").style.display = "none";
      }
      var product = {};

      listOfProductsShowingMaintained.forEach((e) => {
         if (e.productId == id) {
            product = e;
         }
      });

      sendGoogleEvents("Ecommerce", "Product View", "Click on single product");

      analytics.sendawsEvent(
         {
            eventType: "productView",
            productId: product.product._id,
            productAmount: Number(product.product.price),
            productName: product.title,
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
         '<div class="col-md-12 text-left"><h4 id="prod_price" class="w-bold text-white pl-4">$' +
         product.product.price +
         "</h4></div>" +
         '<div class="col-md-12 mt-1 text-left"><label class="pl-4 text-white"  id="productDetailShowDetail"><u class = "product-detail-more-detail">More Details + </u></label></div>' +
         '<div class="col-md-12 product-details text-left text-white" id="product-details_' +
         product.productId +
         '"><p id="prod_details" class="pl-4"></p>' +
         product.product.details +
         "</div>" +
         '<div class="col-md-12 plr"><button class="btn btn-primary btn-sm w-100-btn mt-3 mb-3" id="productDetailAddToCart">Add to Cart</button></div>' +
         "</div>";
      if (
         document.getElementsByClassName("row products-details-componenet")
            .length == 0
      ) {
         jQuery("#products-wrapper").append(productHTML);
      } else {
         var productDetailsComponent = document.getElementsByClassName(
            "products-details-componenet"
         );
         for (var i = 0; i < productDetailsComponent.length; i++) {
            productDetailsComponent[i].style.display = "block";
         }
      }

      document
         .getElementById("productDetailBackToListing")
         .addEventListener("click", () => backToProductListing());
      document
         .getElementById("productDetailShowDetail")
         .addEventListener("click", () => showDetails(product));
      document
         .getElementById("productDetailAddToCart")
         .addEventListener("click", () => addToBag(product.productId));

      document.getElementById(
         "product-details_" + product.productId
      ).style.display = "none";
   }
   let detailOpen = true;
   $(document).ready(function () {
      detailOpen = true;
   });

   function showDetails(product) {
      sendGoogleEvents(
         "Ecommerce",
         "Product Details View",
         "Click on product details"
      );

      if (
         document.getElementById("product-details_" + product.productId).style
            .display == "none"
      ) {
         document.getElementById(
            "product-details_" + product.productId
         ).style.display = "block";
         detailOpen = false;
      } else {
         document.getElementById(
            "product-details_" + product.productId
         ).style.display = "none";
         detailOpen = true;
      }
   }

 /*   function backToProductListing() {
      setTextInElement({ elementId: "cartMessage", text: "" });
      setTextInElement({ elementId: "paymentFormMessage", text: "" });

      if (document.getElementById("form-filled-msg")) {
         jQuery(".form-placed-msg").remove();
         if (document.getElementById("submit_lead_form")) {
            document.getElementById("submit_lead_form").disabled = false;
         }
      }

      document.getElementById("real_product_wrapper").style.display = "block";

      var cObjs = document.getElementsByClassName("cart-obj");
      for (var i = 0; i < cObjs.length; i++) {
         cObjs[i].style.display = "none";
      }

      jQuery(".order-placed-msg").remove();
      jQuery(".products-details-componenet").remove();
   } */

   function addToBag(productId) {
      //console.log("609", productId);
      var item = {};

      let id_s = _.map(cartItems, "productId");

      //console.log("613",listOfProductsShowingMaintained)

      listOfProductsShowingMaintained.forEach((e) => {
         if (e.productId == productId) {
            item = e;
         }
      });

      sendGoogleEvents("Ecommerce", "Add to cart", "Product added to card");

      analytics.sendawsEvent(
         {
            eventType: "productAddedToCart",
            productId: item.product._id,
            productName: item.title,
            productAmount: Number(item.product.price),
         },
         userId,
         videoId
      );

      if (id_s.indexOf(item.productId) == -1) {
         cartItems.push(item);
      }

      jQuery("#cart-count").text(cartItems.length);
      //console.log("641", cartItems);
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
         document.getElementById("cartMessage").innerHTML = "";
      }
      jQuery(".order-placed-msg").remove();
      jQuery(".payemtDs").remove();
      jQuery(".ship-infor").remove();
      jQuery(".cart-obj").remove();
      jQuery(".products-details-componenet").remove();
      jQuery(".shipping-selection").remove();
      jQuery(".order-summary").remove();
      jQuery(".order-summary-header").remove();
      jQuery(".billingInfo").remove();

      document.getElementById("real_product_wrapper").style.display = "none";

      var htmlForCartItems = "";
      totalAmountCartItems = 0.0;
      let backToPL =
         '<div class="row cart-obj my-2"><div class="col-md-12 text-left"><a class="text-white pl-4 product-detail-back" id="cartBackToProducts"> <i class="fa fa-angle-left" aria-hidden="true"></i> Back to Products</a></div></div>';

      cartItems.forEach((element, ind) => {
         let variantHTML = getVariantHTML(
            element.product.variants,
            element.product.price,
            ind
         );
         if (variantHTML === "") {
            hideVariantIndexes.push(ind);
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
            '<div class="col-7 pt-2 pl-0">  ' +
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
         "</div>";
      let checkoutButton =
         '<div class="row cart-obj mb-3"><span class="msg-err plr-15" id="cartMessage"></span><div class="col-md-12 plr-15 mt-3"><button class="btn btn-primary btn-sm w-100-btn" id="cartCheckout">Checkout</button></div></div>';
      jQuery("#products-wrapper").append(
         backToPL + htmlForCartItems + totalAmountHtml + checkoutButton
      );
      hideVariantIndexes.forEach((index) => {
         $(document).ready(function () {
            $("#cartVariantId-" + index).hide();
         });
      });
      document.getElementById("cartCheckout").addEventListener("click", () => {
         if (!cartItems.length) {
            setTextInElement({
               elementId: "cartMessage",
               text: "Cart is Empty.",
            });
            return;
         } else {
            buttonDisableAndLoad([
               {
                  isDisable: true,
                  elementId: "cartCheckout",
                  isSpinner: true,
                  buttonMessage: "",
               },
            ]);
            checkoutToSummaryDetails();
         }
      });
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

   async function checkoutToSummaryDetails() {
      // shippingDetails()
      let checkoutResponse = {};
      try {
         if (!Object.keys(checkoutResponseCopy).length) {
            checkoutResponse = await checkout(cartItems, {});
         } else {
            let checkoutBody = {
               checkout: {
                  checkout: {
                     line_items: createLineItems(cartItems),
                  },
               },
               storeDetails: storeDetails,
               type: "lineItems",
            };
            checkoutResponse = await updateCheckout({checkoutBody, link:'update-checkout', forwardingAddress, checkoutResponseCopy});
         }
         if (checkoutResponse.errorMessage) {
            setTextInElement({
               elementId: "cartMessage",
               text: checkoutResponse.errorMessage,
            });
            buttonDisableAndLoad([
               {
                  isDisable: false,
                  elementId: "cartCheckout",
                  isSpinner: false,
                  buttonMessage: "Checkout",
               },
            ]);
            return;
         }

         orderSummary(checkoutResponse.checkout, false, {});
      } catch (error) {
         buttonDisableAndLoad([
            {
               isDisable: false,
               elementId: "cartCheckout",
               isSpinner: false,
               buttonMessage: "Checkout",
            },
         ]);
         setTextInElement({ elementId: "cartMessage", text: error });
         // console.log(error);
         return error;
      }
   }

   function getVariantHTML(variants, price, ind) {
     // console.log(ind);

      let selectOptions = "";

      variants.forEach((v) => {
         if (v.title == "Default Title") {
            v.title = "none";
         } else {
            var select_price = v.price == price ? "selected" : "";
            if (v.price == price) {
               cartItems[ind].selectedVariant = v.id;
            }
            selectOptions +=
               "<option " +
               select_price +
               ' value="' +
               v.id +
               '">' +
               v.title +
               "</option>";
         }
      });

      return selectOptions;
   }

   function shippingDetails() {
      // console.log("in details shipping");

      sendGoogleEvents("Ecommerce", "Checkout", "Cart Checkout");

      jQuery(".shipping-selection").remove();
      jQuery(".order-summary").remove();
      jQuery(".order-summary-header").remove();
      jQuery("#cart-products").remove();
      if (document.getElementsByClassName("ship-infor").length != 0) {
         jQuery(".ship-infor").show();
         document.getElementById("order_summary_button").innerHTML =
            "Go To Payment";
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
      countries.forEach((v) => {
         if (v.name == "United States") {
            selectCountries +=
               '<option selected value="' + v.id + '">' + v.name + "</option>";
            getStates(
               {
                  target: {
                     value: v.id,
                  },
               },
               "shipping"
            );
         } else {
            selectCountries +=
               '<option value="' + v.id + '">' + v.name + "</option>";
         }
      });
      statesByCountry.forEach((v) => {
         selectSates += '<option value="' + v.id + '">' + v.name + "</option>";
      });
      citiesByCountry.forEach((v) => {
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
         /**
          * javascript comment
          * @Author: Publio Quintero
          * @Date: 2021-07-22 07:24:01
          * @Desc: Adding google & apple pay
          */
         '<div id="payment-request-button" class="col-md-12 pr-0 pl-0 mb-4"></div>' +
         '<div class="col-md-12 pr-0 pl-0 mb-4"><button type="submit" class="btn btn-primary btn-sm w-100-btn" id="order_summary_button">Go To Payment</button></div>' +
         "</form>" +
         "</div>" +
         "</div>";
      /**
       * javascript comment
       * @Author: Publio Quintero
       * @Date: 2021-07-22 07:52:26
       * @Desc: Calling function
       */
		//client.on(client.Event.SDK_READY, function () {
			var treatment = client.getTreatment("google_apple_payments");
			console.log("Result: ",treatment)
			if (client.getTreatment("google_apple_payments") == "on") {
				createApplePay({stripePublicKey, checkoutResponseCopy, storeDetails, forwardingAddress, cartItems, userId, streamBaseAddress, libraryPath })
			} else if (client.getTreatment("google_apple_payments") == "off") {
				console.log("off")
			} else {
				console.log("control")
			}
		//});


      jQuery("#products-wrapper").append(shipInfo);
      // document
      //   .getElementById("order_summary_button")
      //   .addEventListener("click", () => validateShippingForm());
      if (
         !citiesByCountry.length ||
         !statesByCountry.length ||
         !countries.length
      ) {
         document.getElementById("order_summary_button").disabled = true;
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
         .addEventListener("change", () => getStates(event, "shipping"));
      document
         .getElementById("state")
         .addEventListener("change", () => getCities(event, "shipping"));

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
         "zip",
      ];
      var labels = [
         "First Name",
         "Last Name",
         "Email",
         "Country",
         "State",
         "City",
         "Address",
         "Zip",
      ];

      var i,
         l = fields.length;
      var fieldname;
      var lab;
      var nameRegex = /^[a-zA-Z_ ]+(?:-[a-zA-Z_ ]+)*$/;
      var fNameBool = nameRegex.test($("#shippingForm #first_name").val());
      var lNameBool = nameRegex.test($("#shippingForm #last_name").val());
      if (!fNameBool) {
         setTextInElement({
            elementId: "shippingFormMessage",
            text: `First Name can only be in text.`,
         });
         // console.log("First", fieldname);

         return false;
      } else if (!lNameBool) {
         setTextInElement({
            elementId: "shippingFormMessage",
            text: `Last Name can only be in text.`,
         });
         // console.log("Last", fieldname);

         return false;
      }
      for (i = 0; i < l; i++) {
         fieldname = fields[i];
         // console.log("fieldname", fieldname, '---', document.forms["shippingForm"][fieldname].value);
         lab = labels[i];
         if (document.forms["shippingForm"][fieldname].value === "") {
            setTextInElement({
               elementId: "shippingFormMessage",
               text: `${lab} cannot be empty.`,
            });
            // console.log("bbbbbb", lab);
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
         "billing_zip",
      ];
      var labels = [
         "First Name",
         "Last Name",
         "Country",
         "State",
         "City",
         "Address",
         "Zip",
      ];

      var i,
         l = fields.length;
      var fieldname;
      var lab;
      var nameRegex = /^[a-zA-Z_ ]+(?:-[a-zA-Z_ ]+)*$/;
      var fNameBool = nameRegex.test($("#billingForm #first_name").val());
      var lNameBool = nameRegex.test($("#billingForm #last_name").val());
      if (!fNameBool) {
         setTextInElement({
            elementId: "billingFormMessage",
            text: `First Name can only be in text.`,
         });
         return false;
      } else if (!lNameBool) {
         setTextInElement({
            elementId: "billingFormMessage",
            text: `Lasr Name can only be in text.`,
         });

         return false;
      }
      for (i = 0; i < l; i++) {
         fieldname = fields[i];
         lab = labels[i];
         if (document.forms["billingForm"][fieldname].value === "") {
            setTextInElement({
               elementId: "billingFormMessage",
               text: `${lab} cannot be empty.`,
            });
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
         "CVV",
      ];

      var i,
         l = fields.length;
      var fieldname;
      var lab;
      var nameRegex = /^[a-zA-Z_ ]+(?:-[a-zA-Z_ ]+)*$/;
      var numberRegex = /^[0-9]+$/;
      var cardNumberBool = numberRegex.test(
         $("#paymentForm #cardNumber").val()
      );
      var cardNameBool = nameRegex.test($("#paymentForm #nameOnCard").val());
      var cvvNumberBool = numberRegex.test($("#paymentForm #cvv").val());
      if (!cardNumberBool) {
         setTextInElement({
            elementId: "paymentFormMessage",
            text: `Card Number only in numbers`,
         });

         return false;
      } else if (!cardNameBool) {
         setTextInElement({
            elementId: "paymentFormMessage",
            text: `Name on card can only be in text`,
         });

         return false;
      } else if (!cvvNumberBool) {
         setTextInElement({
            elementId: "paymentFormMessage",
            text: `CVV can only be in number`,
         });
         return false;
      }
      for (i = 0; i < l; i++) {
         fieldname = fields[i];
         lab = labels[i];
         if (document.forms["paymentForm"][fieldname].value === "") {
            setTextInElement({
               elementId: "paymentFormMessage",
               text: `${lab} cannot be empty.`,
            });
            return false;
         }
      }
      return true;
   }

   function getShippingFormValues(form) {
      var i, l;
      var fields = [];
      if (form == "shippingForm") {
         fields = [
            "first_name",
            "last_name",
            "email",
            "country",
            "state",
            "city",
            "address1",
            "zip",
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
            "billing_zip",
         ];
         l = fields.length;
      }
      var fieldname;
      var formDetails = {};
      for (i = 0; i < l; i++) {
         fieldname = fields[i];
         formDetails[fields[i]] = document.forms[form][fieldname].value;
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
      // console.log("enter payment methid");

      buttonDisableAndLoad([
         {
            isDisable: true,
            elementId: "order_summary_button",
            isSpinner: true,
            buttonMessage: "",
         },
      ]);

      var shippingInformationObj = {};

      if (validateShippingForm()) {
         // console.log("form validated");
         setTextInElement({ elementId: "shippingFormMessage", text: "" });
         shippingInformationObj = getShippingFormValues("shippingForm");

         await getStatesByCountry(shippingInformationObj.country);
         await getCitiesByStates(shippingInformationObj.state);

         let shippingCountry = countries.filter(
            (element) => element.id == shippingInformationObj.country
         );
         let shippingState = statesByCountry.filter(
            (element) => element.id == shippingInformationObj.state
         );
         let shippingCity = citiesByCountry.filter(
            (element) => element.id == shippingInformationObj.city
         );

         shippingInformationObj.country_code = shippingCountry[0].sortname;
         shippingInformationObj.province_code = shippingState[0].name;
         if (!shippingCity.length) {
            shippingInformationObj.city = "";
         } else {
            shippingInformationObj.city = shippingCity[0].name;
         }
         shippingInformationObj.phone = "";
        // console.log("shippingInformationObj",shippingInformationObj);
         try {
            let checkoutBody = {
               checkout: {
                  checkout: {
                     token: checkoutResponseCopy.token,
                     shipping_address: shippingInformationObj,
                     email: shippingInformationObj.email,
                  },
               },
               storeDetails: storeDetails,
            };
            let checkoutResponse = await updateCheckout({checkoutBody, link:'update-checkout', forwardingAddress, checkoutResponseCopy});
            if (checkoutResponse.errorMessage) {
               setTextInElement({
                  elementId: "shippingFormMessage",
                  text: checkoutResponse.errorMessage,
               });
               buttonDisableAndLoad([
                  {
                     isDisable: false,
                     elementId: "order_summary_button",
                     isSpinner: false,
                     buttonMessage: "Go To Payment",
                  },
               ]);
               return;
            }
            jQuery("#order_summary_button").hide();
            jQuery(".ship-infor").hide();
            // console.log("checkoutResponse ship",checkoutResponse);

            orderSummary(
               checkoutResponse.checkout,
               true,
               checkoutResponse.shipping_rates
            );
         } catch (error) {
            // console.log("form error", error);
            buttonDisableAndLoad([
               {
                  isDisable: false,
                  elementId: "order_summary_button",
                  isSpinner: false,
                  buttonMessage: "Go To Payment",
               },
            ]);
         }
      } else {
         // console.log("form invalid");
         buttonDisableAndLoad([
            {
               isDisable: false,
               elementId: "order_summary_button",
               isSpinner: false,
               buttonMessage: "Go To Payment",
            },
         ]);
      }
   }

   function orderSummary(checkout, hasShippingInfo, shippingRates) {
      jQuery(".shipping-selection").remove();
      jQuery(".order-summary").remove();
      jQuery(".order-summary-header").remove();
      jQuery("#cart-products").remove();
      jQuery("#cartBackToProducts").remove();
      checkoutResponseCopy = checkout;
      subTotal = checkoutResponseCopy.subtotal_price;
      salesTax = checkoutResponseCopy.total_tax;
      let shippingSelection = "";
      let opts = "";

      if (hasShippingInfo) {
         isShippingRequired = checkout.requires_shipping;
         let shippingRatesRes = [];

         if (isShippingRequired) {
            shippingRatesRes = shippingRates;
         }
         let shipInform = document.getElementsByClassName("ship-infor");
         for (let i = 0; i < shipInform.length; i++) {
            shipInform[i].style.display = "none";
         }
         if (isShippingRequired) {
            shippingRatesRes.forEach((ele) => {
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
      }
      // console.log("hasShippingInfo",hasShippingInfo);

      let gotToShipBillInfoButton = !hasShippingInfo
         ? "Go To Shipping Info"
         : "Go To Billing Info";

      let orderSummaryHeader =
         '<div class="col-md-12 text-light mt-3 order-summary-header text-left" id="order-summary-header"><h5>Order Summary</h5></div>';
      let htmlForCartItems = "";
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
      // let parseFixesValue = parseFloat(subTotal).toFixed(2);
      let restTotal =
         '<div class="row product-details text-light" id="res-total">' +
         '<div class="col-6 p-0 text-left"><h6 class="w-bold">Subtotal</h6></div>' +
         '<div class="col-6 p-0 text-right">' +
         '<h6 class="w-bold" id="order_sub_total">$00' +
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
         '<span id="discount_value" class="discount_value_position"></span>' +
         '<span class="w-bold total-bill-font" id="total-order-summary">' +
         "$0.00" +
         "</span>" +
         "</div>" +
         "</div>";
      let orderSummary = hasShippingInfo
         ? '<div class="col-md-12 order-summary text-left" id="order-summary"><a class="text-white product-detail-back" id="go-to-shipping"> <i class="fa fa-angle-left" aria-hidden="true" ></i>&nbsp Back to Shipping Info</a></div>' +
           shippingSelection
         : "";
      let errorMessageContainer = `<div class="row product-details"><span class="text-danger" id="error_check_out_message"></span></div>`;
      let gotToShipBillInfo = `<div class="row product-details"><button type="submit" class="btn btn-primary btn-sm w-100-btn mb-4" id="go_to_shipping_billing_info">${gotToShipBillInfoButton}</button></div>`;

      let applyDiscount = `<div class="row product-details">
    <div class="col-md-12 pt-3 mb-3 border-separator"></div>
    <form class="discount-code-container">
    <div class="form-row" id="discount-form">
      <div class="col-9">
        <input type="text" class="form-control" placeholder="Discount Code" id="discount_code_value" required>
      </div>
      <div class="col-3">
      <button type="button" class="btn btn-primary mb-2 discount-code-button" id="apply_discount_code">Apply</button>
      </div>
    </div>
  </form></div>`;

      let discountBage = `<div class="row product-details" id="applied_discount_code"><span class="badge badge-light discount-code" id="discount_code_holder"><span id="discount_code_name">${
         checkoutResponseCopy.applied_discount
            ? checkoutResponseCopy.applied_discount.title
            : ""
      }</span><i class="discount-remove-icon"><img class="discount-remove-image" id="remove_discount_code" src="${libraryPath}/images/closeBlack.svg"></i></span></div>`;

      jQuery("#products-wrapper").append(
         orderSummary +
            orderSummaryHeader +
            htmlForCartItems +
            restTotal +
            applyDiscount +
            discountBage +
            errorMessageContainer +
            gotToShipBillInfo
      );

      // console.log("checkoutResponseCopy", checkoutResponseCopy);

      if (!checkoutResponseCopy.applied_discount) {
         $("#discount_code_holder").remove();
      } else {
         if (document.getElementById("remove_discount_code")) {
            document
               .getElementById("remove_discount_code")
               .addEventListener("click", () => {
                  applyDiscountCode(
                     checkoutResponseCopy,
                     false,
                     hasShippingInfo
                  );
               });
         }
      }
      // console.log("Listener added",isShippingRequired, hasShippingInfo);

      if (isShippingRequired && hasShippingInfo) {
         // console.log("Listener added");
         document
            .getElementById("shippingMethod")
            .addEventListener("change", () => getSelectedShipping("shipping"));
         document.getElementById("shipping-rate").innerHTML =
            '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
         getSelectedShipping("shipping");
      }
      if (hasShippingInfo && document.getElementById("go-to-shipping")) {
         document
            .getElementById("go-to-shipping")
            .addEventListener("click", () => shippingDetails());
      }

      // if (!hasShippingInfo) {
      document
         .getElementById("apply_discount_code")
         .addEventListener("click", () => {
            applyDiscountCode(checkoutResponseCopy, true, hasShippingInfo);
         });
      // }

      document
         .getElementById("go_to_shipping_billing_info")
         .addEventListener("click", () => {
            if (!hasShippingInfo) {
               shippingDetails();
               return;
            }
            billingInformation();
         });

      buttonDisableAndLoad([
         {
            isDisable: false,
            elementId: "total-order-summary",
            isSpinner: true,
            buttonMessage: "",
         },
      ]);
      // document.getElementById("total-order-summary").innerHTML = '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
      // console.log("aaaaaaaaaaaaaaaaaaaaaaa",hasShippingInfo );

      if (!hasShippingInfo || !checkoutResponseCopy.shipping_line) {
         orderSummaryPrice(checkoutResponseCopy);
      }
   }

   async function applyDiscountCode(discountCheckout, apply, hasShippingInfo) {
      // console.log("hasShippingInfo", hasShippingInfo);

      if (apply && !$("#discount_code_value").val()) {
         setTextInElement({
            elementId: "error_check_out_message",
            text: "Enter a valid discount code.",
         });
         return;
      }
      let discountBadge = `<span class="badge badge-light discount-code" id="discount_code_holder"><span id="discount_code_name"></span><i class="discount-remove-icon"><img class="discount-remove-image" id="remove_discount_code" src="${libraryPath}/images/closeBlack.svg"></i></span>`;
      buttonDisableAndLoad([
         {
            isDisable: true,
            elementId: "apply_discount_code",
            isSpinner: apply,
            buttonMessage: "Apply",
         },
         {
            isDisable: true,
            elementId: "go_to_shipping_billing_info",
            isSpinner: false,
            buttonMessage: !hasShippingInfo
               ? "Go To Shipping Info"
               : "Go to Billing Info",
         },
      ]);

      let discountCode = apply ? $("#discount_code_value").val() : "";
      document.getElementById("discount_code_value").disabled = true;

      let updateBody = {
         checkout: {
            checkout: {
               token: discountCheckout.token,
               discount_code: discountCode,
            },
         },
         storeDetails: storeDetails,
         type: "discountCode",
      };

      let checkoutResponse;
      try {
         checkoutResponse = await updateCheckout({checkoutBody, link:'update-checkout', forwardingAddress, checkoutResponseCopy});
         buttonDisableAndLoad([
            {
               isDisable: !checkoutResponse.errorMessage ? apply : false,
               elementId: "apply_discount_code",
               isSpinner: false,
               buttonMessage: "Apply",
            },
            {
               isDisable: false,
               elementId: "go_to_shipping_billing_info",
               isSpinner: false,
               buttonMessage: !hasShippingInfo
                  ? "Go To Shipping Info"
                  : "Go to Billing Info",
            },
         ]);
         if (!apply) {
            document.getElementById("discount_code_value").disabled = false;
         }

         if (checkoutResponse.errorMessage) {
            document.getElementById("discount_code_value").disabled = false;
            setTextInElement({
               elementId: "error_check_out_message",
               text: checkoutResponse.errorMessage,
            });
            return;
         }
         if (checkoutResponse.checkout.applied_discount) {
            $("#applied_discount_code").append(discountBadge);
            setTextInElement({
               elementId: "discount_code_name",
               text: checkoutResponse.checkout.applied_discount.title,
            });
            document
               .getElementById("remove_discount_code")
               .addEventListener("click", () => {
                  applyDiscountCode(
                     checkoutResponse.checkout,
                     false,
                     hasShippingInfo
                  );
               });
         } else {
            $("#discount_code_holder").remove();
         }

         $("#discount_code_value").val("");
         document.getElementById("error_check_out_message").innerHTML =
            checkoutResponse.checkout.applied_discount
               ? checkoutResponse.checkout.applied_discount
                    .non_applicable_reason
               : "";
         orderSummaryPrice(checkoutResponse.checkout);
         checkoutResponseCopy = checkoutResponse.checkout;
      } catch (error) {
         document.getElementById("discount_code_value").disabled = false;
         buttonDisableAndLoad([
            {
               isDisable: false,
               isSpinner: false,
               elementId: "apply_discount_code",
               buttonMessage: "Apply",
            },
            {
               isDisable: false,
               elementId: "go_to_shipping_billing_info",
               isSpinner: false,
               buttonMessage: !hasShippingInfo
                  ? "Go To Shipping Info"
                  : "Go to Billing Info",
            },
         ]);
         // console.log(error);
      }
   }

   function orderPlaced() {
      // console.log("updatedCheckoutResponseCopy", updatedCheckoutResponseCopy);

      let paymentDetailsValues = {};
      if (validatePaymentForm()) {
         paymentDetailsValues = getPaymentFormValues();
         let sId = window.location.search.substring(1).split("/")[1];
         var pIdsArray = _.map(cartItems, "_id");
         var data = {
            orderObject: {
               customerName:
                  updatedCheckoutResponseCopy.shipping_address.first_name +
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
                  shipping:
                     updatedCheckoutResponseCopy.shipping_rate == null
                        ? "0"
                        : updatedCheckoutResponseCopy.shipping_rate.price,
                  salesTax: updatedCheckoutResponseCopy.total_tax,
                  TotalPrice: updatedCheckoutResponseCopy.total_price,
                  lineItems: updatedCheckoutResponseCopy.line_items,
                  token: updatedCheckoutResponseCopy.token,
               },
            },
            stripeDetails: {
               cardNumber: paymentDetailsValues.cardNumber,
               cardMonth: paymentDetailsValues.cardMonth,
               cardYear: paymentDetailsValues.cardYear,
               nameOnCard: paymentDetailsValues.nameOnCard,
               cvv: paymentDetailsValues.cvv,
               shopify_payments_account_id:
                  updatedCheckoutResponseCopy.shopify_payments_account_id,
            },
            storeDetails: storeDetails,
         };
         document.getElementById("purchase_btn").innerHTML =
            '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
         document.getElementById("purchase_btn").disabled = true;
       //  console.log("data",data);
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

 /*   function clearCartItems() {
      cartItems = [];
      jQuery("#cart-count").text(cartItems.length);
      jQuery(".billingInfo").remove();
      billingForm = {
         firstName: "",
         lastName: "",
         address: "",
         zipCode: "",
      };
   } */

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
      /**
       * javascript comment
       * @Author: Publio Quintero
       * @Date: 2021-07-28 12:48:42
       * @Desc: Cambiar variante precio
       */
      let cartItemTotalAmount = 0.0;
      var e = document.getElementById("cartVariantId-" + i);
      // new variant
      var value = e.options[e.selectedIndex].value;
      // asignar nuevo valor a selectedVariant
      cartItems[i].selectedVariant = value;
		

      var new_variant = cartItems[i].product.variants.filter(
         (item) => item.id == value
      );
		
		cartItems[i].product.price = new_variant[0].price;
      var quantity = document.getElementById("cartItemId-" + i).value;
      cartItems[i].product.totalPrice =
         parseFloat(new_variant[0].price) * quantity;

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
      cartItems[i].quantity = quantity;
		showCartProducts()
   }

   async function getSelectedShipping(flag) {
      var shippingLineSelected = "";
      let updatedCheckout = {};
      if (isShippingRequired && flag == "shipping") {
         shippingLineSelected = document.getElementById("shippingMethod").value;
      }

      let checkoutBody = {};
      if (flag == "shipping") {
         if (shippingLineSelected) {
            checkoutBody = {
               checkout: {
                  checkout: {
                     shipping_line: {
                        handle: shippingLineSelected,
                     },
                  },
               },
               storeDetails: storeDetails,
            };
         } else {
            checkoutBody = {
               checkout: {
                  checkout: {
                     shipping_line: null,
                  },
               },
               storeDetails: storeDetails,
            };
         }
      } else if (flag == "billing") {
         document.getElementById("go_to_payment").disabled = true;
         document.getElementById("go_to_payment").innerHTML =
            '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>';
         if (!jQuery("#sameAsShipping").is(":checked")) {
            let billingInfo = getShippingFormValues("billingForm");
            let billingCountry = countries.filter(
               (element) => element.id == billingInfo.billing_country
            );
            let billingState = statesByCountry.filter(
               (element) => element.id == billingInfo.billing_state
            );
            let billingCity = citiesByCountry.filter(
               (element) => element.id == billingInfo.billing_city
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
                     billing_address: billingInfo,
                  },
               },
               storeDetails: storeDetails,
            };
         } else {
            checkoutBody = {
               checkout: {
                  checkout: {
                     billing_address: shippingAddress,
                  },
               },
               storeDetails: storeDetails,
               type: "billingInformation",
            };
         }
      }
      try {
         updatedCheckout = await updateCheckout({checkoutBody, link:'update-checkout', forwardingAddress, checkoutResponseCopy});
      } catch (error) {
         return error;
      }
      if (flag == "billing") {
         return updatedCheckout;
      }
      updatedCheckoutResponseCopy = updatedCheckout.checkout;
      orderSummaryPrice(updatedCheckoutResponseCopy);
   }

   function orderSummaryPrice(updatedCheckout, hasShippingInfo) {
      let discountApplied = "";
      let shippingRate = "";
      let disable = false;

      if (updatedCheckout.applied_discount) {
         discountApplied = `(Discount -$${updatedCheckout.applied_discount.amount})`;
         disable = true;
      }
      document.getElementById("error_check_out_message").innerHTML =
         updatedCheckout.applied_discount
            ? updatedCheckout.applied_discount.non_applicable_reason
            : "";

      if (
         document.getElementById("apply_discount_code") &&
         document.getElementById("discount_code_value")
      ) {
         buttonDisableAndLoad([
            {
               isDisable: disable,
               elementId: "apply_discount_code",
               isSpinner: false,
               buttonMessage: "Apply",
            },
         ]);
         document.getElementById("discount_code_value").disabled = disable;
      }

      if (
         updatedCheckout.shipping_rate &&
         updatedCheckout.shipping_rate.price
      ) {
         shippingRate = updatedCheckout.shipping_rate.price;
      }

      if (
         updatedCheckout.applied_discount &&
         updatedCheckout.applied_discount.applicable &&
         updatedCheckout.applied_discount.value_type === "shipping" &&
         shippingRate
      ) {
         discountApplied = `(Discount -$${updatedCheckout.applied_discount.amount})`;
      }
      if (
         updatedCheckout.applied_discount &&
         updatedCheckout.applied_discount.applicable &&
         updatedCheckout.applied_discount.value_type === "shipping" &&
         !shippingRate
      ) {
         discountApplied = `(Discount - Shipping)`;
      }

      totalBill = updatedCheckout.total_price;
      salesTax = updatedCheckout.total_tax;
      subTotal = updatedCheckout.subtotal_price;
      // console.log(updatedCheckout);
      let shipping = shippingRate || "0.00";

      jQuery("#shipping-rate").text("$" + shipping);
      jQuery("#order_sub_total").text("$" + subTotal);
      jQuery("#total-order-tax").text("$" + salesTax);
      jQuery("#discount_value").text(discountApplied);

      jQuery("#total-order-summary").text("$" + totalBill);
      ApplePayValue = totalBill;
   }

   async function purchaseCheckout() {
      let currentYear = new Date().getFullYear();
      // console.log("in purchase checkout");

      sendGoogleEvents("Ecommerce", "Go to Payment", "Order Summary Accepted");
      jQuery(".billingInfo").hide();
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
         "<option selected value=" +
         currentYear +
         ">" +
         currentYear +
         "</option>" +
         "<option value=" +
         (currentYear + 1) +
         ">" +
         (currentYear + 1) +
         "</option>" +
         "<option value=" +
         (currentYear + 2) +
         ">" +
         (currentYear + 2) +
         "</option>" +
         "<option value=" +
         (currentYear + 3) +
         ">" +
         (currentYear + 3) +
         "</option>" +
         "<option value=" +
         (currentYear + 4) +
         ">" +
         (currentYear + 4) +
         "</option>" +
         "<option value=" +
         (currentYear + 5) +
         ">" +
         (currentYear + 5) +
         "</option>" +
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
         '<div class="col-md-12 plr-15"><button type="button" class="btn btn-primary btn-sm w-100-btn mb-4" id="purchase_btn">Purchase</button>' +
         "</div>" +
         "</form>" +
         "</div>" +
         "</div>";

      if (jQuery(".payemtDs").length === 0) {
         jQuery("#products-wrapper").append(paymentDetails);
      } else {
         jQuery(".payemtDs").show();
      }
      // mapCardExpiryYears();

      document.getElementById("purchase_btn").addEventListener("click", () => {
         orderPlaced();
      });

      document
         .getElementById("paymentBackToDetails")
         .addEventListener("click", () => backToBillingInformation());
   }

   async function updateBillingInformation() {
      if (
         jQuery("#billingForm").length !== 0 &&
         !jQuery("#sameAsShipping").is(":checked") &&
         !validateBillingForm()
      ) {
         return;
      }

      buttonDisableAndLoad([
         {
            isDisable: true,
            isSpinner: true,
            elementId: "go_to_payment",
            buttonMessage: "",
         },
      ]);

      if (!jQuery("#sameAsShipping").is(":checked")) {
         let billingInfo = getShippingFormValues("billingForm");
         let billingCountry = countries.filter(
            (element) => element.id == billingInfo.billing_country
         );
         let billingState = statesByCountry.filter(
            (element) => element.id == billingInfo.billing_state
         );
         let billingCity = citiesByCountry.filter(
            (element) => element.id == billingInfo.billing_city
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
                  billing_address: billingInfo,
               },
            },
            storeDetails: storeDetails,
            type: "billingInformation",
         };
      } else {
         checkoutBody = {
            checkout: {
               checkout: {
                  billing_address: checkoutResponseCopy.shipping_address,
               },
            },
            storeDetails: storeDetails,
            type: "billingInformation",
         };
      }
      // console.log("Billing Information checkoutBody", checkoutBody);

      try {
         let checkoutRespone = await updateCheckout({checkoutBody, link:'update-checkout', forwardingAddress, checkoutResponseCopy});
         buttonDisableAndLoad([
            {
               isDisable: false,
               isSpinner: false,
               elementId: "go_to_payment",
               buttonMessage: "Go To Payment",
            },
         ]);

         if (checkoutRespone.errorMessage) {
            setTextInElement({
               elementId: "billingFormMessage",
               text: checkoutRespone.errorMessage,
            });
            return;
         }
         setTextInElement({ elementId: "billingFormMessage", text: "" });
         updatedCheckoutResponseCopy = checkoutRespone.checkout;
         purchaseCheckout();
      } catch (error) {
         // console.log("Billing Information Error", error);
      }
   }

   function mapCardExpiryYears() {
      let currentYear = new Date().getFullYear();
      let nextYearsCount = 5;
      for (let year = 0; year <= nextYearsCount; year++) {
         newYear = currentYear + year;
         if (newYear === currentYear) {
            jQuery("#cardYear").append(
               `<option selected value = "${newYear}">${newYear}<option/>`
            );
            continue;
         }
         jQuery("#cardYear").append(
            `<option value = "${newYear}">${newYear}<option/>`
         );
      }
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
      countries.forEach((v) => {
         if (v.name == "United States") {
            selectCountries +=
               '<option selected value="' + v.id + '">' + v.name + "</option>";
            getStates(
               {
                  target: {
                     value: v.id,
                  },
               },
               "billing"
            );
         } else {
            selectCountries +=
               '<option value="' + v.id + '">' + v.name + "</option>";
         }
      });
      var billingInformation = `<div class="row billingInfo">
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
              <div class="col-md-12 mt-3 plr-15"><button type="button" class="btn btn-primary btn-sm w-100-btn mb-4" id="go_to_payment">Go To Payment</button></div>
          </form>
      </div>
  </div>`;
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
         jQuery(".billingInfo").show();
      }
      jQuery("#newBillingInfo").click(() => {
         if (jQuery("#newBillingInfo").is(":checked")) {
            jQuery(".addbillingInfo").append(billInfo);
            getStates(
               {
                  target: {
                     value: jQuery("#billing_country")[0].selectedIndex,
                  },
               },
               "billing"
            );
            statesByCountry.forEach((v) => {
               selectSates +=
                  '<option value="' + v.id + '">' + v.name + "</option>";
            });
            citiesByCountry.forEach((v) => {
               selectCities +=
                  '<option value="' + v.id + '">' + v.name + "</option>";
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
               .addEventListener("change", () => getStates(event, "billing"));
            document
               .getElementById("billing_state")
               .addEventListener("change", () => getCities(event, "billing"));

            billingformChanged();
         }
      });
      jQuery("#sameAsShipping").click(() => {
         if (jQuery("#sameAsShipping").is(":checked")) {
            jQuery(".bill-infor").remove();
         }
      });
      if (
         !citiesByCountry.length ||
         !statesByCountry.length ||
         !countries.length
      ) {
         document.getElementById("go_to_payment").disabled = true;
      }

      document
         .getElementById("go_to_payment")
         .addEventListener("click", () => updateBillingInformation());
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
      jQuery(".payemtDs").remove();
      jQuery(".billingInfo").show();
      setTextInElement({ elementId: "billingFormMessage", text: "" });
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
      var $el = form == "shipping" ? $("#state") : $("#billing_state");
      $el.empty();
      $.each(statesByCountry, function (key, value) {
         $el.append(
            $("<option></option>").attr("value", value.id).text(value.name)
         );
      });
      getCitiesByCountry(statesByCountry[0].id, form);
   }

   async function getCities(event, form) {
      await getCitiesByStates(event.target.value);
      var $el = form == "shipping" ? $("#city") : $("#billing_city");
      $el.empty();
      $.each(citiesByCountry, function (key, value) {
         $el.append(
            $("<option ></option>").attr("value", value.id).text(value.name)
         );
      });
   }

   async function getCitiesByCountry(vl, form) {
      await getCitiesByStates(vl);
      var $el = form == "shipping" ? $("#city") : $("#billing_city");
      $el.empty();
      $.each(citiesByCountry, function (key, value) {
         $el.append(
            $("<option ></option>").attr("value", value.id).text(value.name)
         );
      });
   }

   function hasClass(element, cls) {
      return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
   }

   document.getElementById("products-opener").addEventListener("click", () => {
      forceHideMenu = false;
      document.getElementById("products-wrapper").style.display = "block";
   });

   document.getElementById("products-closer").addEventListener("click", () => {
      forceHideMenu = true;
      document.getElementById("products-wrapper").style.display = "none";
   });

   function createToken(data) {
      $.ajax({
         type: "POST",
         url: "https://api.stripe.com/v1/tokens",
         headers: {
            Authorization: "Bearer " + stripeSecretKey, // ojo cambiar
            "Stripe-Account": data.stripeDetails.shopify_payments_account_id,
         },
         data: {
            card: {
               number: data.stripeDetails.cardNumber,
               cvc: data.stripeDetails.cvv,
               exp_month: data.stripeDetails.cardMonth,
               exp_year: data.stripeDetails.cardYear,
            },
         },
         success: (response) => {
            delete data.stripeDetails;
            data.token = response;
            axios
               .post(forwardingAddress + "/stripe", {
                  withCredentials: true,
                  body: data,
               })
               .then((res) => {
                  if (res.data.error) {
                     document.getElementById("purchase_btn").innerHTML =
                        "Purchase";
                     document.getElementById("purchase_btn").disabled = false;
                     document.getElementById("paymentFormMessage").innerHTML =
                        res.data.message ||
                        res.data.error.error.payment.transaction.message;
                     return;
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
                     '" class="fb-xfbml-parse-ignore"><img src=' +
                     libraryPath +
                     '/images/facebook.svg height="40px"></a></div>' +
                     //twitter Share
                     '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
                     streamBaseAddress +
                     '" data-layout="button_count" data-size="small"><a target="_blank" href="https://twitter.com/intent/tweet?url=' +
                     streamBaseAddress +
                     '" class="fb-xfbml-parse-ignore"><img src=' +
                     libraryPath +
                     '/images/twitter.svg height="40px"></a></div>' +
                     //linkedin Share
                     '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
                     streamBaseAddress +
                     '" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=' +
                     streamBaseAddress +
                     '" class="fb-xfbml-parse-ignore"><img src=' +
                     libraryPath +
                     '/images/linkedin.svg  height="40px"></a></div>' +
                     "</div>";

                  var shopmore =
                     '<div class="col-md-12 plr-15 mt-3"><button class="btn btn-primary btn-sm w-100-btn mb-4" type="button"  id="end_continue_shopping">Continue shopping</button>' +
                     "</div>";

                  var orderPlacedMessage =
                     '<div class="row order-placed-msg">' +
                     '<div class="col-md-12 position-center pl-5 pr-5 border-separator">' +
                     '<i><img src="' +
                     libraryPath +
                     '/images/checkbox.svg"></i>' +
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
                  if (jQuery(".order-placed-msg").length === 0) {
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
                     shippingLine = Number(
                        updatedCheckoutResponseCopy.shipping_line.price
                     );
                  }
                  let quantity = 0;
                  analytics.sendawsEvent(
                     {
                        eventType: "orderPlaced",
                        orderAmount: Number(
                           updatedCheckoutResponseCopy.subtotal_price
                        ),
                        orderTotal: Number(
                           updatedCheckoutResponseCopy.total_price
                        ),
                        orderId: updatedCheckoutResponseCopy.name,
                        orderTax: Number(updatedCheckoutResponseCopy.total_tax),
                        orderShipping: shippingLine,
                     },
                     userId,
                     videoId
                  );
                  cartItems.forEach((items, i) => {
                     quantity = items.quantity ? items.quantity : 1;
                     analytics.sendawsEvent(
                        {
                           eventType: "productOrderPlaced",
                           productId: items.product._id,
                           productName: items.title,
                           productAmount: Number(items.product.price),
                           productQuantity: Number(quantity),
                           orderId: updatedCheckoutResponseCopy.name,
                        },
                        userId,
                        videoId
                     );
                  });
                  cartItems = [];
                  checkoutResponseCopy = {};
                  updatedCheckoutResponseCopy = {};
                  jQuery("#cart-count").text(cartItems.length);
               });
         },
         error: (response) => {
            document.getElementById("paymentFormMessage").innerHTML =
               response.responseJSON.error.message;
            document.getElementById("purchase_btn").innerHTML = "Purchase";
            document.getElementById("purchase_btn").disabled = false;
         },
      });
   }

   async function submitLeadForm(product) {
      let { formInformation, formSubmissionDetails, leadSourceInformation } =
         product;
      document.getElementById("submit_lead_form").disabled = true;
      fieldLength = product.leadsForm.length;
      let fields = product.leadsForm.map(
         (element) => `${element.label}_${element._id}`
      );
      let fieldname;
      let leadsFormObject = {};
      for (let i = 0; i < fieldLength; i++) {
         fieldname = fields[i];
         leadsFormObject[product.leadsForm[i].name] =
            document.forms["leadForm"][fieldname].value;
         if (product.leadsForm[i].name === "phoneNumber") {
            leadsFormObject["countryCode"] =
               document.forms["leadForm"]["countryCodeSelect"].value;
         }
      }

      let leadData = {
         formInformation,
         formSubmissionDetails,
         leadData: leadsFormObject,
         leadSourceInformation,
      };

      // for (const key in leadSourceInformation) {
      //   leadData.leadData[key] = leadSourceInformation[key];
      // }

      try {
         await axios.post(`${basePath}/leadsForm/submit-leads-form`, leadData);
         document.getElementById("leadForm").reset();
         jQuery(`#${product.productId}`).remove();
         products.splice(
            products.findIndex((x) => x.productId === product.productId),
            1
         );
         jQuery(`#real_product_wrapper`).children().show();
         formSubmittedModal(product);
      } catch (error) {
         document.getElementById("leadFormMessage").innerHTML =
            error.data.status.message;
      }
   }

   function formSubmittedModal(form) {
      let shareButtons =
         '<div class="col-md-12 my-3 order-placed-msg border-separator">' +
         '<div class="col-md-12 pl-5 pr-5 my-4"> <p class="text-light text-center sharescreenfontimprove"> ' +
         form.formSubmissionModal.description +
         "</p></div>" +
         '<div class="row px-5 pb-3 shareiconimprove text-center">' +
         //facebook Share
         '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
         streamBaseAddress +
         '" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=' +
         streamBaseAddress +
         '" class="fb-xfbml-parse-ignore"><img src=' +
         libraryPath +
         '/images/facebook.svg height="40px"></a></div>' +
         //twitter Share
         '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
         streamBaseAddress +
         '" data-layout="button_count" data-size="small"><a target="_blank" href="https://twitter.com/intent/tweet?url=' +
         streamBaseAddress +
         '" class="fb-xfbml-parse-ignore"><img src=' +
         libraryPath +
         '/images/twitter.svg height="40px"></a></div>' +
         //linkedin Share
         '<div class="fb-share-button col-3 text-center pl-2 pr-2" data-href="' +
         streamBaseAddress +
         '" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=' +
         streamBaseAddress +
         '" class="fb-xfbml-parse-ignore"><img src=' +
         libraryPath +
         '/images/linkedin.svg  height="40px"></a></div>' +
         "</div>";

      let shopmore =
         '<div class="col-md-12 plr-15 mt-3"><button class="btn btn-primary btn-sm w-100-btn mb-4" type="button"  id="form_continue_shopping">Continue</button>' +
         "</div>";

      let formFilledMessage =
         '<div class="row form-placed-msg" id="form-filled-msg">' +
         '<div class="col-md-12 position-center pl-5 pr-5 border-separator">' +
         '<i><img src="' +
         libraryPath +
         '/images/checkbox.svg"></i>' +
         '<h5 class="mt-3 text-white font-weight-normal"><b>' +
         form.formSubmissionModal.title +
         "</b></h5>" +
         "</div>";

      if (jQuery(".form-placed-msg").length === 0) {
         document.getElementById("real_product_wrapper").style.display = "none";
         jQuery("#products-wrapper").append(
            formFilledMessage + shareButtons + shopmore
         );
      }

      document
         .getElementById("form_continue_shopping")
         .addEventListener("click", () => {
            backToProductListing();
         });
   }

   function createLineItems(cartItems) {
      let lineItems = [];
		console.log("Cart Items 2888: ",cartItems)
      cartItems.forEach((ci, ind) => {
			/** 
			 * javascript comment 
			 * @Author: Publio Quintero 
			 * @Date: 2021-07-28 15:32:55 
			 * @Desc: Line Items price 
			 */
			//var variante = ci.product.variants.filter( item => item.id == ci.selectedVariant );
         let tempO = {};
         (tempO.variant_id = ci.selectedVariant),
            (tempO.quantity = ci.quantity ? ci.quantity : 1);
         lineItems.push(tempO);
      });
		console.log("Line Items 2895: ", lineItems)
      return lineItems;
   }

   function checkout(cartItems, shippingInformationObj) {
      // console.log("In CHeckout!!!");

      let checkoutObj = {};

      let lineItems = createLineItems(cartItems);

      checkoutObj = {
         line_items: lineItems,
         storeDetails: storeDetails,
         cartItems: cartItems,
         // discount_code: 'PG86MMQK33DW'
      };

      if (Object.keys(shippingInformationObj).length) {
         checkoutObj.email = shippingInformationObj.email;
         checkoutObj.shipping_address = shippingInformationObj;
         shippingAddress = shippingInformationObj;
      }

      return new Promise(async (resolve, reject) => {
         try {
            let checkout = await axios.post(`${forwardingAddress}/checkout`, {
               withCredentials: true,
               body: checkoutObj,
            });
            resolve(checkout.data);
         } catch (error) {
            reject(error);
         }
      });
   }


   function buttonDisableAndLoad(props) {
      props.forEach((element) => {
         document.getElementById(element.elementId).disabled =
            element.isDisable;
         document.getElementById(element.elementId).innerHTML =
            element.isSpinner
               ? '<i class="fa fa-spinner fa-spin fa-loader-icon"></i>'
               : element.buttonMessage;
      });
   }
/*    function setTextInElement(props) {
      if (document.getElementById(props.elementId)) {
         document.getElementById(props.elementId).innerHTML = props.text;
      }
   } */




/** 
 * javascript comment 
 * @Author: darwin mercado 
 * @Date: 2021-08-23 10:10:19
 * @Desc: 
 * @param {{checkoutBody:{},link:string,forwardingAddress:string, checkoutResponseCopy:{}}} dataCheckout
 * @retrun Promise
 */

console.log("llego");

   

}

function EmptyMessages() {
   document.getElementById("paymentFormMessage").innerHTML = "";
   document.getElementById("shippingFormMessage").innerHTML = "";
   document.getElementById("billingFormMessage").innerHTML = "";
}

/** 
 * javascript comment 
 * @Author: andersson arellano 
 * @Date: 2021-08-13 22:21:17 
 * @Desc: function to update shopify checkout information
 * @param {{checkoutBody:{},link:string,forwardingAddress:string, checkoutResponseCopy:{}}} dataCheckout
 * @retrun Promise
 */
function updateCheckout(dataCheckout) {
   const {checkoutBody, link, forwardingAddress, checkoutResponseCopy} = dataCheckout;
   return new Promise(async (resolve, reject) => {
      try {
         let updatedCheckout = await axios.post(
            `${forwardingAddress}/${link}/${checkoutResponseCopy.token}`,
            {
               withCredentials: true,
               body: checkoutBody,
            }
         );
         resolve(updatedCheckout.data);
      } catch (error) {
         reject(error);
      }
   });
}


// function moved to use globally
function backToProductListing() {
   setTextInElement({ elementId: "cartMessage", text: "" });
   setTextInElement({ elementId: "paymentFormMessage", text: "" });

   if (document.getElementById("form-filled-msg")) {
      jQuery(".form-placed-msg").remove();
      if (document.getElementById("submit_lead_form")) {
         document.getElementById("submit_lead_form").disabled = false;
      }
   }

   document.getElementById("real_product_wrapper").style.display = "block";

   var cObjs = document.getElementsByClassName("cart-obj");
   for (var i = 0; i < cObjs.length; i++) {
      cObjs[i].style.display = "none";
   }

   jQuery(".order-placed-msg").remove();
   jQuery(".products-details-componenet").remove();
}

// function moved to use globally
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

function setTextInElement(props) {
   if (document.getElementById(props.elementId)) {
      document.getElementById(props.elementId).innerHTML = props.text;
   }
}
