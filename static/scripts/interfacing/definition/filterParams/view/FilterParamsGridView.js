/**
 * @class GCP.view.FilterParamsGridView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.FilterParamsGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.FilterParamsGroupActionBarView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	xtype : 'filterParamsGridView',
	cls : 't7-grid',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.FilterParamsGroupActionBarView',
		{
			itemId : 'filterParamsGroupActionBarView_summDtl',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'panel',
				itemId : 'filterParamsDtlView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						//cls: 'ux_border-top',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								itemId : 'actionLbl',
								cls : 'ux_font-size14',
								padding : '5 0 0 10'
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
