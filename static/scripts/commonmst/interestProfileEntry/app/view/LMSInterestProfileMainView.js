/**
 * @class GCP.view.LMSInterestProfileMainView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.LMSInterestProfileMainView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsInterestProfileMainViewType',
	requires :
	[
		'GCP.view.LMSInterestProfileEntryView',
		'GCP.view.LMSInterestProfileEntryDetailGridView',
		'GCP.view.LMSInterestProfileEntryViewReadOnly'
	],
	width : '100%',
	autoHeight : true,
	cls: 'ux_panel-background',
	initComponent : function()
	{
		var me = this;
		var obj1  = me.createToolBar();
		var obj2 = me.createEntryViewtype();
		var obj21 = me.createDtlToolBar();
		var obj3 = me.createEntryDetailGrid();
		var obj4  = me.createToolBar();
		me.items =
		[obj1,obj2,obj21,obj3,obj4
			/*{
				xtype : 'lmsInterestProfileEntryToolBarViewType',
				width : '100%'				
				//margin : '0 0 5 0'
			},
			{
				xtype : 'lmsInterestProfileEntryViewType',
				width : '100%'
				//margin : '0 0 5 0'
			},
			{
				xtype : 'lmsInterestProfileEntryDtlToolBarViewType',
				width : '100%'
				//margin : '0 0 5 0'
			},
			{
				xtype : 'lmsInterestProfileEntryDetailGridViewType',
				width : '100%',
				margin : '12 0 12 0'
			},
			{
				xtype : 'lmsInterestProfileEntryToolBarViewType',
				width : '100%'
			}*/
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	},
	createToolBar : function(){
		var me = this;
		var obj1;
		obj1 = Ext.create('GCP.view.LMSInterestProfileEntryToolBarView', {
			width : '100%'
		});
		return obj1;
	},
	createDtlToolBar : function(){
		var me = this;
		var obj1;
		obj1 = Ext.create('GCP.view.LMSInterestProfileEntryDtlToolBarView', {
			width : '100%'
		});
		return obj1;
	},
	createEntryViewtype : function(){
		var me = this;
		var obj2;
		if(!Ext.isEmpty(pageMode) && pageMode == 'edit'){
			obj2 = Ext.create('GCP.view.LMSInterestProfileEntryView', {
				width : '100%'
			});
		}
		else if(!Ext.isEmpty(pageMode) && pageMode == 'view'){
			obj2 = Ext.create('GCP.view.LMSInterestProfileEntryViewReadOnly', {
				width : '100%'
			});
		}
		return obj2;
	},
	createEntryDetailGrid : function(){
		var me = this;
		var obj3;
		obj3 = Ext.create('GCP.view.LMSInterestProfileEntryDetailGridView', {
			width : '100%'
		});
		return obj3;
	}
	
} );
