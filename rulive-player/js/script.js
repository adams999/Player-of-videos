var cdn_path = '//cdn.ryou.live/handheld/';
localStorage['channel_page'] = 1;
localStorage['disable_channel_loading'] = 1;

var players = {};


var openAppStorePlayStore = function(button){

    var universalLink = "https://dynamic.ryou.live/SZMN";
    var androidLink = 'https://play.google.com/store/apps/details?id=com.ryoulive.app';
    var iosLink = 'https://itunes.apple.com/us/app/ryoulive/id984492366?mt=8';

    if(button == 'android'){
        return window.location.replace(androidLink);
    }

    if(button == 'ios'){
        return window.location.replace(iosLink);
    }
    
}

var stopPlayer = function(id){
    var p = players[id];
    if(p){ 
        if (!p.player.paused()) {
            p.player.pause();
        }
    }
}

var showPlayerControllers = function(){


    var id = $(this).data('id');
    
    if(id){
        
        //$('.back-btn-'+id).removeClass('hidden');
        $('.valume-'+id).removeClass('hidden');

        setTimeout(function(){
            //$('.back-btn-'+id).addClass('hidden');
            $('.valume-'+id).addClass('hidden');
        },4000);
    }
};
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

if(!isIOS){
    $(document).on('click', '.image-overlay-text',showPlayerControllers);    
}

$(document).on('click', '.video-js',showPlayerControllers);

var togglePlayerSound = function(id){
    var el = $('.valume-'+id);
    el.removeClass('unmute');
    el.removeClass('mute');
    var p = players[id];
    if(p){
        if(p.player.muted()){
            el.addClass('unmute');
            p.player.muted(false);
        }else{
            el.addClass('mute');
            p.player.muted(true);
        }
    }
}

var playerEventBackgroundImage = function(id){

    if($('#event-player-'+id).length > 0){
        $('.event-backgroundImage-'+id).addClass('hidden');
    
        $('#image-overlay-text-'+id).css(
            'background',
            'linear-gradient(to right, rgba(0,0,0,0.80) 43%,rgba(0,0,0,0.80) 38%,rgba(0,0,0,0) 100%)'
        );

        //$('.valume-'+id).removeClass('hidden');

        const el_id = '#event-player-'+id;

        $(el_id).removeClass('hidden');

       

        var p = players[id];
        if(!p){
            
            var options = {};
            
            if(isIOS){
                options.controls = true;
            }

            var player = videojs('event-player-'+id,isIOS);
            
            player.on('play',function() {
                if (isIOS) {
                    
                    $('#event-player-'+id+'_html5_api').attr('controls',true);

                    if(player.muted()){
                        togglePlayerSound(id);
                    }
                }
            });
            

            player.play();

            players[id] = {
                player:player,
                sound:true
            };
        }
    }

    //$('.back-btn-'+id).addClass('hidden');
    $('.valume-'+id).addClass('hidden');

};



var boradcastTimer = function(brdcastID,startDate,isEvent = false){
    var now = new Date();
    var date = new Date(startDate);

    var liveNowHtml = '<p class="popup-live-text"><span></span> Live Now on App</p>';

    if(now < date){
        $('.counter-view-'+brdcastID).removeClass('my_hidden');
        $('.live-div-'+brdcastID).addClass('my_hidden');

        var setCounter = function(){
            
            var diffMs = (date - new Date()); // milliseconds between now & Christmas

            const time = diffMs/1000;

            if((time <= 0)){
                if(isEvent){
                    $('.counter-img-'+brdcastID).addClass('hidden');
                    $('.counter-'+brdcastID).html(liveNowHtml);
                    return 0;
                }else{
                    $('.counter-view-'+brdcastID).addClass('my_hidden');
                    $('.live-div-'+brdcastID).removeClass('my_hidden');
                    return 0;
                }
            }
            

            var days = Math.floor(time / 86400) < 10 ? ("00" + Math.floor(time / 86400)).slice(-2) : Math.floor(time / 86400);
            var hours = Math.floor(time / 3600);
            hours = (hours % 24) < 10 ? ("00" + Math.floor(hours % 24)).slice(-2) : Math.floor(hours % 24);

            var minutes = ("00" + Math.floor((time % 3600) / 60)).slice(-2);
            var seconds = ("00" + (time % 3600) % 60).slice(-2);
            
            var seconds = Math.round(((diffMs/1000) % 3600) % 60);
            seconds = (seconds<10)?"0"+seconds:seconds;
            seconds = (seconds != 60)?seconds:"00";

            if(days < 10 && days != "00"){
                days = (""+days).substr(1,2);
            }

            if(isEvent){
                days = (days=="00")?"":days+' <sub>d</sub> : ';
            }

            if(isEvent){
                hours = (hours=="00")?"":hours+' <sub>hr</sub> : ';
            }

            if(isEvent){
                minutes = (minutes=="00")?"":minutes+' <sub>min</sub> : ';
            }
            
            
            var timeString = days+":"+hours+":"+minutes+":"+seconds;

            if(isEvent){
                
                timeString = days+hours+minutes+seconds+' <sub>sec</sub>';
            }

            $('.counter-'+brdcastID).html(timeString);

            setTimeout(setCounter, 1000);
        };

        setCounter();
    }else{
        if(isEvent){
            $('.counter-img-'+brdcastID).addClass('hidden');
            $('.counter-'+brdcastID).html(liveNowHtml);
        }else{
            $('.counter-view-'+brdcastID).addClass('my_hidden');
            $('.live-div-'+brdcastID).removeClass('my_hidden');
        }
    }
}

