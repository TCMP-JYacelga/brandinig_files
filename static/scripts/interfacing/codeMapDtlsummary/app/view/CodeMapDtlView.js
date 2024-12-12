/**
 * @class GCP.view.CodeMapDtlView
 * @extends Ext.panel.Panel
 * @author Nandkishor Deshpande
 */
Ext.define( 'GCP.view.CodeMapDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'codeMapDtlViewType',
	requires :
	[
		'GCP.view.CodeMapDtlGridView'
	],
	config :
	{
		globalGridRef : null
	},
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'codeMapDtlGridViewType',
				margin : '3 0 10 0',
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
