/**
 * @class GCP.view.AgreementSweepQueryView
 * @extends Ext.panel.Panel
 * @author Sarang Gandhi
 */
Ext.define('GCP.view.AgreementSweepQueryResult', {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementSweepQueryResult',
	requires : [ 'Ext.container.Container',
			'GCP.view.AgreementSweepQueryResultTitleView',
			'GCP.view.AgreementSweepQueryResultGridView' ],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [/* {
			xtype : 'agreementSweepQueryResultTitleView',
			width : '100%',
			margin : '0 0 5 0'
		},  */{
			xtype : 'agreementSweepQueryResultGridView',
			width : '100%',
			margin : '-7px 0px 5px 0px'
		} ];

		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});
