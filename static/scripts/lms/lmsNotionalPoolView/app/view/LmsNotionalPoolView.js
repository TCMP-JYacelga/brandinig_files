/**
 * @class GCP.view.LmsNotionalPoolView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.LmsNotionalPoolView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsNotionalPoolViewType',
	requires :
	[
		'GCP.view.LmsNotionalPoolViewFilterView', 'Ext.ux.gcp.FilterView'
	],
	//width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		var filterViewObj = Ext.create('Ext.ux.gcp.FilterView', {
				itemId : 'treeViewFilterView',
				cfgShowAdvancedFilterLink : false,
				cfgShowFilter : true,
				cfgFilterModel : {
					cfgContentPanelItems : [{
								xtype : 'lmsNotionalPoolViewFilterViewType'
							}],
					cfgContentPanelLayout : {
						type : 'vbox',
						align : 'stretch'
					},
					collapsed : false
				},
				cfgShowFilterInfo : true,
				parent : me
			});	
		me.items =
		[
			/*{
				xtype : 'panel',
				width : '100%',
				baseCls : 'ux_panel-background',
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
						text : getLabel( 'lbl.lmsNotionalPoolView.title', 'Pool View' ),
						cls : 'page-heading'
					},
					{
						xtype : 'label',
						flex : 19
					}
				]
			},*/
			filterViewObj,
			{
				xtype : 'lmsNotionalPoolViewGridViewType',
				cls : 'ft-grid-header',
				bodyCls: 'ft-grid-body',
				margin: '10 0 0 0',
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
