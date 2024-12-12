Ext.define('GCP.view.PositivePayGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	padding : '8 0 12 0',
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
			itemId : 'positivePaySummInfoHeaderBarGridView',
			bodyCls : 'xn-ribbon ux_panel-transparent-background ',
			padding : '9 5 8 10',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'container',
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
						margin: '0 0 0 20',
						padding : '0 0 0 2'
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
					cls : 'ux_largepadding ux_border-bottom',
					layout : 'hbox',
					align : 'stretch',
					flex : 2,
					hidden :true,
					itemId : 'infoSummaryLowerPanel',
					items : balanceArray
				});
		me.add(summaryLowerPanel);
	},
	createTypeCodesList : function() {
		var balanceArray = new Array();
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			align : 'stretch',
			flex : 1,
			margin : '0 20 0 0',
			items :
			[
		         {
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width:200,
					height : 15,
					text : getLabel('pendingDecision', 'Pending Decision'),
					cls : 'ux_font-size14',
					margin : '0 0 6 0'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					items :
					[
						{
							xtype : 'label',
							itemId : 'pendingExceptionTotalItemId',
							cls : 'ux_font-size14-normal',
							padding : '0 5 0 0'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							text : ' ('
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'pendingExceptionCountItemId'  //pendingExceptionId
							//padding : '0 10 5 0'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							text : ')'
						}
					]
				}
			]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			align : 'stretch',
			flex : 1.1,
			margin : '0 20 0 0',
			items : 
				[
				 	{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:100,
						height : 15,
						text : getLabel('actionTaken', 'Action Taken'),
						cls : 'ux_font-size14',
						padding : '0 0 6 21'
					},
					{
						xtype : 'panel',
						layout : 'hbox',
						padding : '5 0 0 21',
						items :
						[
							{
								xtype : 'label',
								itemId : 'pendingAuthTotalItemId',
								cls : 'ux_font-size14-normal',
								padding : '0 5 5 0'
							},
							{
								xtype : 'label',
								cls : 'ux_font-size14-normal',
								text : ' ('
							},
							{
								xtype : 'label',
								itemId : 'pendingAuthCountItemId', //pendingAuthId
								//padding : '0 10 5 0'
								cls : 'ux_font-size14-normal'
							},
							{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							text : ')'
						}
						]
					}
				]

		});
		return balanceArray;
	}

});