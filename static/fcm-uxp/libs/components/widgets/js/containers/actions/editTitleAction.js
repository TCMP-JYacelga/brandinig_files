const EditTitleActionUtils = {
	actionLabels : {
	   'modalTitle'  : getDashLabel('modifyWidgetTitle','Modify Widget Title'),
	   'widgetTitle' : getDashLabel('widgetTitle','Widget Title'),
	   'widgetDesc'  : getDashLabel('widgetDesc','Widget Description'),	   
	   'cancel'      : getDashLabel('btn.cancel','Cancel'),
	   'update'        : getDashLabel('btn.update','Update')
	},
	
	actionIds : {
	   'actionBtnId'    : 'actionbtn_editTitle_',
	   'modalId'        : 'editTitleModal',
	   'modalBtnUpdate'   : 'editWidgetModal_updateBtn',
	   'modalBtnCancel' : 'editWidgetModal_cancelBtn',
	   'modalFldTitle'  : 'editWidgetModal_title',
	   'modalFldDesc'   : 'editWidgetModal_desc',
	   'groupWidgetContainer' : 'groupWidgetContainer_',
	   
	},
	
	actionClasses : {
		'modalClass' : 'widget-action-edit-modal'
	},

	createActionModal : function(widgetName, widgetDesc){
		let modal, modalDialog, modalContent, modalHeader,modalError, modaltitle, modalBody, modalFooter;
		let modalCancelBtn, modalUpdateBtn;
		let modalTitleText, modalTitleDesc;
        
		modalHeader = document.createElement('div');
		modalHeader.className = 'modal-header';
		modalHeader.innerHTML = '<h5 class="modal-title">'+EditTitleActionUtils.actionLabels.modalTitle+'</h5>';
		
		modalError = document.createElement('div');
		modalError.className = 'modal-error';
		
		modalTitleText = document.createElement('div');
		modalTitleText.className = 'form-group';
		modalTitleText.innerHTML = '<label class="col-form-label required">'+EditTitleActionUtils.actionLabels.widgetTitle+'</label>'
									+'<input type="text" value="'+widgetName+'" class="form-control" id="'+EditTitleActionUtils.actionIds.modalFldTitle+'" maxlength="22" tabindex="1"/>';
									
		modalTitleDesc = document.createElement('div');
		modalTitleDesc.className = 'form-group';
		modalTitleDesc.innerHTML = '<label class="col-form-label required">'+EditTitleActionUtils.actionLabels.widgetDesc+'</label>'
									+'<input type="text" value="'+widgetDesc+'" class="form-control" id="'+EditTitleActionUtils.actionIds.modalFldDesc+'" maxlength="35" tabindex="1"/>';
				
		modalBody = document.createElement('div');
		modalBody.className = 'modal-body';
		modalBody.appendChild(modalTitleText);
		modalBody.appendChild(modalTitleDesc);
		
		modalCancelBtn = document.createElement('button');
		modalCancelBtn.className = 'btn btn-outline-primary';
		modalCancelBtn.id = EditTitleActionUtils.actionIds.modalBtnCancel;
		modalCancelBtn.setAttribute('tabindex','1');
		modalCancelBtn.innerHTML = EditTitleActionUtils.actionLabels.cancel;
		
		modalUpdateBtn = document.createElement('button');
		modalUpdateBtn.className = 'btn btn-raised btn-primary';
		modalUpdateBtn.id = EditTitleActionUtils.actionIds.modalBtnUpdate;
		modalUpdateBtn.setAttribute('tabindex','1');
		modalUpdateBtn.innerHTML = EditTitleActionUtils.actionLabels.update;
		
		modalFooter = document.createElement('div');
		modalFooter.className = 'modal-footer';
		modalFooter.appendChild(modalCancelBtn);
		modalFooter.appendChild(modalUpdateBtn);
		
		modalContent = document.createElement('div');
		modalContent.className = 'modal-content';
		modalContent.appendChild(modalHeader);
		modalContent.appendChild(modalError);
		modalContent.appendChild(modalBody);
		modalContent.appendChild(modalFooter);
		
		modalDialog = document.createElement('div');
		modalDialog.className = 'modal-dialog';
		modalDialog.setAttribute('role','document');
		modalDialog.appendChild(modalContent);
		
		modal = document.createElement('div');
		modal.className = 'modal widget-action-edit-modal';
		modal.id = EditTitleActionUtils.actionIds.modalId;
		modal.setAttribute('role','dialog');
		modal.appendChild(modalDialog);
		
		return modal;
	},
	
	updateActionForm : function(_this){
		let title = $('#'+_this.utils.actionIds.modalFldTitle).val().trim();
		let desc = $('#'+_this.utils.actionIds.modalFldDesc).val().trim();
		let errors = _this.utils.validateActionForm(title, desc);
		if(!errors || errors.length == 0){
			$('#'+_this.utils.actionIds.groupWidgetContainer+_this.widgetId+' .widget-title').text(title);
			$('#'+_this.utils.actionIds.groupWidgetContainer+_this.widgetId+' .widget-title').attr('title',desc);
			if(!usrDashboardPref.widgets.hasOwnProperty(_this.widgetId)){
				usrDashboardPref.widgets[_this.widgetId] = {};
			}
			 
			usrDashboardPref.widgets[_this.widgetId].title = title;
			usrDashboardPref.widgets[_this.widgetId].desc = desc;
			updateDashboardPref();
			
			_this.utils.closeActionForm(_this);
		}
		else
		{
			$('#'+_this.utils.actionIds.modalId+' .modal-error').empty();
			$(errors).each(function(index, error){
				//$('#'+_this.utils.actionIds.modalId+' .modal-error').append('<span>'+error+'</span>');
			});
		}	
	},
	
	closeActionForm : function(_this){
		$('#'+_this.utils.actionIds.modalId).modal('hide');
		$('#'+_this.utils.actionIds.modalId).remove();
	},
	
	validateActionForm : function(title, desc){
		let errorMsg = [];
		let _this = this;
		
		if(!title)
		{
			 errorMsg.push(getDashLabel('filter.err.fldRequired','This field is required.'));
			_this.appendErrorMsg('editWidgetModal_title', getDashLabel('filter.err.fldRequired'));
		}
		else if(title && title.length > 22)
		{
			 errorMsg.push('Widget title should be less than 15 character');
			_this.appendErrorMsg('editWidgetModal_title', getDashLabel('err.widgetNameMaxError'));
		}			
		else if(!title || title.length < 4){
			 errorMsg.push('Allowed minimum length for widget title is 4');
			_this.appendErrorMsg('editWidgetModal_title', getDashLabel('filter.err.filterNameMinError'));
		}
		if(!desc)
		{
			 errorMsg.push(getDashLabel('filter.err.fldRequired','This field is required.'));
			_this.appendErrorMsg('editWidgetModal_desc', getDashLabel('filter.err.fldRequired'));
		}
		else if(desc && desc.length > 35){
		    errorMsg.push('Widget description should be less than 35 character');	
		   _this.appendErrorMsg('editWidgetModal_desc', getDashLabel('err.widgetDescMaxError'));
		}
		else if(!desc || desc.length < 4){
		    errorMsg.push('Allowed minimum length for widget description is 4');	
		   _this.appendErrorMsg('editWidgetModal_desc', getDashLabel('filter.err.filterNameMinError'));
		}
		
		return errorMsg;
	},
	
	appendErrorMsg: function(errorField, errorMsg){
		let parentDiv = $('#'+errorField).parent();
		$(parentDiv).find('#'+errorField+'-error').remove();
		$(parentDiv).append('<label id="'+errorField+'-error" class="error" for="'+errorField+'">'+errorMsg+'</label>');
	}
};

