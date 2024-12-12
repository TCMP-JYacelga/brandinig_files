Ext.define('GCP.controller.OthersController',{
	extend : 'Ext.app.Controller',
	requires : [],
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
				ref : 'incomingPanel',
				selector : 'othersPanel container panel panel[id="incomingAchSection"]'
			},{
				ref : 'checksPanel',
				selector : 'othersPanel container panel panel[id="checksSection"]'
			},{
				ref : 'reportPanel',
				selector : 'othersPanel container panel panel[id="reportSchedulingSection"]'
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
						}
						
				});
		
	},
	changeIcon : function(btn){
		if(mode != "VIEW"){
		if(btn.icon.match('icon_uncheckmulti.gif')){
				btn.setIcon("/gcpuscash/static/images/icons/icon_checkmulti.gif");
				return true;
		}
		else{
				btn.setIcon("/gcpuscash/static/images/icons/icon_uncheckmulti.gif");
				return false;
		}
		}
	return false;	
	},
	setcheckboxValues : function(selectValue, items, mode){
			for(var i=0; i<items.length;i++){
				var checkbox = items[i];
				if(checkbox.mode === mode)	
					checkbox.setValue(selectValue);
			}	
	},
	toggleCheckUncheck : function( btn, e, eOpts ){
		var me = this;
		if(mode!= "VIEW"){
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
		}
		}
	}
});