const viewOptionActionUtils = {
	actionIds : {
	   'actionBtnId'    : 'actionbtn_viewOption_'	   
	},
	 viewOptions: {
         12:'small',
         6:'medium',
         4:'large'
     }
};

var viewOptions = function(){
   return viewOptionsAction();
 };
 
 function viewOptionsAction(){
	  var _this = {};
	  _this.constructor = function(widgetId, label, icon, metadata, callback) {
			this.widgetId = widgetId;
			this.label = label;
			this.icon = icon;
			this.metadata = metadata;
			this.callback = callback;		
			this.action = '';
			this.appliedFilter = undefined;
            this.utils = viewOptionActionUtils;
			
			this.initialize();
	    };
		
	  _this.initialize= function(){
			this.action = this.createAction();
			_this.bindAction();
		};
		
	  _this.createAction = function(){
		    let actionItem = document.createElement('li');
            actionItem .className = 'dropdown-submenu';
			let menuOption= document.createElement('a');
			menuOption.className = 'dropdown-item dropdown-toggle';
			menuOption.id = this.utils.actionIds.actionBtnId + this.widgetId;
	        menuOption.setAttribute('data-toggle','dropdown');
            menuOption.setAttribute('style','cursor:pointer');
            $(menuOption).append(this.label);
			actionItem.appendChild(menuOption);
            return actionItem;
		};
		
		_this.getAction = function(){
			return this.action;
		};
        _this.bindAction = function(){	
			let _this = this;
			let actionId = _this.utils.actionIds.actionBtnId + this.widgetId;
			let directionVar = "left:-100%";
			 if(_strUserLocale == 'ar_BH')
			 {
				 directionVar = "right:-100%";
			 }
            let viewOptionItems = '<ul class="dropdown-menu" style="'+directionVar+'">';
            $(_this.metadata.actions.viewOptions.fields).each(function(index, option){
            	let viewOption = '<li><a class="dropdown-item cursor-pointer" id="'+ option.id + '"><img class="pr-3" src="'+ option.imageName +'">'+
            	                 option.label +'<i class="float-right material-icons check-mark d-none pl-2">check</i></a></li>';
            	viewOptionItems+= viewOption;
            })
			viewOptionItems += '</ul>';
		    $('#'+actionId).ready(function(){    
	            $('#groupWidgetContainer_quickLinkContainers .dropdown-menu .dropdown-submenu').append(viewOptionItems);
                $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
				  var $subMenu = $(this).next('.dropdown-menu');
				  $subMenu.toggleClass('show');
				  return false;
                });

			    $('.dropdown').on('hide.bs.dropdown', function(e) {
			      $('.dropdown-submenu .show').removeClass('show');   
                });
                _this.addCheckMark();
			    $(_this.metadata.actions.viewOptions.fields).each(function(index, option){
			      $('#'+ option.id).click(function(){
			    	 option.callbacks.click(option.value);
			      });
			    });
                	
		});
	};
	
    _this.addCheckMark= function(){
       let _this = this;
       if(usrDashboardPref && usrDashboardPref.widgets
		   && usrDashboardPref.widgets[_this.metadata.widgetType]
		   && usrDashboardPref.widgets[_this.metadata.widgetType].maxItemCount) {
    	  		let viewOptionItem = 'actionbtn_viewOption_'+ viewOptionActionUtils.viewOptions[usrDashboardPref.widgets[_this.metadata.widgetType].maxItemCount];
	            $('#' + viewOptionItem + ' i').removeClass('d-none');
	     }
     };
		
	return _this;
	}
