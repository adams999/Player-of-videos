function SimuStream(params) {
   // var time_update_interval;
   var isStreamPlaying = false;

   var libraryPath = params.libraryPath;
   var playerType = params.playerType;
   var onSimuWrapperReady = params.onSimuWrapperReady;

   this.playVideo = params.playVideo;
   this.pauseVideo = params.pauseVideo;
   this.getCurrentVideoTime = params.getCurrentVideoTime;
   this.getVideoDuration = params.getVideoDuration;

   var props = {};
   props.streamObj = params.streamData;
   props.countriesListFetchPath = params.countriesListFetchPath;
   props.statesListFetchPath = params.statesListFetchPath;
   props.citiesListFetchPath = params.citiesListFetchPath;
   props.products = [];

   props.analytics = new SimuAnalytics(params.disableAnalytics);

   props.sendGoogleEvents = function (
      eventCategory,
      eventAction,
      eventLabel,
      eventValue
   ) {
      ga("send", "event", {
         eventCategory: eventCategory,
         eventAction: eventAction,
         eventLabel: eventLabel,
         eventValue: eventValue,
      });
   };
   props.productsAvailable = false;
   props.libraryPath = params.libraryPath;
   props.streamer = {};
   props.userId = "";
   props.isProductDisplayScreen = true;
   props.storeDetails = {
      accessToken: "",
      shop: "",
      recurringApplicationChargeId: "",
   };
   props.forwardingAddress = "";
   props.privateIp;

   props.streamBaseAddress = "";
   props.stripePublicKey = "";
   props.stripe = "";
   props.elements = "";
   props.userPlan = "";

   var displayFuncTimeout;
   var productsDisplay;
   let commonSettings;

   var self = this;

   if (props.streamObj.endStream) {
      if (props.streamObj.endStream[0]['type'] === "image") {
         finalView = `<div class="fallback-view" id="fallback_view"><img src="${props.streamObj.endStream[0]['url']}" style="width:100%; height:100%;"></div>`;
      } else {
         if (
            props.streamObj.endStream[0]['source'] === "computer" ||
            props.streamObj.endStream[0]['source'] === "url"
         ) {
            finalView = `<div class="fallback-view" id="fallback_view"><video width="100%" height="100%" autoplay muted src="${props.streamObj.endStream[0]['url']}"></video></div>`;
         } else {
				finalView = `<div class="fallback-view" id="fallback_view"><iframe style="width:100%; height:100%" src="https://www.youtube.com/embed/${props.streamObj.endStream[0]['url']}?rel=0&controls=0&autoplay=1&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
         }
      }
   } else {
		finalView = `<div class="fallback-view" id="fallback_view"><video width="100%" height="100%" autoplay muted><source src="https://simustream-files.s3.amazonaws.com/final_layout.mp4" type="video/mp4">Your browser does not support the video tag.</video></div>`
	}
   

   props.analytics.sendawsEvent(
      {
         eventType: "streamOpened",
      },
      props.userId,
      streamId
   );

   $.getJSON(props.libraryPath + "/config/settings.json", (data) => {
      props.forwardingAddress = data[0].store_forwarding_address;
      props.basePath = data[0].base_path + "/api/v1/web";
      // remenber change stripePublicKey
      //props.stripePublicKey = data[0].stripe_public_key;
      props.stripePublicKey = data[0].stripe_public_key;
      props.stripeSecretKey = data[0].stripe_secret_key;
      onReadyJson();
   });

   async function onReadyJson() {
      
      // stripe initial here
      props.stripe = Stripe(props.stripePublicKey);
      props.elements = props.stripe.elements();

      /*simuWrapper.onPlayerReady = function () {
        startPlayingVideo();
        sendawsEvent({
            eventType: 'streamOpened'
        }, userId, videoId)
    };*/

      /*simuWrapper.onPlayerPause = function () {
    };*/

      var streamId = props.streamObj._id;
      props.streamBaseAddress = window.location.href;
      props.userId = props.streamObj.user;
      // let plan = await fetch("https://api-stage.simustream.com/api/v1/web/plans/get-plan-by-user/" + props.userId)
      //     let respPlanJson = await plan.json()
      //     props.userPlan = respPlanJson.body.plan;
      streamer = {
         isCardExpired: false,
      };
      if (props.streamObj.storeId) {
         props.storeDetails = {
            accessToken: props.streamObj.storeId.accessToken,
            shop: props.streamObj.storeId.domain,
            recurringApplicationChargeId:
               props.streamObj.storeId.recurringApplicationChargeId,
         };
         props.storeAccessToken = props.streamObj.storeId.accessToken;
      }

      props.streamObj.products.forEach((product) => {
         if (!product.type || product.type === "product") {
            props.products.push({
               productId: product.product.product_id,
               _id: product._id,
               title: product.product.title,
               timeIn: product.timeIn,
               timeOut: product.timeOut,
               type: product.type,
               product: {
                  _id: product.product._id,
                  id: product.product.product_id,
                  image: product.product.images[0]
                     ? product.product.images[0].src
                     : "",
                  price: Number(product.product.variants[0].price).toFixed(2),
                  desciption: product.product.product_type
                     ? product.product.product_type
                     : "Product",
                  variants: product.product.variants,
                  options: product.product.options,
                  details: product.product.body_html,
               },
            });
         }
         if (product.type === "form") {
            props.products.push({
               productId: product._id,
               _id: product._id,
               title: product.leadsForm.displayName,
               formInformation: {
                  formName: product.leadsForm.name,
                  formDisplayName: product.leadsForm.displayName,
               },
               leadSourceInformation: {
                  accountName:
                     props.streamObj.sreamSourceInformation.accountName,
                  streamUrl: window.location.href,
                  streamId: props.streamObj._id,
               },
               desciption: product.leadsForm.description,
               timeIn: product.timeIn,
               timeOut: product.timeOut,
               type: product.type,
               leadsForm: product.leadsForm.leadsFields,
               formSubmissionDetails: product.leadsForm.formSubmissionDetails,
               formSubmissionModal: product.leadsForm.formSubmissionModal,
            });
         }
      });

      productsDisplay = new ProductsDisplay(props);

      if (playerType == "youtube") {
         onSimuWrapperReady();
      } else {
         onSimuWrapperReady();
      }

      self.playStream = function () {
         if (!props.streamer.isCardExpired) {
            startInterval();
            isStreamPlaying = true;
         }
      };

      self.pauseStream = function () {
         self.pauseVideo();
         props.sendGoogleEvents("Video", "Pause", "Video pause");

         isStreamPlaying = false;
      };

      //start player
      function startPlayingVideo() {
         // wrapper.playerInstance.play();
         // playPlayerInstance();
         isStreamPlaying = true;
         self.playVideo();
         props.sendGoogleEvents("Video", "Play", "Video play");
      }

      //starts the interval
      function startInterval() {
         getCurrentTime();

         if (!time_update_interval) {
            props.analytics.sendawsEvent(
               {
                  eventType: "streamStarted",
               },
               props.userId,
               streamId
            );
            var time = self.getCurrentVideoTime();
            if (parseInt(time) == 0)
               props.analytics.sendawsEvent(
                  {
                     eventType: "streamProgress",
                     progress: 0,
                  },
                  props.userId,
                  streamId
               );
         }

         clearInterval(time_update_interval);
         time_update_interval = setInterval(() => {
            var time = self.getCurrentVideoTime();
            if (parseInt(time) % 10 == 0 && isStreamPlaying) {
               streamProgress = parseInt(time);
               props.analytics.sendawsEvent(
                  {
                     eventType: "streamProgress",
                     progress: streamProgress,
                  },
                  props.userId,
                  streamId
               );
            }
            getCurrentTime();
         }, 1000);
      }

      var unique_call_display_button_pay = true;

      // This function is called by startPlayer() Updates current time text display.
      function getCurrentTime() {
         formatTime(self.getCurrentVideoTime());
         // formatTime(wrapper.playerInstance.getPlayerDuration());
         
         if(unique_call_display_button_pay){
            productsDisplay.displayButtonPay();
            unique_call_display_button_pay = false;
         }
         
      }

      //formats time in minutes/seconds to apply checks
      function formatTime(time) {
         time = Math.round(time);
         var minutes = Math.floor(time / 60),
            seconds = time - minutes * 60;
         seconds = seconds < 10 ? "0" + seconds : seconds;
         // if(typeof productDisplay === "function")
         productsDisplay.display(minutes, seconds);
      }

      function hideAllProducts() {
         document.getElementById("products-wrapper").style.display = "none";
         document.getElementById("products-opener").style.display = "block";
      }

      function showAllProducts() {
         productsAvailable
            ? (document.getElementById("products-wrapper").style.display =
                 "block")
            : (document.getElementById("products-wrapper").style.display =
                 "none");
         document.getElementById("products-opener").style.display = "none";
      }
   }

   return this;
}
