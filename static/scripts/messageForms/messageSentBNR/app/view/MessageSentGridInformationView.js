Ext.define('GCP.view.MessageSentGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageSentGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	componentCls : 'gradiant_back',
	cls : 'ux_extralargepaddingtb',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		this.items = [

		{
			xtype : 'panel',
			itemId : 'messageSentHeaderBarGridView',
			cls : 'xn-ribbon ux_border-bottom',
			padding : '10 5 10 10',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_expand_summ',
						margin : '3 0 0 0',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											this.fireEvent('click', c);
										}, c);
							},
							afterrender : function(c){
									me.setPrefView(c);		
							}
						}
					}, {
						xtype : 'label',
						text : getLabel('summinformation','Summary'),
						cls : 'x-custom-header-font',
						padding : '0 0 0 5'
					}]
		}];
		this.callParent(arguments);
	},
	setPrefView : function(img) {
		var me = this;
		var infoPanel = me.down('panel[itemId="infoSummaryLowerPanel"]');
		if (infoPanelCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			if(!Ext.isEmpty(infoPanel))	
				infoPanel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			if(!Ext.isEmpty(infoPanel))
				infoPanel.show();
		}
	},
	createSummaryLowerPanelView : function() {
		var me=this;
	var balanceArray = this.createTypeCodesList();
	var summaryLowerPanel = Ext.create('Ext.panel.Panel', {
				cls : 'ux_largepadding',
				layout : 'hbox',
				itemId : 'infoSummaryLowerPanel',
				items : balanceArray,
				hidden : true
			});
	me.add(summaryLowerPanel);
},
createTypeCodesList : function() {
	var balanceArray = new Array();
	balanceArray.push({
		xtype : 'panel',
		layout : 'vbox',
		//margin : '0 20 0 0',
		flex : 0.34,
		items : [{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width:100,
					cls : 'ux_font-size14',
					text : 'Sent Messages',
					padding : '0 0 6 0'
				}, {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					itemId : 'mailSent',
					padding : '0 0 6 0'
				}]

	});
	balanceArray.push({
		xtype : 'panel',
		layout : 'vbox',
		flex : 0.66,
		margin : '0 20 0 0',
		items : [{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					//width:100,
					cls : 'ux_font-size14',
					text : 'Replied Messages',
					padding : '0 0 6 0'
				}, {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					itemId : 'mailReplied',
					padding : '0 0 0 0'
				}]
	});
	return balanceArray;
}

});