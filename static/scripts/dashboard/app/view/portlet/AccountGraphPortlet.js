Ext.define('Cashweb.view.portlet.AccountGraphPortlet', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.cashposition',
	requires : ['Cashweb.store.AccountStore','Ext.data.JsonStore', 'Ext.chart.theme.Base',
				'Ext.chart.series.Series', 'Ext.chart.series.Line',
				'Ext.chart.axis.Numeric', 'Ext.button.Button', 'Ext.tab.Panel', 'Cashweb.view.portlet.CashPositionDataGrid', 'Cashweb.store.AccountsGraphStore'],
	border : false,
	padding : '0 0 0 5',
	emptyText : null,
	taskRunner: null,
	config : {
		height: 300,
		currency: null
	},
	hideHeaders : true,
	
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		
		this.tools = [ {
			xtype : 'combobox',
			id :  'cashposition_widget_combo',
			store : globalDashboardAccountsStore,
			queryMode : 'local',
			valueField : 'id',
			emptyText : label_map.selectaccount,
			displayField : 'account_number',
			editable : false,
			value: (globalDashboardAccountsStore.getCount() > 0) ? globalDashboardAccountsStore.getAt(0).get('id') : ''
		}];
	var graphStore = new Cashweb.store.AccountsGraphStore();
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
					itemId: 'account-data'
				},{
					xtype : 'cashpositiondatagrid',
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
						action: 'dateToggle',
						enableToggle: true
					},
					items: [{
									text : label_map.closingBal,
									xtype: 'label',
									height : 30,
									padding: '0 10 0 0',
									cls : 'cashflowopeningbalanceslabel'
									},
					{
						text: label_map.oneday,
						id: 'one_day',
						toggleGroup: 'dates'
					},{
						text: label_map.fiveday,
						id: 'five_day',
						toggleGroup: 'dates'
					},{
						text: label_map.onemonth,
						id: 'one_mnth',
						pressed: true,
						toggleGroup: 'dates'
					},{
						text: label_map.threemonth,
						id: 'three_mnth',
						toggleGroup: 'dates'
					},{
						text: label_map.sixmonth,
						id: 'six_mnth',
						toggleGroup: 'dates'
					},{
						text: label_map.oneyear,
						id: 'one_year',
						toggleGroup: 'dates'
					},{
						text:label_map.twoyear,
						id: 'two_yrs',
						toggleGroup: 'dates'
					}]
				},{
					xtype : 'chart',
					height : 200,
					flex: 5,
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
						fields : ['balances'],
						grid : true,
						label : {
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
								var btnOneYr = this.scopePt.ownerCt.down('button[id=one_year]');
								var btnTwoYr = this.scopePt.ownerCt.down('button[id=two_yrs]');
								if(!Ext.isEmpty(btnOneYr) && !Ext.isEmpty(btnTwoYr))
								{
								if(btnOneYr.pressed || btnTwoYr.pressed)
									return Ext.util.Format.date(Ext.Date.parse(value,'d/m/Y'),serverdateFormat);
								else
									return Ext.util.Format.date(Ext.Date.parse(value,'d/m/Y'),'m/d');
									}
									else
									return Ext.util.Format.date(Ext.Date.parse(value,'d/m/Y'),serverdateFormat);
									
							}
						}
					}],
					series : [{
								type : 'line',
								fill : true,
								showMarkers : false,
								axis : 'bottom',
								yField : 'balances',
								xField : 'dates',
								style : {
									 'stroke-width' : 1,
									stroke : 'rgb(148, 174, 10)'

								}
							}]
				}]
			}]
		}]
	});
		
		this.callParent(arguments);

	}
	
});
