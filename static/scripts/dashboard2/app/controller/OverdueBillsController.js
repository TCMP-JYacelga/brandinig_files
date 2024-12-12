Ext.define('Cashweb.controller.OverdueBillsController', {
	extend : 'Ext.app.Controller',
	views : ['Cashweb.view.portlet.OverdueBills'],
	stores : ['OverdueBillsStore'],
	models : ['OverdueBillsModel'],
	mask : null,
	refs : [],
	init : function() {
		var me = this;
		this.control({
				});
	}
});