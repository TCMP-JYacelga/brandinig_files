Ext.define('Cashweb.controller.CashflowDebitController', {
	extend : 'Ext.app.Controller',
	xtype : 'cashflowDebitController',
	views : ['Cashweb.view.portlet.CashflowDebit','Cashweb.view.portlet.CashflowDebitDataGrid'],
	stores : [],
	models : [],
	mask:null,
	chartServiceData:null,
	totalBalance:null,
	sellerCurrency:null,
	piChartAmount:'0k',
	refs : [{
				ref : 'cashflowcreditPortlet',
				selector : 'cashflowdebit'
			}, {
				ref: 'cashflowcreditRefreshTool',
				selector: 'portlet tool[itemId=cashflowdebit_refresh]'
			},{
				ref: 'cashflowCreditPanel',
				selector: 'cashflowdebit panel[itemId=cashflowDebitPanel]'
			},{
				ref: 'cashflowDebitChart',
				selector: 'cashflowdebit panel chart[itemId=cashflowPieChart]'
			},{
				ref: 'cashflowDebitGrid',
				selector: 'cashflowDebitDataGrid'
			},{
			  ref: 'cashflowDebitTotalAmnt',
			  selector: 'cashflowdebit toolbar label[itemId=creditTotalAmt]'
			},{
			  ref: 'chartPanel',
			  selector: 'cashflowdebit panel[itemId=chartPanel]'
			},{
			  ref: 'CashflowDebitPanel',
			 selector: 'CashflowDebit'
			},{
			  ref: 'totaldebitToolbar',
			  selector: 'cashflowdebit toolbar'
			},{
			ref:'errorLabel',
			selector:'cashflowdebit label[itemId=errorLabel]'
			}],

	init : function() {
		var me = this;
		me.control({
					'cashflowdebit' : {
						beforerender : this.beforeCashFlowCreditRender,
						render : this.onCashFlowCreditPortletRender,
						afterrender: this.afterCashflowCreditPortletRender,
						boxready: this.onBoxReady
					}
				});
			
	},
	onBoxReady: function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onCashFlowCreditPortletRender : function(component, eOpts) {
		var me = this,debitPortlet,widget;
	      //portletitems=this.getPortletpanel().portletItems;
		  debitPortlet=this.getCashflowcreditPortlet().up('panel');
		  widget=debitPortlet.widgetCode;
		 var label= Ext.create('Ext.form.Label', {
                  text: 'Today',
					style: { 'font-size': '10px !important' },
					renderTo:Ext.get(widget)
         });
		me.getCashflowcreditRefreshTool().on('click', this.portletRefresh, this);
		me.getCashFlowCreditData();
	},
	beforeCashFlowCreditRender : function(panel){
		var me = this;
		var objPanel = me.getCashflowcreditPortlet();
	},
	afterCashflowCreditPortletRender: function() {
		if(this.getCashflowcreditRefreshTool().record.get('refreshType') == "A") {
			this.handleCashFlowCreditAutoRefresh(this.getCashflowcreditRefreshTool().record);
		}
	},
	getCashFlowCreditData : function() {
		var me=this;
		var strSqlDateFormat = 'Y-m-d';
			  var dtFormat = strExtApplicationDateFormat;
			  var date = new Date(Ext.Date.parse(dtApplicationDate, dtFormat));
			  var appDate = Ext.Date.format(date, strSqlDateFormat);
			  var strUrl ='./getCashflowsDebit.rest?dtFrom='+appDate+'&dtTo='+appDate;
		Ext.Ajax.request({
			url : strUrl,
			success : function(response) {
			   me.chartServiceData=response.responseText;
			    var objData=Ext.decode(me.chartServiceData);
				if(objData.summary.length==0){
				    me.getErrorLabel().show();
					me.getCashflowCreditPanel().hide();
					me.getCashflowcreditPortlet().getTargetEl().unmask();
					}
					else{
			     me.getErrorLabel().hide();
				 me.getCashflowCreditPanel().show();
	             me.totalBalance = objData.totalAmount;
				 me.sellerCurrency=objData.sellerCurrency;
				 me.piChartAmount=objData.piChartAmount;
				 me.getCashflowDebitGrid().total= me.sellerCurrency+' '+me.totalBalance;
				 me.loadGridData(me.chartServiceData);
		         me.loadChartData( me.chartServiceData);
				 }
			},
			failure : function(response) {
			}		
		});
		
		
	},
	
	portletRefresh: function() {
		if(this.mask != null)
		{
		this.mask.hide();
		Ext.destroy(this.mask);
		}
		this.getCashflowcreditPortlet().getTargetEl().mask(label_map.loading);
		this.getCashFlowCreditData();
	},
	handleCashFlowCreditAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getCashflowcreditPortlet().taskRunner = taskRunner;
	},
	loadGridData:function(obj){
	var me=this;
	  var storeData = [];
	  var objData=Ext.decode(obj);
	   var arrData = objData.summary;
	   for (var i=0;i<arrData.length;i++) {
	       var colJson = {};
	        if(arrData[i]){
				     colJson["name"]=arrData[i].typecode;
                     colJson["amount"]=arrData[i].value
                     colJson["Currency"]=arrData[i].ccy,
                      colJson["precentage"]=arrData[i].percentage;
		    } 
		       storeData.push(colJson);
		}
		if(storeData.length > 0){
		me.getCashflowDebitGrid().getStore().loadData(storeData);
		 me.getCashflowDebitGrid().show();
		}
		me.getCashflowcreditPortlet().getTargetEl().unmask();
	},
	loadChartData:function(data){
		var me=this;
		  var storeData = [];
		   var objData=Ext.decode(data);
		   var arrData = objData.summary;
		   for (var i=0;i<arrData.length;i++) {
	       var colJson = {};
	        if(arrData[i]){
				colJson["name"]=arrData[i].typecode;
				colJson['data']=arrData[i].percentage;
		    }
		       storeData.push(colJson);
		}
		
		if(storeData.length > 0){
			var debitChart=me.createChart(storeData);
			var chartPanel = me.getChartPanel();
			chartPanel.removeAll();
			chartPanel.add(debitChart);
			//this.getTotaldebitToolbar().show();
			var totalAmnt = me.sellerCurrency+ me.totalBalance;
			//this.getCashflowDebitTotalAmnt().setText(totalAmnt);
		}
		this.getCashflowcreditPortlet().getTargetEl().unmask();
	},
	createChart:function(storeData){
	var me=this;
	var pieChartStore = Ext.create('Ext.data.JsonStore', {
		    fields: ['name', 'data']
		});
	
	pieChartStore.loadData(storeData);
	var baseColorRGB = [36, 116, 169];
		var colorSet = [];
		var colObj = new Ext.draw.Color(baseColorRGB[0], baseColorRGB[1], baseColorRGB[2]);
		colorSet.push(colObj.toString());
		for (i = 0; i < pieChartStore.getCount(); i++) {
			colObj = colObj.getLighter(0.1);
			colorSet.push(colObj.toString());
		}	
		chart = Ext.create('Ext.chart.Chart', {
				flex:5,
			    minWidth: 350,
			    minHeight: 200,
			    itemId : 'cashflowPieChart',
			    animate: true,
			    shadow: true,
			    store: pieChartStore,
			    theme: 'Base:gradients',
			    legend: {
			    	     visible:true,
					     position: 'right',
					     boxStroke : 'transparent',
						 boxFill: 'transparent'
	            },
			    series: [{
			        type: 'pie',
			        angleField: 'data',
			         donut : 45,
			        colorSet : colorSet,
			        showInLegend: true,
			        tips: {
			        	trackMouse : true,
						constrainPosition : true,
						anchor : 'bottom',
						bodyStyle : {
							background : '#525252',
							color : 'black',
							padding : '10px'
						},
			            renderer: function(storeItem, item) {
			                this.update(storeItem.get('name') + ' - ' + storeItem.get('data').toFixed(2) + '%');
			            }
			        },
			        highlight: {
			            segment: {
			                margin: 20
			            }
			        }
			    }],
			    listeners : {
				 	resize : function(chart, width, height, eOpts){ 
					if(me.totalBalance != 0) {
						var surface = chart.surface;
						var textSpriteGroup = surface.getGroup('typeSpriteGroup');
						if (textSpriteGroup) {
							surface.remove(textSpriteGroup.items[0]);
						}
						var balanceSpriteGroup = surface.getGroup('balanceSpriteGroup');
						if (balanceSpriteGroup) {
							surface.remove(balanceSpriteGroup.items[0]);
						}
						var topX = width / 2 -50;
						var topY = height / 2 ;
						var arr=new Array();
						arr.push('M');arr.push(topX-30);arr.push(topY+6);arr.push('H153');
						var path=arr.toString(); 
						var typeSprite = chart.surface.add({
									type : 'text',
									group : 'typeSpriteGroup',
									text : 'Debits',
									fill : "black",
									font : "bold 14px calibri",
									style: {
										'text-anchor':'middle'
										 
								     },
									 x : topX,
									  y :topY-5
								});
						typeSprite.show(true);
					
					var sepLine = chart.surface.add({
							type: 'path',
							fill: 'none',
							stroke: '#c6c6c6',
							path: path,
							style: {
									  'stroke-width': 1,
									    margin:'5px'
								     }
						}).show(true);
						var balanceSprite = chart.surface.add({
									type : 'text',
									group :'balanceSpriteGroup',
									text : me.piChartAmount,
									fill : "#00CCFF ",
									font : "bold 14px calibri",
									style: {
									    'text-anchor':'middle'
								     },
									x : topX,
									y : topY + 15
								});
						balanceSprite.show(true);
					}
				 }
				 }
			});
			return chart;
	}
});