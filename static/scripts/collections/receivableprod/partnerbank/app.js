var objPartnerBankPanelView;
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/collections/receivableprod/partnerbank/app',
	views: ['GCP.view.PartnerBankPanelView', 'GCP.view.AttachPartnerPopupView'],
	requires : ['Ext.ux.gcp.AutoCompleter'],
	controllers : ['GCP.controller.PartnerBankController'],
	launch : function() {
		objPartnerBankPanelView = Ext.create('GCP.view.PartnerBankPanelView', {
			itemId: 'partnerBankPanelInst',
			renderTo: 'partnerBankPanelDiv'
		});
	}
});