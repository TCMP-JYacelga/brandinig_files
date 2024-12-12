$(document).ready(function () {
	
	var step = 60;
	var hasHorizontalScrollbar = false;
	if(null!= document.getElementById('gridTable'))
	{
		var scrollableArea =document.getElementById('gridTable').parentNode;
		hasHorizontalScrollbar= scrollableArea.scrollWidth > scrollableArea.clientWidth;
	}
	
	
	if (hasHorizontalScrollbar)
	{
		$(".flexigrid div.bDiv").parent().prepend("<div class=\"scrollingHotSpotLeftClass\" style=\"display: block; opacity: 0; position:absolute;\"></div>");
		$(".flexigrid div.bDiv").parent().prepend("<div class=\"scrollingHotSpotRightClass\" style=\"display: block; opacity: 0; position:absolute;\"></div>");
	
		$( ".scrollingHotSpotRightClass" ).click(function(){
			var ele =  $(".flexigrid div.bDiv");
			ele.scrollLeft(ele.scrollLeft()+step);
		});
					
		$( ".scrollingHotSpotLeftClass" ).click(function(){
			var ele =  $(".flexigrid div.bDiv");
			ele.scrollLeft(ele.scrollLeft()-step);
		});

	}
	
});
