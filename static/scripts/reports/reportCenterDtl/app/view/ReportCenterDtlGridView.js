Ext.define( 'GCP.view.ReportCenterDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid','GCP.view.ReportCenterDtlGroupActionBarView','Ext.util.Point'
	],
	xtype : 'reportCenterPopupGridView',
	cls : 't7-grid',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.ReportCenterDtlGroupActionBarView',
		{
			itemId : 'reportCenterDtlGroupActionBarView_summDtl',
			height : 40,
			width : '100%',
			margin : '1 0 0 8',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'panel',
				//collapsible : true,
				//collapsed :pageMode == 'view' ? false : true,
				//width : '100%',
				//cls : 'xn-ribbon ux_border-bottom',
				//bodyCls: 'x-portlet ux_no-padding',
				//title : getLabel('scheduleRep', 'Schedule List'),
				itemId : 'reportCenterDtlPopupGridView',
				items :
				[
					{
						xtype : 'container',
						layout : 'vbox',
						items : [
						 actionBar
						 ]

					}
				]
			}
		];
		this.callParent( arguments );
	}
} );
