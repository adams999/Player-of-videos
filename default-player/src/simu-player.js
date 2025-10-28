var ytPlayer
var simu;
var streamDetails;
var settings;
var apiBasePath = "";
var streamId = "";
var iFrameId = "player-iframe";
var loadedLibraryPath;
let globalCartItems = [];
let time_update_interval;




var init = async function () {
    var patparamsString1 = window.location.search // (or whatever)
    var searchParams1 = patparamsString1.split('/');
    //var searchParams1 = new URLSearchParams(patparamsString1);
    //console.log("searchParams1",patparamsString1);
    streamId = searchParams1[1]
    apiBasePath = settings.basePath;
    loadedLibraryPath = settings.libraryPath;
    var fetchStreamPath = apiBasePath + "/api/v1/web/streams/get-single-stream/";

    let resp = await fetch(fetchStreamPath + streamId)
    let respJson = await resp.json()
    streamDetails = respJson.body.stream;
    initSimuStream();
    setupYouTubeIFrame();
    setMetaTags(streamDetails);

}
function setMetaTags(streamDetails) {
    var link = document.createElement('meta');
    link.setAttribute('property', 'og:title');
    link.content = streamDetails.name
    document.getElementsByTagName('head')[0].appendChild(link);

    var link = document.createElement('meta');
    link.setAttribute('property', 'og:description');
    link.content = streamDetails.description
    document.getElementsByTagName('head')[0].appendChild(link);

    var link = document.createElement('meta');
    link.setAttribute('property', 'og:image');
    link.content = streamDetails.thumbnail
    document.getElementsByTagName('head')[0].appendChild(link);

    var link = document.createElement('meta');
    link.setAttribute('property', 'og:url');
    link.content = "https://play.simustream.com?id=" + streamDetails._id
    document.getElementsByTagName('head')[0].appendChild(link);
}

function setupYouTubeIFrame() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var videoPath = streamDetails.video.videoUrl;
    jQuery("#" + iFrameId).attr('src', 'https://www.youtube.com/embed/' + videoPath + '?playsinline=1&enablejsapi=1&autoplay=0')
}

function onYouTubePlayerAPIReady() {
    ytPlayer = new YT.Player(iFrameId, {
        playerVars: {
            playsinline: 1
        },
        events: {
            autoplay: 1,
            'onStateChange': onPlayerStateChange
        }
    });

    simu.playVideo = function () { ytPlayer.playVideo() };
    simu.pauseVideo = function () { ytPlayer.pauseVideo() };
    simu.getCurrentVideoTime = function () { return ytPlayer.getCurrentTime() };
}


function initSimuStream() {
    simu = new SimuStream({
        libraryPath: loadedLibraryPath,
        "streamData": streamDetails,
        "onSimuWrapperReady": function () { console.log("MY WRAPPER IS READY NOW"); },
        "countriesListFetchPath": apiBasePath + "/api/v1/web/players/countries",
        "statesListFetchPath": apiBasePath + "/api/v1/web/players/states/",
        "citiesListFetchPath": apiBasePath + "/api/v1/web/players/cities/",
        "disableAnalytics": false
    });

}

function onPlayerStateChange(event) {
   let playerWrapper = $("#player-wrapper");
    if (event.data == YT.PlayerState.PLAYING) {
        if (document.getElementById('fallback_view')) {
            $("#fallback_view").remove();
        }
        simu.playStream();
    }

    if (event.data == YT.PlayerState.PAUSED) {
        simu.pauseStream();
    }

    if (!event.data) {
        clearInterval(time_update_interval);
        playerWrapper.append(finalView);
        // $('body').prepend(finalView);
    }
}

$.getJSON("./config/player-settings.json", data => {
    settings = {
        "libraryPath": data.libraryPath,
        "basePath": data.basePath
    };
    init();
});
