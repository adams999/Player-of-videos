/**
* javascript comment
* @Author: Publio Quintero & andersson arellano
* @Date: 2021-07-22 07:24:52/ 2021-08-19
* @Desc: Code for google & apple pay
* @param {{ stripePublicKey:string, checkoutResponseCopy:{}, storeDetails:{}, forwardingAddress:string, cartItems:{}, userId:string, streamBaseAddress:string ,libraryPath:string }} dataPay
* @return
*/
async function createApplePay( dataPay ) {

    var { 
        stripePublicKey, 
        checkoutResponseCopy, 
        storeDetails, 
        forwardingAddress, 
        cartItems,
        userId,
        streamBaseAddress,
        libraryPath,
    } = dataPay;
    console.log(checkoutResponseCopy);

    var dataDetail = checkoutResponseCopy.line_items.map(item =>{
        return {
            label: `${item.title} x ${item.quantity}`,
            amount: parseInt(item.price)*100*item.quantity
        }
    });

    var token = {};
    var total = ApplePayValue.split(".");
    total = total[0] + total[1];
    total = parseInt(total);
    console.log("Price", total);
    var stripe = Stripe(stripePublicKey,{
        stripeAccount: checkoutResponseCopy.shopify_payments_account_id
    });
    //step 2
    var paymentRequest = stripe.paymentRequest({
    country: "US",
    currency: "usd",
    total: {
        label: "Total",
        amount: total,
    },
    displayItems: dataDetail,
    requestPayerName: true,
    requestPayerEmail: true,
    requestShipping: true,
    });
    //step 3
    var elements = stripe.elements();
    var prButton = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    });
    // Check the availability of the Payment Request API first.
    paymentRequest.canMakePayment().then(function (result) {
    if (result) {
        prButton.mount("#payment-request-button");
        document.getElementById("payment-request-button").style.border =
            "1px solid #FFF";
        document.getElementById("payment-request-button").style.background =
            "#5579f3 !important";
    } else {
        document.getElementById("payment-request-button").style.display =
            "none";
    }
    });

    paymentRequest.on("token", async (eventData)=>{
        console.log("reult",eventData);
        token = eventData.token;
        //result.complete("success");
        let names = eventData.shippingAddress.recipient.split(" ");

    let checkoutBody = {
        checkout: {
            checkout: {
            token: checkoutResponseCopy.token,
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
    console.log("checkoutBody",checkoutBody);
    // update-checkout 
    let response = await updateCheckout({checkoutBody, link:'update-checkout', forwardingAddress, checkoutResponseCopy});
    
    console.log("response",response);
    console.log("e",eventData);
    if(response.error){
        eventData.complete('fail');
    }else{
        const checkoutResponse = response.checkout;
        
        let sId = window.location.search.substring(1).split("/")[1];
        var pIdsArray = _.map(cartItems, "_id");
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

        console.log("data",data);
        axios
        .post(forwardingAddress + "/stripe", {
           withCredentials: true,
           body: data,
        }).then(result =>{
            console.log("result", result);
            if(result.status === 200){
                eventData.complete('success');
                //process payment
                createViewShared({streamBaseAddress, libraryPath, data});
                document
                     .getElementById("end_continue_shopping")
                     .addEventListener("click", () => {
                        backToProductListing();
                        clearCartItems();
                     });
                     cartItems = [];
                     checkoutResponseCopy = {};
                     jQuery("#cart-count").text(cartItems.length);
            }else{
                eventData.complete('fail');
            }
        });

    }
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
        console.log("checkoutBody",checkoutBody);
        updateCheckout({checkoutBody, link:'shipings', forwardingAddress, checkoutResponseCopy})
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
}

/** 
 * javascript comment 
 * @Author: andersson arellano 
 * @Date: 2021-08-23 01:02:15 
 * @Desc:  Funtion to create view shared
 * @param {{streamBaseAddress: string, libraryPath: string, data: {}}} dataSharpe
 * retrun  
 */

const createViewShared = (dataSharpe) =>{

    var {
        streamBaseAddress,
        libraryPath,
        data,
    } = dataSharpe;

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
    console.log("here");

    jQuery("#order_summary_button").hide();
    jQuery(".ship-infor").hide();

    jQuery("#products-wrapper").append(
        orderPlacedMessage + shareButtons + shopmore
    );

}