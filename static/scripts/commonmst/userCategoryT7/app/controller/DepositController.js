Ext.define('GCP.controller.DepositController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.DepositPriviligesPopup'],
	refs : [
			{
				ref : 'depositHeaderViewIcon',
				selector : 'depositPriviligesPopup container panel panel[id="depositHeader"] button[itemId="depositHeader_viewIcon"]'
			},{
				ref : 'depositHeaderEditIcon',
				selector : 'depositPriviligesPopup container panel panel[id="depositHeader"] button[itemId="depositHeader_editIcon"]'
			},{
				ref : 'depositHeaderAuthIcon',
				selector : 'depositPriviligesPopup container panel panel[id="depositHeader"] button[itemId="depositHeader_authIcon"]'
			},{
				ref : 'depositHeaderPanel',
				selector : 'depositPriviligesPopup container panel panel[id="userDepositParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'depositPriviligesPopup container panel panel[id="depositHeader"] checkbox[itemId="depositHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'depositPriviligesPopup container panel panel[id="depositHeader"] checkbox[itemId="depositHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'depositPriviligesPopup container panel panel[id="depositHeader"] checkbox[itemId="depositHeader_authIcon"]' : {
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
					
		case 'depositHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getDepositHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'depositHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getDepositHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'depositHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getDepositHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		}	
	}
});