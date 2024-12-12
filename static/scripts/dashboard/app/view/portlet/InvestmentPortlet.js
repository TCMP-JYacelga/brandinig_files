Ext.define('Cashweb.view.portlet.InvestmentPortlet', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.investment',
	requires : ['Cashweb.store.AccountStore','Ext.data.JsonStore','Ext.chart.series.Column','Ext.chart.series.Bar','Ext.chart.theme.Base',
				'Ext.chart.series.Series', 'Ext.chart.series.Line',
				'Ext.chart.axis.Numeric', 'Ext.button.Button', 'Ext.tab.Panel', 'Cashweb.view.portlet.InvestmentDataGrid'],
	border : false,
	padding : '0 0 0 5',
	emptyText : null,
	taskRunner: null,
	config : {
		height: 300	
	},
	hideHeaders : true,
	
	initComponent : function() {
	
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		this.tools = [ {
			xtype : 'combobox',
			itemId :  'investment_widget_combo',
			hidden : true,
			queryMode : 'local',
			valueField : 'id',
			emptyText : label_map.selectaccount,
			displayField : 'account',
			editable : false
		}];
	var graphStore = new Cashweb.store.InvestmentGraphStore();
	Ext.apply(this, {
		items : [{
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			items : [{
				flex: 4,
				layout: 'vbox',
				items: [{
					itemId: 'AccountDetail'
				},{
					xtype : 'investmentdatagrid',
					flex : 4,
					collapsible : false
				}]
			}, {
				flex : 7,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					height: 30,
					defaultType: 'button',
					defaults: {
						height: 20,
						action: 'DateToggle',
						enableToggle: true
					},
					items: [{
									text : label_map.purchaseRedeem,
									xtype: 'label',
									height : 30,
									padding: '0 10 0 0',
									cls : 'cashflowopeningbalanceslabel'
									},
					{
						text: label_map.oneday,
						itemId:'1day',
						toggleGroup: 'dates'
					},{
						text: label_map.fiveday,
						itemId: '5day',
						toggleGroup: 'dates'
					},{
						text: label_map.onemonth,
						itemId: '1month',
						pressed: true,
						toggleGroup: 'dates'
					},{
						text: label_map.threemonth,
						itemId: '3month',
						toggleGroup: 'dates'
					},{
						text: label_map.sixmonth,
						itemId: '6month',
						toggleGroup: 'dates'
					},{
						text: label_map.oneyear,
						itemId: '1Year',
						toggleGroup: 'dates'
					},{
						text: label_map.twoyear,
						itemId: '2Year',
						toggleGroup: 'dates'
					}]
				},{
					xtype : 'chart',
					height : 200,
					flex: 5,
					 legend: {
			              position: 'top'  
			            },
					style: {
					    borderColor: 'black',
					    borderStyle: 'solid'
					},

					width: '100%',
					animate : true,
					shadow : false,
					hidden : true,
					store : graphStore,

					axes : [
					{
						type : 'Numeric',
						minimum : 0,
						position : 'left',
						fields : ['purchase','redeem'],
						grid : true,
						label :{
							font: '11px calibri, helvetica, arial, sans-serif'
						}
					}, {
						type : 'Category',
						position : 'bottom',
						fields : ['dates'],
						title : false,	
						label : {
							font: '11px calibri, helvetica, arial, sans-serif',
							scopePt : this,
							renderer: function(value)
							{
								var btn1Yr = this.scopePt.ownerCt.down('button[itemId=1Year]');
								var btn2Yr = this.scopePt.ownerCt.down('button[itemId=2Year]');
								if(!Ext.isEmpty(btn1Yr) && !Ext.isEmpty(btn2Yr))
								{
								if(btn1Yr.pressed || btn2Yr.pressed)
									return Ext.util.Format.date(Ext.Date.parse(value, "m/d/Y H:i:s"),serverdateFormat);
								else
									return Ext.util.Format.date(Ext.Date.parse(value, "m/d/Y H:i:s"),'m/d');
									}
									else
									return Ext.util.Format.date(Ext.Date.parse(value, "m/d/Y H:i:s"),serverdateFormat);		
							}
						}
						   
					}],
					series : [{
								type : 'column',
								fill : true,
								showMarkers : false,
								title : [' Purchase','Redeem' ],
								axis : 'bottom',
								yField : ['purchase','redeem'],
								xField : 'dates',
								renderer: function(sprite, record, attr, index, store) {                       
									var vx = attr.x + attr.width - 8;
									if(index%2!=0){
										vx = attr.x;
									}
									return Ext.apply(attr, {
										width:8,x:vx
									});

								}
							}]
				}]
			}]
		}]
	});
		
		this.callParent(arguments);
	}
	
});
