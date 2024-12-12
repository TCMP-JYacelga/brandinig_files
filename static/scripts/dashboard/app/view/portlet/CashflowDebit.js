Ext.define('Cashweb.view.portlet.CashflowDebit', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.cashflowdebit',
	requires : ['Cashweb.view.portlet.CashflowDebitDataGrid','Ext.data.JsonStore', 'Ext.chart.theme.Base',
				'Ext.chart.series.Series', 'Ext.chart.series.Line',
				'Ext.chart.axis.Numeric', 'Ext.button.Button', 'Ext.tab.Panel','Ext.chart.Chart','Ext.chart.series.Pie'],
	border : false,
	padding : 10,
	emptyText : null,
	taskRunner: null,
	config : {
		
	},
	hideHeaders : true,
	
	initComponent : function() {
	
		var me = this;
		//me.emptyText = label_map.noDataFound;
		/*me.dockedItems=[{
		    xtype: 'toolbar',
		    dock: 'bottom',
			hidden : true,
		    ui : 'footer',
		    cls : 'ux_panel-transparent-background ux_no-border',
			    items : [

			{
				xtype : 'label',
				itemId : 'creditLabel',
				text : 'Debit',
				cls : 'ux_largepadding-left',
				style : {
					'font-size' : '18px !important',
					'font-weight' : 'bold'
				}
			}, '->', {
				xtype : 'label',
				itemId : 'creditTotalAmt',
				text : '',
				cls : 'ux_largepadding-left button_underline',
				style : {
					'font-size' : '18px !important',
					'font-weight' : 'bold'
				}
			} ]
		}];*/
		
		
	Ext.apply(this, {
		items : [{
				xtype : 'label',
				hidden : true,
				itemId : 'errorLabel',
				text : label_map.noDataFound
			},{
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			itemId : 'cashflowDebitPanel',
			autoHeight : true,
			items : [{
				flex: 5,
				layout: 'vbox',
				items: [{xtype:'label',
						text:'Type Code',
						 style:	{
								'font-size' : '13px',
								'font-weight':'bold'
								},
					   margins: {top:10, left:20, right: 0, bottom:0}
				     },{
					xtype : 'cashflowDebitDataGrid',
					border : false,
					collapsible : false
				}]
			},{
			xtype:'panel',
			itemId:'chartPanel',
			items:[],
			margins: {top:10, left:27, right: 0, bottom:0}
			}]
		}]
	});
		
		me.callParent(arguments);
	},
	calcPosition : function(){
		var me = this;
		console.log("in calcPosition");
	}
	
});
