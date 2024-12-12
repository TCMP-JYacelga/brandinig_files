Ext.define( 'GCP.view.BandInfoGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.BandInfoGroupActionBarView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	xtype : 'bandInfoGridView',
	cls : 'xn-ribbon',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.BandInfoGroupActionBarView',
		{
			itemId : 'bandInfoGroupActionBarView_summDtl',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				itemId : 'bandInfoDtlView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
							{
								xtype : 'label',
								itemId : 'actionLbl',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'font_bold',
								padding : '5 0 0 3'
							}, actionBar,
							{
								xtype : 'label',
								text : '',
								flex : 1
							}
						]
					}
				]
			}
		];
		this.callParent( arguments );
	}
} );
