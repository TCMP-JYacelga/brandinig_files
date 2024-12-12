Ext.define('GCP.controller.PositivePayController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.PositivePayPriviligesPopup'],
	refs : [
			{
				ref : 'positivePayHeaderViewIcon',
				selector : 'positivePayPriviligesPopup container panel panel[id="positivePayHeader"] button[itemId="positivePayHeader_viewIcon"]'
			},{
				ref : 'positivePayEditIcon',
				selector : 'positivePayPriviligesPopup container panel panel[id="positivePayHeader"] button[itemId="positivePayHeader_editIcon"]'
			},{
				ref : 'positivePayAuthIcon',
				selector : 'positivePayPriviligesPopup container panel panel[id="positivePayHeader"] button[itemId="positivePayHeader_authIcon"]'
			},{
				ref : 'positivePayHeaderPanel',
				selector : 'positivePayPriviligesPopup container panel panel[id="userPositivePayParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'positivePayPriviligesPopup container panel panel[id="positivePayHeader"] checkbox[itemId="positivePayHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayPriviligesPopup container panel panel[id="positivePayHeader"] checkbox[itemId="positivePayHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'positivePayPriviligesPopup container panel panel[id="positivePayHeader"] checkbox[itemId="positivePayHeader_authIcon"]' : {
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
					
		case 'positivePayHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getPositivePayHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'positivePayHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getPositivePayHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'positivePayHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getPositivePayHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		}	
	}
});