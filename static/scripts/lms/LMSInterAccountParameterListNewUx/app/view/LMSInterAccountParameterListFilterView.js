Ext.define( 'GCP.view.LMSInterAccountParameterListFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsInterAccountParameterListFilterView',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var agreementCodeParam = [];
		agreementCodeParam.push({
			key : '$filtercode1',
			value : strSellerId
		});
		/*if (!Ext.isEmpty(strClientId)) {
			agreementCodeParam.push({
				key : '$filtercode2',
				value : strClientId
			});
		}*/
		if(entityType === '0')
		{
			Ext.Ajax.request(
					{
						url : 'services/sellerListFltr.json'+"?" + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						async: false,
						success : function( response )
						{
							var data = Ext.decode( response.responseText );
							var sellerData = data.filterList;
							if( !Ext.isEmpty( data ) ){
								storeData = data;
							}
						},
						failure : function(response)
						{
							// console.log("Ajax Get data Call Failed");
						}
			});
			var objStore = Ext.create('Ext.data.Store', {
						fields : ['sellerCode', 'description'],
						data : storeData,
						reader : {
							type : 'json',
							root : 'filterList'
						}
					});
			if(objStore.getCount() > 1){
				multipleSellersAvailable = true;
			}
			isMultipleClientAvailable = true;
		}

		var clientsResponseData;
		var clientsStoreData;
		var objClientStore;
		var clientAutoCompleterSeekId;
		var userClient = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		if( entityType != null && entityType === '0' )
			clientAutoCompleterSeekId = 'interAccountParameterClientBankIdSeek';
		else
		{
			clientAutoCompleterSeekId = 'interAccountParameterClientIdSeek';

			Ext.Ajax.request(
					{
						url : 'services/userseek/interAccountParameterClientIdSeek.json?$top=-1',
						method : 'POST',
						params : {
							$filtercode1 : strUserCode
						},
						async: false,
						success : function( response )
						{
							clientsData = Ext.decode( response.responseText );
							if( !Ext.isEmpty( clientsData ) ){
								clientsStoreData = clientsData.d.preferences;
							}
						},
						failure : function(response)
						{
							// console.log("Ajax Get data Call Failed");
						}

			});
			if( !Ext.isEmpty( clientsStoreData ) ){
				var objClientStore = Ext.create('Ext.data.Store', {
							fields : ['CODE', 'DESCRIPTION'],
							data : clientsStoreData,
							reader : {
								type : 'json'
							}
							});
				if(objClientStore.getCount() >= 2){
					clientsStoreData.unshift({"CODE":"all","DESCRIPTION":"All Companies"});
					isMultipleClientAvailable = true;
				}
			}
		}

		this.items =
		[			/*{
						xtype : 'container',
						layout : 'vbox',
						hidden : ((userClient.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
						width : '25%',
						padding : '0 30 0 0',
						items : [{
									xtype : 'label',
									itemId : 'savedFiltersLabel',
									text : getLabel('lblcompany', 'Company')
								}, {
									xtype : 'combo',
									displayField : 'DESCR',
									valueField : 'CODE',
									queryMode : 'local',
									editable : false,
									triggerAction : 'all',
									width : 230,
									padding : '-4 0 0 0',
									itemId : 'clientCombo',
									mode : 'local',
									emptyText : getLabel('selectCompany',
											'Select Company'),
									store : userClient,
									listeners : {
										'select' : function(combo, record) {
											var val = combo.getValue(), descr = combo
													.getDisplayValue();
											if (val && descr) {
												changeClientAndRefreshGrid(val, descr);
											}
										},
										boxready : function(combo, width, height, eOpts) {
											combo.setValue(combo.getStore().getAt(0));
										}
									}
								}]
						},*/
				{
					xtype : 'container',
					width : '100%',
					layout : 'hbox',
					items :
					[
					 	//Panel 1
			 			{
							 xtype : 'container',
							 hidden : multipleSellersAvailable == true  && entity_type === '0' ? false : true,
							 layout : 'vbox',
							 padding : '0 30 0 0',
							 width : '25%',
							 itemId : 'sellerFilter',
							 items: [{
										xtype : 'label',
									cls : 'frmLabel',
									itemId : 'labelseller',										
									text : getLabel('financialinstitution', 'Financial Institution')
									 
							      }, {
						    	  	xtype : 'combo',
									displayField : 'description',
									width : '100%',
									padding : '-4 0 0 0',
									filterParamName : 'sellerCode',
									itemId : 'entitledSellerIdItemId',
									valueField : 'sellerCode',
									name : 'sellerCombo',
									editable : false,
									value :strSellerId,
									store : objStore
						}]
						
		 			},
		 			//Panel 2
					{
						xtype : 'container',
						layout : 'vbox',
						padding : '0 30 0 0',
						width : '25%',
						hidden : entity_type === '0' ? false : (entity_type === '1' && isMultipleClientAvailable ? false : true),
						items : [{
									xtype : 'label',
									itemId : 'labelclient',
									cls 	: 'required',
									hidden : entity_type === '0' ? false : (entity_type === '1' && isMultipleClientAvailable ? false : true),
									text : getLabel('lbl.companyname', 'Company Name')
								}, {
									xtype : 'AutoCompleter',
									width : 230,
									matchFieldWidth : true,
									name : 'clientCombo',
									itemId : 'clientCodeItemId',
									cfgUrl : 'services/userseek/{0}.json',
									padding : '-4 0 0 0',
									hidden : entity_type === '0' ? false : true,
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : clientAutoCompleterSeekId,
									cfgKeyNode : 'CODE',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'DESCRIPTION',
									emptyText : getLabel('searchByCompany',
											'Search By Company'),
									enableQueryParam : false,
									cfgProxyMethodType : 'POST',
									filterParamName : 'clientCode',
									cfgStoreFields :
									[
										'CODE', 'DESCRIPTION'
									],
									cfgExtraParams : entity_type == '1' ? [{
										key : '$filtercode1',
										value : strUserCode
									}] :[{
										key : '$filtercode1',
										value : strSellerId
									}]
									/*listeners : {
										'select' : function(combo, record) {
											selectedFilterClientDesc = combo.getRawValue();
											selectedFilterClient = combo.getValue();
											$(document).trigger(
													"handleClientChangeInQuickFilter",
													false);
										},
										'change' : function(combo, record) {
											if (Ext.isEmpty(combo.getValue())) {
												selectedFilterClientDesc = "";
												selectedFilterClient = "";
												$(document).trigger(
														"handleClientChangeInQuickFilter",
														false);
											}
										}
									}*/
								}, {
									xtype : 'combo',
									displayField : 'DESCRIPTION',
									valueField : 'CODE',
									matchFieldWidth : true,
									editable : false,
									triggerAction : 'all',
									hidden : entity_type === '1' && isMultipleClientAvailable ? false : true,
									padding : '-4 0 0 0',
									width : '100%',
									filterParamName : 'clientCode',
									itemId : 'clientCodeId',
									name : 'clientCode',
									value : 'All Companies',
									store : objClientStore
							    }]
					       }]
		 				},
						{
						xtype : 'container',
						itemId : 'filterParentContainer',
						width : '100%',
						layout : 'hbox',
						items : [{
									xtype : 'container',
									layout : 'vbox',
									padding: '0 30 0 0',
									items : [{
										xtype : 'label',
										itemId : 'labelAgreement',
										cls 	: 'required',
										text : getLabel('agreementcode', 'Agreement Code')
									}, {
										xtype : 'AutoCompleter',
										width : 230,
										matchFieldWidth : true,
										name : 'agreementcode',
										itemId : 'agreementCodeItemId',
										cls : 'ux_normalmargin-top',
										cfgTplCls : 'xn-autocompleter-t7',
										fieldCls : 'xn-form-text xn-suggestion-box',
										cfgUrl : 'services/userseek/interAccountParameterAgreementCodeSeek.json',
										padding : '-4 0 0 0',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'interAccountParameterAgreementCodeSeek',
										cfgKeyNode : 'CODE',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
										enableQueryParam:false,
										filterParamName : 'agreementCode',
										cfgProxyMethodType : 'POST',
										cfgStoreFields :
											[
												'CODE', 'DESCRIPTION','RECKEY'
											],
										cfgExtraParams : agreementCodeParam
									}]
								},{
									xtype : 'container',
									layout : 'vbox',
									padding: '0 30 0 0',
									items : [{
										xtype : 'label',
										itemId : 'labelfromAccnt',
										cls 	: 'required',
										text : getLabel('fromAccnt', 'Participating Account')
									}, {
										xtype : 'AutoCompleter',
										width : 230,
										name : 'accountNoFrom',
										matchFieldWidth : true,
										itemId : 'fromAccountItemId',
										cls : 'ux_normalmargin-top',
										cfgTplCls : 'xn-autocompleter-t7',
										fieldCls : 'xn-form-text xn-suggestion-box',
										padding : '-4 0 0 0',
										cfgUrl : 'services/userseek/interAccountParameterFromAccountSeek.json',
										emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'interAccountParameterFromAccountSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgKeyNode : 'ACCOUNTID',
										enableQueryParam:false,
										cfgProxyMethodType : 'POST',
										filterParamName : 'fromAccountId',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','ACCOUNTID'									
										]
									}]
								},{
									xtype : 'container',
									layout : 'vbox',
									padding: '0 30 0 0',
									items : [{
										xtype : 'label',
										itemId : 'labelToAccnt',
										cls 	: 'required',
										text : getLabel('toAccnt', 'Contra Account')
									}, {
										xtype : 'AutoCompleter',
										width : 230,
										name : 'accountNoTo',
										matchFieldWidth : true,
										cls : 'ux_normalmargin-top',
										cfgTplCls : 'xn-autocompleter-t7',
										fieldCls : 'xn-form-text xn-suggestion-box',
										itemId : 'toAccountItemId',
										padding : '-4 0 0 0',
										cfgUrl : 'services/userseek/interAccountParameterToAccountSeek.json',
										emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'interAccountParameterToAccountSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgKeyNode : 'ACCOUNTID',
										enableQueryParam:false,
										cfgProxyMethodType : 'POST',
										filterParamName : 'toAccountId',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','ACCOUNTID'								
										]
									}]
								}]
						}		
			
		];
		this.callParent( arguments );
	}
} );
