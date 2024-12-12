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
					
					
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_viewScheduleTransferIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_editScheduleTransferIcon"]' : {
							change : me.toggleCheckUncheck
							},
						
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_viewInvoicesIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_editInvoicesIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_authInvoicesIcon"]' : {
							change : me.toggleCheckUncheck
							},
						
						
						
					
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_viewAdvanceIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_editAdvanceIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_authAdvanceIcon"]' : {
							change : me.toggleCheckUncheck
							},
							
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_viewPayDownIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_editPayDownIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_authPayDownIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_viewPartialPayDownIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_editPartialPayDownIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_authPartialPayDownIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_editLoanRepaymentIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'loanGranularPriviligesPopup container panel panel[id="loanGranularPrivHeader"] checkbox[itemId="loanGranularPrivHeader_editAdvanceDepositeIcon"]' : {
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
				if(checkbox.mode === chkMode  && checkbox.disabled == false)	
					checkbox.setValue(selectValue);
			}	
		}	
	},
	toggleCheckUncheck : function( btn, e, eOpts ){
	
		var me = this;
		var btnId = btn.itemId;
		switch(btnId){
					
		case 'loanGranularPrivHeader_viewScheduleTransferIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW_SCHEDULE_TRANSFER_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_editScheduleTransferIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT_SCHEDULE_TRANSFER_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanGranularPrivHeader_viewInvoicesIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW_INVOICES_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_editInvoicesIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT_INVOICES_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
	   case 'loanGranularPrivHeader_authInvoicesIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'APPROVE_INVOICES_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
	
		case 'loanGranularPrivHeader_viewAdvanceIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'ADVANCE';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_editAdvanceIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CREATE_ADVANCE_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanGranularPrivHeader_authAdvanceIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'APPROVE_ADVANCE_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_viewPayDownIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PAYDOWN';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanGranularPrivHeader_editPayDownIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CREATE_PAYDOWN_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_authPayDownIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'APPROVE_PAYDOWN_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanGranularPrivHeader_viewPartialPayDownIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'PARTIAL_PAYDOWN';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanGranularPrivHeader_editPartialPayDownIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CREATE_PARTIAL_PAYDOWN_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_authPartialPayDownIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'APPROVE_PARTIAL_PAYDOWN_FLAG';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'loanGranularPrivHeader_editLoanRepaymentIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'LOAN_REPAYMENT';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'loanGranularPrivHeader_editAdvanceDepositeIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'ADVANCE_DEPOSITE';		
			var items = me.getLoanGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;	
		
		
		
		}	
	}
});