Ext.define('GCP.view.VerifySubmitHookDetailsView', {
	extend : 'Ext.panel.Panel',
	xtype : 'verifySubmitHookDetailsView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label'],
	width : '100%',
	componentCls : 'ux_panel-background',
	padding : '12 0 0 0',
	data : null,
	cls : 'xn-ribbon',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			itemId : 'verifySubmitHookDetailsBarView',
			cls : 'xn-ribbon ux_header-pad ux_panel-transparent-background',
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
						text : getLabel('hookDetails','Hook Details'),
						cls : 'x-custom-header-font',
						margin : '0 0 0 20'
					}]
		}];
		this.callParent(arguments);
	},

	createSummaryLowerPanelView : function(jsonData) {
		var me=this;
		var infoArray = this.createSummaryInfoList(jsonData);
		var summaryLowerPanel = Ext.create('Ext.panel.Panel', {
					cls : ' ux_border-top ux_largepadding ux_panel-transparent-background',
					layout : 'hbox',
					itemId : 'infoSummaryLowerPanel3',
					items : infoArray
				});
		me.add(summaryLowerPanel);
	},
	createSummaryInfoList : function() {
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
						text : getLabel('preProcessingHook', 'Pre Processing Hook'),
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
						cls : 'ux_font-size14-normal',
						text : getLabel('postProcessingHook', 'Post Processing Hook'),
						style: 'font-weight:bold;'
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
						cls : 'ux_font-size14-normal',
						text : getLabel('postUpdationHook', 'Post Updation Hook'),
						style: 'font-weight:bold;'
					}, {
						xtype : 'label',
						itemId : 'postUpdationId',
						cls : 'ux_font-size14-normal'
					}]

		});
		return balanceArray;
	}

});