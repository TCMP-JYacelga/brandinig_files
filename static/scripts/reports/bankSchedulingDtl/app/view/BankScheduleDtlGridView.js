Ext.define( 'GCP.view.BankScheduleDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid','GCP.view.BankScheduleDtlGroupActionBarView','Ext.util.Point'
	],
	xtype : 'bankSchedulePopupGridView',
	cls : 'gradiant_back',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.BankScheduleDtlGroupActionBarView',
		{
			itemId : 'bankScheduleDtlGroupActionBarView_summDtl',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'panel',
				collapsible : true,
				//collapsed :pageMode == 'view' ? false : true,
				collapsed : false,
				width : '100%',
				cls : 'xn-ribbon ux_border-bottom',
				bodyCls: 'x-portlet ux_no-padding',
				title : getLabel('scheduleRep', 'Schedule List'),
				itemId : 'bankScheduleDtlPopupGridView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items : [
								{
									xtype : 'label',
									text : getLabel('actions', 'Action') + ':',
									cls : 'ux_font-size14',
									padding : '5 0 0 10'
								},actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}
				]
			}
		];
		this.callParent( arguments );
	}
} );
