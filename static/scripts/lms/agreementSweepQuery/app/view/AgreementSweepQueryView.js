/**
 * @class GCP.view.AgreementSweepQueryView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.AgreementSweepQueryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementSweepQueryView',
	requires : [ 'Ext.container.Container',
			'GCP.view.AgreementSweepQueryTitleView',
			'GCP.view.AgreementSweepQueryFilterView',
			'GCP.view.AgreementSweepQueryGridView' ],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [
				{
					xtype : 'agreementSweepQueryGridView',
					width : '100%'
				}];
//		me.items = [/* {
//			xtype : 'agreementSweepQueryTitleView',
//			width : '100%',
//		//	margin : '0 0 5 0'
//		},*/ {
//			xtype : 'agreementSweepQueryFilterView',
//			//width : '100%',
//		//	margin : '0 0 5 0',
//			title : getLabel('agreementfilter', 'Filter By')
//		}, {
//			xtype : 'agreementSweepQueryGridView',
//			//width : '100%',
//			//margin : '-7px 0px 5px 0px',
//			cls : 'ft-margin-large-t ft-grid-header',
//		} ];
		
		me.on('resize', function() {
			me.doLayout();
		});
		me.callParent(arguments);
	}
});
