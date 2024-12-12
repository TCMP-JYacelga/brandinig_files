// Simple JavaScript Rotating Banner Using jQuery
// www.mclelun.com

// Edit jqb_eff to change transition effect.
// 1 - FadeIn FadeOut
// 2 - Horizontal Scroll
// 3 - Vertical Scroll
// 4 - Infinity Horizontal Scroll
// 5 - Infinity Vertical Scroll
var jqb_eff = 0;

//Variables
var jqb_vCurrent = 3;
var jqb_vTotal = 0;
var jqb_vSpeed = 2000;
var jqb_vDuration = 4000;
var jqb_intInterval = 0;
var jqb_vGo = 1;
var jqb_vBusy = false;
var jqb_vIsPause = false;
var jqb_tmp = 20;
var jqb_title;
var jqb_imgW = 1100;
var jqb_imgH = 176;
var jqb_rotate = false;

jQuery(document).ready(function() {	
	jqb_vTotal = $(".jqb_slides").children().size() - 1;
	$("#jqb_object").find(".jqb_slide").each(function(i) { 
		if (i == jqb_vCurrent){
			jqb_title = $(this).attr("title");
			$(".jqb_info").text(jqb_title);
		}
	});

	if (jqb_rotate) {
		jqb_intInterval = setInterval(jqb_fnLoop, jqb_vDuration);
		
		if (jqb_eff == 1)//Fade In & Fade Out
		{
			$("#jqb_object").find(".jqb_slide").each(function(i) { 
				if (i == 0) {
					$(this).animate({ opacity: 'show'}, jqb_vSpeed, function() { jqb_vBusy = false; });
				} else {
					$(this).animate({ opacity: 'hide'}, jqb_vSpeed, function() { jqb_vBusy = false; });
				}
			});
		}
		else if (jqb_eff == 2 || jqb_eff == 4)//Horizontal Alignment
		{
			$("#jqb_object").find(".jqb_slide").each(function(i) { 
				jqb_tmp = ((i - 1)*jqb_imgW) - ((jqb_vCurrent -1)*jqb_imgW);
				$(this).css({"left": jqb_tmp+"px"});
			});
		} 
		else if (jqb_eff == 3 || jqb_eff == 5)//Vertical Alignment
		{
			$("#jqb_object").find(".jqb_slide").each(function(i) { 
				jqb_tmp = ((i - 1)*jqb_imgH) - ((jqb_vCurrent -1)*jqb_imgH);
				$(this).css({"top": jqb_tmp+"px"});
			});
		}
	}

	$("#btn_pauseplay").click(function() {
		if (jqb_vIsPause) {
			jqb_vIsPause = false;
			jqb_fnChange();
			$("#btn_pauseplay").removeClass("jqb_btn_play");
			$("#btn_pauseplay").addClass("jqb_btn_pause");
		} else {
			jqb_vIsPause = true;
			clearInterval(jqb_intInterval);
			$("#btn_pauseplay").removeClass("jqb_btn_pause");
			$("#btn_pauseplay").addClass("jqb_btn_play");
		}
	});
	
	$("#btn_prev").click(function() {
		if (!jqb_vBusy)
		{
			jqb_vBusy = true;
			jqb_vGo = -1;
			jqb_fnChange();
		}
	});
		
	$("#btn_next").click(function() {
		if(!jqb_vBusy)
		{
			jqb_vBusy = true;
			jqb_vGo = 1;
			jqb_fnChange();
		}
	});
	
	$("#jqb_object").find(".jqb_slide").mouseover(function() {
		if (!jqb_vIsPause) {
			clearInterval(jqb_intInterval);
		}
	});
	
	$("#jqb_object").find(".jqb_slide").mouseout(function() {
		if(!jqb_vIsPause) {
			jqb_fnChange();
		}
	});
		
});

function jqb_fnChange() {
	clearInterval(jqb_intInterval);
	jqb_fnLoop();
	if (!jqb_vIsPause && jqb_rotate) {
		jqb_intInterval = setInterval(jqb_fnLoop, jqb_vDuration);
	}

}

