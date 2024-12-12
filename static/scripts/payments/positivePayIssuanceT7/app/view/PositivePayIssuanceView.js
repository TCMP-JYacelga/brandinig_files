/**
 * @class GCP.view.PositivePayIssuanceView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.PositivePayIssuanceView', {
			extend : 'Ext.panel.Panel',
			xtype : 'positivePayIssuanceView',
			requires : ['GCP.view.PositivePayIssuanceTitleView',
					'GCP.view.PositivePayIssuanceFilterView',
					'GCP.view.PositivePayIssuanceGroupView'],
			autoHeight : true,
			// width : '100%',
			initComponent : function() {
				var me = this;
				me.items = [{
							xtype : 'positivePayIssuanceGroupView',
							width : 'auto',
							margin : '0 0 12 0'
						}];

				me.on('resize', function() {
							me.doLayout();
						});

				me.callParent(arguments);
			}
		});