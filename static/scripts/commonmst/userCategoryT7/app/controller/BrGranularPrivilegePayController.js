Ext.define('GCP.controller.BrGranularPrivilegePayController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.BrGranularPriviligesPopup'],
	refs : [
			{
				ref : 'brGranularPrivHeaderPanel',
				selector : 'brGranularPriviligesPopup container panel panel[id="brGranPrivParametersSection"]'
			}],
	init : function() {
		var me = this;
		me.control({
					
						
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_allowTxnIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_txnSearchIcon"]' : {
							change : me.toggleCheckUncheck
							},		
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_intraDaySummaryIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_previousDaySummaryIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_intraDayActivityIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_previousDayActivityIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_prevDayDetailViewImgIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_intraDayDetailViewImgIcon"]' : {
							change : me.toggleCheckUncheck
							},
							'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_cashPositionSummaryIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_cashPositionAccountIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'brGranularPriviligesPopup container panel panel[id="brGranularPrivHeader"] checkbox[itemId="brGranularPrivHeader_cashPositionDetailIcon"]' : {
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
					
		case 'brGranularPrivHeader_allowTxnIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'ALLOWTXN';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
	
        case 'brGranularPrivHeader_txnSearchIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'TXNSEARCH';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;			
		case 'brGranularPrivHeader_intraDaySummaryIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'INTRADAYSUMMARY';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'brGranularPrivHeader_previousDaySummaryIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PREVIOUSDAYSUMMARY';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'brGranularPrivHeader_intraDayActivityIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'INTRADAYACTIVITY';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'brGranularPrivHeader_previousDayActivityIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PREVIOUSDAYACTIVITY';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'brGranularPrivHeader_prevDayDetailViewImgIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PREVDAYDETAILVIEWIMG';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'brGranularPrivHeader_intraDayDetailViewImgIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'INTRADAYDETAILVIEWIMG';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;			
		case 'brGranularPrivHeader_cashPositionSummaryIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CASHPOSITIONSUMMARY';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'brGranularPrivHeader_cashPositionSummaryIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CASHPOSITIONSUMMARY';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;	
		case 'brGranularPrivHeader_cashPositionAccountIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CASHPOSITIONACCOUNT';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;	
		case 'brGranularPrivHeader_cashPositionDetailIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CASHPOSITIONDETAIL';		
			var items = me.getBrGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;	
		}	
	}
});