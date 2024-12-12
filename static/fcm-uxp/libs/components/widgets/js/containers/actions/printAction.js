const PrintActionUtils = {
	actionIds : {
	   'btnId' : 'actionbtn_print_'
	},   
	actionClasses : {}
};

var print = function() {
	  return printAction();
	};

function printAction(){
	 var _this={};
	 _this.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = PrintActionUtils;		
		this.action = '';
		
		this.initialize();
    };
	
    _this.initialize = function(){
		this.action = this.createAction();
	};
	
    _this.createAction = function(){
        let actionItem = document.createElement('li');
		let menuOption = document.createElement('a');
		menuOption.className = 'dropdown-item';
		menuOption.id = this.utils.actionIds.btnId + this.widgetId;
		menuOption.setAttribute('href','javascript:void(0);');
		$(menuOption).append(this.label);
		actionItem.appendChild(menuOption);
		return actionItem;
	};
	
	_this.getAction = function(){
		return this.action;
	};
	return _this;
}
