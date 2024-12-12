Ext.define('GCP.view.ReportCenterGridInformationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterGridInformationView',
	requires : ['Ext.panel.Panel','Ext.Img', 'Ext.form.Label','Ext.button.Button'],
	width : '100%',
	margin : '5 0 0 0',
	componentCls : 'xn-ribbon-body',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		this.items = [

		{
			xtype : 'panel',
			itemId : 'reportCenterSummInfoHeaderBarGridView',			
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
					}, 
					{
						xtype : 'label',
						itemId : 'gridInfoDateLabel',
						text : getLabel('summinformation','Summary Information'),
						cls : 'x-custom-header-font',
						padding : '4 0 0 2'
					}]
		}];
		this.callParent(arguments);
	},

	createSummaryLowerPanelView : function() {
			var me=this;
		var balanceArray = this.createTypeCodesList();
		var summaryLowerPanel = Ext.create('Ext.panel.Panel', {
					padding : '5 0 0 9',
					layout : 'hbox',
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
			margin : '0 30 0 0',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						height : 15,
						text : 'Most Used',
						padding : '0 0 10 0'
					}, {
						xtype : 'label',
						itemId : 'mostUsedId',
						padding : '0 0 10 0'
					}]

		});
		
		balanceArray.push({
			xtype : 'panel',
			layout : 'vbox',
			margin : '0 20 0 0',
			items : [{
						xtype : 'label',
						overflowX : 'hidden',
						overflowY : 'hidden',
						width:200,
						height : 15,
					
						text : 'least Used',
						padding : '0 0 10 0'
					}, {
						xtype : 'label',
						itemId : 'leastUsedId',
						padding : '0 0 10 0'
					}]

		});
		
		return balanceArray;
	}

});