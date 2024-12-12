Ext.define('GCP.view.UserMstFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userMstFilterView',
	requires : ['Ext.menu.Menu', 'Ext.container.Container',
			'Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter'],
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		var storeLength = 0;
		userSummaryView = this;

		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});		
		var corporationStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});		
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/categoryStatusList.json',
						noCache: false,
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			method : 'POST',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				if (corporationStore) {
					corporationStore.removeAll();
					var count = data.length;
					availableClient = count;
					if (count > 1) {
						corporationStore.add({
									'CODE' : 'All',
									'DESCR' : 'All'
								});
					}
					for (var index = 0; index < count; index++) {
						var record = {
							'CODE' : data[index].CODE,
							'DESCR' : data[index].DESCR
						}
						corporationStore.add(record);
					}
				}
			},
			failure : function() {
			}
		});		

		if( corporationStore && corporationStore.data && corporationStore.data.items )
		{
			storeLength = corporationStore.data.items.length;
		}		

		this.items = [  
		              {
		            	  xtype : 'container',
							flex : 1,
							layout : 'vbox',
							hidden : (entity_type == '1'),
						    //hidden : storeLength > 1 ? false : true,
							items : [{
								xtype : 'label',
								text : getLabel('corporation', 'Company Name'),
								margin : '0 0 0 0'
							}, 
							{
								xtype : 'AutoCompleter',
								cls : 'ux_normalmargin-top',
								cfgTplCls : 'xn-autocompleter-t7',
								fieldCls : 'xn-form-text xn-suggestion-box',
								width : screen.width > 1024 ? 220 : 160,
								cfgUrl : 'services/userseek/adminRolesCorporation.json',
								cfgStoreFields : ['CODE','DESCR'],
								cfgRootNode : 'd.preferences',
								cfgQueryParamName : 'autoFilter',
								enableQueryParam:false,
								cfgRecordCount : -1,
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DESCR',
								cfgKeyNode : 'CODE',
								cfgProxyMethodType : 'POST',
								padding : '-4 10 0 0',
								itemId : 'clientCombo',
								cfgQueryParamName : '$autofilter',
								emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
								listeners : {
									'select' : function(combo, record) {
										 me.fireEvent("handleClientChange", combo.getValue(),combo.getRawValue(),sessionSellerCode );
									},
									'change' : function( combo, newValue, oldValue, eOpts ) {
										if (Ext.isEmpty(newValue)) {
											me.fireEvent("handleClientChange",'','', '');
										}
									}
								}
							 }]
		              },
		              {
			  				xtype : 'container',
			  				flex : 1,
			  				layout : 'hbox',
			  				items : [{
			  					xtype : 'container',
		  						flex : 1,
		  						layout : 'vbox',
		  						width : '25%',
		  						padding : '0 15 0 0',
								hidden : (autousrcode != 'PRODUCT') ? true : false,
		  						items : [{
		  							xtype : 'label',
  									text : getLabel('userLoginId', 'Login ID')
		  						},{
		  							xtype : 'AutoCompleter',
  									cls : 'ux_normalmargin-top',
  									cfgTplCls : 'xn-autocompleter-t7',
  									fieldCls : 'xn-form-text xn-suggestion-box',
  									name : 'loginId',
  									width : screen.width > 1024 ? 220 : 160,
  									itemId : 'loginIdFltId',
  									padding : '-4 30 0 0',
  									cfgUrl : 'services/userMstSeek/loginIdList.json',
  									cfgSeekId : 'loginIdList',
  									cfgQueryParamName : 'qfilter',
  									cfgRecordCount : -1,
  									cfgKeyNode : 'value',
  									cfgRootNode : 'filterList',
  									cfgDataNode1 : 'value',
  									emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
  									cfgProxyMethodType : 'POST',
  									enableQueryParam:false,
  									listConfig :{
  									width:200
  									},
  									matchFieldWidth :true,
  									cfgExtraParams : [{
  												key : '$filterseller',
  												value : sessionSellerCode
  											}]		
		  							
		  						}]
		  					
		  					},
		  					{
			  						xtype : 'container',
			  						flex : 1,
			  						layout : 'vbox',
			  						width : '25%',
			  						padding : '0 15 0 0',
			  						items : [{
			  									xtype : 'label',
			  									text : getLabel('userName', 'User Name')
			  								}, {
			  									xtype : 'AutoCompleter',
			  									cls : 'ux_normalmargin-top',
			  									cfgTplCls : 'xn-autocompleter-t7',
			  									fieldCls : 'xn-form-text xn-suggestion-box',
			  									name : 'userDescription',
			  									width : screen.width > 1024 ? 220 : 160,
			  									
			  									itemId : 'userNameFltId',
			  									padding : '-4 30 0 0',
			  									cfgUrl : 'services/userMstSeek/userNamesList.json',
			  									cfgQueryParamName : 'qfilter',
			  									cfgRecordCount : -1,
			  									cfgSeekId : 'userNamesList',
			  									cfgKeyNode : 'value',
			  									cfgRootNode : 'filterList',
			  									cfgDataNode1 : 'value',
			  									emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
			  									cfgProxyMethodType : 'POST',
			  									enableQueryParam:false,
			  									listConfig :{
			  									width:200
			  									},
			  									//replace value in textbox
			  									listeners : {
												'select' : function(combo,record) {
														window.location.reload();
													}	
												},
			  									matchFieldWidth :true,
			  									cfgExtraParams : [{
			  												key : '$filterseller',
			  												value : sessionSellerCode
			  											}]		
			  								}]
			  					},  
			  					{
			  						xtype : 'container',
			  					//	flex : 1,
			  						layout : 'vbox',
			  						width : '25%',
			  						padding : '0 15 0 0',
			  						items : [{
			  									xtype : 'label',
			  									text : getLabel('category', 'Role')
			  								}, {
			  									xtype : 'AutoCompleter',
			  									cls : 'ux_normalmargin-top ',
			  									cfgTplCls : 'xn-autocompleter-t7',
			  									fieldCls : 'xn-form-text xn-suggestion-box',
			  									name : 'userCategory',
			  									width : screen.width > 1024 ? 220 : 160,
			  									padding : '-4 30 0 0',
			  									itemId : 'userCategoryFltId',
			  									cfgUrl : 'services/userMstSeek/userCategoryList.json',
			  									cfgQueryParamName : 'qfilter',
			  									cfgRecordCount : -1,
			  									cfgSeekId : 'userCategoryList',
			  									cfgKeyNode : 'name',
			  									cfgRootNode : 'filterList',
			  									cfgDataNode1 : 'name',
			  									emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
			  									cfgProxyMethodType : 'POST',
			  									enableQueryParam:false,
			  									cfgExtraParams : [{
			  												key : '$filterseller',
			  												value : sessionSellerCode
			  											}]
			  								}]
			  					}, 
			  					{
			  						xtype : 'container',
			  					//	flex : 1,
			  						layout : 'vbox',
			  						width : '25%',
			  						padding : '0 15 0 0',
			  						hidden : (autousrcode != 'PRODUCT') ?  false : true,
			  						items : [{
			  									xtype : 'label',
			  									text : getLabel('ssoUserId', 'SSO User Id')
			  								}, {
			  									xtype : 'AutoCompleter',
			  									cls : 'ux_normalmargin-top ',
			  									cfgTplCls : 'xn-autocompleter-t7',
			  									fieldCls : 'xn-form-text xn-suggestion-box',
			  									name : 'userssologinId',
			  									width : screen.width > 1024 ? 220 : 160,
			  									padding : '-4 30 0 0',
			  									itemId : 'ssoUserIdFilterItemId',
			  									cfgUrl : 'services/userMstSeek/clientSsoUserIdSeekAll.json',
			  									cfgQueryParamName : 'qfilter',
			  									cfgRecordCount : -1,
			  									cfgSeekId : 'clientSsoUserIdSeekAll',
			  									cfgKeyNode : 'name',
			  									cfgRootNode : 'filterList',
			  									cfgDataNode1 : 'name',
			  									emptyText:getLabel('autoCompleterEmptyText','Enter Keyword or %'),
			  									cfgProxyMethodType : 'POST',
			  									enableQueryParam:false,
			  									cfgExtraParams : [{
			  												key : '$filterseller',
			  												value : sessionSellerCode
			  											}]
			  								}]
			  					},
			  					{
			  						xtype : 'container',
			  						flex : 1,
			  						layout : 'vbox',
			  						width : '25%',
			  						padding : '0 15 0 0',
			  						items : [{
			  									xtype : 'label',
			  									text : getLabel('status', 'Status')
			  								},
			  								Ext.create('Ext.ux.gcp.CheckCombo', {
  												valueField : 'name',
  												displayField : 'value',
  												editable : false,
  												addAllSelector : true,
  												emptyText : 'All',
  												multiSelect : true,
  												width : screen.width > 1024 ? 220 : 160,
  												padding : '-4 0 0 0',
  												itemId : 'statusFltId',
  												isQuickStatusFieldChange : false,
  												store : me.getStatusStore(),
  												listeners : {
  													'focus' : function() {
  													//	$('#entryDataPicker').attr(
  													//			'disabled', 'disabled');
  													}
  												}
  											})]
			  					}
			  				]
		              }
		           ]
		this.callParent(arguments);
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = [];
		var clientBtn = me.down('combo[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'all'
				});

		Ext.each(clientArray, function(client) {
					clientMenu.push({
								text : client.DESCR,
								CODE : client.CODE,
								DESCR : client.DESCR
								
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}else{
			clientBtn.getStore().loadData(clientMenu);
		}

	} ,
	
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrStatusFilterLst)) {
			arrStatusFilterLst.push(
					{
						"name" : "15",
						"value" : getLabel( 'lblResetUserRequest', 'Reset User Request' )
					},
					{
						"name" : "16",
						"value" : getLabel( 'lblResetUserRequestRejected', 'Reset User Request Rejected' )
					},
					{
						"name" : "17",
						"value" : getLabel( 'lblUnlockUserRequest', 'Unlock User Request' )
					},
					{
						"name" : "18",
						"value" : getLabel( 'lblUnlockUserRequestRejected', 'Unlock User Request Rejected' )
					}
				);
			
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
	}
});