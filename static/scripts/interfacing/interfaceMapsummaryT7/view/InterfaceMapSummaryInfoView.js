Ext.define('GCP.view.InterfaceMapSummaryInfoView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interfaceMapSummaryInfoView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button','Ext.layout.container.VBox','Ext.layout.container.HBox'],
	width : '100%',
	data : null,
	componentCls : 'xn-ribbon-body ux_panel-transparent-background',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			itemId : 'interfaceMapSummaryInfoHeaderBarGridView',
			bodyCls : 'xn-ribbon ux_panel-transparent-background largepadding_tb ux_largepaddinglr ux_font-size14-normal ux_line-height24',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											this.fireEvent('click', c);
										}, c);
							}
						}
					}, {
						xtype : 'label',
						text : getLabel('summInformation','Summary'),
						cls : 'x-custom-header-font'
					}]
		}];
		this.callParent(arguments);
	},

	createSummaryLowerPanelView : function(jsonData) {
		var me=this;
		var infoArray = this.createSummaryInfoList(jsonData);
		var summaryLowerPanel = Ext.create('Ext.panel.Panel', {
					//padding : '5 0 0 9',
					layout : 'hbox',
					cls:'ux_border-top xn-pad-10',
					align : 'stretch',
					flex : 2,
					itemId : 'infoSummaryLowerPanel',
					items : infoArray
				});
		me.add(summaryLowerPanel);
	},
	createSummaryInfoList : function() {
		var balanceArray = new Array();
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			align : 'stretch',
			flex : 2,
			margin : '0 20 0 0',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						height : 15,
						text :  getLabel('stdInterface','Standard Interface'),
						cls : 'ux_font-size14'
					}, {
						xtype : 'label',
						itemId : 'standardId'
					}]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			align : 'stretch',
			flex : 4,
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						height : 15,
						text : getLabel('custInterface','Custom Interface'),
						cls : 'ux_font-size14'
					}, {
						xtype : 'label',
						itemId : 'customId'
					}]

		});
		return balanceArray;
	}

});