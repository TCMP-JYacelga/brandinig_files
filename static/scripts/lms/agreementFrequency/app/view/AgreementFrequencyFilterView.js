Ext.define('GCP.view.AgreementFrequencyFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementFrequencyFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : 'vbox',
	initComponent : function() {
	me = this;
	var sellerStoreData = null;
	var clientStore=Ext.create('Ext.data.Store', {
		fields : ['CODE','DESCR']
	});
	if(entity_type === '0')
	{
		Ext.Ajax.request(
		{
			url : 'services/sellerListFltr.json'+"?" + csrfTokenName + "=" + csrfTokenValue,
			method : 'POST',
			async: false,
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if( !Ext.isEmpty( data ) ){
					sellerStoreData = data;
				}
			},
			failure : function(response)
			{
				// console.log("Ajax Get data Call Failed");
			}
		});
		var objFIStore = Ext.create('Ext.data.Store', {
				fields : ['sellerCode', 'description'],
				data : sellerStoreData,
				reader : {
					type : 'json',
					root : 'filterList'
				}
				});
		if(objFIStore.getCount() > 1){
			multipleSellersAvailable = true;
		}
	}
	else
	{
		Ext.Ajax.request({
			url : 'services/userseek/foreuserclients.json'+'?&$filtercode1='+ strSellerId,
			method : 'GET',
			async : false,
			success: function(response){								
			if(response && clientStore){
				clientStore.removeAll(true,true);
				var responseData = Ext.decode(response.responseText),
					data = responseData.d.preferences,
					count = data.length;
				if(count > 1){
					clientStore.add({
						'CODE' : 'all',
						'DESCR' : 'All Companies'
					});
					
					for(var i=0;i<count;i++){
						var obj = {
							'DESCR': data[i].DESCR,
							'CODE' : data[i].CODE
						};
						clientStore.add(obj);
					}
				}
				
			}
		},
			failure : function(){}
		});
	}

	me.items = [
			{
				xtype : 'container',
				layout : 'hbox',				
				width: '100%',
				items : [{
					xtype : 'container',
					layout : 'vbox',
					width: '25%',
					padding: '0 30 0 0',
					flex : 1,
					hidden : multipleSellersAvailable == true ? false : true,
					items : [
					{
							xtype: 'label',
                            text : getLabel(
                                    'financialinstitution',
                                    'Financial Institution')
                        },
					{
    						xtype : 'combo',
    						displayField : 'description',
    						filterParamName : 'sellerId',
    						itemId : 'entitledSellerIdItemId',
    						valueField : 'sellerCode',
    						name : 'entitledSellerId',
    						width : screen.width > 1024 ? 220 : 160,
    						editable : false,
    						value :strSellerId,
    						store : objFIStore,
    						listeners :
    						{
    							'select' : function(combo, strNewValue, strOldValue) {
    								setAdminSeller(combo.getValue());
    							}
    						}
    					}
					]
					}
					]
				},
				{
					xtype : 'container',
					layout : 'vbox',
					width: '25%',
					padding: '0 30 0 0',
					flex : 1,
					hidden : ((clientStore.getCount() < 1) || entityType == 0 ? true : false),
					items : [
					{
						xtype: 'label',
						text : getLabel('companyname', 'Company Name')
					},
					{
						xtype : 'combo',			            	        	 
						displayField : 'DESCR',
						valueField : 'CODE',
						queryMode : 'local',
						editable : false,
						itemId : 'clientCodeCombo',
						mode : 'local',
						width : screen.width > 1024 ? 220 : 160,
						emptyText : getLabel('selectCompany', 'Select Company Name'),
						store : clientStore
					}
				]
				},
				{
					xtype: 'container',
					layout: 'vbox',
					width: '25%',
					padding: '0 30 0 0',
					hidden : entityType == 0 ? false : true,
					items:[{
						xtype: 'label',
								text : getLabel(
										'companyname',
										'Company Name'),
								cls : 'frmLabel'
					},
					{	
						xtype : 'AutoCompleter',
						cls : 'ux_normalmargin-top',
						cfgTplCls : 'xn-autocompleter-t7',
						fieldCls : 'xn-form-text xn-suggestion-box',
						width : screen.width > 1024 ? 220 : 160,
						labelSeparator : '',
						name : 'clientCode',
						itemId : 'clientCodeAuto',
						cfgUrl : 'services/userseek/AgreementFrequencyClientCodeSeek.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'AgreementFrequencyClientCodeSeek',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCRIPTION',
						cfgStoreFields : [ 'CODE',
								'DESCRIPTION' ],
						cfgExtraParams: 
						[
						  {
							key : '$filtercode1',
							value : strSellerId
						  } 
						],
						emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %')
						}]
				},
			{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				items : [
				{
					xtype: 'container',
					layout: 'vbox',
					width: '25%',
					padding: '0 30 0 0',
					items:[{
						xtype: 'label',
						text : getLabel(
								'lbl.notionalMst.agreementCode',
								'Agreement Code'),
						cls : 'frmLabel'
					},
					{
						xtype : 'AutoCompleter',
						cls : 'ux_normalmargin-top',
						cfgTplCls : 'xn-autocompleter-t7',
						fieldCls : 'xn-form-text xn-suggestion-box',
						width : screen.width > 1024 ? 220 : 160,
						labelSeparator : '',
						name : 'AgreementCode',
						itemId : 'agreementCodeItemId',
						cfgUrl : 'services/userseek/{0}.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'AgreementFreqAgreementCodeSummSeekAll',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'CODE',
						cfgDataNode2 : 'DESCRIPTION',
						cfgStoreFields : [ 'CODE','DESCRIPTION','RECKEY' ],
						cfgExtraParams: 
						[
						  {
							key : '$filtercode1',
							value : strSellerId
						  } 
						],
						emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %')
					}]
				},
				{
					xtype : 'container',
					layout : 'vbox',
					width: '25%',
					padding: '0 30 0 0',
					items : [{
						xtype : 'label',
						text : getLabel('lms.notionalMst.status', 'Status'),
								cls : 'frmLabel',
								flex : 1
						},
						Ext.create('Ext.ux.gcp.CheckCombo', {
						name : 'agreementFreqStatusId',
						itemId : 'agreementFreqStatusId',
						width : screen.width > 1024 ? 220 : 160,
						valueField : 'code',
						displayField : 'desc',
						editable : false,
						matchFieldWidth : true,
						addAllSelector : true,
						emptyText : 'All',
						multiSelect : true,
						store : me.getStatusStore(),
						isQuickStatusFieldChange : false
						})
					]
				}
			]
		}
		]
	this.callParent(arguments);	
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrActionColumnStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrActionColumnStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
	}
	});