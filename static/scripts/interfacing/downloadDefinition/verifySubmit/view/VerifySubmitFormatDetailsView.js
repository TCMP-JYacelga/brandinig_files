Ext.define('GCP.view.VerifySubmitFormatDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'verifySubmitFormatDetailsView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label'],
	width : '100%',
	componentCls : 'ux_panel-background',
	//padding : '12 0 0 0',
	data : null,
	cls : 'xn-ribbon ',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			itemId : 'verifySubmitFormatDetailsBarView',
			cls : 'xn-ribbon ux_header-pad ux_panel-transparent-background',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'container',
						itemId : 'showHideFormatDetailsView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3 0',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											this.fireEvent('click', c);
										}, c);
							}
						}
					}, {
						xtype : 'label',
						text : getLabel('formatDetails','Format Details'),
						cls : 'x-custom-header-font',
							margin : '0 0 0 20'
					}]
		}];
		this.callParent(arguments);
	},

	createSummaryLowerPanelView : function(jsonData) {
		var me=this;
		var infoArray1 = this.createSummaryInfoList1(jsonData);
		var infoArray2 = this.createSummaryInfoList2(jsonData);
		var summaryLowerPanel1 = Ext.create('Ext.panel.Panel', {
					cls : 'ux_largepaddinglr ux_largepadding-top ux_border-top ux_panel-transparent-background',
					layout : 'hbox',
					itemId : 'infoSummaryLowerPanel1',
					items : infoArray1
				});
		var summaryLowerPanel2 = Ext.create('Ext.panel.Panel', {
			cls : 'ux_largepadding-bottom ux_largepaddinglr ux_panel-transparent-background',
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel11',
			items : infoArray2
		});
		me.add(summaryLowerPanel1);
		me.add(summaryLowerPanel2);
	},
	createSummaryInfoList1 : function() {
		var balanceArray = new Array();
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			cls : 'ux_line-height24',
			items : [{
						xtype : 'label',
						cls : 'ux_font-size14-normal',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						text : 'Interface Name',
						style: 'font-weight:bold;'
					}, {
						xtype : 'label',
						cls : 'ux_font-size14-normal',
						itemId : 'interfaceName'
					}]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			cls : 'ux_line-height24',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						text : 'Parent Interface',
						style: 'font-weight:bold;',
						cls : 'ux_font-size14-normal'
					}, {
						xtype : 'label',
						itemId : 'parentInterfaceName',
						cls : 'ux_font-size14-normal'
					}]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			cls : 'ux_line-height24',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						text : 'Model',
						style: 'font-weight:bold;',
						cls : 'ux_font-size14-normal'
					}, {
						xtype : 'label',
						itemId : 'modelId',
						cls : 'ux_font-size14-normal'
					}]

		});
		return balanceArray;
	},
	createSummaryInfoList2 : function() {
		var balanceArray = new Array();
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			cls : 'ux_line-height24',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						text : 'Medium',
						style: 'font-weight:bold;',
						cls : 'ux_font-size14-normal'
					}, {
						xtype : 'label',
						itemId : 'datastoreId',
						cls : 'ux_font-size14-normal'
					}]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			cls : 'ux_line-height24',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						text : 'Format',
						style: 'font-weight:bold;',
						cls : 'ux_font-size14-normal'
					}, {
						xtype : 'label',
						itemId : 'formatId',
						cls : 'ux_font-size14-normal'
					}]

		});
	  return balanceArray;
	}

});