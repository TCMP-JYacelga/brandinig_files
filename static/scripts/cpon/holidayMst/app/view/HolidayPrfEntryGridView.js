Ext.define('GCP.view.HolidayPrfEntryGridView', {
	extend : 'Ext.panel.Panel',
	xtype : 'holidayPrfEntryGridView',
	requires : ['Ext.ux.gcp.SmartGrid', 'GCP.view.PrfMstDtlsActionBarView'],
	autoHeight : true,
	width : '100%',
	title : getLabel('holidayList', 'Holiday List'),
	componentCls : 'gradiant_back',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	cls : 'xn-ribbon ux_border-bottom',
	collapsible : true,
	
	initComponent : function() {
		var me = this;		
		var actionBar = Ext.create('GCP.view.PrfMstDtlsActionBarView', {
			itemId : 'dtlsActionBar',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		});
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["YEAR"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/holidayProfileDetails/fetchDateList.json?$viewState='+mstProfileId,
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json'
						}
					}
				});

		me.tools=[{
			xtype : 'container',
			itemId : 'holidayDateFilterContainer',
			cls:'paymentqueuespacer',
			layout : {
				type : 'hbox'
			},
			items : [
			{
				xtype:"combo",
				editable:false,
				displayField : 'YEAR',
				valueField : 'YEAR',
				store : objStore,
				itemId:'yearFilter',
				fieldCls : 'xn-form-field inline_block',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'requestState',
				value:getLabel('selectYear','Select Year')
			}]
			
		}]
		me.items = [{
			xtype : 'panel',
			itemId : 'prfMstDtlView',
				items : [{
					xtype : 'container',
					layout : 'hbox',
					cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
					items : [{
						xtype : 'label',
						text : getLabel('actions', 'Actions :'),
						cls : 'font_bold ux-ActionLabel ux_font-size14',
						padding : '5 0 0 3'
					}, actionBar, {
						xtype : 'label',
						text : '',
						flex : 1
					}]		
			}]
		}];
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	}
});