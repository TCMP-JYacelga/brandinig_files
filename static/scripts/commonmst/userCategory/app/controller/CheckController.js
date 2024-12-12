Ext.define('GCP.controller.CheckController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.CheckPriviligesPopup'],
	refs : [
			{
				ref : 'checkHeaderViewIcon',
				selector : 'checkPriviligesPopup container panel panel[id="checkHeader"] button[itemId="checkHeader_viewIcon"]'
			},{
				ref : 'checkEditIcon',
				selector : 'checkPriviligesPopup container panel panel[id="checkHeader"] button[itemId="checkHeader_editIcon"]'
			},{
				ref : 'checkAuthIcon',
				selector : 'checkPriviligesPopup container panel panel[id="checkHeader"] button[itemId="checkHeader_authIcon"]'
			},{
				ref : 'checkHeaderPanel',
				selector : 'checkPriviligesPopup container panel panel[id="userCheckParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'checkPriviligesPopup container panel panel[id="checkHeader"] button[itemId="checkHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'checkPriviligesPopup container panel panel[id="checkHeader"] button[itemId="checkHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'checkPriviligesPopup container panel panel[id="checkHeader"] button[itemId="checkHeader_authIcon"]' : {
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
					
		case 'checkHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getCheckHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'checkHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getCheckHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'checkHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getCheckHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		}	
	}
});