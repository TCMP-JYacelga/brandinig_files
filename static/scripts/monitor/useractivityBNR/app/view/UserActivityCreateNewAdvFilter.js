Ext.define('GCP.view.UserActivityCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'userActivityCreateNewAdvFilter',
	requires : ['Ext.menu.Menu', 'Ext.container.Container','Ext.ux.gcp.AutoCompleter'],
	callerParent : null,
	width : 480,
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var storeData;
		 var objSellerStore = Ext.create('Ext.data.Store', {
             fields: ['sellerCode', 'description'],
             proxy: {
                 type: 'ajax',
                 autoLoad: true,
                 url: 'services/sellerListFltr.json'
             }
         });
		 	var statusValTypeStore = Ext.create('Ext.data.Store', {
					fields : ['statusVal', 'statusDesc'],
					data : [{
								"statusVal" : "",
								"statusDesc" : "All"
							},{
								"statusVal" : "Y",
								"statusDesc" : "Active"
							},
							{
								"statusVal" : "N",
								"statusDesc" : "In-Active"
							}]
				});
		 Ext.Ajax.request({
								url :  'services/userseek/userclients.json',
								method : "POST",
								params : {$sellerCode : strSellerId},
								async : false,
								success : function(response) {
									//console.log(response);
									if (response && response.responseText)
										storeData = Ext.decode(response.responseText);
										storeData = storeData.d.preferences;
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
		 
		 var objClientStore = Ext.create('Ext.data.Store', {
             fields: ['CODE', 'DESCR'],
			 data : storeData
         });
		this.items = [{
					xtype : 'label',
					cls : 'red' ,
					itemId : 'errorLabel',
					heigth : 10,
					hidden : true
				},{
					xtype : 'panel',
					itemId : 'bankUserPanel',
					layout : 'hbox',
					hidden : isClientUser(),
					margin : '0 0 6 0',
					items : [{
						xtype : 'checkbox',
						padding : '0 0 0 0',
						hidden : isClientUser(),
						itemId:'bankUserFlag',
						boxLabel  : 'Bank Users'
					}]
				},{
					xtype : 'panel',
					itemId : 'sellerPanel',
					layout : 'hbox',
					hidden : isClientUser(),
					margin : '0 0 6 0',	
					items : [{
						xtype : 'label',
						text : getLabel('seller', 'Financial Institution'),
						width : 156,
						padding : '4 0 0 0',
						cls : 'black ux_font-size14'
					}, {
					xtype : 'combobox',
					width : 165,
					displayField : 'description',
					itemId : 'sellerCodeID',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'sellerCode',
					valueField : 'sellerCode',
					name : 'sellerCode',
					editable : false,
					store : objSellerStore,
					listeners : {
						'render' : function(combo, record) {
	                                                combo.setValue(sessionSellerCode);     
	                                                combo.store.load();
	                                },
                        change : function(combo, newValue, oldValue) {
							me.fireEvent("handleSellerCombo",combo,newValue,oldValue);
						}
					}
				}]
			   },/*{
					xtype : 'panel',
					itemId : 'corpPanel',
					hidden : isClientUser(),
					layout : 'hbox',
					margin : '0 0 6 0',
					items : [{
						xtype : 'label',
						text : getLabel('lblcorporation', 'Corporation'),
						width : 156,
						padding : '10 0 0 0',
						cls : 'black ux_font-size14'
					}, {
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'ux_paddingb',
								padding : '12 0 12 0',
								fieldCls : 'xn-form-text w12 xn-suggestion-box',
								labelSeparator : '',
								name : 'corpCode',
								itemId : 'corporationName',
								cfgUrl :  'services/userseek/userActivityCorpSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'corpCodeSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode   : 'CODE',
								cfgDataNode1 : 'DESCR',
								cfgStoreFields:['CODE','DESCR'],
								cfgProxyMethodType : 'POST',
								cfgExtraParams : [{key : '$filtercode1',value : sessionSellerCode}],
								listeners : {
			                        select : function(combo, record, index) {
										me.fireEvent("handleCorpCombo",combo,record,index);
									}
								}
					}]
			   },*/{
					xtype : 'panel',
					itemId : 'clientPanel',
					hidden : isClientUser(),
					layout : 'hbox',
					margin : '0 0 6 0',
					items : [{
						xtype : 'label',
						text : getLabel('lblclient', 'Company Name'),
						width : 156,
						padding : '4 0 0 0',
						cls : 'black ux_font-size12'
					}, {
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'ux_paddingb',
								padding : '0 0 8 0',
								fieldCls : 'xn-form-text w12 xn-suggestion-box',
								labelSeparator : '',
								name : 'clientCode',
								itemId : 'clientName',
								cfgUrl :  'services/userseek/userActivityClientSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'clientCodeSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode   : 'CODE',
								cfgDataNode1 : 'DESCR',
								valueField : 'CODE',
								cfgStoreFields:['CODE','DESCR'],
								cfgProxyMethodType : 'POST',
								cfgExtraParams : [{key : '$filtercode1',value : sessionSellerCode}],
								listeners:{
								change:function(combo){
									selectedClient = '';
								    selectedClient=combo.getValue();
								}
								}
					}]
			   },
			   {
					xtype : 'panel',
					itemId : 'sellerPanel',
					layout : 'hbox',
					hidden : !isClientUser(),
					margin : '0 0 6 0',	
					items : [{
						xtype : 'label',
						text : getLabel('lblclient', 'Company Name'),
						width : 156,
						padding : '4 0 0 0',
						cls : 'black ux_font-size14'
					}, {
					xtype : 'combobox',
					width : 165,
					displayField : 'DESCR',
					itemId : 'clientNameDr',
					padding : '0 0 8 0',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'CODE',
					valueField : 'CODE',
					name : 'clientCode',
					editable : false,
					store : objClientStore,
					listeners:{
						change:function(combo){
							selectedClient = '';
						    selectedClient=combo.getValue();
						    console.log(selectedClient);
						}
					}
					
				}]
			   },/*{
					xtype : 'textfield',
					itemId : 'userCategory',
					fieldLabel : getLabel('lblcategory', 'Category'),
					fieldCls : 'w12 ',
					labelCls : 'ux_font-size14',
					labelWidth : 150,
					padding : '0 0 12 0'
				},*/{
					xtype : 'panel',
					itemId : 'userCategoryPanel',
					hidden : false,
					layout : 'hbox',
					margin : '0 0 6 0',
					items : [{
						xtype : 'label',
						text : getLabel('lblRole', 'User Category'),
						width : 156,
						padding : '10 0 0 0',
						cls : 'black ux_font-size12'
					}, {
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'ux_paddingb',
								padding : '12 0 12 0',
								fieldCls : 'xn-form-text w12 xn-suggestion-box',
								labelSeparator : '',
								name : 'category',
								itemId : 'userCategory',
								cfgUrl : 'services/categorySeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'categorySeek',
								cfgRootNode : 'd.activitylist',
								cfgKeyNode   : 'corporationName',
								cfgDataNode1 : 'corporationName',
								cfgStoreFields:['corporationName'],
								cfgProxyMethodType : 'POST',
								listeners:{
								change:function(combo){
									selectedRole = '';
									selectedRole= combo.getValue();
									if(Ext.isEmpty(selectedClient) && selectedClient != 'null')
										selectedClient ='';
									//combo.cfgExtraParams = [{key : '$filter', value : selectedClient }];
								}
								}
					}]
			   },{
					xtype : 'panel',
					itemId : 'usernamepanel',
					layout : 'hbox',
					margin : '0 0 8 0',
				items : [{
						xtype : 'label',
						text : getLabel('lblusername', 'User Name'),
						width : 156,
						padding : '4 0 0 0',
						cls : 'black ux_font-size12'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_paddingb',
					padding : '0 0 8 0',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'userDescription',
					itemId : 'username',
					cfgUrl : 'services/userActivityMstSeek/userNamesListSeek.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'userNamesListSeek',
					cfgKeyNode : 'value',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'value',
					cfgProxyMethodType : 'POST',
					listeners:{
						render:function(combo){
							combo.cfgExtraParams=[{
								key : '$filterseller',
								value : sessionSellerCode
							}]
						},
						change:function(combo){
							console.log(selectedRole);
							console.log(selectedClient);
							if(Ext.isEmpty(selectedRole) && selectedRole != 'null')
								selectedRole ='';
							if(Ext.isEmpty(selectedClient) && selectedClient != 'null')
								selectedClient ='';
							combo.cfgExtraParams = [{
								key : '$filterseller',value : sessionSellerCode}];
				}
			}
		}]
			},/*{
					xtype : 'textfield',
					itemId : 'ipAdress',
					fieldLabel : getLabel('lblipadd', 'IP Address'),
					fieldCls : 'w12 ux_font-size14',
					labelCls : 'ux_font-size14',
					padding : '0 0 12 0',
					labelWidth : 150
				},*/
			   {
					xtype : 'datefield',
					itemId : 'logintime',
					fieldLabel : getLabel('lbllogintime', 'Last Login Time'),
					fieldCls : 'w12 ux_font-size12',
					labelCls : 'ux_font-size12',
					padding : '0 0 8 0',
					labelWidth : 150
				},
				 {
					xtype : 'datefield',
					itemId : 'logouttime',
					fieldLabel : getLabel('lbllogouttime', 'Last Logout Time'),
					fieldCls : 'w12 ux_font-size12',
					labelCls : 'ux_font-size12',
					padding : '0 0 8 0',
					labelWidth : 150
				},
			  {
							xtype : 'container',
							itemId : 'loginStatusContainer',
							hidden : false,
							layout : 'hbox',
							items : [{
						xtype : 'label',
						text : getLabel('lblstatus', 'Status'),
						width : 140,
						cls : 'black ux_font-size12'
							},{
										xtype : 'combo',
										padding : '6 8 6 8',
										//height : 25,
										itemId : 'loginStatus',
										name : 'Status',
										editable : false,
										fieldCls : 'xn-form-field',
										triggerBaseCls : 'xn-form-trigger',
										store : statusValTypeStore,
										displayField : 'statusDesc',
										valueField : 'statusVal'
									}]
						},
				{
					xtype : 'textfield',
					itemId : 'channel',
					fieldLabel : getLabel('lblchannel', 'Channel'),
					fieldCls : 'w12',
					labelCls : 'ux_font-size12',
					padding : '0 0 8 0',
					labelWidth : 150
				},
				{
					xtype : 'textfield',
					itemId : 'userType',
					fieldLabel : getLabel('lbluserType', 'UserType'),
					fieldCls : 'w12',
					labelCls : 'ux_font-size12',
					padding : '0 0 8 0',
					labelWidth : 150
				},
				{
					xtype : 'textfield',
					itemId : 'filterCode',
					fieldLabel : getLabel('filterName', 'Filter Name'),
					fieldCls : 'w12',
					labelCls : 'ux_font-size12',
					padding : '0 0 8 0',
					labelWidth : 150
				},
				{
					xtype : 'label',
					text : getLabel('note', 'Note : This will also include static filters'),
					padding : '9 0 7 0'
				},
				{
					xtype : 'label',
					cls : 'page-heading-bottom-border',
					width : 500,
					padding : '4 0 0 0'
				}];

		this.dockedItems = [{
			xtype : 'toolbar',
			padding : '10 0 0 0',
			dock : 'bottom',
			items : ['->', {
						xtype : 'button',
						cls : 'ux_button-background-color ux_button-padding',
						glyph : 'xf002@fontawesome',
						text : getLabel('btnSearch', 'Search'),
						itemId : 'searchBtn',
						handler : function(btn) {
							if (me.callerParent == 'usrActivityView') {
								me.fireEvent('handleSearchAction', btn);
							}
						}
					}, {
						xtype : 'button',
						cls : 'ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							if (me.callerParent == 'usrActivityView') {
								me.fireEvent('handleSaveAndSearchAction', btn);
							}

						}
					}, {
						xtype : 'button',
						cls : 'ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn) {
							if (me.callerParent == 'usrActivityView') {
								me.fireEvent('closeFilterPopup', btn);
							}

						}
					},'->']
		}];

		this.callParent(arguments);
	},
	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];

		if(objOfCreateNewFilter.down('checkbox[itemId="bankUserFlag"]')!=null)
		{
		var bankusercheckbox = objOfCreateNewFilter.down( 'checkbox[itemId="bankUserFlag"]' ).getValue();
		if(!Ext.isEmpty( bankusercheckbox) && bankusercheckbox)
		{
			jsonArray.push(
			{
				field : 'bankUserFlag',
				operator : 'eq',
				value1 : '0',
				value2 : ''
			} );
		}
		}
		
		var username = objOfCreateNewFilter.down('textfield[itemId="username"]').getValue();
		if (!Ext.isEmpty(username)) 
		{
			jsonArray.push({
				field : 'username',
				operator : 'eq',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="username"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		
		
		if(objOfCreateNewFilter.down('combobox[itemId="sellerCodeID"]')!=null)
		{
		var sellerCodeID = objOfCreateNewFilter.down( 'combobox[itemId="sellerCodeID"]' ).getValue();
		if( !Ext.isEmpty( sellerCodeID))
		{
			jsonArray.push(
			{
				field : 'sellerCode',
				operator : 'eq',
				value1 : encodeURIComponent(sellerCodeID.replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			} );
		}
		}
		if(objOfCreateNewFilter.down('AutoCompleter[itemId="corporationName"]')!=null)
		{
		var corporationName = objOfCreateNewFilter.down('AutoCompleter[itemId="corporationName"]').getValue();
		if (!Ext.isEmpty(corporationName)) 
		{
			jsonArray.push({
				field : 'corporationName',
				operator : 'eq',
				value1 : encodeURIComponent(corporationName.replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		}
		
		if(objOfCreateNewFilter.down('AutoCompleter[itemId="userCategory"]')!=null)
		{
		var rolename = objOfCreateNewFilter.down('AutoCompleter[itemId="userCategory"]').getValue();
		if (!Ext.isEmpty(rolename)) 
		{
			jsonArray.push({
				field : 'userCategory',
				operator : 'lk',
				value1 : encodeURIComponent(rolename.replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		}
		
		if(objOfCreateNewFilter.down('AutoCompleter[itemId="clientName"]')!=null)
		{
		var clientName = objOfCreateNewFilter.down('AutoCompleter[itemId="clientName"]').getValue();
		if (!Ext.isEmpty(clientName)) 
		{
			jsonArray.push({
				field : 'clientName',
				operator : 'eq',
				value1 : encodeURIComponent(clientName.replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		}
		
		
		if(objOfCreateNewFilter.down('combobox[itemId="clientNameDr"]')!=null)
		{
	var clientName = objOfCreateNewFilter.down('combobox[itemId="clientNameDr"]').getValue();
	if (!Ext.isEmpty(clientName)) {
		jsonArray.push({
					field : 'clientName',
					operator : 'eq',
					value1 : encodeURIComponent(clientName.replace(new RegExp("'", 'g'), "\''")),
					value2 : ''
				});
	}
		}
		

		/*var userCategory = objOfCreateNewFilter.down('textfield[itemId="userCategory"]').getValue();
		if (!Ext.isEmpty(userCategory)) 
		{
			jsonArray.push({
				field : 'userCategory',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down('textfield[itemId="userCategory"]').getValue(),
				value2 : ''
			});
		}*/
		
/*		var ipAdress = objOfCreateNewFilter.down('textfield[itemId="ipAdress"]').getValue();
		if (!Ext.isEmpty(ipAdress)) 
		{
			jsonArray.push({
				field : 'ipAdress',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down('textfield[itemId="ipAdress"]').getValue(),
				value2 : ''
			});
		}*/
		
		var logintime = objOfCreateNewFilter.down('textfield[itemId="logintime"]').getValue();
		if (!Ext.isEmpty(logintime)) 
		{
			jsonArray.push({
				field : 'logintime',
				operator : 'eq',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="logintime"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		
		var logouttime = objOfCreateNewFilter.down('textfield[itemId="logouttime"]').getValue();
		if (!Ext.isEmpty(logouttime)) 
		{
			jsonArray.push({
				field : 'logouttime',
				operator : 'eq',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="logouttime"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		var loginStatus = objOfCreateNewFilter.down('textfield[itemId="loginStatus"]').getValue();
		if (!Ext.isEmpty(loginStatus)) 
		{
			jsonArray.push({
				field : 'loginStatus',
				operator : 'lk',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="loginStatus"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}

		var channel = objOfCreateNewFilter.down('textfield[itemId="channel"]').getValue();
		if (!Ext.isEmpty(channel)) 
		{
			jsonArray.push({
				field : 'channel',
				operator : 'eq',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="channel"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		var userType = objOfCreateNewFilter.down('textfield[itemId="userType"]').getValue();
		if (!Ext.isEmpty(userType)) 
		{
			jsonArray.push({
				field : 'userType',
				operator : 'eq',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="userType"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			});
		}
		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;
		return objJson;
	},
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];

		
		if(objOfCreateNewFilter.down('checkbox[itemId="bankUserFlag"]')!=null)
		{
		var bankusercheckbox = objOfCreateNewFilter.down( 'checkbox[itemId="bankUserFlag"]' ).getValue();
		if(!Ext.isEmpty( bankusercheckbox) && bankusercheckbox)
		{
			jsonArray.push(
			{
				field : 'bankUserFlag',
				operator : 'eq',
				value1 : '0',
				value2 : '',
				dataType : 0,
				displayType : 0
			} );
		}
		}
		
		
		var username = objOfCreateNewFilter.down('textfield[itemId="username"]').getValue();
		if (!Ext.isEmpty(username)) 
		{
			jsonArray.push({
				field : 'userName',
				operator : 'lk',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="username"]').getValue().replace(new RegExp("'", 'g'), "\''")).toUpperCase(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		
		
		if(objOfCreateNewFilter.down('AutoCompleter[itemId="userCategory"]')!=null)
		{
		var rolename = objOfCreateNewFilter.down('AutoCompleter[itemId="userCategory"]').getValue();
		if (!Ext.isEmpty(rolename)) 
		{
			jsonArray.push({
				field : 'userCategory',
				operator : 'lk',
				value1 : encodeURIComponent(rolename.replace(new RegExp("'", 'g'), "\''")).toUpperCase(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		}
		
		
		if(objOfCreateNewFilter.down('combobox[itemId="sellerCodeID"]')!=null)
			{
		var sellerCodeID = objOfCreateNewFilter.down( 'combobox[itemId="sellerCodeID"]' ).getValue();
		if( !Ext.isEmpty( sellerCodeID))
		{
			jsonArray.push(
			{
				field : 'sellerCode',
				operator : 'eq',
				value1 : encodeURIComponent(objOfCreateNewFilter.down( 'combobox[itemId="sellerCodeID"]' ).getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : ''
			} );
		}
			}
		if(objOfCreateNewFilter.down('AutoCompleter[itemId="corporationName"]')!=null)
			{
		var corporationName = objOfCreateNewFilter.down('AutoCompleter[itemId="corporationName"]').getValue();
		if (!Ext.isEmpty(corporationName)) {
			jsonArray.push({
						field : 'corporationName',
						operator : 'eq',
						value1 : encodeURIComponent(corporationName.replace(new RegExp("'", 'g'), "\''")),
						value2 : ''
					});
		}
			}
		/*var corporationName = objOfCreateNewFilter.down('textfield[itemId="corporationName"]').getValue();
		if (!Ext.isEmpty(corporationName)) 
		{
			jsonArray.push({
				field : 'corporationName',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down('textfield[itemId="corporationName"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		
		var clientName = objOfCreateNewFilter.down('textfield[itemId="clientName"]').getValue();
		if (!Ext.isEmpty(clientName)) 
		{
			jsonArray.push({
				field : 'clientName',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down('textfield[itemId="clientName"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}*/
		if(objOfCreateNewFilter.down('AutoCompleter[itemId="clientName"]')!=null)
			{
		var clientName = objOfCreateNewFilter.down('AutoCompleter[itemId="clientName"]').getValue();
		if (!Ext.isEmpty(clientName)) {
			jsonArray.push({
						field : 'clientName',
						operator : 'eq',
						value1 : encodeURIComponent(clientName.replace(new RegExp("'", 'g'), "\''")),
						value2 : ''
					});
		}
			}
		
		if(objOfCreateNewFilter.down('combobox[itemId="clientNameDr"]')!=null)
		{
	var clientName = objOfCreateNewFilter.down('combobox[itemId="clientNameDr"]').getValue();
	if (!Ext.isEmpty(clientName)) {
		jsonArray.push({
					field : 'clientName',
					operator : 'eq',
					value1 : encodeURIComponent(clientName.replace(new RegExp("'", 'g'), "\''")),
					value2 : ''
				});
	}
		}
		
		/*var userCategory = objOfCreateNewFilter.down('textfield[itemId="userCategory"]').getValue();
		if (!Ext.isEmpty(userCategory)) 
		{
			jsonArray.push({
				field : 'userCategory',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down('textfield[itemId="userCategory"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}*/
		
	/*	var ipAdress = objOfCreateNewFilter.down('textfield[itemId="ipAdress"]').getValue();
		if (!Ext.isEmpty(ipAdress)) 
		{
			jsonArray.push({
				field : 'ipAdress',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down('textfield[itemId="ipAdress"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}*/
		
		var logintime = objOfCreateNewFilter.down('textfield[itemId="logintime"]').getValue();
		if (!Ext.isEmpty(logintime)) 
		{
			jsonArray.push({
				field : 'logintime',
				operator : 'lk',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="logintime"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		var logouttime = objOfCreateNewFilter.down('textfield[itemId="logouttime"]').getValue();
		if (!Ext.isEmpty(logouttime)) 
		{
			jsonArray.push({
				field : 'logouttime',
				operator : 'lk',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="logouttime"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		var loginStatus = objOfCreateNewFilter.down('textfield[itemId="loginStatus"]').getValue();
		if (!Ext.isEmpty(loginStatus)) 
		{
			jsonArray.push({
				field : 'loginStatus',
				operator : 'lk',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="loginStatus"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		var channel = objOfCreateNewFilter.down('textfield[itemId="channel"]').getValue();
		if (!Ext.isEmpty(channel)) 
		{
			jsonArray.push({
				field : 'channel',
				operator : 'lk',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="channel"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		} 
		var userType = objOfCreateNewFilter.down('textfield[itemId="userType"]').getValue();
		if (!Ext.isEmpty(userType)) 
		{
			jsonArray.push({
				field : 'userType',
				operator : 'lk',
				value1 : encodeURIComponent(objOfCreateNewFilter.down('textfield[itemId="userType"]').getValue().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function(objCreateNewFilterPanel) 
	{
		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText(' ');
		objCreateNewFilterPanel.down('textfield[itemId="username"]').reset();
		
		if(objCreateNewFilterPanel.down('combobox[itemId="sellerCodeID"]')!=null)
			objCreateNewFilterPanel.down('combobox[itemId="sellerCodeID"]').reset();
		//objCreateNewFilterPanel.down('AutoCompleter[itemId="corporationName"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="clientName"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="userCategory"]').reset();
		
		//objCreateNewFilterPanel.down('textfield[itemId="userCategory"]').reset();
		//objCreateNewFilterPanel.down('textfield[itemId="ipAdress"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="logintime"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="logouttime"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="loginStatus"]').reset();		
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
		objCreateNewFilterPanel.down('checkbox[itemId="bankUserFlag"]').reset();
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) 
	{
		objCreateNewFilterPanel.down('textfield[itemId="username"]').setDisabled(boolVal);
		if(objCreateNewFilterPanel.down('combobox[itemId="sellerCodeID"]')!=null)
			objCreateNewFilterPanel.down('combobox[itemId="sellerCodeID"]').setDisabled(boolVal);
		//objCreateNewFilterPanel.down('AutoCompleter[itemId="corporationName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="clientName"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="userCategory"]').setDisabled(boolVal);
		//objCreateNewFilterPanel.down('textfield[itemId="userCategory"]').setDisabled(boolVal);
		//objCreateNewFilterPanel.down('textfield[itemId="ipAdress"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="logintime"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="logouttime"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="loginStatus"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="bankUserFlag"]').setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal)
	{
		objCreateNewFilterPanel.down('textfield[itemId="username"]').setReadOnly(boolVal);
		if(objCreateNewFilterPanel.down('combobox[itemId="sellerCodeID"]')!=null)
			objCreateNewFilterPanel.down('combobox[itemId="sellerCodeID"]').setReadOnly(boolVal);
		//objCreateNewFilterPanel.down('AutoCompleter[itemId="corporationName"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="clientName"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="userCategory"]').setReadOnly(boolVal);
		//objCreateNewFilterPanel.down('textfield[itemId="userCategory"]').setReadOnly(boolVal);
		//objCreateNewFilterPanel.down('textfield[itemId="ipAdress"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="logintime"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="logouttime"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="loginStatus"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="bankUserFlag"]').setReadOnly(boolVal);
	}
});