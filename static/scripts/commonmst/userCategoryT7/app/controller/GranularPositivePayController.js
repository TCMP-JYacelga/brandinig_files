Ext.define('GCP.controller.GranularPositivePayController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.PositivePayGranularPriviligesPopup'],
	refs : [
			{
				ref : 'positivePayGranularPrivHeaderPanel',
				selector : 'positivePayGranularPriviligesPopup container panel panel[id="userGranPrivParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_viewExceptionIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_createDecisionIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_ApproveIssueIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_viewCheckImageIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_viewPassthruIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_createPassthruIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayGranularPriviligesPopup container panel panel[id="ppGranularPrivHeader"] checkbox[itemId="ppGranularPrivHeader_approvePassthruIcon"]' : {
							change : me.toggleCheckUncheck
							}
						
				});
		
	},
	changeIcon : function(btn){
		if(mode != "VIEW"){
		if(btn.checked == true){
				return true;
			}
		else{
			return false;
		}
		if(btn.icon.match('icon_uncheckmulti.gif')){
				btn.setIcon("./static/images/icons/icon_checkmulti.gif");
				return true;
		}
		else{
				btn.setIcon("./static/images/icons/icon_uncheckmulti.gif");
				return false;
		}}
	},
	setcheckboxValues : function(selectValue, items, chkMode){
		if(mode != "VIEW"){
			for(var i=0; i<items.length;i++){
				var checkbox = items[i];
				if(checkbox.mode === chkMode)	
					checkbox.setValue(selectValue);
			}	
		}	
	},
	toggleCheckUncheck : function( btn, e, eOpts ){
	
		var me = this;
		var btnId = btn.itemId;
		switch(btnId){
					
		case 'ppGranularPrivHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'ppGranularPrivHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'ppGranularPrivHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'ppGranularPrivHeader_viewExceptionIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEWEXCEPTION';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'ppGranularPrivHeader_createDecisionIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CREATEDECISION';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'ppGranularPrivHeader_ApproveIssueIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'APPROVEDECISION';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
        case 'ppGranularPrivHeader_viewCheckImageIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEWCHECKIMAGE';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;

		case 'ppGranularPrivHeader_viewPassthruIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PP_VIEW_PASSTHRU';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'ppGranularPrivHeader_createPassthruIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PP_EDIT_PASSTHRU';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'ppGranularPrivHeader_approvePassthruIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PP_APPROVE_PASSTHRU';		
			var items = me.getPositivePayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;	
			
		
		}	
	}
});