Ext.define('GCP.controller.IncomingAchController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : ['GCP.view.IncomingAchPriviligesPopup'],
	refs : [
			{
				ref : 'incomingAchHeaderViewIcon',
				selector : 'incomingAchPriviligesPopup container panel panel[itemId="incomingAchHeader"] button[itemId="incomingAchHeader_viewIcon"]'
			},{
				ref : 'incomingAchHeaderEditIcon',
				selector : 'incomingAchPriviligesPopup container panel panel[itemId="incomingAchHeader"] button[itemId="incomingAchHeader_editIcon"]'
			},{
				ref : 'incomingAchHeaderAuthIcon',
				selector : 'incomingAchPriviligesPopup container panel panel[itemId="incomingAchHeader"] button[itemId="incomingAchHeader_authIcon"]'
			},{
				ref : 'incomingAchHeaderPanel',
				selector : 'incomingAchPriviligesPopup container panel panel[itemId="userIncomingAchParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'incomingAchPriviligesPopup container panel panel[itemId="incomingAchHeader"] button[itemId="incomingAchHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'incomingAchPriviligesPopup container panel panel[itemId="incomingAchHeader"] button[itemId="incomingAchHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'incomingAchPriviligesPopup container panel panel[itemId="incomingAchHeader"] button[itemId="incomingAchHeader_authIcon"]' : {
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
					
		case 'incomingAchHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getIncomingAchHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'incomingAchHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getIncomingAchHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'incomingAchHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getIncomingAchHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		}	
	}
});