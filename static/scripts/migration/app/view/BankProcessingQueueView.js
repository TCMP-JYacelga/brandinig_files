/**
 * @class GCP.view.BankProcessingQueueView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.BankProcessingQueueView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankProcessingQueueView',
	requires :
	[
		'GCP.view.MigrationSummaryTitleView', 'GCP.view.BankProcessingQueueFilterView','GCP.view.BankProcessingQueueGridView'
		
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
				xtype : 'migrationSummaryTitleView',
				width : '100%'
			},
			{
				xtype : 'bankProcessingQueueFilterView',
				width : '100%',
				margin : '0 0 10 0',
				title : getLabel( 'filterBy1', 'Migration Summary ' )
					+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'bankProcessingQueueGridView',
				width : '100%',
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
