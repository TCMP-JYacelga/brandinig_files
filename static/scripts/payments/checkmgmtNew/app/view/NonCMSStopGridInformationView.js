Ext.define('GCP.view.NonCMSStopGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'nonCMSStopGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	padding : '12 0 12 0',
	data : null,
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
			itemId : 'nonCMSSummInfoGridView',
			//bodyCls : 'xn-ribbon-header',
			cls : 'xn-ribbon ux_border-bottom',
			padding : '9 5 8 10',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_expand_summ',
						margin : '3',
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
						text : getLabel('summinformation','Summary Information'),
						cls : 'x-custom-header-font'
					}
					]
		}];
		this.callParent(arguments);
	},

	createSummaryLowerPanelView : function() {
			var me=this;
		var infoArray = this.createSummaryInfoList();
		var summaryLowerPanel = Ext.create('Ext.panel.Panel', {
					cls : 'ux_largepadding',
					layout : 'hbox',
					//align : 'stretch',
					//flex : 2,
					hidden :true,
					itemId : 'infoSummaryLowerPanel',
					items : infoArray
				});
		me.add(summaryLowerPanel);
		me.hideShowPanel();
	},
	createSummaryInfoList : function(jsonData) {
		var infoArray = new Array();
		infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			margin : '0 12 0 0',
			flex : 0.5,
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 250,
					text : getLabel('lblchkinquiry', 'Check Inquiry Request'),
					cls : 'ux_font-size14',
					padding : '0 0 6 0'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					items :
					[
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'chkInqReqAmtId'
							//padding : '0 10 0 0'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'chkInqReqCntId',
							padding : '0 10 0 5'
						}
					]
				}
			]
		} );
		infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			margin : '0 0 0 45',
			flex : 0.5,
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					text : getLabel('lblstopchkreq', 'Stop Pay Request'),
					cls : 'ux_font-size14',
					padding : '0 0 6 0'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					items :
					[
						{
							xtype : 'label',
							itemId : 'stopPayAmtId',
							cls : 'ux_font-size14-normal'
							//padding : '0 10 0 0'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'stopPayCntId',
							padding : '0 10 0 5'
						}
					]
				}
			]
		} );
		infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			margin : '0 115 0 0',
			flex : 0.5,
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					text : getLabel('lblcancelstopchkreq', 'Cancel Stop Request'),
					cls : 'ux_font-size14',
					padding : '0 0 6 54'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					padding : '0 0 0 54',
					items :
					[
						{
							xtype : 'label',
							itemId : 'cancelStopAmtId',
							cls : 'ux_font-size14-normal'
							//padding : '0 10 0 0'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'cancelStopCntId',
							padding : '0 10 0 5'
						}
					]
				}
			]
		} );
		return infoArray;
	},
	setPrefView : function(img) {
		var me = this;
		var infoPanel = me.down('panel[itemId="infoSummaryLowerPanel"]');
	
		if (infoPanelCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			//if(!Ext.isEmpty(infoPanel))	
				//infoPanel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			//if(!Ext.isEmpty(infoPanel))
				//infoPanel.show();
		}
	},
	hideShowPanel : function() {
		var me = this;
		var panel = me.down('panel[itemId="infoSummaryLowerPanel"]');
		if (infoPanelCollapsed && !Ext.isEmpty(panel)) 
			panel.hide();
		else if(!Ext.isEmpty(panel))
			panel.show();
	}

});