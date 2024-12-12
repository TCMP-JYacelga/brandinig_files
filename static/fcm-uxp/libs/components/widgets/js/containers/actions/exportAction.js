const ExportActionUtils = {
	actionIds : {
	   'btnId' : 'actionbtn_export_'
	},   
	actionClasses : {}
};

var Export = function(){
	  return exportAction();
 };

function exportAction(){
	    var _this = {};
		_this.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = ExportActionUtils;		
		this.action = '';
		
		this.initialize();
    };
	
	_this.initialize = function(){
		this.action = this.createAction();
	};
	
	_this.createAction= function(){
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
