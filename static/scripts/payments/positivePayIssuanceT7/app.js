var objProfileView = null, prefHandler = null;
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
			appFolder : 'static/scripts/payments/positivePayIssuanceT7/app',
			requires : ['Ext.ux.gcp.GroupView',
					'Ext.ux.gcp.PreferencesHandler',
					'Ext.ux.gcp.vtypes.CustomVTypes',
					'GCP.view.PositivePayIssuanceView',
					'GCP.view.PositivePayIssuanceTitleView',
					'GCP.view.PositivePayIssuanceFilterView',
					'GCP.view.PositivePayIssuanceGroupView',
					'Ext.ux.gcp.GCPPager'],
			controllers : ['GCP.controller.PositivePayIssuanceController'],
			init : function(application) {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
			launch : function() {
				Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
						? 600000
						: parseInt(requestTimeout,10) * 1000 * 60;

				Ext.Ajax.on('requestexception', function(con, resp, op, e) {
							if (resp.status == 403) {
								// window.location='logoutUser.action';
								location.reload();
							}
						});
				objProfileView = Ext.create('GCP.view.PositivePayIssuanceView',
						{
							renderTo : 'summary-T7-content'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
		var filterButton=objProfileView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	