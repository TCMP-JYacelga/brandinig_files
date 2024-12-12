/**
 * @class GCP.view.SweepTxnView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.SweepTxnView',
{
	extend : 'Ext.container.Container',
	xtype : 'sweepTxnViewType',
	requires :
	[
		'GCP.view.SweepTxnGridView','GCP.view.SweepTxnFilterView', 'GCP.view.SweepTxnTitleView'
	],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			/*{
				xtype : 'sweepTxnTitleViewType',
				width : '100%'
			},*/
			{
				xtype : 'sweepTxnFilterViewType',
				width : '100%',
				margin : '0 0 5 0',
				title : getLabel( 'filter', 'Filter By ' )
					+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'sweepTxnGridViewType',
				width : '100%',
				margin : '20px 0px 5px 0px',
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
