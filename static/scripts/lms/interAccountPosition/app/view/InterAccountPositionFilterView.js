Ext.define( 'GCP.view.InterAccountPositionFilterView',
		{
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'interAccountPositionFilterView',
	layout:'vbox',
	initComponent : function() {
		var me=this, strUrl='';
		
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
			var objSellerStore = Ext.create('Ext.data.Store', {
						fields : ['sellerCode', 'description'],
						data : storeData,
						reader : {
							type : 'json',
							root : 'filterList'
						}
						});
			/*if(objSellerStore.getCount() > 1){
				multipleSellersAvailable = true;
			}
			isMultipleClientAvailable = true;*/
		}
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (clientStore) {
							clientStore.removeAll();
							var count = data.length;
							if (count > 1) {
								clientStore.add({
											'CODE' : 'all',
											'DESCR' : 'All Companies'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								clientStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
				
		me.items = [
		            {
		            	xtype : 'container',
		            layout : 'hbox',
		            width : '100%',
		            hidden : (isClientUser()) ? true : false,//If not admin then hide
		            items : [
		            {
			xtype : 'container',
			layout : 'vbox',
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						cls 	: 'required',
						text : getLabel('lblFi', 'Financial Institution')
					}, {
						xtype : 'combo',
						displayField : 'description',
						height:36,
						width : '100%',
						padding : '-4 0 0 0',
						filterParamName : 'sellerCode',
						itemId : 'entitledSellerIdItemId',
						valueField : 'sellerCode',
						name : 'sellerCombo',
						editable : false,
						emptyText : getLabel('searchByFi','Search By FI'),
						value :seller,
						store : objSellerStore,
						listeners : {
							/*'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								$('#msClient').val(selectedFilterClient);
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
							},*/
							/*boxready : function(combo, width, height, eOpts) {
								combo.setValue(combo.getStore().getAt(0));
							}*/
						}
					}]
		}]},
		{
        	xtype : 'container',
        layout : 'hbox',
        width : '100%',
      //  hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
        items : [
    {
				xtype : 'container',
				itemId : 'clientContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 25 0 0',
				hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
				items : [{
							xtype : 'label',
							text : getLabel("grid.column.company", "Company Name"),
							cls 	: 'required',
							flex : 1,
							margin : '0 0 0 0'
						}, {
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '100%',
							itemId : 'quickFilterClientCombo',
							mode : 'local',
							padding : '-4 0 0 0',
							emptyText : getLabel('selectclient',
									'Select Client'),
							store : me.getClientStore(),
							listeners : {
								boxready : function(combo, width, height, eOpts) {
									combo.setValue(combo.getStore().getAt(0));
								}
							}
						}]
			},{
	xtype : 'container',
	layout : 'vbox',
	hidden : (isClientUser()) ? true : false,//If not admin then hide
	width : '25%',
	padding : '0 25 0 0',
	items : [{
				xtype : 'label',
				itemId : 'savedFiltersLabel',
				cls 	: 'required',
				text : getLabel('grid.column.company', 'Company Name')
			}, {
				xtype : 'AutoCompleter',
				matchFieldWidth : true,
				fieldLabel : '',
				fieldCls : 'xn-form-text xn-suggestion-box',
				itemId : 'clientCodeItemId',
				cls : 'autoCmplete-field',
				labelSeparator : '',
				padding : '-4 0 0 0',
				width: '100%',
				cfgUrl : 'services/userseek/interAccountPositionClientSeek.json',
				cfgQueryParamName : '$autofilter',
				emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
				cfgRecordCount : -1,
				cfgSeekId : 'interAccountPositionClientSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				//cfgDataNode2 : 'SHORTNAME',
				cfgKeyNode : 'CODE',
				value : clientId,
				cfgStoreFields :
					[
						'CODE','DESCRIPTION','SHORTNAME'
					],
				cfgExtraParams :
				[
					{
						key : '$filtercode1',
						value : seller
					}
				]
				/*listeners :
				{
					select : function( combo, record, index )
					{
					//	clientId = record[ 0 ].data.CODE;
						document.getElementById( "clientDescription" ).value = record[ 0 ].data.DESCRIPTION;
						var clientCodeValue = record[ 0 ].data.CODE;
						document.getElementById( "agreementRecKey" ).value = null  ;
						document.getElementById( "accountId1" ).value = null ;
						document.getElementById( "accountId2" ).value = null ;
						createAgreementAutoCompletor( clientCodeValue );
						$(document).trigger("handleClientChangeInQuickFilter",
								false);
					},
					'change' : function( combo, record, index )
					{				
						if(combo.value == ''|| combo.value == null)
						{
						
							document.getElementById( "agreementCode" ).value = null;
							document.getElementById( "accountId1" ).value = null;
							document.getElementById( "agreementRecKey" ).value = null;
							document.getElementById( "accountId1" ).value = null;					
							document.getElementById( "clientId" ).value = null;					
							document.getElementById( "clientDescription" ).value = null;	
							document.getElementById( "clientCodeDiv" ).value = "";					
							createAgreementAutoCompletor( '' );	
							createAccount1AutoCompletor('');
							createAccount2AutoCompletor('');												
						}
					}
				}*/
			}]
},{
xtype : 'container',
layout : 'vbox',
width : '25%',
padding : '0 25 0 0',
items : [{
			xtype : 'label',
			itemId : 'savedFiltersLabel1',
			cls 	: 'required',
			text : getLabel('AgreementCode', 'Agreement Code')
		}, {
			xtype : 'AutoCompleter',
			matchFieldWidth : true,
			fieldLabel : '',
			itemId : 'agreementItemId',
			cls : 'ux_normalmargin-top',
			cfgTplCls : 'xn-autocompleter-t7',
			padding : '-4 0 0 0',
			width: '100%',
			labelSeparator : '',
			emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
			fieldCls : 'xn-form-text xn-suggestion-box',
			cfgUrl : 'services/userseek/interAccountPositionAgreementSeek.json',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			cfgSeekId : 'interAccountPositionAgreementSeek',
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'CODE',
			cfgDataNode2 : 'DESCRIPTION',
			cfgStoreFields :
				[
					'CODE', 'DESCRIPTION','RECORD_KEY_NO'
				],
			listeners : {
					boxready : function(combo, width, height, eOpts) {
						if(strClient != null )
						{
							combo.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : strClient
								}
							];
						}
					}
				}
			/*cfgExtraParams :
				[
					{
						key : '$filtercode1',
						value : clientId,
					}
				],*/
			/*listeners :
			{
				select : function( combo, record, index )
				{
					document.getElementById( "agreementRecKey" ).value = record[ 0 ].data.RECORD_KEY_NO;
					document.getElementById( "agreementCode" ).value = record[ 0 ].data.CODE;
					document.getElementById( "agreementDescription" ).value = record[ 0 ].data.DESCRIPTION;
									
					var agreementRekKey = record[ 0 ].data.RECORD_KEY_NO ;
					document.getElementById( "accountId1" ).value = null ;
					document.getElementById( "accountId1" ).value = null ;
					createAccount1AutoCompletor(agreementRekKey);
					createAccount2AutoCompletor(agreementRekKey);
				},
				'change' : function( combo, record, index )
				{				
					if(combo.value == ''|| combo.value == null)
					{
						document.getElementById( "agreementCode" ).value = null;
						document.getElementById( "accountId1" ).value = null;
						document.getElementById( "agreementRecKey" ).value = null;
						document.getElementById( "accountId2" ).value = null;		
						createAccount1AutoCompletor('');
						createAccount2AutoCompletor('');
				
					}
				}
			}*/
		}]
	}]}
		, {
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				padding : '0 25 0 0',
				items : [{
							xtype 	: 'label',
							itemId 	: 'savedFiltersLabel',
							cls 	: 'required',
							text 	: getLabel('Participating Account', 'Participating Account')
						}, {
							xtype : 'AutoCompleter',
							fieldLabel : '',
							matchFieldWidth : true,
							itemId : 'participatingAccItemId',
							cls : 'ux_normalmargin-top',
							cfgTplCls : 'xn-autocompleter-t7',
							emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
							labelSeparator : '',
							padding : '-4 0 0 0',
							width: '100%',
							fieldCls : 'xn-form-text xn-suggestion-box',
							cfgUrl : 'services/userseek/interAccountPositionAccount1Seek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'interAccountPositionAccount1Seek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCRIPTION',
							cfgStoreFields :
								[
									'CODE', 'DESCRIPTION','ACCTID','CCYCODE'
								],
							listeners:{
							  select:function(combo, record, index){
							   participatingAccountCurrency=record[ 0 ].data.CCYCODE;
							  }
							}
							/*cfgExtraParams :
								[
									{
										key : '$filtercode1',
										value : agreementRekKey
									}
								],*/
							/*listeners :
							{
								select : function( combo, record, index )
								{
									document.getElementById( "accountId1" ).value = record[ 0 ].data.ACCTID;
									document.getElementById( "accountId1" ).value = record[ 0 ].data.ACCTID;
									document.getElementById( "accountOneDescription" ).value = record[ 0 ].data.DESCRIPTION;
									var agreementRekKey = document.getElementById( "agreementRecKey" ).value ;
									document.getElementById( "accountId2" ).value = null ;
									createAccount2AutoCompletor(agreementRekKey,record[ 0 ].data.ACCTID);
								},
								'change' : function( combo, record, index )
								{				
									if(combo.value == ''|| combo.value == null)
									{
										document.getElementById( "accountId1" ).value = null;						
										document.getElementById( "accountId2" ).value = null;	
										document.getElementById( "accountOneDescription" ).value = null;
										createAccount2AutoCompletor('');			
									}
								}
							}*/
						}]
					},{
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 25 0 0',
			//	hidden : isHidden('AdvanceFilter'),
				items : [{
							xtype : 'label',
							itemId : 'savedFiltersLabel',
							cls 	: 'required',
							text : getLabel('ContraAccount', 'Contra Account')
						}, {
							xtype : 'AutoCompleter',
							fieldLabel : '',
							matchFieldWidth : true,
							itemId : 'contraAccItemId',
							cls : 'ux_normalmargin-top',
							cfgTplCls : 'xn-autocompleter-t7',
							emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
							labelSeparator : '',
							padding : '-4 0 0 0',
							width: '100%',
							fieldCls : 'xn-form-text xn-suggestion-box',
							cfgUrl : 'services/userseek/interAccountPositionAccount2Seek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'interAccountPositionAccount2Seek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCRIPTION',
							cfgStoreFields :
								[
									'CODE', 'DESCRIPTION','ACCTID'
								]
							/*cfgExtraParams :
								[
									{
										key : '$filtercode1',
										value : agreementReckKey
									},
									{
										key : '$filtercode2',
										value : account1
									}
								],
							listeners :
							{
								select : function( combo, record, index )
								{
									document.getElementById( "accountId2" ).value = record[ 0 ].data.ACCTID;
									document.getElementById( "accountTwoDescription" ).value = record[ 0 ].data.DESCRIPTION;
								},
								'change' : function( combo, record, index )
								{				
									if(combo.value == ''|| combo.value == null)
									{
										document.getElementById( "accountId2" ).value = null;	
										document.getElementById( "accountTwoDescription" ).value = null;	
									}
								}
							}*/
						}]
			}, {
				xtype : 'container',
				itemId : 'fromDateContainer',
				layout : 'vbox',
				width : '28%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'panel',
					itemId : 'fromDatePanel',
					height : 23,
					//width : '100%',
					//flex : 1,
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'fromDateLabel',
								cls 	: 'required',
								text : getLabel('FromDate', 'Date')
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'FromDate',
								itemId : 'fromDateBtn',
								cls : 'ui-caret-dropdown',
								listeners : {
									click : function(event) {
										var menus = getDateDropDownItems(
												"fromDateQuickFilter", this);
										var xy = event.getXY();
										menus.showAt(xy[0], xy[1] + 16);
										event.menu = menus;
										// event.removeCls('ui-caret-dropdown'),
										// event.addCls('action-down-hover');
									}
								}
							}]
				}, {
					xtype : 'container',
					itemId : 'fromDateToContainer',
					layout : 'hbox',
					width : '100%',
					items : [{
						xtype : 'component',
						width : '85%',
						itemId : 'InterAccfromDatePicker',
						filterParamName : 'FromDate',
						html : '<input type="text"  id="fromDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}
					]
				}]
			}/*, {
				xtype : 'container',
				itemId : 'entryDateContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 20 0 0',
				items : [{
					xtype : 'panel',
					itemId : 'entryDatePanel',
					height : 23,
					width : '100%',
					flex : 1,
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'entryDateLabel',
								text : getLabel('toDate', 'To Date')
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'EntryDate',
								itemId : 'entryDateBtn',
								cls : 'ui-caret-dropdown',
								listeners : {
									click : function(event) {
										var menus = getDateDropDownItems(
												"entryDateQuickFilter", this);
										var xy = event.getXY();
										menus.showAt(xy[0], xy[1] + 16);
										event.menu = menus;
										// event.removeCls('ui-caret-dropdown'),
										// event.addCls('action-down-hover');
									}
								}
							}]
				}, {
					xtype : 'container',
					itemId : 'entryDateToContainer',
					layout : 'hbox',
					width : '100%',
					items : [{
						xtype : 'component',
						width : 197,
						itemId : 'paymentEntryDataPicker',
						filterParamName : 'EntryDate',
						html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}
					]
				}]
			}*/,
			{
				xtype : 'container',
				itemId : 'savedFiltersContainer22',
				layout : 'vbox',
				width : '25%',
				padding : '0 0 0 0',
			//	hidden : isHidden('AdvanceFilter'),
				items : [{
							xtype : 'label',
							itemId : 'savedFiltersLabel22',
							text : getLabel('lblsearch', 'Search'),
							cls : 'create-advanced-filter-label'
							//width : '70px',
							/*listeners : {
								render : function(c) {
									c.getEl().on('click', function() {
												me.fireEvent('handleTransCategoryTypeCodeClick',c);
											}, c);
								}
							}*/
						}]
			}
			
			]
		}];
		this.callParent(arguments);	
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode='+ seller,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	}

} );
