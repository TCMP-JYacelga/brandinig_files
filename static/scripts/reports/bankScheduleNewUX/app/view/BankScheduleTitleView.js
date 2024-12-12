/**
 * @class GCP.view.summary.BankScheduleTitleView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.BankScheduleTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankScheduleTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button',
			'Ext.toolbar.Toolbar'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'label',
					text : getLabel('reportsInterfaceScheduling', 'REPORTS-INTERFACE SCHEDULING'),
					itemId : 'pageTitle',
					cls : 'page-heading',
					padding : '0 0 0 10'
				}]
		me.callParent(arguments);		
	}

});