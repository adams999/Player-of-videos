var ruLivePlayer; 
var simu;
var streamDetails;

var apiBasePath="https://api-stage.simustream.com";
var fetchStreamPath=apiBasePath+"/api/v1/web/streams/get-single-stream/";
var streamId="5d39a49cdae53618968f8025";


async function initSimuStream(player) {

    ruLivePlayer=player;
    ruLivePlayer.on(Clappr.Events.PLAYER_PLAY, onPlayerStateChange);
    ruLivePlayer.on(Clappr.Events.PLAYER_PAUSE, onPlayerStateChange);


    let resp = await fetch(fetchStreamPath + streamId)
    let respJson = await resp.json()
    streamDetails = respJson.body.stream;
    console.log(">>>>SOJ:",streamDetails);
    configureSimuStream();

}


function configureSimuStream()
{ 
    console.log("PASSING IN",streamDetails)
    simu=new SimuStream({
    libraryPath:"../lib/dist",
    "streamData":streamDetails,
    "onSimuWrapperReady":function(){console.log("MY WRAPPER IS READY NOW");},
    "countriesListFetchPath":apiBasePath+"/api/v1/web/players/countries",
    "statesListFetchPath":apiBasePath+"/api/v1/web/players/states/",
    "citiesListFetchPath":apiBasePath+"/api/v1/web/players/cities/",
    "disableAnalytics":false
    });

    simu.playVideo=function (){ruLivePlayer.play()};
    simu.pauseVideo=function(){ruLivePlayer.pause()};
    simu.getCurrentVideoTime=function(){return ruLivePlayer.getCurrentTime()};

}

function onPlayerStateChange(event) 
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

