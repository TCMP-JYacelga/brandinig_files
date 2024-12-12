var appliedWidgetSetting = {};

const WidgetGroupContainerUtils = {
	containerIds : {
	   'carousel'     : 'groupWidgetContainer_',
	   'carouselItem' : 'groupWidgetItem_'
	},   
	containerClasses : {
	   'carouselIndicators'  : 'carousel-indicators',
	   'carouselInner'       : 'carousel-inner',
	   'carouselControlPrev' : 'carousel-control-prev',
	   'carouselControlNext' : 'carousel-control-next',
	   'carousel'            : 'carousel widget-carousel slide',
	   'carouselActiveItem'  : 'carousel-item widget-item active',
	   'carouselItem'        : 'carousel-item widget-item'
	}
};

var widgetGroupContainer = {
	'initialize' : function (toggleSlider, containerId, widgetArray, usrDashboardPref) {
		var _this = {};
		_this.toggleSlider =  $.type(toggleSlider) == 'undefined'? false: toggleSlider;
		_this.containerId = $.type(containerId) == 'undefined'? undefined: containerId;
		_this.widgetArray = $.type(widgetArray) == 'undefined'? []: widgetArray;
		_this.utils = WidgetGroupContainerUtils;
		 groupContainer = '';
		 var containerId = _this.utils.containerIds.carousel+_this.containerId;
		 var widgetCount = 0;
		 var sliderItem = '';
		 $.each(_this.widgetArray, function(index, widget){
			var hidden   = widget.hidden ? widget.hidden : false;
			if(!hidden)
			{
				widgetCount++;
			}
		 });
		 if(widgetCount > 0)
		 {
			groupContainer = widgetGroupContainer.createContainer(containerId, widgetCount, toggleSlider);
			var widgetIndex = 0;
			$.each(_this.widgetArray, function(index, widget){
				var widgetId = widget.widgetId;
				var widgetType = widget.widgetType;
				var hidden   = widget.hidden ? widget.hidden : false;
				if(!hidden)
				{
					var widgetMetadata = widgetMap[widgetId];				
					var _oWidgetContainer = widgetContainer.initialize({'widgetId': widgetId, "metadata": widgetMetadata, "usrDashboardPref": usrDashboardPref});
		            var _widgetContainer = _oWidgetContainer.widgetContainer;
					var sliderItemName = widgetMetadata.icon;
					var activeClass = widgetIndex == 0 ? 'active' : '';
					if (sliderItemName !== undefined)
					{
					   sliderItem += '<button data-target="#'+containerId+'" data-slide-to="'+widgetIndex+'" type="button" class="btn '+activeClass+'">'+sliderItemName+'</button>';
					}
				    widgetGroupContainer.addContainerItem(groupContainer, widgetId, _widgetContainer, widgetIndex++);
				}
				
			});
		  }
		 if(_this.toggleSlider && sliderItem !== '')
		  {
				var sliderGroup = '<div class="btn-group mr-2 widget-toogle-btn" role="group" aria-label="First group" style="direction:ltr">';
	                sliderGroup += sliderItem;
	                sliderGroup += '</div>';
				$(groupContainer).find('.widget-action-menu').prepend(sliderGroup);
			}
			
			_this.groupContainer = groupContainer;
			return _this;
    },
	
    'addContainerItem': function (groupContainer, containerItemId, containerItem, index) {
		let carouselItem;
		
		carouselItem = document.createElement('div');
		carouselItem.className = (index == 0) ? WidgetGroupContainerUtils.containerClasses.carouselActiveItem 
									: WidgetGroupContainerUtils.containerClasses.carouselItem;
		carouselItem.id = WidgetGroupContainerUtils.containerIds.carousel + containerItemId;
		
		carouselItem.appendChild(containerItem);
		
		$(groupContainer).find('.carousel-inner').append(carouselItem);
	},
	
	'createContainer': function(containerId, widgetCount, toggleSlider){
		let carousel, carouselIndicators, carouselInner, carouselControlPrev, carouselControlNext;
		
		carouselIndicators = document.createElement('ol');
		carouselIndicators.className = WidgetGroupContainerUtils.containerClasses.carouselIndicators;
		for (var n = 0; n < widgetCount; n++)
		{
			let cls = (n==0) ? 'active' : '';
			carouselIndicators.innerHTML += '<li data-target="#'+containerId+'" data-slide-to="'+n+'" class="'+cls+'"></li>';
		}

		
		carouselInner = document.createElement('div');
		carouselInner.className = WidgetGroupContainerUtils.containerClasses.carouselInner;
		
		carouselControlPrev = document.createElement('a');
		carouselControlPrev.className = WidgetGroupContainerUtils.containerClasses.carouselControlPrev;
		carouselControlPrev.setAttribute('href','#'+containerId);
		carouselControlPrev.setAttribute('role','button');
		carouselControlPrev.setAttribute('data-slide','prev');
		carouselControlPrev.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span> <span class="sr-only">Previous</span>';
		
		carouselControlNext = document.createElement('a');
		carouselControlNext.className = WidgetGroupContainerUtils.containerClasses.carouselControlNext;
		carouselControlNext.setAttribute('href','#'+containerId);
		carouselControlNext.setAttribute('role','button');
		carouselControlNext.setAttribute('data-slide','next');
		carouselControlNext.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span> <span class="sr-only">Next</span>';
		
		carousel = document.createElement('div');
		carousel.id = containerId;
		carousel.className = WidgetGroupContainerUtils.containerClasses.carousel;
		carousel.setAttribute('data-ride','carousel');		
		carousel.setAttribute('data-interval','false');
		carousel.appendChild(carouselInner);
		if (widgetCount > 1 && !toggleSlider)
		{
			carousel.appendChild(carouselIndicators);
			carousel.appendChild(carouselControlPrev);
			carousel.appendChild(carouselControlNext);
		}
		return carousel;
	}
}

widgetSetting = appliedWidgetSetting;