/**
 * @class GCP.view.BankScheduleView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.BankScheduleDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankScheduleDtlView',
	requires :
	[
		'GCP.view.BankScheduleDtlGridView', 'GCP.view.BankScheduleDtlFilterView'
	],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	margin : '0 0 12 0',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'bankScheduleDtlFilterView',
				width : '100%',
				margin : '0 0 12 0',
				title : getLabel('filterBy', 'Filter By: ') + '&nbsp;<span id="imgFilterInfoGridView" class="largepadding icon-information"></span>'
			},{
				xtype : 'bankSchedulePopupGridView',
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
