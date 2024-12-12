Ext.define('GCP.controller.LoanGranularPrivilegeController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.LoanGranularPriviligesPopup'],
	refs : [
			{
				ref : 'loanGranularPrivHeaderPanel',
				selector : 'loanGranularPriviligesPopup container panel panel[id="loanGranPrivParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] button[itemId="loanGranularPrivHeader_advanceIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] button[itemId="loanGranularPrivHeader_payDownIcon"]' : {
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
					
		case 'loanGranularPrivHeader_advanceIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'ADVANCE';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_payDownIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PAYDOWN';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		
		}	
	}
});