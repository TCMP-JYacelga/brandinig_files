Ext.define('GCP.view.FinanceSetupFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'financeSetupFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			componentCls : 'gradiant_back',
			collapsible : true,
			cls : 'xn-ribbon',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				
				var statusStore = Ext.create('Ext.data.Store', {
					fields: ['state', 'desc'],
					data : [{"state" : "", "desc" : getLabel('all','ALL')},
					{"state" : "0", "desc" : getLabel('new','NEW')},
					{"state" : "11", "desc" : getLabel('pendingAuth','Pending Auth')},
					{"state" : "3", "desc" : getLabel('active','Active')},
					{"state" : "1", "desc" : getLabel('modifiedDraft','Modified Draft')},
					{"state" : "12", "desc" : getLabel('modified','Modified')},
					{"state" : "5", "desc" : getLabel('disabledRequest','Disabled Request')},
					{"state" : "6", "desc" : getLabel('disabled','Disabled')},
					{"state" : "4", "desc" : getLabel('enableRequest','Enable Request')}]
				});
				
			
				var objStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/financingProfileMst/sellerList.json'
					}
				});

		this.items = [{
			xtype : 'container',
			width : '100%',
			layout : 'column',
			items : [{
						xtype : 'container',
						columnWidth : 0.25,
						padding : '10px',
						items : [{
									xtype : 'label',
									text : getLabel('seller', 'Seller'),
									padding : '1 0 0 10'
								}, {
									xtype : 'combo',
									padding : '1 0 0 10',
									width : 120,
									displayField : 'description',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'seller',
									itemId : 'sellerFltId',
									valueField : 'sellerCode',
									name : 'sellerCombo',
									editable : false,
									value : 'ALL',
									store : objStore
								}]
					}, {
						xtype : 'container',
						columnWidth : 0.28,
						padding : '10px',
						items : [{
									xtype : 'label',
									text : getLabel('financeSetupName', 'Finance Setup Name'),
									padding : '1 0 0 10'
								}, {
									xtype : 'AutoCompleter',
									padding : '1 0 0 10',
									fieldCls : 'xn-form-text w14 xn-suggestion-box',
									name : 'profileName',
									itemId : 'profileNameFltId',
									cfgUrl : 'cpon/cponseek/{0}.json',
									cfgSeekId : 'financeSetupNamesSeek',
									cfgKeyNode : 'name',
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'name',
									cfgProxyMethodType : 'POST'
								}]
						
					},{
						xtype : 'container',
						columnWidth : 0.28,
						padding : '10px',
						items : [{
									xtype : 'label',
									text : getLabel('category', 'Category'),
									padding : '1 0 0 10'
								}, {
									xtype : 'AutoCompleter',
									padding : '1 0 0 10',
									fieldCls : 'xn-form-text w14 xn-suggestion-box',
									name : 'categoryCode',
									itemId : 'categoryFltId',
									cfgUrl : 'cpon/cponseek/{0}.json',
									cfgSeekId : 'financeSetupCategorySeek',
									cfgKeyNode : 'name',
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'value',
									cfgProxyMethodType : 'POST'
								}]
					}, {
						xtype : 'container',
						padding : '10px',
						columnWidth : 0.25,

						items : [{
									xtype : 'label',
									text : getLabel('status', 'Status'),
									padding : '1 0 0 10'
								}, {
									xtype : 'combobox',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									padding : '1 0 0 10',
									width : 120,
									itemId : 'statusFilter',
									filterParamName : 'requestState',
									store : statusStore,
									valueField : 'name',
									displayField : 'value',
									editable : false,
									value : getLabel('all',
											'ALL')

								}]

				}, {
						xtype : 'container',
						columnWidth : 0.20,
						padding : '25 10 10 20',
						items : [{
									xtype : 'button',
									padding : '1 10 0 10',
									itemId : 'btnFilter',
									cls : 'xn-button bottomAlign',
									text : 'Search',
									height : 20
								}]
					}]
		}];
		this.callParent(arguments);

		}
	});