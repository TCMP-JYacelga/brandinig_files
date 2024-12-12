/**
 * @class GCP.view.DispBankProdClrLocTitleView
 * @extends Ext.panel.Panel
 * @author Vivek Bhurke
 */
Ext.define('GCP.view.DispBankProdClrLocTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'dispBankProdClrLocTitleView',
	requires : [ 'Ext.form.Label', 'Ext.Img', 'Ext.button.Button' ],
	width : '100%',
	defaults : {
		style : {
			padding : '0 0 0 0px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'label',
			text : getLabel('dbpclMaster', 'Bank Service Setup'),
			itemId : 'pageTitle',
			cls : 'page-heading'
		},{
			xtype : 'label',
			flex : 25
		}];
		this.callParent(arguments);
	}
});
