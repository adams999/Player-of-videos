# SimuStream Player Wrapper Library


This is the library for wrapping your players inside the SimuStream wrapper that will convert your streams into an in-stream shopping experience. 


## Installation

To install the library in your project, simply pull the code and place it in a folder in your project. Tada !

We will add npm at some point, but for now, you can simply download the repo and move the code to your project directory. 



## Dependencies

SimuStream has following dependencies, so make sure you install them.

- [Aws SDK](https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js)
-  [Lodash](https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js)
- [Axios](https://unpkg.com/axios/dist/axios.min.js")
- [jQuery](https://code.jquery.com/jquery-1.10.2.js)
- [Bootstrap](https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css)
- [Font-Awesome](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css")
-  [Stripe](https://js.stripe.com/v3/)
-  [Moment](https://github.com/moment/moment)

## Setup

Include the js and css in your index.html file

  **Javascript**
  `<link  rel="stylesheet"  href="simustream/simu.min.js">`

  **Javascript**
`<link  rel="stylesheet"  href="simustream/simu.min.css">`


## Usage

### Load the stream data
First you need to load the stream object. It should have the following format


You will need the streamData object, mapped from the id that the SimuStream dashboard generate for you. If you are using your own custom backend, then you have to load the data yourself. It should be the in the format below
```json
{"description":"Did you know in China you can buy a G-Class for only $40000?! Well, you can as long as you're happy with it not being an actual Mercedes! The Chinese are ...","status":"publish","thumbnail":"https://i.ytimg.com/vi/1GxGA78RgAA/hqdefault.jpg","sales":0,"views":34,"isActive":true,"isCustom":false,"isArchive":false,"deleted":false,"_id":"5d39a49cdae53618968f8025","name":"Fake AMG G63 and the other worst Chinese copycat cars!","video":{"thumbnail":"https://i.ytimg.com/vi/1GxGA78RgAA/hqdefault.jpg","isActive":true,"deleted":false,"_id":"5d39a3e2dae53618968f801c","title":"Fake AMG G63 and the other worst Chinese copycat cars!","videoUrl":"1GxGA78RgAA","accountId":"5d39a3e2dae53618968f7feb","videoOriginalId":"1GxGA78RgAA","contentDetails":"Did you know in China you can buy a G-Class for only $40000?! Well, you can as long as you're happy with it not being an actual Mercedes! The Chinese are ...","channelId":"UCUhFaUpnq31m6TNX2VKVSVA","publishedAt":"2019-05-05T08:00:01.000Z","createdAt":"2019-07-25T12:43:14.930Z","updatedAt":"2019-07-25T12:43:14.930Z","__v":0},"products":[{"_id":"5d39a49cdae53618968f802a","product":{"body_html":"","imageUrl":"https://simustream-files.s3.amazonaws.com/default_product.jpg","sales":0,"views":0,"variants":[{"id":11813442486319,"title":"10 / Green / Plastic","option_values":[{"option_id":1701023711279,"name":"Size","value":"10"},{"option_id":1742260011055,"name":"Color","value":"Green"},{"option_id":1742260043823,"name":"Material","value":"Plastic"}],"price":"600.00","formatted_price":"$600.00","compare_at_price":null,"grams":0,"requires_shipping":true,"sku":"","barcode":"","taxable":true,"position":1,"available":true,"inventory_policy":"deny","inventory_quantity":986,"inventory_management":"shopify","fulfillment_service":"manual","weight":0,"weight_unit":"lb","image_id":null,"created_at":"2019-06-11T04:17:02-04:00","updated_at":"2019-07-18T23:10:00-04:00"}],"options":[{"id":1701023711279,"name":"Size","product_id":1216965804079,"position":1,"values":["10"]},{"id":1742260011055,"name":"Color","product_id":1216965804079,"position":2,"values":["Green"]},{"id":1742260043823,"name":"Material","product_id":1216965804079,"position":3,"values":["Plastic"]}],"images":[{"id":4541971169327,"created_at":"2019-05-14T07:29:31-04:00","position":1,"updated_at":"2019-05-14T07:29:31-04:00","product_id":1216965804079,"src":"https://cdn.shopify.com/s/files/1/0070/2087/1727/products/IMG_0195.jpg?v=1557833371","variant_ids":[],"width":1218,"height":637}],"isActive":true,"deletedFromStore":false,"deleted":false,"_id":"5d39a487dae53618968f8024","product_id":"1216965804079","handle":"apple-smart-watch","product_type":"","title":"Apple Smart Watch","vendor":"Apple","tags":"","accountId":"5d39a402dae53618968f801e","price":600,"createdAt":"2019-07-25T12:45:59.994Z","updatedAt":"2019-07-25T12:45:59.994Z","__v":0},"timeIn":"03:00","timeOut":"08:43"},{"_id":"5d39a49cdae53618968f8029","product":{"body_html":"<meta charset=\"utf-8\">\n<header class=\"dB46V section-header\">\n<h2>About the Event</h2>\n</header>\n<div class=\"BWYtr\">\n<div class=\"_2MP_F\">\n<div class=\"_1tY7T\">\n<p class=\"eyebrow\">OVERVIEW</p>\n<div class=\"x17BN\">\n<p><strong>Bellator MMA</strong><span> </span>is returning to the “Big Apple” on Friday, June 14 for its second event at Madison Square Garden with a stacked card. This blockbuster event features an epic showdown for the welterweight title as <strong>Rory MacDonald</strong><span> </span>takes on<span> </span><strong>Neiman Gracie</strong><span> </span>in the semi-finals of the Welterweight World Grand Prix! Plus two of the sport’s most recognizable names in<span> </span><strong>Lyoto Machida</strong><span> </span>(25-8) and<span> </span><strong>Chael Sonnen</strong><span> </span>(31-16-1) will finally meet inside the Bellator cage.</p>\n<p>Additionally, the Viacom-owned promotion is moving the previously announced 175-pound catchweight contest between grappling ace<span> </span><strong>Dillon Danis</strong><span> </span>and<span> </span><strong>Max Humphrey</strong><span> </span>to inside Madison Square Garden. Fresh off two boxing wins in 2018 to remain undefeated at 22-0,<span> </span><strong>Heather Hardy</strong><span> </span>is ready to return to the site of her mixed martial arts debut, when she brings her exciting style back to the Bellator cage against<span> </span><strong>Taylor Turner.</strong></p>\n<p>To view the complete bout sheet,<span> </span><a href=\"https://www.msg.com/wp-content/uploads/2019/06/Bellator-222-June14_New-York_6-5-19.pdf\">click here</a>.</p>\n<p>*All bouts/times subject to change.</p>\n</div>\n</div>\n</div>\n</div>","imageUrl":"https://simustream-files.s3.amazonaws.com/default_product.jpg","sales":0,"views":32,"variants":[{"id":11818861428783,"title":"L","option_values":[{"option_id":1743157133359,"name":"Size","value":"L"}],"price":"30.00","formatted_price":"$30.00","compare_at_price":null,"grams":0,"requires_shipping":false,"sku":"","barcode":"","taxable":true,"position":1,"available":true,"inventory_policy":"deny","inventory_quantity":961,"inventory_management":"shopify","fulfillment_service":"manual","weight":0,"weight_unit":"lb","image_id":null,"created_at":"2019-06-11T16:58:00-04:00","updated_at":"2019-07-26T06:06:52-04:00"}],"options":[{"id":1743157133359,"name":"Size","product_id":1252152442927,"position":1,"values":["L"]}],"images":[{"id":4737070006319,"created_at":"2019-06-11T16:58:05-04:00","position":1,"updated_at":"2019-06-11T16:58:05-04:00","product_id":1252152442927,"src":"https://cdn.shopify.com/s/files/1/0070/2087/1727/products/Screen_Shot_2019-06-11_at_2.49.09_PM.png?v=1560286685","variant_ids":[],"width":792,"height":444}],"isActive":true,"deletedFromStore":false,"deleted":false,"_id":"5d39a487dae53618968f8023","product_id":"1252152442927","handle":"bellator-222-fri-jun-14-6-30pm","product_type":"Tickets","title":"Bellator 222 - Fri, Jun 14/6:30pm","vendor":"Madison Square","tags":"","accountId":"5d39a402dae53618968f801e","price":30,"createdAt":"2019-07-25T12:45:59.079Z","updatedAt":"2019-07-25T12:45:59.079Z","__v":0},"timeIn":"00:00","timeOut":"08:43"},{"_id":"5d39a49cdae53618968f8028","product":{"body_html":"","imageUrl":"https://simustream-files.s3.amazonaws.com/default_product.jpg","sales":0,"views":0,"variants":[{"id":11580867969071,"title":"Default Title","option_values":[{"option_id":1701008179247,"name":"Title","value":"Default Title"}],"price":"450.00","formatted_price":"$450.00","compare_at_price":null,"grams":0,"requires_shipping":true,"sku":"","barcode":"","taxable":true,"position":1,"available":true,"inventory_policy":"deny","inventory_quantity":978,"inventory_management":"shopify","fulfillment_service":"manual","weight":0,"weight_unit":"lb","image_id":null,"created_at":"2019-05-14T07:08:50-04:00","updated_at":"2019-07-18T23:10:00-04:00"}],"options":[{"id":1701008179247,"name":"Title","product_id":1216955580463,"position":1,"values":["Default Title"]}],"images":[{"id":4541885874223,"created_at":"2019-05-14T07:08:52-04:00","position":1,"updated_at":"2019-05-14T07:08:52-04:00","product_id":1216955580463,"src":"https://cdn.shopify.com/s/files/1/0070/2087/1727/products/Dell_Alienware17_L_1.jpg?v=1557832132","variant_ids":[],"width":400,"height":300}],"isActive":true,"deletedFromStore":false,"deleted":false,"_id":"5d39a47fdae53618968f8022","product_id":"1216955580463","handle":"alienware-dell","product_type":"","title":"Alienware Dell 2020","vendor":"Dell","tags":"","accountId":"5d39a402dae53618968f801e","price":450,"createdAt":"2019-07-25T12:45:51.981Z","updatedAt":"2019-07-25T12:45:51.981Z","__v":0},"timeIn":"00:00","timeOut":"08:43"},{"_id":"5d39a49cdae53618968f8027","product":{"body_html":"","imageUrl":"https://simustream-files.s3.amazonaws.com/default_product.jpg","sales":0,"views":0,"variants":[{"id":11580969320495,"title":"Default Title","option_values":[{"option_id":1701025382447,"name":"Title","value":"Default Title"}],"price":"120.00","formatted_price":"$120.00","compare_at_price":null,"grams":0,"requires_shipping":true,"sku":"","barcode":"","taxable":true,"position":1,"available":true,"inventory_policy":"deny","inventory_quantity":994,"inventory_management":"shopify","fulfillment_service":"manual","weight":0,"weight_unit":"lb","image_id":null,"created_at":"2019-05-14T07:30:46-04:00","updated_at":"2019-07-23T10:10:05-04:00"}],"options":[{"id":1701025382447,"name":"Title","product_id":1216966787119,"position":1,"values":["Default Title"]}],"images":[{"id":4541980377135,"created_at":"2019-05-14T07:30:56-04:00","position":1,"updated_at":"2019-05-14T07:30:56-04:00","product_id":1216966787119,"src":"https://cdn.shopify.com/s/files/1/0070/2087/1727/products/RTX2080_OC_8GB_STRIX_ASUS-600x600.png?v=1557833456","variant_ids":[],"width":600,"height":600}],"isActive":true,"deletedFromStore":false,"deleted":false,"_id":"5d39a47fdae53618968f8020","product_id":"1216966787119","handle":"asus-8gb-rtx2070-strix","product_type":"","title":"Asus 8GB RTX2070 Strix","vendor":"SimuStream Store","tags":"","accountId":"5d39a402dae53618968f801e","price":120,"createdAt":"2019-07-25T12:45:51.825Z","updatedAt":"2019-07-25T12:45:51.825Z","__v":0},"timeIn":"00:00","timeOut":"08:43"},{"_id":"5d39a49cdae53618968f8026","product":{"body_html":"","imageUrl":"https://simustream-files.s3.amazonaws.com/default_product.jpg","sales":0,"views":0,"variants":[{"id":11580835495983,"title":"Default Title","option_values":[{"option_id":1701000904751,"name":"Title","value":"Default Title"}],"price":"470.00","formatted_price":"$470.00","compare_at_price":null,"grams":0,"requires_shipping":false,"sku":"","barcode":"","taxable":true,"position":1,"available":true,"inventory_policy":"deny","inventory_quantity":997,"inventory_management":"shopify","fulfillment_service":"manual","weight":0,"weight_unit":"lb","image_id":null,"created_at":"2019-05-14T07:02:56-04:00","updated_at":"2019-07-15T04:51:56-04:00"}],"options":[{"id":1701000904751,"name":"Title","product_id":1216950075439,"position":1,"values":["Default Title"]}],"images":[{"id":4541853827119,"created_at":"2019-05-14T07:02:59-04:00","position":1,"updated_at":"2019-05-14T07:02:59-04:00","product_id":1216950075439,"src":"https://cdn.shopify.com/s/files/1/0070/2087/1727/products/bmw-tyre-500x500.jpg?v=1557831779","variant_ids":[],"width":500,"height":500}],"isActive":true,"deletedFromStore":false,"deleted":false,"_id":"5d39a47fdae53618968f801f","product_id":"1216950075439","handle":"bmw-tyres","product_type":"","title":"BMW Tyres","vendor":"BMW","tags":"","accountId":"5d39a402dae53618968f801e","price":470,"createdAt":"2019-07-25T12:45:51.146Z","updatedAt":"2019-07-25T12:45:51.146Z","__v":0},"timeIn":"00:00","timeOut":"08:43"}],"storeId":{"imageUrl":"https://simustream-files.s3.amazonaws.com/default_product.jpg","accountType":"shopify","recurringApplicationChargeId":"4061855791","isActive":true,"deleted":false,"_id":"5d39a402dae53618968f801e","domain":"simustream-store.myshopify.com","title":"Simu Stream","userId":"5d383e076d8b6b1fa4bbaab9","accessToken":"76a9410920d5e6777fb33e65e8b83bfb","createdAt":"2019-07-25T12:43:46.133Z","updatedAt":"2019-07-25T12:43:46.133Z","__v":0},"user":"5d383e076d8b6b1fa4bbaab9","publishedAt":"2019-07-25T12:46:20.940Z","createdAt":"2019-07-25T12:46:20.940Z","updatedAt":"2019-07-25T12:46:20.940Z","__v":0}}}
```
### Instantiate the library
  
~~~~
simu=new  SimuStream({

libraryPath:"../lib/dist",
"streamData":streamDetails,
"onSimuWrapperReady":function(){console.log("MY WRAPPER IS READY NOW");},
"countriesListFetchPath":"/api/v1/web/players/countries",
"statesListFetchPath":"/api/v1/web/players/states/",
"citiesListFetchPath":"/api/v1/web/players/cities/",
"disableAnalytics":false
});
~~~~


| Param        | Detail           |
| ------------- |:-------------:|
| libraryPath    |The path to the folder where you downloaded the library | 
| streamData     | The streamData object that you loaded above      |  
| onSimuWrapperReady     | Called when the wrapper is ready. If this function is called, you know your library integration is working  |  
| countriesListFetchPath | A list of all the countries.Please contact the Simu team for the dump and the format      |
| statesListFetchPath | A list of all the countries. Please contact the Simu team for the dump and the format    |
| countriesListFetchPath | Please contact the Simu team for the dump and the format        |
| disableAnalytics     |Our system records analytics like total sales, viewership funnels, conversion funnels etc.However, if you would prefer that this data not be sent to our system, you can disable it, but please know that it will disable all the graphs and analytics on your SimuStream Dashboard. Please note that if you do enable it, we DO NOT collect any direct customer information such as address, phone number, credit card number etc, we only collect usage stats for your dashboard    |  


### Hook up your player to simu 

Get a reference to your player instace
~~~~
var  player = new  MyPlayer({});
....
initSimuStream(player);
~~~~


and hook it player events up to the simustream instance. The three methods the library needs access to are play, pause and duration.  

~~~~
simu.playVideo=function (){player.play()};
simu.pauseVideo=function(){player.pause()};
simu.getCurrentVideoTime=function(){return  player.getCurrentTime()};
~~~~

### Wire-up state changes

You will also need to inform simustream of when your player's state changes. 

Add your event listeners
 ~~~~
 player.on(player.PLAYER_PLAY, onPlayerStateChange);
player.on(player.PLAYER_PAUSE, onPlayerStateChange);
 ~~~~
and handle the state changes

 ~~~~
 function  onPlayerStateChange(event)
{	
		if (ruLivePlayer.isPlaying())
		{
			simu.playStream();
		}
		else
		{
			simu.pauseStream();
		}
}
 ~~~~

### Add the html 

Add this to your html. This is the div that the SimuStream code will be injected into 

 ~~~~
<div  id="productDisplayContainer"></div>
 ~~~~

That's it, you're done. Sip your tea and rejoice :)

### Demo code

You download example code that demonstrates RuLive integration from here
https://drive.google.com/drive/folders/1msS9O2OxiK_mQL1kwjmkOamZeS1bpI3b?usp=sharing
