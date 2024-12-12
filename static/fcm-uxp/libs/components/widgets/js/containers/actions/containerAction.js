const ContainerActionUtils = {
	actionLabels : {
		'editTitle'   :  getDashLabel('edit','Edit Title'),
		'chartToggle' :  getDashLabel('chart','Chart Toggle'),
		'refresh'     :  getDashLabel('refresh','Refresh'),
		'filter'      :  getDashLabel('filter','Filter'),
		'summary'     :  getDashLabel('summary','Summary'),
		'print'       :  getDashLabel('print','Print'),
		'export'      :  getDashLabel('export','Export'),
		'remove'      :  getDashLabel('remove','Remove Widget'),
		'topLable'    :  getDashLabel('top','Top Lable'),
        'viewOptions' :  getDashLabel('viewOption','View Options'),
        'columnChooser' : getDashLabel('columnChooser.title','Add/Remove Columns')
	},
	
	actionIcons : {
		'editTitle'   : '<i class="material-icons edit-icon header-margin">edit</i>',
		'chartToggle' : '<i class="material-icons">insert_chart_outlined</i>',
		'refresh'     : '<i class="material-icons refresh-icon header-margin" title="'+getDashLabel('btn.refresh','Refresh')+'">refresh</i>'
	},
	
	actionIds : {
	   
	},
	
	actionClasses : {
		'widgetActionMenu'   : 'widget-action-menu',
		'widgetMenuDropdown' : 'dropdown-menu',
		'widgetMenuDropdownItem' : 'dropdown-item'
	},
	
	widgetSpecificActions : {
		"ALL" : {
			"refresh" : {
				"text" : getDashLabel('refresh','Refresh'),
				"callbacks" : {
					"open" : function(){}
				}
			},
			"remove" : {
				"text" : getDashLabel('remove','Remove Widget'),
				"callbacks" : {
					"open" : function(){}
				}
			},
			"editTitle" : {
				"text"   :  getDashLabel('edit','Edit Title'),
				"callbacks" : {
					"open" : function(){}
				}
			}
		},
		"filter" : {
			"text" : getDashLabel('filter','Filter'),
			"callbacks" : {
				"enabled": function() {
					return false;
				},
				"open" : function(){}
			}
		},
		"datatable": {
			"columnChooser" : {
				"text" : getDashLabel('columnChooser.title'),
				"callbacks" : {
					"open" : function(){}
				}
			}
		}
	},
	actionList: ['editTitle','chartToggle','refresh','filter','summary','print','export','remove','footerLink'],
	
	headerActionList: ['editTitle','chartToggle','refresh'],
	
	bodyActionList: ['topLable'],
	
	dropdownActionList: ['viewOptions','filter', 'columnChooser' ,'summary','print','export','custom','remove'],
	
	footerActionList: ['footerLink'],
	
	getActionClass : function(action){
		let actionClass;
		switch (action)
		{
		  case 'remove':
			actionClass = remove();
			break;
		  case 'editTitle':
			actionClass = edit();
			break;
		  case 'refresh':
			actionClass = refresh();
			break;	
		  case 'filter':
			actionClass = filter();
			break;
		  case 'summary':
			actionClass = summary();
			break;
		  case 'print':
			actionClass = print();
			break;
		  case 'export':
			actionClass = Export();
			break;	
		  case 'chartToggle':
			actionClass = toggleAction();
			break;
		  case 'topLabel':
			actionClass = topLabel();
			break;
		  case 'viewOptions':
			actionClass = viewOptions();
			break;
		  case 'columnChooser':
				actionClass = columnChooser();
				break;	
		  default:
			break;
		}
		return actionClass;
	}
};

var actions = function(){
	   return ContainerAction();
};

