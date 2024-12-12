Ext.define('GCP.view.BroadcastMessageSummaryView', {
		extend : 'Ext.panel.Panel',
		xtype : 'broadcastMessageSummaryView',
		requires : ['Ext.ux.gcp.AutoCompleter'],
		width : '100%',
		componentCls : 'gradiant_back ux_extralargemargin-bottom',
		collapsible : true,
		collapsed : true,
		cls : 'xn-ribbon ux_border-bottom ux_no-margin',
		layout : {
				type : 'vbox',
				align : 'stretch'
		},
		initComponent : function() {
				
				this.items = [{
					xtype : 'panel',
					layout : 'column',
					width : '100%',
					items : [{
							xtype : 'panel',
							layout : 'column',
							columnWidth : 0.56,
							itemId : 'specificFilter',
							items :[]
						}]
				}];
				this.callParent(arguments);
		},
			
        createSummaryPanelView : function(jsonData) {
			var me=this;
			var infoArray = this.createSummaryInfoList(jsonData);
			var summaryPanel = Ext.create('Ext.panel.Panel', {
						//padding : '5 0 0 9',
						layout : 'hbox',
						cls : 'ux_largepadding',
						itemId : 'broadcastMsgSummaryPanel',
						items : infoArray
					});
			me.add(summaryPanel);
		},
		
		createSummaryInfoList : function(jsonData) {
			var infoArray = new Array();
			infoArray.push({
				xtype : 'panel',
				layout : 'vbox',
				flex : 0.3,
				items : [{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
						//	width:188,
							height : 25,
							cls : 'frmLabel',
							text : getLabel('urgentBroadcast', 'Urgent Broadcast'),
							padding : '0 0 5 0'
						}, {
								xtype : 'panel',
								layout : 'hbox',
								margin : '0 20 0 0',
								items : [{
											xtype : 'label',
											text : '# '+jsonData[0].urgentCount,
											padding : '0 10 5 0'
										}]
						}]

			});
			infoArray.push({
				xtype : 'panel',
				layout : 'vbox',
				cls : 'ux_normalmargin-left',
				flex : 0.3,
				items : [{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
						//	width:190,
							height : 25,
							cls : 'frmLabel',
							text : getLabel('customerBroadcast', 'Customer Broadcast'),
							padding : '0 0 5 0'
						}, {
								xtype : 'panel',
								layout : 'hbox',
								margin : '0 20 0 0',
								items : [{
											xtype : 'label',
											text : '# '+jsonData[0].customerCount,
											padding : '0 10 5 0'
										}]
						}]

			});
			infoArray.push({
				xtype : 'panel',
				layout : 'vbox',
				cls : 'ux_extralargemargin-left',
				flex : 0.4,
				items : [{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							//width:190,
							height : 25,
							cls : 'frmLabel',
							text : getLabel('bankBroadcast', 'Bank Broadcast'),
							padding : '0 0 5 0'
						}, {
								xtype : 'panel',
								layout : 'hbox',
								margin : '0 20 0 0',
								items : [{
											xtype : 'label',
											text : '# '+jsonData[0].bankCount,
											padding : '0 10 5 0'
										}]
						}]

			});
			return infoArray;
		}
});