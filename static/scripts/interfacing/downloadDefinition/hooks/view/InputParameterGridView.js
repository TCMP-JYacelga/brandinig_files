/**
 * @class GCP.view.InputParameterGridView
 * @extends Ext.panel.Panel
 * @author Archana
 */
Ext.define( 'GCP.view.InputParameterGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid','Ext.util.Point'
	],
	xtype : 'inputParameterGridView',
	cls : 'xn-panel',
	bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '55%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				collapsible : true,
				//width : '100%',
				cls : 'xn-panel',
				itemId : 'inputParameterDtlView',
				title : getLabel( 'inputParameterList', 'Input Parameters' ),
				items :
				[
				]
			}
		];
		this.callParent( arguments );
	}
} );
