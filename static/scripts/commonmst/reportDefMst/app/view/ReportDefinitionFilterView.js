Ext.define('GCP.view.ReportDefinitionFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'reportDefinitionFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon ux_extralargemargin-bottom',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				var me = this;
				pmtSummaryView = this;
				var receiverPartyNameSeek = null;
				var receiverAccountSeekUrl = null;
				var filterContainerArr = new Array();		
				
				var moduleStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/reportSeek/reportModuleSeek.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					},
					listeners : {
						load : function(store, records, options) {
							store.insert(0, {
										"name" : getLabel('all','ALL'),
										"value" : ""
									});
						}
					}					
				});		
				
				var categoryTypeStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/reportSeek/categoryTypeSeek.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					},
					listeners : {
						load : function(store, records, options) {
							store.insert(0, {
										"name" : getLabel('all','ALL'),
										"value" : ""
									});
						}
					}				
				});					
				
				var categoryTypefield = Ext.create('Ext.form.field.ComboBox', {
					displayField : 'name',
					fieldCls : 'xn-form-field ux_font-size14-normal ',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					triggerBaseCls : 'xn-form-trigger',
					padding : '1 0 0 10',
					filterParamName : 'categoryType',
					itemId : 'categoryType',
					valueField : 'value',
					width : 200,
					name : 'categoryType',
					editable : false,
					store : categoryTypeStore,
					value : getLabel('all',
					'ALL')					
				});					
				
				var reportModulefield = Ext.create('Ext.form.field.ComboBox', {
					displayField : 'name',
					fieldCls : 'xn-form-field ux_font-size14-normal ',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					triggerBaseCls : 'xn-form-trigger',
					padding : '1 0 0 10',
					filterParamName : 'reportModule',
					itemId : 'reportModule',
					valueField : 'value',
					width : 200,
					name : 'reportModule',
					editable : false,
					store : moduleStore,
					value : getLabel('all',
					'ALL')					
				});				
				
				var reportNameTextfield = {
						xtype : 'container',
						columnWidth : 0.25,
						items : [{
							xtype : 'label',
							text : getLabel('lblReportName', 'Report Name'),
							padding : '1 0 0 10',
							cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
						}, {
							xtype : 'AutoCompleter',
							padding : '1 0 0 10',
							cls : 'ux_normalmargin-top ux_largepadding-left',
							fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
							width : 200,
							name : 'reportName',
							itemId : 'reportNameFltId',
							cfgUrl : 'services/reportSeek/{0}.json',
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'reportNameSeek',
							cfgRootNode : 'd.filter',
							cfgDataNode1 : 'name',
							cfgProxyMethodType : 'POST'
						}]
					};				
								
				filterContainerArr.push(reportNameTextfield);		
				filterContainerArr.push({
						xtype : 'container',
						columnWidth : 0.25,
			            items: [{
								xtype : 'label',
								padding : '1 0 0 10',
								cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left',
								text : getLabel('lblReportModule', 'Module')
					          }, reportModulefield]
						});	
				filterContainerArr.push({
					xtype : 'container',
					columnWidth : 0.25,
		            items: [{
							xtype : 'label',
							padding : '1 0 0 10',
							cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left',
							text : getLabel('lblCatType', 'Category Type')
				          }, categoryTypefield]
					});
				filterContainerArr.push({
					xtype : 'container',
					columnWidth : 0.25,
					items : [{
								xtype : 'label',
								text : getLabel('status', 'Status'),
								cls : 'frmLabel'
							}, {
								xtype : 'combo',
								width : 150,
								displayField : 'value',
								valueField : 'name',
								value : getLabel('all','ALL'),
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'statusFilter',
								itemId : 'statusFilter',
								name : 'statusCombo',
								editable : false,
								store : me.getStatusStore()
							}]
				});
				
				this.items = [{
							xtype : 'container',
							width : '100%',
							layout : 'column',
							padding:'10 10 10 0',
							cls : 'ux_border-top',
							items : filterContainerArr
						}];

				this.callParent(arguments);
		},
		getStatusStore : function(){
			var objStatusStore = null;
			if (!Ext.isEmpty(arrStatusFilterLst)) {
				
				arrStatusFilterLst.push({
					name : 'ALL',
					value : getLabel('all','ALL')
				});					
				objStatusStore = Ext.create('Ext.data.Store', {
							fields : ['name','value'],
							data : arrStatusFilterLst,
							autoLoad : true,
							listeners : {
								load : function() {
								}
							}
						});
				objStatusStore.load();
			}
			return objStatusStore;
		},

		tools : [{
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			layout : {
				type : 'hbox'
			},
			items : [ ]
		}, {
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			layout : {
				type : 'hbox'
			},
			items : [ ]
		}]		
});