$(function() {
    $('#channel_content ul').on('touchmove', onScrollMbl);
    
    $(document).on('click', '.close-popup', function(e) {
        e.preventDefault();
        $('.md-modal').removeClass('md-show');
    });

    $(document).on('click', '.close', function(e) {
        e.preventDefault();
        $('.modal').removeClass('show');
    });

    initialize_sliders();

    // $(".mutual_slider").owlCarousel({
    //     items:4,
    //     itemsDesktop:[1199,2],
    //     itemsDesktopSmall:[980,2],
    //     itemsMobile:[600,1],
    //     pagination:false,
    //     navigation:true,
    //     navigationText:["",""],
    //     autoPlay:false,
    //     lazyLoad: true
    // });

    // $(".trailer_slider").owlCarousel({
    //     items:4,
    //     itemsDesktop:[1199,2],
    //     itemsDesktopSmall:[980,2],
    //     itemsMobile:[600,1],
    //     pagination:false,
    //     navigation:true,
    //     navigationText:["",""],
    //     autoPlay:false,
    //     lazyLoad: true
    // });


    const pop_urlParams = new URLSearchParams(window.location.search);
    const pop_c_id = pop_urlParams.get('channel');
    const pop_e_id = pop_urlParams.get('event');
    const pop_page = pop_urlParams.get('page');

    if((!pop_c_id) && (!pop_e_id)){
        if(pop_page == 'help'){
            $('#modal-help-pop').addClass('md-show');
        }else{
            //$('#event-main-pop').addClass('md-show');
        }
    }


    $(document).on('click', '.channel_icon', function(e) {
        localStorage.setItem('current-item', $(this).attr('data-id'));
        $('div#modal-12').addClass('md-show');
        //getChannelInfo();
    });

    if (window.location.hash == '#login_error') {
        $('.login-error').slideDown();
        setTimeout(function() {
            $('.login-error').slideUp();
            $('.close-cookie-div').click();
        }, 1000 * 30);
    }

    $('.fix-date').each(function(i, v) {
        var date = $(v).text();
        var d = new Date(date);
        $(v).text(d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes());
    });

    var is_embedded = false;
    if (window.location.hash == '#embedded')
        is_embedded = true;

    if (is_embedded) {
        $('.logo a').attr('href', '#');
        $('.profile-login').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    $('.change-channel-url').click(function(e) {
        var id = $(this).data('attribute');
        window.history.pushState('', '', '/?channel=' + id);
    });

    

    $('.change-event-url').click(function(e) {
        var id = $(this).data('attribute'); 
        var p = players[id];

        if(p){
            p.player.play();
        }else{
            playerEventBackgroundImage(id);
        }

        window.history.pushState('', '', '/event/' + id);
    });

    $('.md-close.close-popup').click(function(e) {
        window.history.pushState('', '', '/');
    });

    // $('#click-to-copy').click(function(e) {
    // 	e.preventDefault();

    // 	var $temp = $("<input>");
    //     $("#model-----").append($temp);
    //     $temp.val($('#video-link').text()).select();
    //     document.execCommand("copy");
    //     $temp.remove();
    // });

    if ($('#click-to-copy').length) {
        var copyEmailBtn = document.querySelector('#click-to-copy');
        copyEmailBtn.addEventListener('click', function(event) {
            event.preventDefault();
            // Select the email link anchor text  
            var emailLink = document.querySelector('#video-link');
            var range = document.createRange();
            range.selectNode(emailLink);
            window.getSelection().addRange(range);

            try {
                // Now that we've selected the anchor text, execute the copy command  
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copy email command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }

            // Remove the selections - NOTE: Should use
            // removeRange(range) when it is supported  
            window.getSelection().removeAllRanges();
        });
    }

    $('#generate-csv').click(function(e) {
        e.preventDefault();

        if (is_embedded) {
            $('.header-info > .info').html('To Export Data, you must view visit <a href="https://www.ryoulive.com/manage-privacy">https://www.ryoulive.com/manage-privacy</a> from a browser. Thank You!');
            $('.header-info').slideDown();
            return;
        }

        var my_data = JSON.parse(user_data);
        console.log(my_data);
        var pur = my_data.purchased;
        var part = my_data.participated;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += 'Your Data on RYOULIVE\r\n'
        csvContent += my_data.name + '\r\n'
        csvContent += my_data.email + '\r\n\r\n'
        if (my_data.purchased !== undefined && my_data.purchased != "") {
            csvContent += 'Purchased Items\r\n\r\n';
            csvContent += 'Name,Date,Price\r\n';
            for (let row of pur) {
                var date = row.date;
                var d = new Date(date);
                csvContent += row.name + ',' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ',' + row.currency + row.price + '\r\n';
            }
        }

        if (my_data.participated !== undefined && my_data.participated != "") {
            csvContent += '\r\nParticipation\r\n\r\n';
            csvContent += 'Name,Date,Price\r\n';
            for (let row of part) {
                var date = row.date;
                var d = new Date(date);
                csvContent += row.name + ',' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ',' + row.type + '\r\n';
            }
        }

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("style", "display:none;");
        link.setAttribute("download", "My-Data.csv");
        link.innerHTML = "Click Here to download";
        document.body.appendChild(link);

        link.click();
    });

    $('.delete-account-btn').click(function(e) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });

    $('#confirmation-text').keyup(function(e) {
        if($(this).val().toUpperCase() == 'DELETE') {
            $('#delete-identity').attr('disabled', false);
        } else {
            $('#delete-identity').attr('disabled', true);
        }
    });

    $('#delete-identity').click(function(e) {
        e.preventDefault();
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        $('.mp-text-danger').fadeOut();
        var btn = this;
        $(btn).attr('disabled', true);
        $(btn).text('Deleting...');
        var confirmation_text = encodeURIComponent($('#confirmation-text').val());
        if(confirmation_text.toUpperCase() != "DELETE") {
            $('.mp-text-danger').fadeIn();
            $(btn).attr('disabled', false);
            $(btn).text('Delete');
        } else {
            $.post('/manage-privacy', 'confirmation_text=' + confirmation_text, function(res) {
                if (res == '2') {
                    $('.mp-text-danger').fadeIn();
                } else if (res) {
                    $('.mp-text-danger').removeClass('text-danger');
                    $('.mp-text-danger').addClass('text-success');
                    $('.mp-text-danger').text('You data has been deleted from RYOULIVE.');
                    $('.mp-text-danger').fadeIn();
                    window.location.href = '/';
                } else {
                    alert('Unexpected error occured while deleting your data please try again later.');
                }
                $(btn).attr('disabled', false);
                $(btn).text('Delete');
            });
        }
    });

    $('.cancel-btn').click(function(e) {
        $(this).parent().slideUp();
        $('.close-cookie-div').click();
    });

    if (localStorage['cookies-div'] === undefined) {
        $('.cookies-div').fadeIn(0);
        $(".active-heading").addClass("btm");
        $(".profile-login").addClass("top-no");
        $(".logo").css("padding-top", "75px");
    }

    $('#cookies-link').click(function(e) {
        e.preventDefault();
        $('.cookies-policy-div').slideDown();
        $(".active-heading").removeClass("btm");
        $(".profile-login").removeClass("top-no");

    });

    $("#cookies-link").click(function() {
        $(".cookies-policy-div").slideDown();
        $(".cookies-text").addClass("rel");
    });

    $('.close-cookie-div').click(function(e) {
        e.preventDefault();
        $('.cookies-div').slideUp();
        $(".logo").css("padding-top", "30px");
        $(".profile-login").removeClass("top-no");
        localStorage['cookies-div'] = false;
        var w = $(document).width();
        if (w >= 992) {
            var wh = $(window).height();

            var hdr = $("header").height();
            var footer = $("footer").height();
            var h = wh - (hdr + footer + 0);
            setTimeout(function() {
                $(".main-he").css({
                    'height': h + 70,
                    'overflow': "hidden",
                    'margin-bottom': '20px'

                });

                if ($('#home_view').length && $(document).width() > 767) {
                    var height = $(window).height() - ($('header').height() + $('footer').height() + 90);
                    $('.change-scroll').css('height', height + 'px');
                }
            }, 300);
        }
    });

    var ws = $(document).width();
        if (ws <= 767) {
            $('.news-slider2').removeClass('owl-carousel owl-theme');
        }

    $('body').on('click', '.toggle-manu', function() {
        $(".dropdown-content").show().animate({
            right: "0px",
        }, 500);
        $('.opacity-overlay').css('display', 'block');
        $('body').css('overflow', 'hidden');
    });

    $(".cross-btn").click(function() {
        $(".dropdown-content").animate({
            right: "-350px",
        }, 500);
        $('.opacity-overlay').css('display', 'none');
        $('body').css('overflow', 'auto');
    });

    /*$('.md-trigger').click(function() {
    	//$('#modal-heading').text($(this).find('.video-heding').text());
    	//$('#modal-bg-image').attr('src', $(this).find('.bg-image').attr('src'));
    });*/

    var w = $(document).width();
    if (w <= 991) {
        $('.con-wrap1').addClass("swiper-container");
        $('.con-wrap2').addClass("swiper-wrapper");
        $('.con-wrap3').addClass("swiper-slide");
        $(".dropbtn").addClass("toggle-manu");
        $(".dropdown-content").addClass("change-scroll");
        $(".videos-div ul").removeClass("change-scroll");

        var swiper = new Swiper('.swiper-container', {
            autoHeight: true,
            onSlideChangeEnd: function(swiper) {
                $('.main-he').removeAttr("style");
                $('#bottom-menu li').removeClass('active');
                $('#bottom-menu li:eq(' + swiper.activeIndex + ')').addClass('active');
                /*var h = $(document).find('div.swiper-slide-active').height();
                var wh = $(window).height();*/
                var slide_height = $('.swiper-slide:eq(' + swiper.activeIndex + ')').find('.slide-pos').height();
                if (swiper.activeIndex === 2)
                    $('.swiper-slide-active').parent().css('height', (slide_height + 150) + 'px');
                else
                    $('.swiper-slide-active').parent().css('height', (slide_height + 60) + 'px');
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });

        var index = 0;
        var height = $('.con-wrap3:eq(' + index + ') > div').height() + 105;
        var style = 'height: ' + height + 'px !important';
        $('.swiper-wrapper').attr('style', style);
        $('#bottom-menu li').click(function() {
            var index = $(this).index();
            swiper.slideTo(index);

            /*var height = $('.con-wrap3:eq('+index+') > div').height() + 105;
            var style = $('.swiper-wrapper').attr('style');
            style = 'height: '+height+'px !important;'+style;
            $('.swiper-wrapper').css('height', height+'px');*/
        });

        if (window.location.hash == '#live') {
            $('#bottom-menu li:eq(1)').click();
        } else if (window.location.hash == '#vod') {
            $('#bottom-menu li:eq(2)').click();
        }

    } else {
        $('.con-wrap1').removeClass("swiper-container");
        $('.con-wrap2').removeClass("swiper-wrapper");
        $('.con-wrap3').removeClass("swiper-slide");
        $(".dropbtn").removeClass("toggle-manu");
        $(".dropdown-content").removeClass("change-scroll");
        $(".videos-div ul").addClass("change-scroll");
    }

    if ($('#view').length) {

        $('#check_video_available').click(function(e) {
            e.preventDefault();
            $(this).text('Getting Stream');
            $.ajax({
                url: '/view/is_available/' + $(this).data('id') + '/' + $(this).data('type'),
                type: 'POST',
                dataType: 'text',
                success: function(res) {
                    if (res == 'ok') {
                        window.location.href = '/view/' + $('#check_video_available').data('id');
                        $('#check_video_available').text('Redirecting...');
                    } else {
                        alert('Streaming is not available yet.');
                        $('#check_video_available').text('Stream Not Available');
                    }
                }
            });
        });

        var url = window.location.href.split('/');
        var id = url.pop();
        var type = url.pop();
        if (date && new Date() < date) {
            /*if($('#video_price').text() == 'Free' || $('#video_price').text() == 'Purchased') {
            	$('.play_btn').fadeOut(0);
            	$('#counter_btn').removeClass('my_hidden');
            	$('.back-arrow-link').attr('href', '/#live');
            	run_video_timer(date);
            }*/
            $('.play_btn').fadeOut(0);
            $('#counter_btn').removeClass('my_hidden');
            $('.back-arrow-link').attr('href', '/#live');
            run_video_timer(date);
        } else {
            $('.vr_play_icon').removeClass('vr_play_icon');
        }

        /*$.post('/view/get-talents/'+type+'s/'+id, function(res) {
        	res = JSON.parse(res);
        	if(res.length === 0)
        		return;
        	res = res._collection.resources;
        	localStorage.setItem("talent_data", JSON.stringify(res));
        	var result = '';
        	if (res) {
        		$.each(res, function(i, data) {
        			$('.singer-slider').css('border-bottom', '1px solid #0a80a0');
        			if (data._links.profile_picture)
        				image = data._links.profile_picture.href;
        			else
        				image = "//cdn.ryou.live/wl-assets/images/talent-img.png";
        			result += `<li>
        			<div class="singer-img">
        				<img src="${image}" data-index="${i}" alt="${data.name}" />
        				<div class="image-overlay hidden">
        					<span class="image-overlay-close"><i class="fa fa-close"></i></span>
        				</div>
        			</div>
        			<div class="slider-text">
        				<h4>${data.name}</h4>
        				<p>${data.type ? data.type : " "}</p>
        			</div>
        		</li>`;
        		})
        	}
        	$('#flexiselDemo2').append(result);

        	var length = $('#flexiselDemo2').children().length;
        	// var arrows

        	var is_infinite = false;
        	if($(window).width() < 767) {
        		is_infinite = true;
        	} else {
        		if(length > 4) {
        			setTimeout(function(){
        				$('.nbs-flexisel-nav-left').show();
        				$('.nbs-flexisel-nav-right').show();
        			},1000)
        			
        			is_infinite = true;
        		}
        	}



        	$("#flexiselDemo2").flexisel({
        		visibleItems: 4,
        		itemsToScroll: 1,
        		animationSpeed: 200,
        		infinite: is_infinite,
        		controlNav:false,
        		autoPlay: {
        			enable: false,
        			interval: 5000,
        			pauseOnHover: true
        		},
        		responsiveBreakpoints: { 
        			portrait: { 
        				changePoint:480,
        				visibleItems: 1,
        				itemsToScroll: 1
        			}, 
        			landscape: { 
        				changePoint:640,
        				visibleItems: 2,
        				itemsToScroll: 2
        			},
        			tablet: { 
        				changePoint:768,
        				visibleItems: 3,
        				itemsToScroll: 3
        			}
        		}
        	});
        });*/

        $('body').on('click', '.image-overlay-close', function(e) {
            e.preventDefault();
            $('#talent').hide().slideUp();
            $(this).parent().addClass('hidden');
            $('#description').show();
        });

        // $(document).on('click', '.singer-img img', function(e) {
        //        e.preventDefault();
        //        $(this).parents().eq(2).find('div.image-overlay').addClass('hidden');
        //        var index = $(this).data('index');
        //        var data = localStorage.getItem('talent_data');
        //        var d = JSON.parse(data)[index];

        //        $('.talent_name').text(d.name);
        //        $('.talent_type').text(d.type);
        //        addEllipsis('talent_name');
        //        $('.talent_description').text(d.description);
        //        if (d._links.profile_picture) {
        //            $('.talent-img').find('img').attr('src', d._links.profile_picture.href);
        //        } else {
        //            $('.talent-img').find('img').attr('src', '//cdn.ryou.live/wl-assets/images/talent.svg');
        //        }
        //        $(this).parents().eq(1).find('div.image-overlay').removeClass('hidden');
        //        $('#talent').show().slideDown();
        //        $('#description').hide();
        //        $('.instagram-tag').html('');
        //        $('.facebook-feeds').html('');
        //        $('.twitter-tweets').html('');

        //        $('.instagram').addClass('hidden');
        //        $('.facebook').addClass('hidden');
        //        $('.twitter').addClass('hidden');

        //        if(d._links.twitter_account !== undefined && d._links.twitter_account.href != "") {
        //            $.ajax({
        //                method: 'POST',
        //                dataType: 'text',
        //                data: "user_name="+d._links.twitter_account.href,
        //                url: '/social/twitter',
        //                success:function(resp) {
        //                	if(resp != '0') {
        //                		$('.twitter').removeClass('hidden');
        //                		$('.twitter-tweets').html(resp);
        //                	}
        //                },
        //                error:function(err, resp) {
        //                    console.log(err);
        //                    console.log(resp);
        //                }
        //            });
        //        }

        //        if(d._links.instagram_account !== undefined && d._links.instagram_account.href != "") {
        //            $.ajax({
        //                method:"GET",
        //                url:d._links.instagram_account.href+'?__a=1',
        //                success:function(resp) {
        //                    if(resp) {
        //                        if(resp.user.media.nodes[0].thumbnail_resources[1]) {
        //                            var image = `<a target="_blank" href="https://www.instagram.com/p/${resp.user.media.nodes[0].code}"><img src="${resp.user.media.nodes[0].thumbnail_resources[1].src}" alt="${resp.user.media.nodes[0].caption}"/></a>` ;
        //                            $('.instagram-tag').html(image);
        //                            $('.instagram').removeClass('hidden');
        //                        } else {
        //                            $('.instagram').addClass('hidden');
        //                        }
        //                    }
        //                }
        //            });
        //            $('.instagram').removeClass('hidden');
        //        }

        //        if(d._links.facebook_account !== undefined && d._links.facebook_account.href != "") {
        //            var url = d._links.facebook_account.href.split('/');
        //            $.ajax({
        //                method: "POST",
        //                url: '/social/facebook',
        //                data: 'user_name='+url[3],
        //                dataType: 'text',
        //                success:function(resp) {
        //                    if(resp) {
        //                        if(resp != '0') {
        //                            $('.facebook-feeds').html(resp);
        //                            $('.facebook').removeClass('hidden');
        //                        } else {
        //                            $('.facebook').addClass('hidden');
        //                        }
        //                    }
        //                }
        //            });
        //        }
        //    });
    }

    load_images();
    var current_url = window.location.href;
    if (current_url.includes('/view')) {
        var content_id = getIdFromUrl(current_url);
        getAssociatedChannels(content_id, getTypeFromUrl(current_url));
    }

    $(document).on('click', '.channel-overlay', function(e) {
        e.preventDefault();
        localStorage.setItem('current-item', $(this).data('attribute'));
        $('#' + $(this).data('modal')).find('a.nav-link.videos_tab').trigger('click');
        //getSingleChannelVideos($(this).attr('data-attribute'), false);
        $('#' + $(this).data('modal')).addClass('md-show');
        window.history.pushState('', '', '/?channel=' + $(this).data('attribute'));
        $('.social').removeClass('active');
        $('.social').removeClass('in');
    });

    $(document).on('click', 'a.nav-link', function(e) {
        e.preventDefault();
        var current = $(this).attr('href');
        if (current.includes('videos')) {
            $('.videos_cont').tab('show');
            if ($('div' + current).find('div.news-slider2').hasClass('content-loading')) {
                getChannelVideos(current);
            }

        }

        if (current.includes('trailers')) {
            if ($('div' + current).find('div.trailer_slider').hasClass('content-loading')) {
                getChannelTrailers(current);
            }

        }

        if (current.includes('social')) {
            if ($('div' + current).find('div.social_slider').hasClass('content-loading')) {
                getSocialContent(current);
            }
        }
    });

    var hash = window.location.hash;
    
    const urlParams = new URLSearchParams(window.location.search);
    const c_id = urlParams.get('channel');
    const e_id = urlParams.get('event');
    var path = window.location.pathname;

    if(path.includes('/event/')){
        var event_id = path.replace('/event/','');
        playerEventBackgroundImage(event_id);
    }

    if(e_id){
        var modal = $('.event-overlay[data-attribute="' + e_id + '"]').data('modal');
        localStorage.setItem('current-item', e_id);
        $('div#' + modal).addClass('md-show');
        playerEventBackgroundImage(e_id);
    }

    if (c_id) {
        var id = c_id;
        if ($('div#' + modal).length) {
            var modal = $('.channel-overlay[data-attribute="' + id + '"]').data('modal');
            localStorage.setItem('current-item', id);
            $('div#' + modal).addClass('md-show');
            getChannelVideos('#' + $('div#' + modal).find('.videos_cont').attr('id'));
        } else {
            $('.my-loader-div').fadeIn();
            $.post('/channel/' + id, function(res) {
                
                if((typeof res) == "string"){
                    res = JSON.parse(res);
                }
                
                res = res.channel;
                var i = new Date().getTime();
                $('#channel_content ul').append('<div class="hidden">' + render_channel_thumbnails(i, res) + '</div>');
                $('#channel_popups').append(render_popup_content(i, res));

                var modal = $('.channel-overlay[data-attribute="' + id + '"]').data('modal');
                localStorage.setItem('current-item', id);
                $('div#' + modal).addClass('md-show');
                getChannelVideos('#' + $('div#' + modal).find('.videos_cont').attr('id'));

                initialize_sliders();
                $('.my-loader-div').fadeOut();
            });
        }
    }
});

function getSocialContent(element) {
    $('.facebook-feeds').html('<div class="chanel-inr-video"></div><div class="gray-div-load"></div>');
    $('.instagram-tag').html('<div class="chanel-inr-video"></div><div class="gray-div-load"></div>');
    $('.twitter-tweets').html('<div class="chanel-inr-video"></div><div class="gray-div-load"></div>');

    $('.facebook-feeds').parent().removeClass('hidden');
    $('.instagram-tag').parent().removeClass('hidden');
    $('.twitter-tweets').parent().removeClass('hidden');

    var facebook_url = $('div' + element).find('a.facebook_account').attr('href');
    var instagram_url = $('div' + element).find('a.instagram_account').attr('href');
    var twitter_url = $('div' + element).find('a.twitter_account').attr('href');
    

    if (facebook_url) {
        var facebook_id = getIdFromUrl(facebook_url);
        $.ajax({
            method: "POST",
            url: '/social/facebook',
            data: 'user_name=' + facebook_id,
            dataType: 'text',
            success: function(resp) {
                if (resp) {
                   
                    if (resp != '0') {
                        
                        $('.facebook-feeds').parent().removeClass('hidden');
                        
                        var html  = resp;
                        
                        if(isUserLogin == 'false' && (resp == 'OAuthException')){
                            html = `
                            <a class="btn btn-block btn-social btn-lg btn-facebook" style="max-width: max-content;" href="/login/facebook">
                                <span class="fa fa-facebook"></span> Sign in with Facebook
                            </a>
                            `;
                        }

                        if((isUserLogin == 'true' && resp.includes('Exception')) || (resp == 'GraphMethodException')){
                            $('.facebook-feeds').parent().addClass('hidden');
                        }

                        $('.facebook-feeds').html(html);
                    } else {
                        $('.facebook-feeds').parent().addClass('hidden');
                    }
                }
            },
            error: function(err, resp) {
                $('.facebook-feeds').parent().addClass('hidden');
            }
        });
    } else {
        $('.facebook-feeds').parent().addClass('hidden');
    }

    if (instagram_url) {
        if (instagram_url.indexOf('?') > 0)
            instagram_url = instagram_url.split('?')[0];

        $.ajax({
            method: "GET",
            url: instagram_url + '?__a=1',
            success: function(resp) {
                if (resp) {
                    if (resp.graphql.shortcode_media.display_url) {
                        var image = `<a target="_blank" href="https://www.instagram.com/p/${resp.graphql.shortcode_media.shortcode}"><img src="${resp.graphql.shortcode_media.display_url}" alt="${resp.graphql.shortcode_media.title}"/></a>`;
                        $('.instagram-tag').html(image);
                        $('.instagram-tag').parent().removeClass('hidden');
                    } else {
                        $('.instagram-tag').parent().addClass('hidden');
                    }
                }
            },
            error: function(err, resp) {
                $('.instagram-tag').parent().addClass('hidden');
                console.log("insta error");
            }
        });
    } else {
        $('.instagram-tag').parent().addClass('hidden');
    }

    if (twitter_url) {
        var twitter_id = getIdFromUrl(twitter_url);
        $.ajax({
            method: 'POST',
            dataType: 'text',
            data: "user_name=" + twitter_id,
            url: '/social/twitter',
            success: function(resp) {
                if (resp != '0') {
                    $('.twitter-tweets').parent().removeClass('hidden');
                    $('.twitter-tweets').html(resp);
                } else {
                    $('.twitter-tweets').parent().addClass('hidden');
                }
            },
            error: function(err, resp) {
                $('.twitter-tweets').parent().addClass('hidden');
            }
        });
    } else {
        $('.twitter-tweets').parent().addClass('hidden');
    }
}

/*function getChannelInfo()
{
	$('.nav-link').removeClass('active');
	$('.videos_tab').addClass('active');
//	$('.assoc_channel ul').html('');
	var id = localStorage.getItem('current-item');	
	//$('.nav-tabs a[href="#home4"]').tab('show');
	if(id) {
		getSingleChannelVideos(id, false);
		$.post('/channel/'+id, function(res) {
			res = JSON.parse(res);
			if(res.length === 0)
				return;
			res = res.channel;
			$('.channel-title').text(res.name);
			$('.channel-description').text(res.description);
			$('.channel_preview').attr('src', res._links.preview_image.href);
			$('.channel_preview').attr('alt', res.name);
			var assoc_chanel = "";
			if(res.associated_channels) {
				$.each(res.associated_channels, function(i, data) {
					var mu_id = getIdFromUrl(data._links.self.href);
					assoc_chanel += `<li>
									<a href="#" class="justin-data" data-id = "${mu_id}">
										<div class="talent-div-inr">
											<div class="talent-img-round">
												<img src="${data._links.channel_icon.href}" alt="${data.name}">
											</div>
											<div class="talent-text-div">
												<h5>${data.name}</h5>
											</div>
										</div>
									</a>
								</li>`;
				});

				if(window.location.href.includes('view')) {
					if(res.facebook_account) {
						$('.facebook_account').attr('href', res.facebook_account);
					}

					if(res.twitter_account) {
						$('.twitter_account').attr('href', res.twitter_account);
					}

					if(res.instagram_account) {
						$('.instagram_account').attr('href', res.instagram_account);
					}
				}
			}

			$('.assoc_channel ul').html(assoc_chanel);
			$('.loader-div').fadeOut();
		});
	}	
}*/

function getAssociatedChannels(id, type) {
    if (id) {
        $.post('/channel/getAssociatedChannels/' + type + '/' + id, function(res) {
            if((typeof res) == "string"){
                res = JSON.parse(res);
            }
            if (res.associatedChannels) {
                var channels = ``;
                getSingleChannelVideos(res.associatedChannels[0]._links.videos.href);
                $.each(res.associatedChannels, function(i, data) {
                    var id = getIdFromUrl(data._links.self.href);
                    $('.singer-slider').css('border-bottom', '1px solid #0a80a0');
                    channels += `<li data-id="${id}" class="channel_icon">
									   <a href="/?channel=${id}">
										<div class="singer-img">
											<img src="${data._links.channel_icon.href}"  alt="${data.name}" />
											<div class="image-overlay hidden">
												<span class="image-overlay-close"><i class="fa fa-close"></i></span>
											</div>
										</div>
										<div class="slider-text">
											<h4>${data.name}</h4>
										</div>
									   </a>
								   </li>`;

                });

                $('#flexiselDemo2').html(channels);
                var length = $('#flexiselDemo2').children().length;
                // var arrows

                var is_infinite = false;
                if ($(window).width() < 767) {
                    is_infinite = true;
                } else {
                    if (length > 4) {
                        setTimeout(function() {
                            $('.nbs-flexisel-nav-left').show();
                            $('.nbs-flexisel-nav-right').show();
                        }, 1000)

                        is_infinite = true;
                    }
                }



                $("#flexiselDemo2").flexisel();
            } else {
                //alert("No associated channel not found.")
            }
        });
    }
}

function getChannelTrailers(element) {
    var id = localStorage.getItem('current-item');
    if (id) {
        var videos = "";
        $.post('/channel/channelTrailers/' + id, function(res) {
            if((typeof res) == "string"){
                res = JSON.parse(res);
            }
            if (res._collection.count > 0) {
                res = res._collection.resources;

                $.each(res, function(i, data) {
                    var video_url = getVideoUrl(data._links.self.href);
                    videos += `<div class="post-slide2">
									<a href="${video_url}">
										<div class="chanel-inr-video">
											<img src="${data._links.preview_image_small.href}" alt="${data.name}" />
										</div>
										<div class="channel-video-text">
											<p>${data.name}</p>
										</div>
									</a>    
								</div>`;
                });

                $('div' + element).find('div.trailer_slider').trigger('replace.owl.carousel', videos).trigger('refresh.owl.carousel');
                $('div' + element).find('div.trailer_slider').removeClass('content-loading').addClass('content-loaded');
                $('.loader-div').fadeOut();
            }
        });
    }
}

function getSingleChannelVideos(id, split = true) {
    if (split)
        id = id.split('/')[6];
    $('.btns-buy').html(``);
    $.post('/channel/channelVideos/' + id, function(res) {
        if((typeof res) == "string"){
            res = JSON.parse(res);
        }
        if ($('.btns-buy').length) {
            if (res._collection.resources.length) {
                var play_url = '/view/broadcast/' + res._collection.resources[0].id;
                if (res._collection.resources[0].type)
                    play_url = '/view/vod/' + res._collection.resources[0].id;
                $('.btns-buy').html(`<a class="btn" href="${play_url}">Play</a>`);
            }
        }

        videos = '';
        if (res._collection.count > 0) {
            res = res._collection.resources;

            $.each(res, function(i, data) {
                var type = 'broadcast';
                if (data.type === 1) {
                    type = 'vod';
                }

                var current_playing_video = '';
                if (window.location.href.split('/')[5] == data.id) {
                    current_playing_video = 'currently_playing';
                }

                videos += `<li class="${current_playing_video}">
								<a href="/view/${type}/${data.id}">
									<div class="videos-inr">
										<p class="video-heding">${data.name}</p><img src="${data._links.preview_image_small.href}" alt="" />
									</div>
								</a>
							</li>`;
            });

            if (videos == '')
                videos = 'Channel does not have other videos.';

            $('#channel-videos').html(videos);
            $('div').find('div.news-slider2').trigger('replace.owl.carousel', videos).trigger('refresh.owl.carousel');
            $('div').find('div.news-slider2').removeClass('content-loading').addClass('content-loaded');
            $('.loader-div').fadeOut();
        }
    });
}

function getChannelVideos(element) {
    var id = localStorage.getItem('current-item');
    var currentPage = 1;
    if (id) {
        var videos = "";
        $.post('/channel/channelVideos/' + id + '?page'+currentPage, function(res) {
            if((typeof res) == "string"){
                res = JSON.parse(res);
            }
            if (res._collection.count > 0) {
                res = res._collection.resources;
                var first_vid_url = null;
                $.each(res, function(i, data) {
                    var video_url = getVideoUrl(data._links.self.href);
                    videos += `<div class="post-slide2">
									<a href="${video_url}">
										<div class="chanel-inr-video">
                                            <img src="${data._links.preview_image_small.href}" alt="${data.name}" />
                                            
                                            <div class="counter-div counter-div-sm counter-view-${data.id} my_hidden" style="text-align: left;    padding: 5px 25px 5px;">
                                                <img style="max-width: 13px;display: inline-block;" src="https://cdn.ryou.live/wl-assets/images/countdown_icon.svg" alt="" />
                                                <span class="counter-div-text counter-${data.id}" style="font-size: 12px;" >5D 13:51:07</span>
                                            </div>

										</div>
										<div class="channel-video-text">
											<p>${data.name}</p>
										</div>
									</a>    
                                </div>`;
                        
                        setTimeout(function() {
                            boradcastTimer(data.id,data.start_at);    
                        }, 2000);
                    if (first_vid_url === null) {
                        first_vid_url = video_url;
                    }
                });

                if (element !== '#undefined') {
                    if (first_vid_url !== null) {
                        if (element.match(/\d/g).length > 0)
                            $('body').find('.play-btn' + element.match(/\d/g).toString().replace(/,/g, '') + ' a').attr('href', first_vid_url);
                    } else {
                        $('.play-btn' + element.match(/\d/g)[0]).closest('.btns-buy').remove();
                    }
                }

                $('body div' + element).find('div.news-slider2').trigger('replace.owl.carousel', videos).trigger('refresh.owl.carousel');
                $('body div' + element).find('div.news-slider2').removeClass('content-loading').addClass('content-loaded');
                $('.loader-div').fadeOut();
            }
        });
    }
}

$('.cross-close').click(function(e) {
    e.preventDefault();
    $('.telents-show-overlay').fadeOut();
    $('.justin-data').find('div.talent-div-inr').removeClass('active');
    $('.remove-scroll').addClass('change-scroll change-scroll02');
});
$( document ).ready(function() {
    setTimeout(function() {
        var h = $('.upcoming-video-div').css('height');
        h = h.replace('px','');
        h = parseInt(h);
        $('.upcoming-video-div').css('height',(h-30) +'px');
    }, 1000);
 });
$(document).on('click', '.justin-data', function(e) {
    e.preventDefault();
    var loader = '<div class="chanel-load-effect"><div class="chanel-inr-video"></div><div class="gray-div-load"></div></div><div class="chanel-load-effect"><div class="chanel-inr-video"></div><div class="gray-div-load"></div></div><div class="chanel-load-effect"><div class="chanel-inr-video"></div><div class="gray-div-load"></div></div><div class="chanel-load-effect"><div class="chanel-inr-video pulse"></div><div class="gray-div-load pulse"></div></div>';
    $('.mutual_slider').trigger('replace.owl.carousel', loader).trigger('refresh.owl.carousel');
    $('.remove-scroll').removeClass('change-scroll change-scroll02');
    $('.channel_title').text('Loading...');

    var curr = $(this);
    $('.telents-show-overlay').css({ 'display': 'block', });
    var channel_id = localStorage.getItem('current-item');
    var id = getIdFromUrl($(curr).attr('data-id'));
    $('.justin-data').find('div.talent-div-inr').removeClass('active');
    $(curr).find('div.talent-div-inr').addClass('active');
    $('.mutual_heading').text($(this).parents().eq(5).find('div.image-overlay-text').find('h2').text() + ' + ' + $(curr).find('h5').text());
    if (id) {
        var videos = "";
        $.post(`/channel/channelMutualVideos/${channel_id}/${id}`, function(res) {
            if((typeof res) == "string"){
                res = JSON.parse(res);
            }
            if (res._collection.count > 0) {
                res = res._collection.resources;
                $('.channel_title').text('Go To ' + $(curr).find('h5').text() + ' Channel').attr('data-reference', id);
                $.each(res, function(i, data) {
                    
                    var video_url = getVideoUrl(data._links.self.href);
                    videos += `<div class="post-slide2">
									<a href="${video_url}">
										<div class="chanel-inr-video">
                                            <img src="${data._links.preview_image_small.href}" alt="${data.name}" />
                                            <div class="counter-div counter-div-sm my_hidden counter-view-${data.id}" style="text-align: left;    padding: 5px 25px 5px;">
                                                <img style="max-width: 13px;display: inline-block;" src="https://cdn.ryou.live/wl-assets/images/countdown_icon.svg" alt="" />
                                                <span class="counter-div-text counter-${data.id}" style="font-size: 12px;" >5D 13:51:07</span>
                                            </div>
										</div>
										<div class="channel-video-text">
											<p>${data.name}</p>
										</div>
									</a>    
                                </div>`;
                
                                setTimeout(function() {
                                    boradcastTimer(data.id,data.start_at);    
                                }, 2000);
                });
                $('.mutual_slider').trigger('replace.owl.carousel', videos).trigger('refresh.owl.carousel');
                $('.channel_title').attr('data-id', id);
            } else {
                $('.channel_title').text('Go To ' + $(curr).find('h5').text() + ' Channel').attr('data-reference', id);
                $('.channel_title').attr('data-id', id);
                $('.mutual_slider').html('Videos Not Found');
            }
        });
    }
});


$('body').on('click', '.channel_title', function(e) {
    e.preventDefault();
    var curr = $(this);
    if ($(this).attr('data-id')) {
        localStorage.setItem('current-item', $(this).attr('data-reference'));
        $('.telents-show-overlay').hide();
        var id = $('a[data-attribute="' + $(curr).attr('data-reference') + '"]').attr('data-modal');
        $('div.md-modal').removeClass('md-show');
        $('div#' + id).addClass('md-show');
        $('.videos_tab').tab('show');

        var modal = $('.channel-overlay[data-attribute="' + $(curr).attr('data-reference') + '"]').data('modal');
        getChannelVideos('#' + $('div#' + modal).find('.videos_cont').attr('id'));
        window.history.pushState('', '', '/?channel=' + $(this).attr('data-reference'));
    }
});


function getIdFromUrl(url) {
    if (url && url.trim != '') {
        url = url.substring(url.lastIndexOf("/") + 1);
        return url;
    }
}

function getTypeFromUrl(url) {
    if (url && url.trim != '') {
        url = url.substring(url.lastIndexOf("view/") + 5, url.lastIndexOf("/"));
        return url;
    }
}

function getVideoUrl(url) {
    var url_id = url.substring(url.lastIndexOf("/") + 1);
    if (url.includes('/vods')) {
        return '/view/vod/' + url_id;
    }

    if (url.includes('/broadcast')) {
        return '/view/broadcast/' + url_id
    }
}


var ccount = 0;

function load_images() {
    let videos = $('video').length;
    let v_count = 0;
    $('video').each(function(i, v) {
        if(!$(v).hasClass('video-js') && !$(v).hasClass('vjs-tech')){
            if (v.paused && ccount > 0)
                v.play();
            if (v.currentTime > 0) {
                $(v).parent().find('.video-overlay-imgs').remove();
                v_count++;
            }
        }
    });

    if (v_count == videos)
        return;

    setTimeout(function() {
        ccount++;
        load_images();
    }, 1000);
}

function run_video_timer(date) {
    var n_date = (new Date(date) - new Date()) / 1000;
    $('#counter_btn').find('span.counter-div-text').html(parseInt(n_date).toHHMMSS());
    if (n_date <= 0) {
        location.reload();
    } else {
        setTimeout(function() {
            run_video_timer(date);
        }, 1000);
    }
}

Number.prototype.toHHMMSS = function() {
    var days = Math.floor(this / 86400) < 10 ? ("00" + Math.floor(this / 86400)).slice(-2) : Math.floor(this / 86400);
    var hours = Math.floor(this / 3600);
    hours = (hours % 24) < 10 ? ("00" + Math.floor(hours % 24)).slice(-2) : Math.floor(hours % 24);

    var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
    var seconds = ("00" + (this % 3600) % 60).slice(-2);
    return '<span>' + days + '</span><sub>d</sub>' + " : " + '<span>' + hours + '</span><sub>hr</sub>' + " : " + '<span>' + minutes + '</span><sub>min</sub>' + " : " + '<span>' + seconds + '</span><sub>sec</sub>';
}

function addEllipsis(className) {
    if (window.innerWidth < 480) {
        var text = $('.' + className).text();
        var length = $.trim(text.length);
        if (length > 14) {
            $('.' + className).css({
                'height': '50px'
            });
            $('.' + className).append('...');
        } else {
            $('.' + className).css({
                'height': 'auto'
            });
        }
    }
}

var pageURL = $(location).attr("href");
$('#video-link').text(pageURL);

function initialize_sliders() {
    if ($(".news-slider2").length) {
        var owl = $('.news-slider2');
        owl.owlCarousel({
            items: 4,
            margin: 10,
            loop: false,
            responsive: {
                0: {
                    items: 1,
                    mouseDrag: false,
                    touchDrag: false,
                },
                600: {
                    items: 1,
                    mouseDrag: false,
                    touchDrag: false,
                },
                768: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });
    }

    var owl = $('.mutual_slider');
    if (owl.length > 0) {
        owl.owlCarousel({
            items: 4,
            margin: 10,
            loop: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });
    }

    var owl = $('.trailer_slider');
    if (owl.length > 0) {
        owl.owlCarousel({
            items: 4,
            margin: 10,
            loop: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });
    }


}

function render_popup_content(i, channel) {
    var popups = '';
    popups += `<div class="md-modal md-effect-12" id="modal-${i}">
<div class="change-scroll change-scroll02 remove-scroll">
<div class="md-content">
<div class="model-bg-div">
<a onclick="window.history.pushState('','','/')"  class="md-close hidden-md-up close-popup" href="#"><img src="${cdn_path}images/back-arrow.png" alt="" /></a>`;
    if (channel._links.preview_image !== undefined) {
        popups += `<img id="modal-bg-image" src="${channel._links.preview_image.href}" alt="${channel.name}" />`;
    }

    popups += `<div class="image-overlay-text">
<a onclick="window.history.pushState('','','/')" class="md-close hidden-sm-down close-popup" href="#"><img src="${cdn_path}images/back-arrow.png" alt="" /></a>
<h2 id="modal-heading">${channel.name}</h2>
<p class="channel-description">${channel.description}</p>
<div class="btns-buy play-btn${i}">
<a class="btn" href="#">Play</a>
</div>
</div>

</div>
</div>
<div class="tabs-div">
<ul class="nav nav-tabs" role="tablist">
<li class="nav-item">
<a class="nav-link" href="#home${i}" role="tab" data-toggle="tab">Info</a>
</li>
<li class="nav-item">
<a class="nav-link active videos_tab" href="#videos${i}" role="tab" data-toggle="tab">Videos</a>
</li>
<li class="nav-item">
<a class="nav-link" href="#trailers${i}" role="tab" data-toggle="tab">Trailers</a>
</li>
<li class="nav-item">
<a class="nav-link" href="#social${i}" role="tab" data-toggle="tab">Social</a>
</li>
</ul>
</div>
<div class="tab-content">
<div role="tabpanel" class="tab-pane fade" id="home${i}"> 
<div class="talent-div-s assoc_channel">
<ul>`;
    if (channel.associated_channels) {
        for (var j = 0; j < channel.associated_channels.length; j++) {
            popups += `<li>
<a href="#" class="justin-data" data-id="${channel.associated_channels[j]._links.self.href}">
<div class="talent-div-inr">
<div class="talent-img-round">
<img src="${channel.associated_channels[j]._links.channel_icon.href}" alt="${channel.associated_channels[j].name}">
</div>
<div class="talent-text-div">
<h5>${channel.associated_channels[j].name}</h5>
</div>
</div>
</a>
</li>`;
        }
    }
    popups += `</ul>
</div>
<div class="telents-show-overlay">
<div class="change-scroll">
<div class="row">
<div class="col-lg-7 col-md-6 col-sm-6 col-xs-6">
<div class="telents-sliderts-overlay-hding">
<h3 class="mutual_heading"></h3>
</div>
</div>
<div class="col-lg-5 col-md-6 col-sm-6 col-xs-6">
<div class="align-right">
<a class="btn btn-chanels channel_title" href="#"></a>
<a class="cross-close" href="#">
<img src="${cdn_path}images/cross-icon-round.png" alt="" />
</a>
</div>
</div>
</div>
<div class="demo demo02">
<div id="news-slider31" class="owl-carousel mutual_slider">
<div class="chanel-load-effect">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
<div class="chanel-load-effect">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
<div class="chanel-load-effect">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
<div class="chanel-load-effect">
<div class="chanel-inr-video pulse"></div>
<div class="gray-div-load pulse"></div>
</div>
</div>
</div>
</div>
</div>
</div> 
<div role="tabpanel" class="tab-pane fade in active no-padding videos_cont" id="videos${i}">
<div class="demo telents-slider">
<div id="news-slider2" class="owl-carousel owl-theme videos-slider news-slider2 content-loading" >
<div class="chanel-load-effect"><div class="chanel-inr-video"></div><div class="gray-div-load"></div></div><div class="chanel-load-effect"><div class="chanel-inr-video"></div><div class="gray-div-load"></div></div><div class="chanel-load-effect"><div class="chanel-inr-video"></div><div class="gray-div-load"></div></div><div class="chanel-load-effect"><div class="chanel-inr-video pulse"></div><div class="gray-div-load pulse"></div></div>
</div> 
</div>
</div>
<div role="tabpanel" class="tab-pane fade no-padding" id="trailers${i}">
<div class="demo telents-slider">
<div id="news-slider3" class="owl-carousel trailer_slider content-loading">
<div class="chanel-load-effect">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
<div class="chanel-load-effect">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
<div class="chanel-load-effect">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
<div class="chanel-load-effect">
<div class="chanel-inr-video pulse"></div>
<div class="gray-div-load pulse"></div>
</div>


</div>
</div>    
</div>
<div role="tabpanel" class="tab-pane fade no-padding social" id="social${i}">
<div class="demo telents-slider">
<div class="change-scroll">`;
    if (channel.facebook_account) {
        popups += `<a href="${channel.facebook_account}" class="facebook_account hidden"></a>`;
    }
    if (channel.twitter_account) {
        popups += `<a href="${channel.twitter_account}" class="twitter_account hidden"></a>`;
    }
    if (channel.instagram_account) {
        popups += `<a href="${channel.instagram_account}" class="instagram_account hidden"></a>`;
    }

    popups += `<div id="news-slider3" class="social_slider content-loading">
<div class="row">
<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
<h3>Facebook</h3>
<div class="chanel-load-effect facebook-feeds">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
</div>
<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
<h3>Twitter</h3>
<div class="chanel-load-effect twitter-tweets">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
</div>
<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
<h3>Instagram</h3>
<div class="chanel-load-effect instagram-tag">
<div class="chanel-inr-video"></div>
<div class="gray-div-load"></div>
</div>
</div>
</div>
</div>
</div>
</div>    
</div>
</div>
</div>
</div>
<div class="md-overlay"></div>`;

    return popups;
}

function render_channel_thumbnails(i, channel) {
    var channels = `<li>
<a href="#" class="md-trigger channel-overlay change-channel-url" data-attribute="${channel.id}" data-modal="modal-${i}">
<div class="videos-inr">`;
    if (channel._links.preview_image !== undefined) {
        channels += `<img src="${channel._links.preview_image.href}" alt="${channel.name}" />`;
    }
    channels += `</div>
</a>
</li>`

    return channels;
}

function onScrollMbl() {
	if($(window).scrollTop() > $('#channel_content li').height() * ($('#channel_content li').length - 2)) {
		onScroll();
	}
}

function onScroll() {
    var page = localStorage['channels_loading'];
    if (page === undefined && localStorage['disable_channel_loading'] == '1') {
        $('.videos-loader').fadeIn();
        localStorage['channels_loading'] = 1;
        page = ++localStorage['channel_page'];
        $.post('/channel?page=' + page, function(res) {
            delete localStorage['channels_loading'];            
            if((typeof res) == "string"){
                res = JSON.parse(res);
            }
            res = res._collection;
            if (res.count < 10)
                localStorage['disable_channel_loading'] = 0;

            var channels = ``;
            var popups = ``;
            var i = $('#channel_content ul li').length;
            for (var channel of res.resources) {
                i++;
                channels += render_channel_thumbnails(i, channel);
                popups += render_popup_content(i, channel);
            }

            $('#channel_popups').append(popups);
            $('#channel_content ul').append(channels);
            initialize_sliders();
            $('.videos-loader').fadeOut();
            if ($('#channel_content ul').scrollTop() === 0)
                $('.con-wrap2.swiper-wrapper').css('height', (($('#channel_content ul li').length + 2) * $('#channel_content ul li:eq(0)').height()) + 'px');

            var oldHeight = $('#channel-list-height').height();
            var height = oldHeight + (80 * res.count);
            $('#channel-list-height').height(height);
        });
    }
};


$("#supportForm").validate();

$( "#supportForm" ).submit(function( event ) {
    
    if($("#supportForm").valid()){

        var support_submit_btn = $("#support_submit_btn");
        
        support_submit_btn.attr("disabled", true);

        $.ajax({
            url: '/support',
            type: "POST",
            data: $("#supportForm").serialize(),
            dataType: 'json', // lowercase is always preferered though jQuery does it, too.
            success: function(response){
                support_submit_btn.attr("disabled", false);
                $('#thanks-div').removeClass('hidden');
                $('#help-feilds-div').addClass('hidden');
            },
            error:function(error){
                alert('Something went wrong ! please try again !');
                support_submit_btn.attr("disabled", false);
            }
        });
    }
    
    event.preventDefault();
});
  