var edit = function() {
	  return editTitleAction();
};

function editTitleAction(){
	    var _this = {};
	   _this.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = EditTitleActionUtils;		
		this.action = '';
		
		this.initialize();
    };
	
    _this.initialize = function(){
		this.action = this.createAction();
		this.bindAction();	
	};
	
	_this.createAction = function(){
		let menuOption = document.createElement('button');
		menuOption.className = 'btn btn-dark pl-2 mr-1 pr-1 pt-1 pb-1 align-top';
		menuOption.id = this.utils.actionIds.actionBtnId + this.widgetId;
        menuOption.setAttribute('href','javascript:void(0);');
		menuOption.innerHTML = this.icon;
		return menuOption;
	};
	
	_this.getAction = function(){
		return this.action;
	};
	
	_this.bindAction = function(){
		let _this = this;
		let actionId = _this.utils.actionIds.actionBtnId + _this.widgetId;
		$('#'+actionId).ready(function(){
			$('#'+actionId).click(function(){
				_this.callback ? _this.callback(_this) : _this.callAction();
			});			
		});
	};
	
	_this.callAction = function(){
		let _this = this;
		let widgetName = $('#'+_this.utils.actionIds.groupWidgetContainer + _this.widgetId +' .widget-title').text();
		let widgetDesc = $('#'+_this.utils.actionIds.groupWidgetContainer + _this.widgetId +' .widget-title').attr('title');
		
		$('body').append(_this.utils.createActionModal(widgetName, widgetDesc));
		$('#'+_this.utils.actionIds.modalId).modal('show');
		$('#editWidgetModal_title').focus();
		$('#'+_this.utils.actionIds.modalBtnCancel).click(function(){
			_this.utils.closeActionForm(_this);
		});		
		
		$('#'+_this.utils.actionIds.modalBtnUpdate).click(function(){
			_this.utils.updateActionForm(_this);		
		});
		
		$('#'+_this.utils.actionIds.modalBtnUpdate).blur(function(){
			$('#editWidgetModal_title').focus();	
		});
		
		
		$('#editWidgetModal_title, #editWidgetModal_desc').blur(function(){
			let value = $(this).val();
			let eleId = $(this).attr('id');
			if(!value)
			{
				_this.utils.appendErrorMsg(eleId, getDashLabel('filter.err.fldRequired'));
			}
			else if(value.length < 4)
			{
				_this.utils.appendErrorMsg(eleId, getDashLabel('filter.err.filterNameMinError'));
			}
			else
			{
				let parentDiv = $(this).parent();
				$(parentDiv).find('#'+eleId+'-error').remove();
			}
		});
		
	};
	return _this;
}
