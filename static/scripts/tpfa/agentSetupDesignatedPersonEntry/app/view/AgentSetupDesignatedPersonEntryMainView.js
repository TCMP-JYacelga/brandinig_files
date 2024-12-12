/**
 * @class AgentSetupDesignatedPersonEntryMainView
 * @extends Ext.panel.Panel
 * @author Mayank Viramgama
 */
Ext.define( 'GCP.view.AgentSetupDesignatedPersonEntryMainView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agentSetupDesignatedPersonEntryMainViewType',
	requires :
	[
		'GCP.view.AgentSetupDesignatedPersonEntryView',
		'GCP.view.AgentSetupDesignatedPersonEntryDetailGridView',
		'GCP.view.AgentSetupDesignatedPersonEntryViewReadOnly'
	],
	width : '100%',
	autoHeight : true,
	cls: 'ux_panel-background',
	initComponent : function()
	{
		var me = this;
		//var obj1  = me.createToolBar();
	//	var obj2 = me.createEntryViewtype();
		var obj21 = me.createDtlToolBar();
		var obj3 = me.createEntryDetailGrid();
		me.items =
		[ obj21,obj3	];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	},
	createDtlToolBar : function(){
		var me = this;
		var obj1;
		obj1 = Ext.create('GCP.view.AgentSetupDesignatedPersonEntryDtlToolBarView', {
			width : '100%'
		});
		return obj1;
	},
	createEntryDetailGrid : function(){
		var me = this;
		var obj3;
		obj3 = Ext.create('GCP.view.AgentSetupDesignatedPersonEntryDetailGridView', {
			width : '100%'
		});
		return obj3;
	}
	
} );
