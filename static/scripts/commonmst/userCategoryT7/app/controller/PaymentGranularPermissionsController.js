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
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] checkbox[itemId="reversalPayGranularPrivHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] checkbox[itemId="reversalPayGranularPrivHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] checkbox[itemId="reversalPayGranularPrivHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] checkbox[itemId="reversalPayGranularPrivHeader_quickApproveIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'reversalPayGranularPriviligesPopup container panel panel[id="reversalPayGranularPrivHeader"] checkbox[itemId="reversalPayGranularPrivHeader_deleteIcon"]' : {
							change : me.toggleCheckUncheck
							},	
						//SI privileges handling	
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] checkbox[itemId="siGranularPrivHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] checkbox[itemId="siGranularPrivHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] checkbox[itemId="siGranularPrivHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] checkbox[itemId="siGranularPrivHeader_quickApproveIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'siPayGranularPriviligesPopup container panel panel[id="siGranularPrivHeader"] checkbox[itemId="siGranularPrivHeader_deleteIcon"]' : {
							change : me.toggleCheckUncheck
							},	
						//PAYMENT CENTER privileges handling	
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_quickApproveIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_recallIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_cancelIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_cancelApproveIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_deleteIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'paymentGranularPriviligesPopup container panel panel[id="payGranularPrivHeader"] checkbox[itemId="payGranularPrivHeader_importIcon"]' : {
							change : me.toggleCheckUncheck
							},
						//templates handling
						
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_viewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_editIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_deleteIcon"]' : {
							change : me.toggleCheckUncheck
							},	
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_authIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_quickApproveIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_importIcon"]' : {
							change : me.toggleCheckUncheck
							},

					'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_srviewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_sreditIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_srauthIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_srquickApproveIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_srdeleteIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_srimportIcon"]' : {
							change : me.toggleCheckUncheck
							},

						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_nrviewIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_nreditIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_nrdeleteIcon"]' : {
							change : me.toggleCheckUncheck
							},		
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_nrauthIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_nrquickApproveIcon"]' : {
							change : me.toggleCheckUncheck
							},
						'templatesGranularPriviligesPopup container panel panel[id="templateGranularPrivHeader"] checkbox[itemId="templateGranularPrivHeader_nrimportIcon"]' : {
							change : me.toggleCheckUncheck
							}

															
						
				});
		
	},
	changeIcon : function(btn){
		if(mode != "VIEW"){

		if(btn.checked == true){
				var viewHeaderItemId = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_viewIcon]');
				if(!Ext.isEmpty(viewHeaderItemId))
				{
					if(!viewHeaderItemId[0].checked)
						viewHeaderItemId[0].setValue(true);
				}	
				var viewHeaderSIItemId = Ext.ComponentQuery.query('checkbox[itemId=siGranularPrivHeader_viewIcon]');
				if(!Ext.isEmpty(viewHeaderSIItemId))
				{
					if(!viewHeaderSIItemId[0].checked)
						viewHeaderSIItemId[0].setValue(true);
				}
				var viewHeaderTPItemId = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_viewIcon]');
				if(!Ext.isEmpty(viewHeaderTPItemId))
				{
					if(!viewHeaderTPItemId[0].checked)
						viewHeaderTPItemId[0].setValue(true);
				}
				var viewHeaderSRTPItemId = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_srviewIcon]');
				if(!Ext.isEmpty(viewHeaderSRTPItemId))
				{
					if(!viewHeaderSRTPItemId[0].checked && btn.itemId.indexOf('GranularPrivHeader_sr')>-1)
						viewHeaderSRTPItemId[0].setValue(true);
				}
				var viewHeaderNRTPItemId = Ext.ComponentQuery.query('checkbox[itemId=templateGranularPrivHeader_nrviewIcon]');
				if(!Ext.isEmpty(viewHeaderNRTPItemId))
				{
					if(!viewHeaderNRTPItemId[0].checked && btn.itemId.indexOf('GranularPrivHeader_nr')>-1)
						viewHeaderNRTPItemId[0].setValue(true);
				}
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
	case 'reversalPayGranularPrivHeader_deleteIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'DELETE';		
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

		case 'siGranularPrivHeader_deleteIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'DELETE';		
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
		case 'payGranularPrivHeader_importIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'IMPORT';		
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
		case 'payGranularPrivHeader_deleteIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'DELETE';		
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
		case 'templateGranularPrivHeader_deleteIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'DELETE';		
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
			
		case 'templateGranularPrivHeader_importIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'IMPORT';		
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
		case 'templateGranularPrivHeader_srdeleteIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'SRDELETE';		
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

		case 'templateGranularPrivHeader_srimportIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'SRIMPORT';		
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
		case 'templateGranularPrivHeader_nrdeleteIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'NRDELETE';		
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
			
		case 'templateGranularPrivHeader_nrimportIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'NRIMPORT';		
			var items = me.getTemplateGranularPrivHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;	
		
		}	
	}
});