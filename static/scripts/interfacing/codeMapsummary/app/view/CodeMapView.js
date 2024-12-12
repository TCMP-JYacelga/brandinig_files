Ext.define( 'GCP.view.CodeMapView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'codeMapViewType',
	requires :
	[
		'GCP.view.CodeMapFilterView', 'GCP.view.CodeMapGridView'
	],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				cls : 'ux_panel-background ux_largepaddingtb',
				defaults :
				{
					style :
					{
						padding : '0 0 0 4px'
					}
				},
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						text : getLabel( 'lbl.codeMap', 'Code Map Master' ),
						cls : 'page-heading'
					},
					{
						xtype : 'label',
						flex : 25
					}
				]
			},
			{
				xtype : 'label',
				margin : '7 0 3 0',
				hidden: canEditFlag === 'Y' ? true : false
			},			
			{
				xtype : 'codeMapFilterViewType',
				width : '100%',
				margin : '0 0 10 0',
				title : getLabel( 'filterBy', 'Filter By: ' )
					+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'codeMapGridViewType',
				width : '100%',
				margin : '0 0 10 0',
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
