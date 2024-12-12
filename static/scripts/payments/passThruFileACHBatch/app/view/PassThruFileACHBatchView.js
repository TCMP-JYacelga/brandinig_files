/**
 * @class GCP.view.PassThruFileACHBatchView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.PassThruFileACHBatchView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'passThruFileACHBatchViewType',
	requires :
	[
		'GCP.view.PassThruFileACHBatchHeaderGridView','GCP.view.PassThruFileACHBatchDetailGridView', 
		'GCP.view.PassThruFileACHBatchFilterView'
	],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		var screenName ;
		if(screenType == 'FileACHBatch')
		{
			screenName = getLabel('passThruAch', 'Pass Thru - ACH');
		}
		else
		{
			screenName = getLabel('passThruPositivePay', 'Pass Thru - Positive Pay');
		}
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				cls : 'ux_panel-background ux_largepaddingtb',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						text : screenName,
						cls : 'page-heading'
					}
				]
			},
			{
				xtype : 'panel',
				cls : 'ux_panel-background ux_extralargepadding-bottom',
				itemId : 'backId',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'button',
						itemId : 'backBtnId',
						name : 'back',
						text : getLabel( 'back', 'Back' ),
						cls : 'ux_button-background-color ux_button-padding'
					}
				]
			},
			{
				xtype : 'passThruFileACHBatchFilterViewType',
				width : '100%',
				title : getLabel( 'filterBy', 'Filter By: ' )
					+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
			},
			{
				xtype : 'passThruFileACHBatchHeaderGridType',
				width : '100%',
				parent : me
			},
			{
				xtype : 'passThruFileACHBatchDetailGridType',
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
