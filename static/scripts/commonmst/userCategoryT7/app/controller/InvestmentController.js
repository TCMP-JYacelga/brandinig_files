Ext.define('GCP.controller.InvestmentController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.InvestmentPriviligesPopup'],
	refs : [
			{
				ref : 'investmentHeaderViewIcon',
				selector : 'investmentPriviligesPopup container panel panel[id="investmentHeader"] button[itemId="investmentHeader_viewIcon"]'
			},{
				ref : 'investmentHeaderEditIcon',
				selector : 'investmentPriviligesPopup container panel panel[id="investmentHeader"] button[itemId="investmentHeader_editIcon"]'
			},{
				ref : 'investmentHeaderAuthIcon',
				selector : 'investmentPriviligesPopup container panel panel[id="investmentHeader"] button[itemId="investmentHeader_authIcon"]'
			},{
				ref : 'investmentHeaderPanel',
				selector : 'investmentPriviligesPopup container panel panel[id="userInvestmentParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						'investmentPriviligesPopup container panel panel[id="investmentHeader"] button[itemId="investmentHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'investmentPriviligesPopup container panel panel[id="investmentHeader"] button[itemId="investmentHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'investmentPriviligesPopup container panel panel[id="investmentHeader"] button[itemId="investmentHeader_authIcon"]' : {
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
					
		case 'investmentHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getInvestmentHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'investmentHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getInvestmentHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'investmentHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getInvestmentHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		}	
	}
});