Ext.define('GCP.view.MsgCenterAlertGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'msgCenterAlertGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	data : null,
	cls: 'xn-ribbon ux_extralargemargin-top',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		this.items = [{
			xtype : 'panel',
			itemId : 'msgCenterAlertInfoHeaderBarGridView',
			cls : 'xn-ribbon ux_border-bottom ux_panel-transparent-background',
			padding : '11 5 9 10',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3 0 0 0',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											this.fireEvent('click', c);
										}, c);
							},
							afterrender : function( c )
							{
								me.setPrefView(c);	
							}
						}
					}, {
						xtype : 'label',
						text : getLabel('summinformation','Summary'),
						cls : 'x-custom-header-font'
					}]
		}];
		this.callParent(arguments);
	},
	setPrefView : function(img) {
		var me = this;
		var panel = me.down('panel[itemId="infoSummaryLowerPanel"]');

		if (infoPanelCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			panel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			panel.show();
		}
	},

	createSummaryLowerPanelView : function(jsonData) {
		var me=this;
		var infoArray = this.createSummaryInfoList(jsonData);
		var summaryLowerPanel = Ext.create('Ext.panel.Panel', {
					cls : 'ux_largepadding ux_panel-transparent-background',
					layout : 'hbox',
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
			flex : 0.37,
			margin : '0 20 0 0',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						text : 'Count',
						cls : 'ux_font-size14',
						padding : '0 0 6 0'
					}, {
						xtype : 'label',
						cls : 'ux_font-size14-normal',
						itemId : 'allCount'
					}]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			flex : 0.8,
			margin : '0 20 0 10',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						cls : 'ux_font-size14',
						text : 'Unread',
						padding : '0 0 6 0'
					}, {
						xtype : 'label',
						itemId : 'allUnread',
						cls : 'ux_font-size14-normal'
					}]

		});
		return balanceArray;
	}

});