function jqb_fnLoop() {
	if (!jqb_rotate) return ;

	if (jqb_vGo == 1){
		if (jqb_vCurrent >= jqb_vTotal)
			jqb_vCurrent = 0;
		else
			jqb_vCurrent++;
	} else {
		if (jqb_vCurrent <= 0)
			jqb_vCurrent = jqb_vTotal;
		else
			jqb_vCurrent--;
	}

	$("#jqb_object").find(".jqb_slide").each(function(i) { 
		if (i == jqb_vCurrent){
			jqb_title = $(this).attr("title");
			$(".jqb_info").animate({ opacity: 'hide', "left": "-50px"}, 250,function(){
				$(".jqb_info").text(jqb_title).animate({ opacity: 'show', "left": "0px"}, 500);
			});
		} 

		if (jqb_eff == 2)//Horizontal Scrolling
		{
			jqb_tmp = ((i - 1)*jqb_imgW) - ((jqb_vCurrent -1)*jqb_imgW);
			$(this).animate({"left": jqb_tmp+"px"}, jqb_vSpeed, function() { jqb_vBusy = false; });
		}
		else if (jqb_eff == 3)//Vertical Scrolling
		{
			jqb_tmp = ((i - 1)*jqb_imgH) - ((jqb_vCurrent -1)*jqb_imgH);
			$(this).animate({"top": jqb_tmp+"px"}, jqb_vSpeed, function() { jqb_vBusy = false; });
		}	
		else if (jqb_eff == 4)//Infinity Horizontal Scrolling
		{
			if (jqb_vTotal == 1) //IF 2 SLIDE ONLY, FIX
			{
				if(jqb_vGo == 1){
					if (($(this).position().left) < 0 )
					{
						$(this).css({"left": jqb_imgW+"px"});
					}
				} else {
					if (($(this).position().left) > (jqb_imgW * (jqb_vTotal - 1)))
					{	
						$(this).css({"left": (-1 * jqb_imgW)+"px"});
					}
				}
			}
			else
			{
				if (($(this).position().left) < -jqb_imgW )
				{
					$(this).css({"left": (jqb_imgW * (jqb_vTotal - 1))+"px"});
				}
				else if(($(this).position().left) > (jqb_imgW * (jqb_vTotal - 1)))
				{	
					$(this).css({"left": (-1 * jqb_imgW)+"px"});
				}
			}

			jqb_tmp = $(this).position().left - (jqb_imgW * jqb_vGo);
			$(this).animate({"left": jqb_tmp+"px"}, jqb_vSpeed, function() { jqb_vBusy = false;  });
		}
		else if (jqb_eff == 5)//Infinity Vertical Scrolling
		{
			if (jqb_vTotal == 1) //IF 2 SLIDE ONLY, FIX
			{
				if (jqb_vGo == 1){
					if(($(this).position().top) < 0 )
					{
						$(this).css({"top": jqb_imgH+"px"});
					}
				} else {
					if (($(this).position().top) > (jqb_imgH * (jqb_vTotal - 1)))
					{	
						$(this).css({"top": (-1 * jqb_imgH)+"px"});
					}
				}
			}
			else
			{
				if (($(this).position().top) < -jqb_imgH )
				{
					$(this).css({"top": (jqb_imgH * (jqb_vTotal - 1))+"px"});
				}
				else if (($(this).position().top) > (jqb_imgH * (jqb_vTotal - 1)))
				{	
					$(this).css({"top": (-1 * jqb_imgH)+"px"});
				}	
			}

			jqb_tmp = $(this).position().top - (jqb_imgH * jqb_vGo);
			 $(this).animate({"top": jqb_tmp+"px"}, jqb_vSpeed, function() { jqb_vBusy = false;  });
		}
		else //if (jqb_eff == 1) //Fade In & Fade Out
		{
			if (i == jqb_vCurrent){
				$(this).animate({ opacity: 'show'}, jqb_vSpeed, function() { jqb_vBusy = false; });
			} else {
				$(this).animate({ opacity: 'hide'}, jqb_vSpeed, function() { jqb_vBusy = false; });
			}
		}
	});
}





