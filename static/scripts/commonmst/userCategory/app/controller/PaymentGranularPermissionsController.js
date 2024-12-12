Ext.define('GCP.controller.PaymentGranularPermissionsController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.ReversalPayGranularPriviligesPopup','GCP.view.SIGranularPriviligesPopup','GCP.view.PaymentGranularPriviligesPopup','GCP.view.TemplatesGranularPriviligesPopup'],
	refs : [
			{
				ref : 'reversalPayGranularPrivHeaderPanel',
				selector : 'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranPrivParametersSection"]'
			},
			{
				ref : 'siGranularPrivHeaderPanel',
				selector : 'siPayGranularPriviligesPopup container panel panel[id="siGranPrivParametersSection"]'
			},
			{
				ref : 'payGranularPrivHeaderPanel',
				selector : 'paymentGranularPriviligesPopup container panel panel[id="payGranPrivParametersSection"]'
			},
			{
				ref : 'templateGranularPrivHeaderPanel',
				selector : 'templatesGranularPriviligesPopup panel[itemId="templateGranPrivParametersSection"]'
			}
			
			],
	init : function() {
		var me = this;
		me.control({
					
					//reversal pay privileges handling	
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] button[itemId="reversalPayGranularPrivHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] button[itemId="reversalPayGranularPrivHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] button[itemId="reversalPayGranularPrivHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] button[itemId="reversalPayGranularPrivHeader_quickApproveIcon"]' : {
							click : me.toggleCheckUncheck
							},
						//SI privileges handling	
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] button[itemId="siGranularPrivHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] button[itemId="siGranularPrivHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] button[itemId="siGranularPrivHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] button[itemId="siGranularPrivHeader_quickApproveIcon"]' : {
							click : me.toggleCheckUncheck
							}	
							,
						//PAYMENT CENTER privileges handling	
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] button[itemId="payGranularPrivHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] button[itemId="payGranularPrivHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] button[itemId="payGranularPrivHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] button[itemId="payGranularPrivHeader_quickApproveIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] button[itemId="payGranularPrivHeader_recallIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] button[itemId="payGranularPrivHeader_cancelIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] button[itemId="payGranularPrivHeader_cancelApproveIcon"]' : {
							click : me.toggleCheckUncheck
							},
						//templates handling
						
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_quickApproveIcon"]' : {
							click : me.toggleCheckUncheck
							},
							

					'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_srviewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_sreditIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_srauthIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_srquickApproveIcon"]' : {
							click : me.toggleCheckUncheck
							},

				'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_nrviewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_nreditIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_nrauthIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] button[itemId="templateGranularPrivHeader_nrquickApproveIcon"]' : {
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
					
		case 'reversalPayGranularPrivHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getReversalPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'reversalPayGranularPrivHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getReversalPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'reversalPayGranularPrivHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getReversalPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'reversalPayGranularPrivHeader_quickApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'QUICKAPPROVE';		
			var items = me.getReversalPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
			
		//SI privileges handling
		
	  case 'siGranularPrivHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getSiGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'siGranularPrivHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getSiGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'siGranularPrivHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getSiGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'siGranularPrivHeader_quickApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'QUICKAPPROVE';		
			var items = me.getSiGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;	
	//PAYMENT Center privileges handling
		
	  case 'payGranularPrivHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'payGranularPrivHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'payGranularPrivHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'payGranularPrivHeader_quickApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'QUICKAPPROVE';		
			var items = me.getPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'payGranularPrivHeader_recallIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'RECALL';		
			var items = me.getPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'payGranularPrivHeader_cancelIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CANCEL';		
			var items = me.getPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'payGranularPrivHeader_cancelApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'CANCELAPPROVE';		
			var items = me.getPayGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;			

      //templates cases
	  
	         case 'templateGranularPrivHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'templateGranularPrivHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'templateGranularPrivHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'templateGranularPrivHeader_quickApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'QUICKAPPROVE';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;	
			
	
       case 'templateGranularPrivHeader_srviewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'SRVIEW';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'templateGranularPrivHeader_sreditIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'SREDIT';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'templateGranularPrivHeader_srauthIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'SRAUTH';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'templateGranularPrivHeader_srquickApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'SRQUICKAPPROVE';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;	



        case 'templateGranularPrivHeader_nrviewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'NRVIEW';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'templateGranularPrivHeader_nreditIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'NREDIT';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'templateGranularPrivHeader_nrauthIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'NRAUTH';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'templateGranularPrivHeader_nrquickApproveIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'NRQUICKAPPROVE';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;				
			
		
		
		}	
	}
});