Ext.define('GCP.view.VerifySubmitHookDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'verifySubmitHookDetailsView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label'],
	width : '100%',
	componentCls : 'ux_panel-background',
	padding : '12 0 0 0',
	data : null,
	cls : 'xn-ribbon ',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			itemId : 'verifySubmitHookDetailsBarView',
			cls : 'xn-ribbon ux_header-pad ux_panel-transparent-background ',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'container',
						itemId : 'showHideHookDetailsView',
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
						text : getLabel('hookDetails','Other Information Details'),
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
		var infoArray3 = this.createSummaryInfoList3(jsonData);
		var infoArray4 = this.createSummaryInfoList4(jsonData);
		
		var summaryLowerPanel1 = Ext.create('Ext.panel.Panel', {
			cls : 'ux_largepaddinglr ux_largepadding-top ux_border-top ux_panel-transparent-background',
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel31',
			items : infoArray1
		});
		var summaryLowerPanel2 = Ext.create('Ext.panel.Panel', {
					cls : 'ux_largepaddinglr ux_largepadding-bottom ux_panel-transparent-background',
					layout : 'hbox',
					itemId : 'infoSummaryLowerPanel32',
					items : infoArray2
				});
		var summaryLowerPanel3 = Ext.create('Ext.panel.Panel', {
			cls : 'ux_largepaddinglr ux_largepadding-bottom ux_panel-transparent-background',
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel3',
			items : infoArray3
		});
		var summaryLowerPanel4 = Ext.create('Ext.panel.Panel', {
			cls : 'ux_largepadding-bottom ux_largepaddinglr ux_panel-transparent-background',
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel33',
			items : infoArray4
		});
		me.add(summaryLowerPanel1);
		me.add(summaryLowerPanel2);
		me.add(summaryLowerPanel3);
		me.add(summaryLowerPanel4);
	},
	createSummaryInfoList1 : function() {
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
						cls : 'ux_font-size14-normal',
						text : 'Upload Condition',
						style: 'font-weight:bold;',
						padding : '0 0 5 0'
					}, {
						xtype : 'label',
						itemId : 'downloadConditionId',
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
						cls : 'ux_font-size14-normal',
						text : 'Routine Name',
						style: 'font-weight:bold;'
					}, {
						xtype : 'label',
						itemId : 'generationRoutineId',
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
						cls : 'ux_font-size14-normal',
						text : 'Empty File Routine Name',
						style: 'font-weight:bold;'
					}, {
						xtype : 'label',
						itemId : 'emptyFileRoutineId',
						cls : 'ux_font-size14-normal'
					}]

		});
		
		return balanceArray;
	},
	createSummaryInfoList3 : function() {
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
						cls : 'ux_font-size14-normal',
						text : 'Pre Processing Hook',
						style: 'font-weight:bold;'
					}, {
						xtype : 'label',
						itemId : 'preProcessId',
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
						text : 'Post Processing Hook',
						style: 'font-weight:bold;',
						cls : 'ux_font-size14-normal'
					}, {
						xtype : 'label',
						itemId : 'postProcessId',
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
						text : 'Reverse Update Hook',
						style: 'font-weight:bold;',
						cls : 'ux_font-size14-normal'
					}, {
						xtype : 'label',
						itemId : 'postUpdationId',
						cls : 'ux_font-size14-normal'
					}]

		});
		return balanceArray;
	},
	createSummaryInfoList4 : function() {
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
						text : 'File Split Fields',
						style: 'font-weight:bold;',
						cls : 'ux_font-size14-normal'
					}, {
						xtype : 'label',
						itemId : 'fileSplitFieldsId',
						cls : 'ux_font-size14-normal'
					}]

		});
		return balanceArray;
	}

});