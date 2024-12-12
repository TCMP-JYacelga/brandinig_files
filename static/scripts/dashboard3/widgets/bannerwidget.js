widgetMetaData.bannerWidget = function(widgetId, widgetType)
{
	var bannerImages = [{'id' :'banner_img3', url: rootUrl + '/static/scripts/dashboard3/widgets/banner3.png'},
			            {'id' :'banner_img2', url: rootUrl + '/static/scripts/dashboard3/widgets/banner2.png'},
			            {'id' :'banner_img1', url: rootUrl + '/static/scripts/dashboard3/widgets/banner.png'}];
	let metadata = {
			  'title': '',
			  'desc': '',
			  'type': 'card',
			  "widgetType" : widgetType,
			  "cloneMaxCount": 1,
			  'subType': '',  
			  'icon':'',
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
			  'actions' : {
				  'custom' : {
					  'title' : getDashLabel('setting'),
					  'callbacks' : {
						  'click' : function(metaData){
						  }						  
					  }
				  },
				  'refresh' : {
					  'callbacks' : {
						  'init' : function(addData, metaData){
							  var slider = '<div id="bannerWidgetSlider" class="carousel slide" data-ride="carousel"><div class="carousel-inner">';
							  var corousels = '<a class="carousel-control-prev" href="#bannerWidgetSlider" style="top:160px; left:-25px;" role="button" data-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="sr-only">Previous</span></a>'+
                                              '<a class="carousel-control-next" href="#bannerWidgetSlider" style="top:160px; right:-25px;" role="button" data-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="sr-only">Next</span></a>';
						      $(bannerImages).each(function(index, data){
						    	let activeClass = (index == 0) ? 'active' : '';
						        var bannerWidgetBody = '<div class="carousel-item ' +activeClass+ '">'+
												        '<img id="' + data.id + '" src="' + data.url+ '" class="d-block w-100">'+
												      '</div>';
						        slider+= bannerWidgetBody;
						      });
						      slider+= '</div>'+ corousels +
						              '</div>';
							  $('#widget-body-'+metaData.widgetId).prepend(slider);
						      $('#bannerWidgetSlider').carousel({
								interval: 6000
							  });
						  }
					  }
				  }
			  }
	}
	return metadata;
}

