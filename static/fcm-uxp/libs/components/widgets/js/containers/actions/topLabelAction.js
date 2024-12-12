const TopLabelActionUtils = {
	actionIds : {
	   'btnId' : 'actionbtn_toplabel_'
	},   
	actionClasses : {}
 };

var topLabel = function() {
	  return topLabelAction();
 };

function topLabelAction(){
	   var _this= {};
	   _this.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = TopLabelActionUtils;		
		this.action = '';
		
		this.initialize();
    };
	
    _this.initialize = function(){
		this.action = this.createAction();
	};
	
	_this.createAction = function(){
		let menuOption = document.createElement('div');
		menuOption.className = 'top-label-action';
		menuOption.id = this.utils.actionIds.btnId + this.widgetId;
		menuOption.innerHTML = '';		
		return menuOption;
	};
	
	_this.getAction = function(){
		return this.action;
	};
  return _this;
}
