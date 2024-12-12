Ext.define('GCP.controller.OthersController',{
	extend : 'Ext.app.Controller',
	requires : ['Ext.form.field.Checkbox'],
	views : [ 'GCP.view.OthersView'],
	refs : [
			{
				ref : 'pPayViewIcon',
				selector : 'othersPanel container panel panel[id="pPayHeader"] button[itemId="pPayHeader_viewIcon"]'
			},{
				ref : 'pPayEditIcon',
				selector : 'othersPanel container panel panel[id="pPayHeader"] button[itemId="pPayHeader_editIcon"]'
			},{
				ref : 'pPayAuthIcon',
				selector : 'othersPanel container panel panel[id="pPayHeader"] button[itemId="pPayHeader_authIcon"]'
			},			{
				ref : 'portalViewIcon',
				selector : 'othersPanel container panel panel[id="portal"] button[itemId="portal_viewIcon"]'
			},{
				ref : 'portalEditIcon',
				selector : 'othersPanel container panel panel[id="portal"] button[itemId="portal_editIcon"]'
			},{
				ref : 'portalAuthIcon',
				selector : 'othersPanel container panel panel[id="portal"] button[itemId="portal_authIcon"]'
			},{
				ref : 'incomingViewIcon',
				selector : 'othersPanel container panel panel[id="incomingHeader"] button[itemId="incomingHeader_viewIcon"]'
			},{
				ref : 'incomingEditIcon',
				selector : 'othersPanel container panel panel[id="incomingHeader"] button[itemId="incomingHeader_editIcon"]'
			},{
				ref : 'incomingAuthIcon',
				selector : 'othersPanel container panel panel[id="incomingHeader"] button[itemId="incomingHeader_authIcon"]'
			},{
				ref : 'checksViewIcon',
				selector : 'othersPanel container panel panel[id="checksHeader"] button[itemId="checksHeader_viewIcon"]'
			},{
				ref : 'checksEditIcon',
				selector : 'othersPanel container panel panel[id="checksHeader"] button[itemId="checksHeader_editIcon"]'
			},{
				ref : 'checksAuthIcon',
				selector : 'othersPanel container panel panel[id="checksHeader"] button[itemId="checksHeader_authIcon"]'
			},{
				ref : 'reportViewIcon',
				selector : 'othersPanel container panel panel[id="reportHeader"] button[itemId="reportHeader_viewIcon"]'
			},{
				ref : 'reportEditIcon',
				selector : 'othersPanel container panel panel[id="reportHeader"] button[itemId="reportHeader_editIcon"]'
			},{
				ref : 'reportAuthIcon',
				selector : 'othersPanel container panel panel[id="reportHeader"] button[itemId="reportHeader_authIcon"]'
			},{
				ref : 'othersPanel',
				selector : 'othersPanel container panel'
			},{
				ref : 'pPayPanel',
				selector : 'othersPanel container panel panel[id="positivePaySection"]'
			},{
				ref : 'portalPanel',
				selector : 'othersPanel container panel panel[id="portalSection"]'
			},{
				ref : 'incomingPanel',
				selector : 'othersPanel container panel panel[id="incomingAchSection"]'
			},{
				ref : 'checksPanel',
				selector : 'othersPanel container panel panel[id="checksSection"]'
			},{
				ref : 'reportPanel',
				selector : 'othersPanel container panel panel[id="reportSchedulingSection"]'
			},
			{
				ref : 'loanHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="loanHeader"] button[itemId="loanHeader_viewIcon"]'
			},{
				ref : 'loanHeaderEditIcon',
				selector : 'othersPanel container panel panel[id="loanHeader"] button[itemId="loanHeader_editIcon"]'
			},{
				ref : 'loanHeaderAuthIcon',
				selector : 'othersPanel container panel panel[id="loanHeader"] button[itemId="loanHeader_authIcon"]'
			},{
				ref : 'loanHeaderPanel',
				selector : 'othersPanel container panel panel[id="loanSection"]'
			},
			
			{
				ref : 'investHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="investHeader"] button[itemId="investHeader_viewIcon"]'
			},{
				ref : 'investHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="investHeader"] button[itemId="investHeader_editIcon"]'
			},{
				ref : 'investHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="investHeader"] button[itemId="investHeader_authIcon"]'
			},{
				ref : 'investHeaderPanel',
				selector : 'othersPanel container panel panel[id="investHeader"]'
			},
			
			{
				ref : 'depviewHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="depviewHeader"] button[itemId="depviewHeader_viewIcon"]'
			},{
				ref : 'depviewHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="depviewHeader"] button[itemId="depviewHeader_editIcon"]'
			},{
				ref : 'depviewHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="depviewHeader"] button[itemId="depviewHeader_authIcon"]'
			},{
				ref : 'depviewHeaderPanel',
				selector : 'othersPanel container panel panel[id="depviewHeader"]'
			},
			
			{
				ref : 'incomingWireHeaderViewIcon',
				selector : 'othersPanel container panel panel[id="incomingWireHeader"] button[itemId="dincomingWireHeader_viewIcon"]'
			},{
				ref : 'incomingWireHeaderEditIcon',
				selector : 'othersPanel container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_editIcon"]'
			},{
				ref : 'incomingWireHeaderAuthIcon',
				selector : 'othersPanel container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_authIcon"]'
			},{
				ref : 'incomingWireHeaderPanel',
				selector : 'othersPanel container panel panel[id="incomingWireHeader"]'
			}
			
			],
	init : function() {
		var me = this;
		me.control({
					'othersPanel container panel panel[id="pPayHeader"] button[itemId="pPayHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="pPayHeader"] button[itemId="pPayHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="pPayHeader"] button[itemId="pPayHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},
						'othersPanel container panel panel[id="portal"] button[itemId="portal_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="portal"] button[itemId="portal_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="portal"] button[itemId="portal_authIcon"]' : {
							click : me.toggleCheckUncheck
							},					
					'othersPanel container panel panel[id="incomingHeader"] button[itemId="incomingHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="incomingHeader"] button[itemId="incomingHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="incomingHeader"] button[itemId="incomingHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},	
					'othersPanel container panel panel[id="reportHeader"] button[itemId="reportHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="reportHeader"] button[itemId="reportHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="reportHeader"] button[itemId="reportHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},	
					'othersPanel container panel panel[id="checksHeader"] button[itemId="checksHeader_viewIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="checksHeader"] button[itemId="checksHeader_editIcon"]' : {
						click : me.toggleCheckUncheck
						},
					'othersPanel container panel panel[id="checksHeader"] button[itemId="checksHeader_authIcon"]' : {
						click : me.toggleCheckUncheck
						},

						'othersPanel container panel panel[id="loanHeader"] button[itemId="loanHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="loanHeader"] button[itemId="loanHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="loanHeader"] button[itemId="loanHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
							
						'othersPanel container panel panel[id="investHeader"] button[itemId="investHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="investHeader"] button[itemId="investHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="investHeader"] button[itemId="investHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
							
							
						'othersPanel container panel panel[id="depviewHeader"] button[itemId="depviewHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="depviewHeader"] button[itemId="depviewHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="depviewHeader"] button[itemId="depviewHeader_authIcon"]' : {
							click : me.toggleCheckUncheck
							},
							
						'othersPanel container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_viewIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_editIcon"]' : {
							click : me.toggleCheckUncheck
							},
						'othersPanel container panel panel[id="incomingWireHeader"] button[itemId="incomingWireHeader_authIcon"]' : {
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
		case 'pPayHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getPPayPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'pPayHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getPPayPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'pPayHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getPPayPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'portal_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getPortalPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'portal_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getPortalPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'portal_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getPortalPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'incomingHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getIncomingPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'incomingHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getIncomingPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'incomingHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getIncomingPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'checksHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getChecksPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'checksHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getChecksPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'checksHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getChecksPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'reportHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getReportPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'reportHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getReportPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'reportHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getReportPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
			
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
		
		case 'investHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getInvestHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'investHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getInvestHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'investHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getInvestHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		case 'depviewHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getDepviewHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'depviewHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getDepviewHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'depviewHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getDepviewHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		
		
		case 'incomingWireHeader_viewIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'VIEW';		
			var items = me.getIncomingWireHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);	
			break;
		case 'incomingWireHeader_editIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'EDIT';		
			var items = me.getIncomingWireHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		case 'incomingWireHeader_authIcon':
			var selectValue = me.changeIcon(btn);
			var mode = 'AUTH';		
			var items = me.getIncomingWireHeaderPanel().query('checkbox');		
			me.setcheckboxValues(selectValue, items, mode);
			break;
		}	
	}
});