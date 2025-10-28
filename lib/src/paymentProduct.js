//test
function addCartProduct(listOfProductsShowingMaintained,productId) {
    var cartItems = [];
    listOfProductsShowingMaintained.forEach((e) => {
       if (e.productId == productId) {
          cartItems.push(e);
       }
    });
    return cartItems;
 }
 
 function createLineItemsProduct(cartItems) {
    let lineItems = [];

  lineItems.push({
       "variant_id":(cartItems[0].product.variants)[0].id,
       "quantity":1
    });

    return lineItems;
 }
 
 function checkoutProduct(productId, shippingInformationObj,forwardingAddress,listOfProductsShowingMaintained) {
    let checkoutObj = {};
    let lineItems = createLineItemsProduct(addCartProduct(listOfProductsShowingMaintained,productId));

    checkoutObj = {
       line_items: lineItems,
       storeDetails: shippingInformationObj.storeDetails,
       cartItems: addCartProduct(listOfProductsShowingMaintained,productId),
       shipping_address: shippingInformationObj.shipping_address,
    };

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

 function updateCheckoutProduct(dataCheckout) {
    const {checkoutBody, link, forwardingAddress, value_token} = dataCheckout;
    return new Promise(async (resolve, reject) => {
       try {
          let updatedCheckout = await axios.post(`${forwardingAddress}/${link}/${value_token}`,
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


async function createApplePayProduct(dataPay) {
    var {
        listOfProductsShowingMaintained,
        stripePublicKey,
        checkoutResponseCopy, 
        storeDetails, 
        forwardingAddress, 
        product_payment,
        userId
    } = dataPay;
    var token = {};

    var total = (product_payment.price).split(".");
    total = total[0] + total[1];
    total = parseInt(total);
    var shippingAddress = {};

   var checkoutResponse = checkoutProduct(product_payment.id,{storeDetails,shippingAddress},forwardingAddress,listOfProductsShowingMaintained)
   checkoutResponse.then(response=>{
      checkoutResponseCopy = response;
      console.log(checkoutResponseCopy.checkout.shopify_payments_account_id);
      console.log("checkout",checkoutResponseCopy);

      
  var stripe = Stripe(stripePublicKey,{stripeAccount: checkoutResponseCopy.checkout.shopify_payments_account_id});
 
  //step 2
  var paymentRequest = stripe.paymentRequest({
     country: "US",
     currency: "usd",
     total: {
        label: "Total",
        amount: total,
  },
     requestPayerName: true,
     requestPayerEmail: true,
     requestShipping: true,
  });

  
   //step 3
   var elements = stripe.elements();
   var prButton = elements.create("paymentRequestButton", {
   paymentRequest: paymentRequest,
   });
  

   paymentRequest.canMakePayment().then(function (result) {
   if (result) {
       prButton.mount("#payment-request-button-product-"+product_payment.id);
       document.getElementById("payment-request-button-product-"+product_payment.id).style.border =
           "1px solid #FFF";
       document.getElementById("payment-request-button-product-"+product_payment.id).style.background =
           "#5579f3 !important";
   } else {
       document.getElementById("payment-request-button-product-"+product_payment.id).style.display =
           "none";
   }
});
  

paymentRequest.on("token", async (eventData)=>{
  token = eventData.token;
  let names = eventData.shippingAddress.recipient.split(" ");

let checkoutBody = {
  checkout: {
      checkout: {
      token: checkoutResponseCopy.checkout.token,
      shipping_address: {
          address1: eventData.shippingAddress.addressLine[0],
          city: eventData.shippingAddress.city,
          country_code: eventData.shippingAddress.country,
          first_name: names[0],
          last_name: (names.length>1)?names[1]:names[0],
          province_code: eventData.shippingAddress.region,
          zip: eventData.shippingAddress.postalCode,
          phone: (eventData.shippingAddress.phone)?eventData.shippingAddress.phone:''
      },
      shipping_line:{
          handle: eventData.shippingOption.id
      },
      billing_address: {
          address1: eventData.shippingAddress.addressLine[0],
          city: eventData.shippingAddress.city,
          country_code: eventData.shippingAddress.country,
          first_name: names[0],
          last_name: (names.length>1)?names[1]:names[0],
          province_code: eventData.shippingAddress.region,
          zip: eventData.shippingAddress.postalCode,
          phone: (eventData.shippingAddress.phone)?eventData.shippingAddress.phone:''
      },
      email: eventData.payerEmail
      },
  },
  storeDetails: storeDetails,
};

let value_token = checkoutResponseCopy.checkout.token;
let response = await updateCheckoutProduct({checkoutBody, link:'update-checkout', forwardingAddress,value_token});
console.log("response",response);
console.log("e",eventData);

const checkoutResponse = response.checkout;
  
  let sId = window.location.search.substring(1).split("/")[1];
  var pIdsArray = _.map(addCartProduct(listOfProductsShowingMaintained,product_payment.id), "_id");

  
  var data = {
      orderObject: {
          customerName: eventData.payerName,
          customerEmail: eventData.payerEmail,
          stream: sId,
          products: pIdsArray,
          user: userId,
          orderNumber: checkoutResponse.name,
          amount: checkoutResponse.total_price,
          customerId: checkoutResponse.customer_id,
          checkout: {
          shippingDetails: checkoutResponse.shipping_address,
          subTotal: checkoutResponse.subtotal_price,
          shipping:
              checkoutResponse.shipping_rate == null
                  ? "0"
                  : checkoutResponse.shipping_rate.price,
          salesTax: checkoutResponse.total_tax,
          TotalPrice: checkoutResponse.total_price,
          lineItems: checkoutResponse.line_items,
          token: checkoutResponse.token,
          },
      },
      storeDetails: storeDetails,
      token: token     
  };

  axios
  .post(forwardingAddress + "/stripe", {
     withCredentials: true,
     body: data,
  }).then(result =>{
      console.log("result", result);
      if(result.status === 200){
          eventData.complete('success');
          //process payment
      }else{
          eventData.complete('fail');
      }
  });   
});


   // event change shippings
   paymentRequest.on('shippingaddresschange', function(eventData) {
     if (eventData.shippingAddress.country !== 'US') {
        eventData.updateWith({status: 'invalid_shipping_address'});
    } else {
        console.log("eventData",eventData);
        let checkoutBody = {
            checkout: {
                checkout: {
                    token: checkoutResponseCopy.token,
                    shipping_address: {
                    address1: "default",
                    city: eventData.shippingAddress.city,
                    country_code: eventData.shippingAddress.country,
                    first_name: "default",
                    last_name: "default",
                    province_code: eventData.shippingAddress.region,
                    zip: eventData.shippingAddress.postalCode,
                    phone: (eventData.shippingAddress.phone)?eventData.shippingAddress.phone:''
                }
                },
            },
            storeDetails: storeDetails,
        };
      

        let value_token = checkoutResponseCopy.checkout.token;

        updateCheckoutProduct({checkoutBody, link:'shipings', forwardingAddress,value_token })
            .then(response =>{
                let shippingOptions;
                if(response.shipping_rates){
                shippingOptions = response.shipping_rates.map(shipping =>{
                    return {
                        id: shipping.id,
                        label: shipping.title,
                        detail: shipping.handle,
                        amount: parseInt(shipping.price)*100
                    };
                });
                }else{
                    eventData.updateWith({status: 'invalid_shipping_address'});
                }
                console.log("response",response);
                eventData.updateWith({
                status: 'success',
                shippingOptions: shippingOptions
                });
            })
            .catch(error =>{
                console.error(error);
            });
    }
    });
   })
   


 }
 

