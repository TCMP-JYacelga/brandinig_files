Ext.define('GCP.view.UploadSummaryInfoView', {
	extend : 'Ext.panel.Panel',
	xtype : 'uploadSummaryInfoView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	margin : '5 0 0 0',
	data : null,
	componentCls : 'xn-ribbon-body',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [{
			xtype : 'panel',
			itemId : 'uploadSummaryInfoHeaderBarGridView',
			bodyCls : 'xn-ribbon-header',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3',
						listeners : {
							render : function(c) {
								c.getEl().on('click', function() {
											this.fireEvent('click', c);
										}, c);
							}
						}
					}, {
						xtype : 'label',
						text : getLabel('summinformation','Summary'),
						cls : 'x-custom-header-font',
						padding : '4 0 0 0'
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
						text : 'Standard Interface',
						padding : '0 0 5 0'
					}, {
						xtype : 'label',
						itemId : 'standardId',
						padding : '0 0 5 0'
					}]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			align : 'stretch',
			flex : 2,
			margin : '0 40 0 35',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:300,
						height : 15,
						text : 'Bank Customised Interface'
					}, {
						xtype : 'label',
						itemId : 'bankId'
					}]

		});
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			align : 'stretch',
			flex : 2,
			margin : '0 40 0 20',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:300,
						height : 15,
						text : 'Client Customised Interface'
					}, {
						xtype : 'label',
						itemId : 'clientId'
					}]

		});
		return balanceArray;
	}

});