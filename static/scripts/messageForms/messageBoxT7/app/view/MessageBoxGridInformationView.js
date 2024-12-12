Ext.define('GCP.view.MessageBoxGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageBoxGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	padding : '12 0 12 0',
	componentCls : 'gradiant_back',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		this.items = [

		{
			xtype : 'panel',
			itemId : 'messageBoxHeaderBarGridView',
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
				hidden : true,
				items : balanceArray
			});
	me.add(summaryLowerPanel);
},
createTypeCodesList : function() {
	var varflex;
	if(entity_type === '0')
	{
		var clientSeekUrl = 'services/userseek/adminMsgCentrClientSeek.json';
		varflex = 0.3;
	}
	else
	{
		var clientSeekUrl = 'services/userseek/custMsgCentrClientSeek.json';
		varflex = 0.48;
	}
	var balanceArray = new Array();
	balanceArray.push({
		xtype : 'panel',
		layout : 'vbox',
		align : 'stretch',
		flex : varflex,
		//flex : 1,
		//margin : '0 20 0 0',
		items : [{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					cls : 'ux_font-size14 ux_padding0060',
					width:120,
					text : getLabel('totalMsg','Total Messages'),
					flex: 1
				}, {
					xtype : 'label',
					cls : 'ux_font-size14-normal',
					itemId : 'totalMsg'
				}]

	});
	balanceArray.push({
		xtype : 'panel',
		layout : 'vbox',
		//margin : '0 20 0 0',
		items : [{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					//width:100,
					cls : 'ux_font-size14',
					text : getLabel('unreadMsg','Unread Messages'),
					padding : '0 0 6 0'
				}, {
					xtype : 'label',
					itemId : 'unreadMsg',
					cls : 'ux_font-size14-normal',
					padding : '0 0 0 0'
				}]
	});
	balanceArray.push({
		xtype : 'panel',
		layout : 'vbox',
		flex : 0.8
	});
	
	return balanceArray;
}


});