const columnChooserActionUtils = {
	columnChooserIds : {
	   'columnChooserBtnId'    : 'actionbtn_addRemoveColumn_',
       'allColumnsId'  : 'columnChooser_allColumns_',
       'applyBtnId' :  'columnChooser_btn_apply_'   
	}
}

var columnChooser = function(){
   return columnChooserAction();
 };
 
 function columnChooserAction(){
	 var _this = {};
	  _this.constructor = function(widgetId, label, icon, metadata, callback) {
			this.widgetId = widgetId;
			this.label = label;
			this.icon = icon;
			this.metadata = metadata;
			this.callback = callback;		
			this.action = '';
			this.appliedFilter = undefined;
            this.utils = columnChooserActionUtils;
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
			menuOption.id = this.utils.columnChooserIds.columnChooserBtnId+ this.widgetId;
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
          let widgetId = _this.widgetId;
          let actionId = _this.utils.columnChooserIds.columnChooserBtnId+ this.widgetId;
          _this.createColumnChooserItems();
         $('#'+actionId).ready(function(){
            $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul').remove();
            $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu').append(_this.columnChooserItems);
            $('#' + _this.utils.columnChooserIds.allColumnsId + widgetId).click(function(){
              _this.checkAllColumns();
            });
            $('#' + _this.utils.columnChooserIds.applyBtnId + widgetId).click(function(){
              $('#groupWidgetContainer_'+widgetId+' #widget-action-menu-btn').trigger('click');
              _this.applyChanges();
            });
          $('#'+actionId).click(function(){
            _this.updateColumns();
            $('.column-chooser-menu').click(function(e) {
				e.stopPropagation();
		    });
            if($('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked && $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li').length> $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input:checkbox:checked').length)
                $('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked = false;
            else if ($('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input:checkbox').length == $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input:checkbox:checked').length)
                $('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked = true;

             $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input').click(function(){
              if($('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked && $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li').length> $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input:checkbox:checked').length)
                $('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked = false;
              else if ($('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input:checkbox').length == $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input:checkbox:checked').length)
                $('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked = true;
            });

          }); 
         });  
       };

       _this.createColumnChooserItems = function() {
           let widgetId = _this.widgetId;
           let directionVar = "left: -132%;";
           if(_strUserLocale == 'ar_BH')
			{
        	   directionVar = "right: -157%;";
			}
           let columnItems = '<ul class="dropdown-menu column-chooser-menu" style="'+directionVar+'">';
           columnItems+=  '<form><div class="custom-control custom-checkbox column-field pb-2">'+
                                  '<input type="checkbox" class="custom-control-input" id="'+ _this.utils.columnChooserIds.allColumnsId + widgetId + '" value="ALL">'+
                                  '<label class="custom-control-label pl-2" for="'+ _this.utils.columnChooserIds.allColumnsId + widgetId + '">'+
                                     getDashLabel('columnChooser.allColumns') +
                                  '</label>'+
                                  '</div><div class="columnns-div">';
            $(_this.metadata.fields.columns).each(function(index, column) {
              let isVisible = (column.visible=== undefined )? true : column.visible;
              let checked = ((usrDashboardPref.widgets && usrDashboardPref.widgets[widgetId] && usrDashboardPref.widgets[widgetId].columns && usrDashboardPref.widgets[widgetId].columns.length!==0)?usrDashboardPref.widgets[widgetId].columns.indexOf(column.fieldName)>-1: isVisible)?'checked':'';
              let col=         '<li><div class="custom-control custom-checkbox column-field">'+
                                  '<input type="checkbox" class="custom-control-input" id="colChooser_input_'+ widgetId + index + '" value="'+ column.fieldName + '"' + checked +' name="' + index + '">'+
                                  '<label class="custom-control-label pl-2" for="colChooser_input_' + widgetId + index + '">'+
                                     column.label +
                                  '</label>'+
                                  '</div></li>';
              columnItems+= col;
             });
            columnItems+= '</div></form><a type="button" class="btn btn-raised btn-primary apply-button float-right mt-3 mr-3" id="' + _this.utils.columnChooserIds.applyBtnId + widgetId + '">' + getDashLabel('columnChooser.btn.apply') + '</a>';
            columnItems+= '</ul>';
           _this.columnChooserItems = columnItems;
         };

        _this.updateColumns = function() {
          let widgetId = _this.widgetId;
          let columnItems = '';    
          $(_this.metadata.fields.columns).each(function(index, column) {
        	  let isVisible = (column.visible=== undefined )? true : column.visible;
              let checked = ((usrDashboardPref.widgets && usrDashboardPref.widgets[widgetId] && usrDashboardPref.widgets[widgetId].columns && usrDashboardPref.widgets[widgetId].columns.length!==0)?usrDashboardPref.widgets[widgetId].columns.indexOf(column.fieldName)>-1: isVisible)?'checked':'';
              let col=         '<li><div class="custom-control custom-checkbox column-field">'+
                                  '<input type="checkbox" class="custom-control-input" id="colChooser_input_'+ widgetId + index + '" value="'+ column.fieldName + '"' + checked +' name="' + index + '">'+
                                  '<label class="custom-control-label pl-2" for="colChooser_input_' + widgetId + index + '">'+
                                     column.label +
                                  '</label>'+
                                  '</div></li>';
              columnItems+= col;
          });
          $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu .columnns-div').empty();
          $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu .columnns-div').append(columnItems);
          $('.columnns-div').scrollTop(0);
      };
        
      _this.applyChanges = function() {
    	   let selectedColumns = [];
    	   let widgetId = _this.widgetId;
    	    $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li input:checkbox:checked').each(function(){
    	       selectedColumns.push($(this).val());
    	    });
    	    if(usrDashboardPref.widgets){
    	  		if(!usrDashboardPref.widgets[widgetId]){
    	  			usrDashboardPref.widgets[widgetId] = {
    	  					columns : []
    	  			};
    	  		}else if(!usrDashboardPref.widgets[widgetId].columns){
    	  			usrDashboardPref.widgets[widgetId].columns = [];
    	  		}
    	  	}
    	  	else
    	  	{
    	  		usrDashboardPref = {
    	  			widgets : {
    	  				widgetId : {
    	  					columns : []
    	  				}
    	  			}
    	  		};
    	  	}
    	    usrDashboardPref.widgets[widgetId].columns= selectedColumns;
            updateDashboardPref();
            this.metadata.api.refresh();
            _this.updateColumns();
    	  };
    	_this.checkAllColumns= function() {
         let widgetId = _this.widgetId;
    		  if($('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked) {
    		    $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li').each(function(){
                      if($(this).find('input')[0].value !== 'ALL') {
    		       $(this).find('input')[0].checked = true;                      }
    		    });
    		  }
    		  else if(! $('#' + _this.utils.columnChooserIds.allColumnsId + widgetId)[0].checked) {
    		    $('#groupWidgetContainer_'+widgetId+' .dropdown-menu .dropdown-submenu ul li').each(function(){
    		       $(this).find('input')[0].checked = false;
    		    });
    		  }

    		 };
    	  
   return _this;
	 
}
 