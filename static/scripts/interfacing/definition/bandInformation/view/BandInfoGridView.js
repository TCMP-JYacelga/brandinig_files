Ext.define( 'GCP.view.BandInfoGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.BandInfoGroupActionBarView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	componentCls : 'gradiant-back',
	xtype : 'bandInfoGridView',
	cls : 't7-grid',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.BandInfoGroupActionBarView',
		{
			itemId : 'bandInfoGroupActionBarView_summDtl',
			//height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				cls : 'ux_largepadding ux_panel-transparent-background',
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
								padding : '4 0 0 0',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'ux_font-size14'
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
