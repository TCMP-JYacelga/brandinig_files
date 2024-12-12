const RemoveActionUtils = {
	actionIds : {
	   'actionBtnId' : 'actionbtn_remove_'
	},   
	actionClasses : {}
};


var remove = function() {
	   return removeAction();
	}

function removeAction(){
    var _this = {};
	_this.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = RemoveActionUtils;		
		this.action = '';
		
		this.initialize();
    };
	
    _this.initialize= function(){
		this.action = this.createAction();
		this.bindAction();
	};
	
	_this.createAction = function(){
		let actionItem = document.createElement('li');
		let menuOption = document.createElement('a');
		menuOption.className = 'dropdown-item';
		menuOption.id = this.utils.actionIds.actionBtnId + this.widgetId;
		menuOption.setAttribute('href','javascript:void(0);');
		$(menuOption).append(this.label);		
        actionItem.appendChild(menuOption);
        return actionItem;
	};
	
	_this.getAction = function(){
		return this.action;
	};
	
	_this.bindAction = function(){	
		let _this = this;
		let actionId = _this.utils.actionIds.actionBtnId + _this.widgetId;
		$('#'+actionId).ready(function(){
			$('#'+actionId).unbind('click');
			$('#'+actionId).click(function(){
				_this.callback ? _this.callback(_this) : _this.callAction();
			});			
		});
	};
	
	_this.callAction = function(){
	   let _this = this;
	   let itemCount = $('#groupWidgetContainer_'+this.widgetId).parent().find('.widget-item').length;
	   if(itemCount > 1)
	   {		   
		   let parentEle = $('#groupWidgetContainer_'+this.widgetId).parent();
		   $('#groupWidgetContainer_'+this.widgetId).remove();
		   $(parentEle).find('.widget-item:first-child').addClass('active');
           if($(parentEle).parent().find('.carousel-indicators li').length == 2)
            {
        	   $(parentEle).parent().find('.carousel-indicators li').remove();
        	   $(parentEle).parent().find('a[data-slide="prev"]').remove();
               $(parentEle).parent().find('a[data-slide="next"]').remove();
            }
           else {
		      $(parentEle).parent().find('.carousel-indicators li:last-child').remove();
             }
	   }
	   else
	   {
		   $('#groupWidgetContainer_'+this.widgetId).parent().parent().parent().remove();
	   }
	   let _index, _index2, _index3;
	   $(usrDashboardPref.dashboard.layouts).each(function(index, layout){
		   _index = index;
		   $(layout.groupContainers).each(function(index2, layout2){
			   _index2 = index2;
			  $(layout2.widgetContainers).each(function(index3, layout3){
				   _index3 = index3;
				 if(layout3.widgetId == _this.widgetId)
				 {
                     // splice will remove the provided index element from array
                     usrDashboardPref.dashboard.layouts[_index].groupContainers[_index2].widgetContainers.splice(_index3,1);
                     // if widgetContainers becomes empty then remove the groupcontainer itself
                     if(usrDashboardPref.dashboard.layouts[_index].groupContainers[_index2].widgetContainers.length == 0)
                         usrDashboardPref.dashboard.layouts[_index].groupContainers.splice(_index2,1);
                     getWidgetsForCloneCount();
       				 let response = fetchAvailableWidgets();
        			 parseRestData(response);
				 }
			  }); 
		   });
	   });
	   
	   updateDashboardPref();
	   
	};
	return _this;
}
