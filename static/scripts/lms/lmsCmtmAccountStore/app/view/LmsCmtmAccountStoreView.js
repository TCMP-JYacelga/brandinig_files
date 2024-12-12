/**
 * @class GCP.view.LmsCmtmAccountStoreView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.LmsCmtmAccountStoreView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsCmtmAccountStoreViewType',
	requires :
	[
		'GCP.view.LmsCmtmAccountStoreGridView', 'GCP.view.LmsCmtmAccountStoreFilterView'
	],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				baseCls : 'page-heading ux_panel-background ',
				cls : 'ux_extralargepaddingtb',
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
						text : getLabel( 'lmsCmtmAccountStore.title', 'Cash/Treasury Management Accounts' ),
						cls : 'page-heading'
					},
					{
						xtype : 'label',
						flex : 19
					},
					{
						xtype : 'container',
						layout : 'hbox',
						align : 'rightFloating',
						defaults :
						{
							labelAlign : 'top'
						},
						items :
						[
						]
					}
				]
			},
			{
				xtype : 'lmsCmtmAccountStoreFilterViewType',
				width : '100%',
				//margin : '0 0 10 0',				
				title : getLabel( 'filterBy', 'Filter By: ' ) + '&nbsp;<span id="imgFilterInfoGridView" class="largepadding icon-information"></span>	'

			},
			{
				xtype : 'lmsCmtmAccountStoreGridViewType',
				width : '100%',
				//margin : '0 0 10 0',
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
