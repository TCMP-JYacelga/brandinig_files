const customActionUtils = {
	actionIds : {
	   'actionBtnId'    : 'actionbtn_custom_',
	   'groupWidgetContainer' : 'groupWidgetContainer_'	   
	}
};

var custom = function() {
	  return customAction();
};

function customAction(){
	    var _this = {};
	   _this.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = customActionUtils;		
		this.action = '';
		
		this.initialize();
    };
	
    _this.initialize = function(){
		this.action = this.createAction();
		this.bindAction();	
	};
	
	_this.createAction = function(){
		let actionItem = document.createElement('li');		
        let menuOption = document.createElement('a');
		menuOption.className = 'dropdown-item';
		menuOption.id = this.utils.actionIds.actionBtnId + this.widgetId;
		menuOption.setAttribute('href','#');
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
			$('#'+actionId).click(function(){
				_this.metadata.actions.custom.callbacks.click(_this.metadata);
			});			
		});
	};
	
	return _this;
}
