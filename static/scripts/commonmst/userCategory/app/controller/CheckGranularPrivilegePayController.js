Ext.define('GCP.controller.CheckGranularPrivilegePayController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.CheckGranularPriviligesPopup'],
	refs : [
			{
				ref : 'checkGranularPrivHeaderPanel',
				selector : 'checkGranularPriviligesPopup container panel panel[id="checkGranPrivParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] button[itemId="checkGranularPrivHeader_inquiryIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] button[itemId="checkGranularPrivHeader_stopPayIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] button[itemId="checkGranularPrivHeader_cancelStopPayIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] button[itemId="checkGranularPrivHeader_cancelApproveIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'checkGranularPriviligesPopup container panel panel[id="checkGranularPrivHeader"] button[itemId="checkGranularPrivHeader_stopPayApproveIcon"]' : {
							click : me.toggleCheckUncheck
							}
					
						
				});
		
	},
	changeIcon : function(btn){
		if(mode != "VIEW"){
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
					
		case 'checkGranularPrivHeader_inquiryIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'INQUIRY';		
			var items = me.getCheckGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'checkGranularPrivHeader_stopPayIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'STOPPAY';		
			var items = me.getCheckGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'checkGranularPrivHeader_cancelStopPayIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CANCELSTOPPAY';		
			var items = me.getCheckGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'checkGranularPrivHeader_cancelApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CANCELSTOPPAYAPPROVE';		
			var items = me.getCheckGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'checkGranularPrivHeader_stopPayApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'STOPPAYAPPROVE';		
			var items = me.getCheckGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		}	
	}
});