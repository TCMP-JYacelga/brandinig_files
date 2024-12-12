/**
 * @class GCP.view.ReportCenterView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.ReportCenterDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterDtlView',
	requires :
	[
		'GCP.view.ReportCenterDtlGridView','Ext.ux.gcp.SmartGridActionBar'
	],
	width : '100%',
	autoHeight : true,
	margin: '12 0 12 0',
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'reportCenterPopupGridView',
				width : '100%',
				parent : me
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