function ContainerAction(){
	  var _this = {};
	  _this.constructor = function(widgetId, widgetContainer, metadata) {
	    this.widgetId = $.type(widgetId) == 'undefined'? undefined : widgetId;
		this.widgetContainer = $.type(widgetContainer)== 'undefined'? undefined :widgetContainer;
		this.metadata = $.type(widgetContainer)== 'undefined'?{}:metadata;
		this.actionArray  = $.extend({}, metadata.actions);
		if(metadata.filter !== undefined && metadata.filter.fields !== 'undefined' && metadata.filter.fields.length !== 0) {
			this.actionArray['filter'] = ContainerActionUtils.widgetSpecificActions['filter'];
		}
		for (let action in ContainerActionUtils.widgetSpecificActions['ALL']) {
			_this.addAction(action, 'ALL');
		}
		for (let action in ContainerActionUtils.widgetSpecificActions[metadata.type]) {
			_this.addAction(action, metadata.type);
		}
		for (let action in this.actionArray) {
			if (this.actionArray[action] === undefined) {
				delete this.actionArray[action];
			} else  if (this.metadata.actions[action] !== undefined 
				&& this.metadata.actions[action].callbacks !== undefined 
				&& this.metadata.actions[action].callbacks.enabled !== undefined 
				&& !this.metadata.actions[action].callbacks.enabled()) {
				delete this.actionArray[action];
			}
		}
		
		this.utils = ContainerActionUtils;
		this.initialize();
    };
    
    _this.addAction = function(action, type) {
    	if(this.metadata.actions[action]=== undefined) {
			this.actionArray[action] = ContainerActionUtils.widgetSpecificActions[type][action];
		} else if (this.metadata.actions[action] !== undefined 
			&& this.metadata.actions[action].callbacks !== undefined 
			&& this.metadata.actions[action].callbacks.enabled !== undefined 
			&& !this.metadata.actions[action].callbacks.enabled()) {
			 delete this.actionArray[action];
		}
    }
	
    _this.initialize = function(){
		this.createAction();
	};
	
	_this.getContainer = function(){
		return this.widgetContainer;
	};
	
	_this.createAction = function(){
		let actionObj = {};
		let actionMenuEle = $(this.widgetContainer).find('.'+this.utils.actionClasses.widgetActionMenu);		
		let dropDownMenuEle = $(this.widgetContainer).find('.'+this.utils.actionClasses.widgetActionMenu
								+' .'+this.utils.actionClasses.widgetMenuDropdown);
		if (this.actionArray === undefined || Object.keys(this.actionArray).length < 2) { // refresh if enabled
			actionMenuEle.find("I.material-icons").text("");
		}
		let widgetBodyEle = $('#widget-body-'+this.widgetId);
		for (let action in this.actionArray)
		{
			let actionClass = this.utils.getActionClass(action);
			if(actionClass)
			{
				let label = this.utils.actionLabels[action];
				let icon = this.utils.actionIcons[action];
				actionClass.constructor(this.widgetId, label, icon, this.metadata, null);
				
				actionObj[action] =  actionClass;
			}
			else
			{
				if(action == 'custom')
				{
					actionClass = custom();
					let actionMenu = this.actionArray[action];
					
					let label = actionMenu.title;
					let icon = actionMenu.icon;
					actionClass.constructor(this.widgetId, label, icon, this.metadata, null);
					
					actionObj[action] =  actionClass;
				}
			}
		}
		
		this.addHeaderAction(actionMenuEle, actionObj);
		this.addDropdownAction(dropDownMenuEle, actionObj);
		//this.addBodyAction(widgetBodyEle,actionObj);
	};
	
	_this.addHeaderAction= function(actionMenuElement, actionObj){
		let _this = this;
		let headerActionList = this.utils.headerActionList;
		headerActionList.forEach(function(action,index) { 
		    if(actionObj[action])
			{
				if(action == 'editTitle')
				{
					$(actionMenuElement).before(actionObj[action].getAction());
				}
				else if(action == 'refresh')
				{
					$(actionMenuElement).prepend(actionObj[action].getAction());
				}
			} 
		});
	};
	
	_this.addBodyAction = function(widgetBodyEle, actionObj){
		let _this = this;
		let bodyActionList = this.utils.headerActionList;
		bodyActionList.forEach(function(action,index) { 
		    if(actionObj[action])
			{
				if(action == 'topLabel')
				{
					$(actionMenuElement).prepaind(actionObj[action].getAction());
				}
			} 
		});
	};
	
	_this.addDropdownAction = function(dropdownElement, actionObj){
		let _this = this;
		let dropdownActionList = this.utils.dropdownActionList;
		dropdownActionList.forEach(function(action,index) { 
		    if(actionObj[action])
			{
				if(action == 'remove' && $(dropdownElement)
						.find('.'+_this.utils.actionClasses.widgetMenuDropdownItem).length > 0)
				{
					//$(dropdownElement).append('<div class="dropdown-divider"></div>');
				}
				$(dropdownElement).append(actionObj[action].getAction());
			} 
		});
	};	
	_this.addFooterAction= function(){
		
	};
  return _this;
}
