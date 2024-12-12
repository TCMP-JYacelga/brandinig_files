Ext.define('GCP.controller.LoansController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.LoanPriviligesPopup'],
	refs : [
			{
				ref : 'loanHeaderViewIcon',
				selector : 'loanPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_viewIcon"]'
			},{
				ref : 'loanHeaderEditIcon',
				selector : 'loanPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_editIcon"]'
			},{
				ref : 'loanHeaderAuthIcon',
				selector : 'loanPriviligesPopup container panel panel[id="loanHeader"] button[itemId="loanHeader_authIcon"]'
			},{
				ref : 'loanHeaderPanel',
				selector : 'loanPriviligesPopup container panel panel[id="userLoanParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'loanPriviligesPopup container panel panel[id="loanHeader"] checkbox[itemId="loanHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanPriviligesPopup container panel panel[id="loanHeader"] checkbox[itemId="loanHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanPriviligesPopup container panel panel[id="loanHeader"] checkbox[itemId="loanHeader_authIcon"]' : {
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
					
		case 'loanHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getLoanHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getLoanHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getLoanHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		}	
	}
});