Ext
	.define(
		'GCP.controller.BankAdminUserController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.BankAdminUserGridView'
			],
			views :
			[
				'GCP.view.BankAdminUserView', 
				'GCP.view.BankAdminUserFilterView'
			],

			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'bankAdminUserViewRef',
					selector : 'bankAdminUserViewType'
				},
				{
					ref : 'bankAdminUserGridViewRef',
					selector : 'bankAdminUserViewType bankAdminUserGridViewType'
				},
				{
					ref : 'bankAdminUserDtlViewRef',
					selector : 'bankAdminUserViewType bankAdminUserGridViewType panel[itemId="bankAdminUserDtlViewItemId"]'
				},
				{
					ref : 'bankAdminUserGridRef',
					selector : 'bankAdminUserViewType bankAdminUserGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'bankAdminUserViewType bankAdminUserGridViewType bankAdminUserGroupActionViewType'
				},
	    		{
		           ref : "sellerFilter",
		          selector : 'bankAdminUserViewType bankAdminUserFilterViewType combobox[itemId="sellerCombo"]'
	            },
				{
				ref : "statusFilter",
				selector : 'bankAdminUserFilterViewType combobox[itemId="requestStateFilterItemId"]'
				},
				{
					ref : 'bankAdminUserFilterViewRef',
					selector : 'bankAdminUserViewType bankAdminUserFilterViewType'
				},
				{
					ref : 'specificFilterPanel',
					selector : 'bankAdminUserViewType bankAdminUserFilterViewType container[itemId="specificFilter"]'
				},
				{
					ref : 'roleFilter',
					selector : 'bankAdminUserFilterViewType AutoCompleter[itemId="categoryCodeFilterItemId"]'
				},
				{
					ref : 'userNameFilter',
					selector : 'bankAdminUserFilterViewType AutoCompleter[itemId="userCodeFilterItemId"]'
				},
				{
					ref : 'branchNameFilter',
					selector : 'bankAdminUserFilterViewType AutoCompleter[itemId="branchCodeFilterItemId"]'
				}
			],

			config :
			{
				filterCodeValue : null,
				sellerFilterVal : strSellerId,
				sellerKeyFilter : strSellerId,
				categoryCodeFilterVal : 'all',
				categoryRecKeyFilterVal : 'all',
				userCodeFilterVal : 'all',
				userCodeKeyFilterVal : 'all',
				statusFilterVal : 'all',
				statusKeyFilter : 'all',
				branchCodeKeyFilter : 'all',
				filterData : [],
				filterApplied : 'ALL',
				//recordIdetifier : null,
				recordViewState : null
			},

			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;

				me.control(
				{
				'bankProductView bankProductFilterView' : {
				'handleChangeFilter': function(combo, strNewValue, strOldValue){
					me.setDataForFilter();
				}
			},
				
					'bankAdminUserViewType' :
					{
						render : function( panel )
						{
						},
						performReportAction : function( btn, opts )
						{
							me.handleReportAction( btn, opts );
						}
					},
                     'bankAdminUserView BankAdminUserGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			  },
			  'bankAdminUserGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},

					'bankAdminUserFilterViewType' :
					{
						render : function( panel, opts )
						{
							me.setInfoTooltip();
							me.handleSpecificFilter();
						},
						expand : function( panel )
						{
							//me.toggleSavePrefrenceAction( true );
						},
						collapse : function( panel )
						{
							//me.toggleSavePrefrenceAction( true );
						},
						filterStatusType : function( btn, opts )
						{
							//me.toggleSavePrefrenceAction( true );
							me.handleStatusTypeFilter( btn );
						}
					},

					'bankAdminUserGridViewType smartgrid' :
					{
						render : function( grid )
						{
							me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
						{
							me.enableValidActionsForGrid( grid, record, recordIndex, records, jsonData );
						},
						statechange : function( grid )
						{
							//me.toggleSavePrefrenceAction( true );
						},
						pagechange : function( pager, current, oldPageNum )
						{
							//me.toggleSavePrefrenceAction( true );
						}
					},

					'bankAdminUserGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},

					'bankAdminUserFilterViewType AutoCompleter[itemId="categoryCodeFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getBankAdminUserFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="userCodeFilterItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/bankusrAdminAllUserCodeSeek.json';
							objAutocompleter.cfgSeekId = 'bankAdminUserCodeSeek';
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								},
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
							
							var objAutocompleterSSOUsrId = objFilterPanel.down( 'AutoCompleter[itemId="SsoUserIdFilterItemId"]' );
							objAutocompleterSSOUsrId.setValue( '' );
							objAutocompleterSSOUsrId.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								},
								{
									key : '$sellerCode',
									value : strSellerId
								}
							];
							
							me.categoryCodeFilterVal = record[ 0 ].data.CODE;
							me.categoryRecKeyFilterVal = record[ 0 ].data.CODE;
						},
						change : function( combo, newValue, record, index )
						{
							var objAutocompleter = me.getBankAdminUserFilterViewRef().down( 'AutoCompleter[itemId="userCodeFilterItemId"]' );
							objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : 'ALL'
									},
									{
										key : '$sellerCode',
										value : strSellerId
									}
								];
							
							var objAutocompleterSSOUsrId = me.getBankAdminUserFilterViewRef().down( 'AutoCompleter[itemId="SsoUserIdFilterItemId"]' );
							objAutocompleterSSOUsrId.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : 'ALL'
									},
									{
										key : '$sellerCode',
										value : strSellerId
									}
								];
								me.categoryCodeFilterVal = 'all';
								me.categoryRecKeyFilterVal = 'all';
							}
					},
					'bankAdminUserFilterViewType AutoCompleter[itemId="userCodeFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.userCodeFilterVal = record[ 0 ].data.USRCODE;
							me.userCodeKeyFilterVal = record[ 0 ].data.RECORD_KEY_NO;
						},
						
						change : function( combo, newValue, oldValue, eOpts )
						{
								me.userCodeFilterVal = 'all';
								me.userCodeKeyFilterVal = 'all';
							}
					},
					'bankAdminUserFilterViewType AutoCompleter[itemId="SsoUserIdFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
						
							me.ssoUserIdFilterVal = record[ 0 ].data.CODE;
							me.ssoUserIdKeyFilterVal = record[ 0 ].data.RECORD_KEY_NO;
							//me.clearUserName();
						},
						change : function( combo, record, index )
						{
								me.ssoUserIdFilterVal = 'all';
								me.ssoUserIdKeyFilterVal = 'all';
							}
					},
					'bankAdminUserFilterViewType combobox[itemId="requestStateFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.statusKeyFilter = record[ 0 ].data.key;
							me.statusFilterVal = record[ 0 ].data.value;
						}
					},
               'bankAdminUserFilterViewType combobox[itemId="sellerFltId"]' :
					{
						select : function( combo, record, index )
						{
							me.sellerKeyFilter = record[ 0 ].data.key;
							me.sellerFilterVal = record[ 0 ].data.value;
						}
					},
					'bankAdminUserFilterViewType AutoCompleter[itemId="branchCodeFilterItemId"]' : 
					{
						select : function( combo, record, index )
						{
							me.branchCodeKeyFilter = record[ 0 ].data.CODE;
						},
						change : function( combo, record, index )
						{
							me.branchCodeKeyFilter = 'all';
						}
					},
					'bankAdminUserFilterViewType button[itemId="btnFilter"]' :
					{
						click : function( btn, opts )
						{
							me.callHandleLoadGridData();
						}
					}

				} );
			},
			clearUserCode: function () {
				var me = this;
				var objFilterPanel = me.getBankAdminUserFilterViewRef();
				var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="SsoUserIdFilterItemId"]' );
				objAutocompleter.setValue( '' );
				me.ssoUserIdFilterVal = 'all';
				me.ssoUserIdKeyFilterVal = 'all';
			},
			resetUserCode : function ()
			{
				var me = this;
				var jsonArray = [];
				// SsouserId AutoCompleter
				var objFilterPanel = me.getBankAdminUserFilterViewRef();
				var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="SsoUserIdFilterItemId"]' );
				objAutocompleter.cfgUrl = 'services/userseek/bankAdminSsoUserIdSeek.json';
				objAutocompleter.cfgSeekId = 'bankAdminSsoUserIdSeek';
				objAutocompleter.setValue( '' );
				objAutocompleter.cfgExtraParams = jsonArray;
				jsonArray.push(
				{
					key : '$sellerCode',
					value : strSellerId
				} );
				
				var categoryCode = '%';
				if( !Ext.isEmpty( me.categoryRecKeyFilterVal ) && me.categoryRecKeyFilterVal != 'all' )
				{
					categoryCode = me.categoryCodeFilterVal;
				}
				jsonArray.push(
				{
					key : '$filtercode1',
					value : categoryCode
				} );
			},
			setDataForFilter : function()
			{
				var me = this;
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
			},
			handleSpecificFilter : function()
			{
				var me = this;
				var filterPanel = me.getSpecificFilterPanel();
				if (!Ext.isEmpty(filterPanel))
				{
					filterPanel.removeAll();
				}
				filterPanel.flex=2.9;
				filterPanel.doLayout();
				var arrItems = [];
				arrItems.push(me.createFICombo());
				arrItems.push(me.createRoleAutoCompleter());
				arrItems.push(me.createUserNameAutoCompleter());
				arrItems.push(me.createankAdminSsoAutoCompleter());
				arrItems.push(me.createStatusCombo());
				arrItems.push(me.createBranchNameAutoCompleter());
				arrItems.push(me.createSearchBtn());
				filterPanel.add(arrItems);
			},
			createLable: function(key,defaultValue){
				var labelField = Ext.create('Ext.form.Label', {
					cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
					text : getLabel(key, defaultValue)
				});
				return labelField;
			},
			createFICombo : function(){
				var me = this;
				Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});	
				var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
				multipleSellersAvailable = false;
				if (objStore.getCount() > 1) {
					multipleSellersAvailable = true;
				}
				var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
					displayField : 'DESCR',
					fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'sellerCode',
					itemId : 'sellerCombo',
					valueField : 'CODE',
					name : 'sellerCode',
					editable : false,
					store : objStore,
					value : strSellerId,
					width : 165,
					listeners : {
						'render' : function(combo, record) {
							combo.store.load();
							var roleFilter = me.getRoleFilter();
							roleFilter.reset();
							var userNameFilter = me.getUserNameFilter();
							userNameFilter.reset();
							var branchNameFilter = me.getBranchNameFilter();
							branchNameFilter.reset();
						},
						'change' : function(combo, record) {
							var strSellerId=combo.getValue();
							setAdminSeller(strSellerId);
							var roleFilter = me.getRoleFilter();
							roleFilter.reset();
							var userNameFilter = me.getUserNameFilter();
							userNameFilter.reset();
							var branchNameFilter = me.getBranchNameFilter();
							branchNameFilter.reset();
						}
					}
				});
				var fiContainer = Ext.create('Ext.container.Container', {
					columnWidth : 0.3,
					padding : '5px',
					hidden: !multipleSellersAvailable,
					filterParamName: 'sellerCode',
					itemId : 'sellerFilter',
					items : [me.createLable('seller', 'FI'), sellerComboField]
				});
				return fiContainer;
			},
			createRoleAutoCompleter : function(){
				var me=this;
				var roleTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'categoryCode',
					itemId : 'categoryCodeFilterItemId',
					cfgUrl : 'services/userseek/bankAdminUserCategoryCodeSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'bankAdminUserCategoryCodeSeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgStoreFields :['CODE', 'DESCRIPTION', 'RECORD_KEY_NO'],
					cfgExtraParams :
					[
						{
							key : '$sellerCode',
							value : "OWNER"
						}
					]
				});
				var roleContainer = Ext.create('Ext.container.Container', {
					xtype : 'container',
					columnWidth : 0.3,
					padding : '5px',
					itemId: 'brankRoleFilterPanel',
					items : [me.createLable('lbl.bankAdminUser.bankRoleName', 'Role'), roleTextField]
				});
				return roleContainer;
			},
			createUserNameAutoCompleter : function(){
				var me=this;
				var userNameTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'userCode',
					itemId : 'userCodeFilterItemId',
					cfgUrl : 'services/userseek/bankusrAdminAllUserCodeSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'bankusrAdminAllUserCodeSeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgStoreFields :['USRCODE','CODE', 'DESCRIPTION', 'RECORD_KEY_NO'],
					cfgExtraParams :
					[
						{
							key : '$filtercode1',
							value : 'ALL'
						},
						{
							key : '$sellerCode',
							value : strSellerId
						}
					]
				});
				var userNameContainer = Ext.create('Ext.container.Container', {
					xtype : 'container',
					columnWidth : 0.3,
					padding : '5px',
					itemId: 'branchUserNameFilterPanel',
					items : [me.createLable('lbl.bankAdminUser.userName', 'User Name'), userNameTextField]
				});
				return userNameContainer;
			},	
			createankAdminSsoAutoCompleter : function(){
				var me=this;
				var bankAdminSsoField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'userCode',
					itemId : 'SsoUserIdFilterItemId',
					cfgUrl : 'services/userseek/bankAdminSsoUserIdSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'bankAdminSsoUserIdSeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgStoreFields :['CODE', 'DESCRIPTION', 'RECORD_KEY_NO'],
					cfgExtraParams :
					[
						{
							key : '$filtercode1',
							value : 'ALL'
						},
						{
							key : '$sellerCode',
							value : strSellerId
						}
					]
				});
				var bankAdminSsoContainer = Ext.create('Ext.container.Container', {
					columnWidth : 0.3,
					padding : '5px',
					hidden : ( ADMINSSO == 'Y' && autousrcode != 'PRODUCT') ?  false : true,
					itemId : 'bankAdminSsoUserFilter',
					items : [me.createLable('lbl.bankAdminUser.userCode', 'SSO User Id'), bankAdminSsoField]
				});
				return bankAdminSsoContainer;
			},
			createStatusCombo : function(){
				var me=this;
				var requestStateComboStore = me.getRequestStatusStore();
				var statusFieldCombo = Ext.create('Ext.form.field.ComboBox', {
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					width : 165,
					itemId : 'requestStateFilterItemId',
					store : requestStateComboStore,
					valueField : 'key',
					displayField : 'value',
					editable : false,
					value : getLabel('all','ALL')
				});
				var statusFieldContainer = Ext.create('Ext.container.Container', {
					columnWidth : 0.3,
					padding : '5px',
					itemId: 'statusFilter',
					items : [me.createLable('status', 'Status'), statusFieldCombo]
				});
				return statusFieldContainer;
			},	
			createBranchNameAutoCompleter : function(){
				var me=this;
				var branchNameTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'userBranch',
					itemId : 'branchCodeFilterItemId',
					cfgUrl : 'services/userseek/userBranchFilterSeek.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'userBranchFilterSeek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgKeyNode : 'CODE',
					cfgStoreFields :['CODE','DESCR'],
					cfgExtraParams :
					[
						{
							key : '$filtercode1',
							value : 'ALL'
						},
						{
							key : '$sellerCode',
							value : strSellerId
						}
					]
				});
				var branchNameContainer = Ext.create('Ext.container.Container', {
					columnWidth : 0.3,
					padding : '5px',
					itemId: 'branchCodeFilterPanel',
					items : [me.createLable('branchName', 'Branch Name'), branchNameTextField]
				});
				return branchNameContainer;
			},
			createSearchBtn : function(){
				var searchBtnContainer = Ext.create('Ext.container.Container', {
					columnWidth : 0.3,
					padding : '5px',
					itemId: 'buttonFilter',
					items : [{
						xtype : 'panel',
						layout : 'hbox',
						padding : '20 0 1 5',
						items : [{
							xtype : 'button',
							itemId : 'btnFilter',
							text : getLabel('search','Search'),
							cls : 'ux_button-padding ux_button-background ux_button-background-color'
						}]
					}]
				});
				return searchBtnContainer;
			},
			getRequestStatusStore : function(){
				return Ext.create( 'Ext.data.Store', {
					fields :
					[
						'key', 'value'
					],
					data :
					[
						{
							"key" : "all",
							"value" : getLabel( 'lblAll', 'All' )
						},
						{
							"key" : "0NN",
							"value" : getLabel( 'lblNew', 'New' )
						},
						{
							"key" : "0NY",
							"value" : getLabel( 'lblSubmitted', 'New Submitted' )
						},
						{
							"key" : "3YN",
							"value" : getLabel( 'lblAuthorized', 'Approved' )
						},
						{
							"key" : "7NN",
							"value" : getLabel( 'lblNewRejected', 'New Rejected' )
						},
						{
							"key" : "1YN",
							"value" : getLabel( 'lblModified', 'Modified' )
						},
						{
							"key" : "1YY",
							"value" : getLabel( 'lblModifiedSubmitted', 'Modified Submitted' )
						},
						{
							"key" : "8YN",
							"value" : getLabel( 'lblModifiedReject', 'Modified Rejected' )
						},
						{
							"key" : "5YY",
							"value" : getLabel( 'lblDisableRequest', 'Suspend Request' )
						},
						{
							"key" : "9YN",
							"value" : getLabel( 'lblDisableReqRejected', 'Suspend Request Rejected' )
						},
						{
							"key" : "3NN",
							"value" : getLabel( 'lblDisabled', 'Suspended' )
						},
						{
							"key" : "4NY",
							"value" : getLabel( 'lblEnableRequest', 'Enable Request' )
						},
						{
							"key" : "10NN",
							"value" : getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' )
						},
						{
							"key" : "13NY",
							"value" : getLabel( 'pendingMyApproval', 'Pending My Approval' )
						},
						{
							"key" : "11YN",
							"value" : getLabel( 'lblResetUserRequest', 'Reset User Request' )
						},
						{
							"key" : "12YN",
							"value" : getLabel( 'lblResetUserRequestRejected', 'Reset User Request Rejected' )
						},
						{
							"key" : "13YN",
							"value" : getLabel( 'lblUnlockUserRequest', 'Unlock User Request' )
						},
						{
							"key" : "14YN",
							"value" : getLabel( 'lblUnlockUserRequestRejected', 'Unlock User Request Rejected' )
						}
					]
				});
			},		
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var isPending = true;
				me.sellerKeyFilter = me.getSellerFilter().getValue();
				jsonArray.push(
				{
					paramName : 'sellerCode',
					paramValue1 : encodeURIComponent(me.sellerKeyFilter.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				} );
				if( !Ext.isEmpty( me.categoryRecKeyFilterVal ) && me.categoryRecKeyFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'categoryRecKey',
						paramValue1 : encodeURIComponent(me.categoryRecKeyFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( !Ext.isEmpty( me.userCodeFilterVal ) && me.userCodeFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'usrCode',
						paramValue1 : encodeURIComponent(me.userCodeFilterVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( !Ext.isEmpty( me.ssoUserIdKeyFilterVal ) && me.ssoUserIdKeyFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'usrSSOLoginid',
						paramValue1 : encodeURIComponent(me.ssoUserIdFilterVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( !Ext.isEmpty( me.branchCodeKeyFilter ) && me.branchCodeKeyFilter != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'userBranch',
						paramValue1 : encodeURIComponent(me.branchCodeKeyFilter.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				me.statusKeyFilter = me.getStatusFilter().getValue();
				if( !Ext.isEmpty( me.statusKeyFilter ) &&  getLabel('lblAll','All').toUpperCase() != me.statusKeyFilter.toUpperCase() && me.statusKeyFilter.toUpperCase()!='ALL')
				{
					
					if(me.statusKeyFilter  == '13NY')
					{
						me.statusKeyFilter = new Array('5YY','4NY','0NY','1YY','11YN','13YN');
						isPending = false;
						jsonArray.push({
									paramName : 'statusFilter',
									paramValue1 : me.statusKeyFilter,
									operatorValue : 'in',
									dataType : 'S'
								} );
						jsonArray.push({
									paramName : 'makerId',
									paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : 'ne',
									dataType : 'S'
								});
		         }
				 if(isPending)
				 {
					 if(me.statusKeyFilter  == '0NY' || me.statusKeyFilter  == '1YY'){
	                    	me.statusKeyFilter  = (me.statusKeyFilter  == '0NY')?'0NY':'1YY'
	                        jsonArray.push(
	                                   {
	                                        paramName : 'statusFilter',
	                                        paramValue1 : me.statusKeyFilter,
	                                        operatorValue : 'eq',
	                                        dataType : 'S'
	                                   } );
	                   }
	                   else {
					jsonArray.push(
					{
						paramName : 'statusFilter',
						paramValue1 : me.statusKeyFilter,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				  }
				 }
				}
				return jsonArray;
			},

			handleSmartGridConfig : function()
			{
				var me = this;
				var bankAdminUserGrid = me.getBankAdminUserGridRef();
				var objConfigMap = me.getBankAdminUserNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( bankAdminUserGrid ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
					{
						data = Ext.decode( objGridViewPref );
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
						pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 5;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
					else if( objConfigMap.arrColsPref )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
						pgSize = 5;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},

			handleSmartGridLoading : function( arrCols, storeModel, pgSize )
			{
				var me = this;
				var alertSummaryGrid = null;
				bankAdminUserGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : _GridSizeMaster,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					width : '100%',
					maxHeight : 550,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleMoreMenuItemClick : function(
							grid, rowIndex, cellIndex,
							menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(
								dataParams.view,
								dataParams.rowIndex,
								dataParams.columnIndex,
								menu, null,
								dataParams.record);
					}	
				} );

				var bankAdminUserDtlView = me.getBankAdminUserDtlViewRef();
				bankAdminUserDtlView.add( bankAdminUserGrid );
				bankAdminUserDtlView.doLayout();
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'submit' || actionName === 'clearUser' || actionName === 'resetUser' || actionName === 'disable' || actionName === 'enable')
				{
					me.handleGroupActions( btn, record );
				}
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					var userCode = (autousrcode != 'PRODUCT') ?  record.get( 'ssoLoginId' ) : record.get( 'usrCode' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( userCode ,record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					viewBankAdminUser( record.get('viewState') );
				}
				else if( actionName === 'btnEdit' )
				{
					editBankAdminUser( record.get('viewState') );
				}
			},

			submitForm : function( strUrl, record, rowIndex )
			{
				var form;
				var viewState = record.get( 'viewState' );

				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
					+ csrfTokenValue;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.action = strUrl;
				form.submit();
			},
	handleClientEntryAction : function(entryType) {
	
		var me = this;
		var form;
		var sellerCombo = me.getCorporationFilter();
		if(sellerCombo){
			var selectedSeller = sellerCombo.getValue();
		}
		var strUrl = 'addBankProductMaster.form';
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

    form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},

			showHistory : function(userCode, url, id )
			{
				Ext.create( 'GCP.view.BankAdminUserHistoryView',
				{
					userCode   : userCode,
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id
				} ).show();
			},

			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},

			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},

			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = me.getWithHeaderCheckbox().checked;
				var arrExtension =
				{
					downloadXls : 'xls',
					downloadCsv : 'csv',
					downloadPdf : 'pdf',
					downloadTsv : 'tsv',
					downloadBAl2 : 'bai2'
				};
				var currentPage = 1;
				var strExtension = '';
				var strUrl = '';
				var strSelect = '';
				var activeCard = '';
				var viscols;
				var col = null;
				var visColsStr = "";
				var colMap = new Object();
				var colArray = new Array();

				strExtension = arrExtension[ actionName ];
				strUrl = 'services/getBankAdminUserList/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				strUrl += strQuickFilterUrl;
				var grid = me.getBankAdminUserGridRef();
				viscols = grid.getAllVisibleColumns();
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrReportSortColumn[ col.dataIndex ] )
					{
						if( colMap[ arrReportSortColumn[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrReportSortColumn[ col.dataIndex ] ] = 1;
							colArray.push( arrReportSortColumn[ col.dataIndex ] );

						}
					}

				}
				if( colMap != null )
				{

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}

				strUrl = strUrl + strSelect;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},

			getBankAdminUserNewConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				
				if(multipleSellersAvailable === "true") {
					objWidthMap =
					{
						//"usrDescription" : '20%',
						"usrCode" : '20%',
						"usrCategory":'20%',
						"sellerDesc":'20%',
						"requestStateDesc" : '20%'
					};
				} else {
					objWidthMap =
					{
						//"usrDescription" : '25%',
						"usrCode" : '25%',
						"usrCategory":'25%',
						"requestStateDesc" : '25%'
					};
				}
				
				if(multipleSellersAvailable === "true") {
					if (ADMINSSO == 'Y' && autousrcode != 'PRODUCT') {	
					arrColsPref =
						[
							{
								"colId" : "usrDescription",
								"colDesc" : getLabel( 'lbl.bankAdminUser.userDesc', 'User Name' ),
								"colHidden" : true
							},
							{
								"colId" : (autousrcode != 'PRODUCT') ?  "ssoLoginId" : "usrCode",								
								"colDesc" : (autousrcode != 'PRODUCT') ? getLabel( 'lbl.bankAdminUser.ssouserId', 'SSO User Id' ) : getLabel( 'lbl.bankAdminUser.loginId', 'Login Id' ),
								"colHidden" : false
							},
							{
								"colId" : "usrCategory",
								"colDesc" : getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ),
								"colHidden" : false
							},
							{
								"colId" : "sellerDesc",
								"colDesc" : getLabel( 'lbl.bankAdminUser.primaryFi', 'Primary FI' ),
								"colHidden" : false
							},
							{
								"colId" : "requestStateDesc",
								"colDesc" : getLabel( 'status', 'Status' ),
								"colHidden" : false
							},
							{
								"colId" : "usrLoggedOn",
								"colDesc" : getLabel( 'loginStatus', 'Login/Locked Status' ),
								"colHidden" : false
							},
							{
								"colId" : "userDisableFlag",
								"colDesc" : getLabel('lblUserStatus','User Status'),
								"colHidden" : false
							},
							{
								"colId" : "usrFirstName",
								"colDesc" : getLabel( 'firstName', 'First Name' ),
								"colHidden" : false
							},{
								"colId" : "usrLastName",
								"colDesc" : getLabel( 'lastName', 'Last Name' ),
								"colHidden" : false
							},{
								"colId" : "department",
								"colDesc" : getLabel( 'department', 'Department' ),
								"colHidden" : true
							},{
								"colId" : "usrLastLogon",
								"colDesc" : getLabel( 'lastAccess', 'Last Access Date/Time' ),
								"colHidden" : true
							},{
								"colId" : "isSelfAdmin",
								"colDesc" : getLabel( 'adminIndicator', 'Admin Indicator' ),
								"colHidden" : true
							}
						];					
					}
					else {
					arrColsPref =
						[
							{
								"colId" : "usrDescription",
								"colDesc" : getLabel( 'lbl.bankAdminUser.userDesc', 'User Name' ),
								"colHidden" : true
							},
							{
								"colId" : ( autousrcode != 'PRODUCT' ) ?  "ssoLoginId" : "usrCode",								
								"colDesc" : ( autousrcode != 'PRODUCT' ) ? getLabel( 'lbl.bankAdminUser.ssouserId', 'SSO User Id' ) : getLabel( 'lbl.bankAdminUser.loginId', 'Login Id' ),
								"colHidden" : false
							},
							{
								"colId" : "usrCategory",
								"colDesc" : getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ),
								"colHidden" : false
							},
							{
								"colId" : "sellerDesc",
								"colDesc" : getLabel( 'lbl.bankAdminUser.primaryFi', 'Primary FI' ),
								"colHidden" : false
							},
							{
								"colId" : "requestStateDesc",
								"colDesc" : getLabel( 'status', 'Status' ),
								"colHidden" : false
							},
							{
								"colId" : "usrLoggedOn",
								"colDesc" : getLabel( 'loginStatus', 'Login/Locked Status' ),
								"colHidden" : false
							},
							{
								"colId" : "userDisableFlag",
								"colDesc" : getLabel('lblUserStatus','User Status'),
								"colHidden" : false
							},{
								"colId" : "makerId",
								"colDesc" : getLabel( 'createdBy', 'Created By' ),
								"colHidden" : true
							},
								{
								"colId" : "makerStamp",
								"colDesc" : getLabel( 'dateCreated', 'Date Created' ),
								"colHidden" : true
							},{
								"colId" : "checkerId",
								"colDesc" : getLabel( 'approvedBy', 'Approved By' ),
								"colHidden" : true
							},{
								"colId" : "usrFirstName",
								"colDesc" : getLabel( 'firstName', 'First Name' ),
								"colHidden" : false
							},{
								"colId" : "usrLastName",
								"colDesc" : getLabel( 'lastName', 'Last Name' ),
								"colHidden" : false
							},{
								"colId" : "department",
								"colDesc" : getLabel( 'department', 'Department' ),
								"colHidden" : true
							},{
								"colId" : "usrLastLogon",
								"colDesc" : getLabel( 'lastAccess', 'Last Access Date/Time' ),
								"colHidden" : true
							},{
								"colId" : "isSelfAdmin",
								"colDesc" : getLabel( 'adminIndicator', 'Admin Indicator' ),
								"colHidden" : true
							}
						];					
					}
					
				} else {
					if (ADMINSSO == 'Y' && autousrcode != 'PRODUCT') {				
					arrColsPref =
						[
							{
								"colId" : "usrDescription",
								"colDesc" : getLabel( 'lbl.bankAdminUser.userDesc', 'User Full Name' ),
								"colHidden" : true
							},
							{
								"colId" : (autousrcode != 'PRODUCT') ? "ssoLoginId" : "usrCode",								
								"colDesc" : (autousrcode != 'PRODUCT') ? getLabel( 'lbl.bankAdminUser.ssouserId', 'SSO User Id' ) : getLabel( 'lbl.bankAdminUser.loginId', 'Login Id' ),
								"colHidden" : false
							},
							{
								"colId" : "usrCategory",
								"colDesc" : getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ),
								"colHidden" : false
							},
							{
								"colId" : "requestStateDesc",
								"colDesc" : getLabel( 'status', 'Status' ),
								"colHidden" : false
							},
							{
								"colId" : "usrLoggedOn",
								"colDesc" : getLabel( 'loginStatus', 'Login/Locked Status' ),
								"colHidden" : false
							},
							{
								"colId" : "userDisableFlag",
								"colDesc" : getLabel('lblUserStatus','User Status'),
								"colHidden" : false
							},
							{
								"colId" : "usrFirstName",
								"colDesc" : getLabel( 'firstName', 'First Name' ),
								"colHidden" : false
							},{
								"colId" : "usrLastName",
								"colDesc" : getLabel( 'lastName', 'Last Name' ),
								"colHidden" : false
							},
							{
								"colId" : "department",
								"colDesc" :getLabel( 'department', 'Department' ),
								"colHidden" : true
							},{
								"colId" : "usrLastLogon",
								"colDesc" : getLabel( 'lastAccess', 'Last Access Date/Time' ),
								"colHidden" : true
							},{
								"colId" : "isSelfAdmin",
								"colDesc" : getLabel( 'adminIndicator', 'Admin Indicator' ),
								"colHidden" : true
							}
						];
				} else 
					{
					arrColsPref =
						[
							{
								"colId" : "usrDescription",
								"colDesc" : getLabel( 'lbl.bankAdminUser.userDesc', 'User Full Name' ),
								"colHidden" : true
							},
							{
								"colId" : ( ADMINSSO == 'Y' && autousrcode != 'PRODUCT') ? "ssoLoginId" : "usrCode",								
								"colDesc" : ( ADMINSSO == 'Y' && autousrcode != 'PRODUCT') ? getLabel( 'lbl.bankAdminUser.ssouserId', 'SSO User Id' ) : getLabel( 'lbl.bankAdminUser.loginId', 'Login Id' ),
								"colHidden" : false
							},
							{
								"colId" : "usrCategory",
								"colDesc" : getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ),
								"colHidden" : false
							},
							{
								"colId" : "requestStateDesc",
								"colDesc" : getLabel( 'status', 'Status' ),
								"colHidden" : false
							},
							{
								"colId" : "usrLoggedOn",
								"colDesc" : getLabel( 'loginStatus', 'Login/Locked Status' ),
								"colHidden" : false
							},
							{
								"colId" : "userDisableFlag",
								"colDesc" : getLabel('lblUserStatus','User Status'),
								"colHidden" : false
							},
							{
								"colId" : "makerId",
								"colDesc" : getLabel( 'createdBy', 'Created By' ),
								"colHidden" : true
							},
								{
								"colId" : "makerStamp",
								"colDesc" : getLabel( 'dateCreated', 'Date Created' ),
								"colHidden" : true
							},{
								"colId" : "checkerId",
								"colDesc" : getLabel( 'approvedBy', 'Approved By' ),
								"colHidden" : true
							},{
								"colId" : "usrFirstName",
								"colDesc" : getLabel( 'firstName', 'First Name' ),
								"colHidden" : false
							},{
								"colId" : "usrLastName",
								"colDesc" : getLabel( 'lastName', 'Last Name' ),
								"colHidden" : false
							},
							{
								"colId" : "department",
								"colDesc" :getLabel( 'department', 'Department' ),
								"colHidden" : true
							},{
								"colId" : "usrLastLogon",
								"colDesc" : getLabel( 'lastAccess', 'Last Access Date/Time' ),
								"colHidden" : true
							},{
								"colId" : "isSelfAdmin",
								"colDesc" : getLabel( 'adminIndicator', 'Admin Indicator' ),
								"colHidden" : true
							}
						];
					}
				}
				
				storeModel =
				{
					fields :
					[
						'usrDescription','usrCategory', 'requestStateDesc', 'checkLoginStatus','makerId','makerStamp','checkerId','history', 'identifier', 'viewState',
						'usrFirstName','usrLastName','department','usrLastLogon','__metadata','sellerCode','usrCode','sellerDesc', 'usrLoggedOn','userDisableFlag','isSelfAdmin','ssoLoginId'
					],
					proxyUrl : 'getBankAdminUserList.srvc',
					rootNode : 'd.userAdminList',
					totalRowsNode : 'd.__count'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},

			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getBankAdminUserGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.enableDisableGroupActions( '00000000000');
				grid.setLoading(true);
				grid.loadGridData( strUrl, null );
			},

			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', isFilterApplied = 'false';

				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += strQuickFilterUrl;
						isFilterApplied = true;
					}
					return strUrl;
				}
			},

			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';
				var strFilterParam = '';

				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'bt':
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
							}
							break;
						case 'in' :
							var arrId = filterData[index].paramValue1;
							if (0 != arrId.length) {
								strTemp = strTemp + '(';
								for (var count = 0; count < arrId.length; count++) {
									strTemp = strTemp + filterData[index].paramName
											+ ' eq ' + '\'' + arrId[count] + '\'';
									if (count != arrId.length - 1) {
										strTemp = strTemp + ' or ';
									}
								}
								strTemp = strTemp + ' ) ';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								if(filterData[ index ].paramName === 'statusFilter' && filterData[ index ].paramValue1 === 'L'){
									strTemp = strTemp + 'loggedInFilter' + ' '
										+ filterData[ index ].operatorValue + ' ' + '\'' + 'Y'
										+ '\'';
								}
								else{
									strTemp = strTemp + filterData[ index ].paramName + ' '
										+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
										+ '\'';
								}
							}
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
			},

			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '00000000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				var isSubmitted = false;
				var isDisabled = false;
				var isUserLoggedOn = false;				
				
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
					if (objData.raw.validFlag != 'Y') {
						isDisabled = true;
					}
					if (objData.raw.usrLoggedOn == 'Y') {
						isUserLoggedOn = true;
					}						
					if (objData.raw.isSubmitted != null
							&& objData.raw.isSubmitted == 'Y'
							&& objData.raw.requestState != 8
							&& objData.raw.requestState != 4
							&& objData.raw.requestState != 5) {
						isSubmitted = true;
					}
				}
				actionMask = doAndOperation( maskArray, 11 );
				me.enableDisableGroupActions( actionMask, isSameUser, isSubmitted ,isUserLoggedOn ,isDisabled);
			},

			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'getBankAdminUserList/{0}.srvc?', strAction );
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', record );
				}
			},

			showRejectVerifyPopUp : function( strAction, strActionUrl, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					fieldLbl = getLabel( 'rejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'rejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if( btn == 'ok' )
						{
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel( 'lblerror', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remarks cannot be blank' ));
							}
							else
							{
								me.preHandleGroupActions(strActionUrl, text, record);
							}
						}
					}
				} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},

			preHandleGroupActions : function( strUrl, remark, record )
			{
				var me = this;
				var grid = this.getBankAdminUserGridRef();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var records = grid.getSelectedRecords();
					records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
					[
						record
					];
					for( var index = 0 ; index < records.length ; index++ )
					{
						arrayJson.push(
						{
							serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
							identifier : records[ index ].data.identifier,
							userMessage : remark,
							reason : records[ index ].data.usrCategory
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );

					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							var jsonRes = Ext.JSON.decode( response.responseText );
							var errors = '';
							for( var i in jsonRes.d.instrumentActions )
							{
								if( jsonRes.d.instrumentActions[ i ].errors )
								{
									for( var j in jsonRes.d.instrumentActions[ i ].errors )
									{
										errors += jsonRes.d.instrumentActions[ i ].errors[ j ].errorMessage + "<br\>";
									}
								}
							}
							if( errors != '' )
							{
								Ext.MessageBox.show(
								{
									title : getLabel( 'lblerror', 'Error' ),
									msg : errors,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
							me.enableDisableGroupActions( '00000000000', true );
							grid.refreshData();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'lblerror', 'Error' ),
								msg : getLabel( 'lblerrordata', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}
			},

			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 11;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
				if( !Ext.isEmpty( maskPosition ) )
				{
					bitPosition = parseInt( maskPosition,10 ) - 1;
					maskSize = maskSize;
				}
				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				maskArray.push( rightsMap );
				actionMask = doAndOperation( maskArray, maskSize );
				var isSameUser = true;
				if( record.raw.makerId === USER )
				{
					isSameUser = false;
				}
				if( Ext.isEmpty( bitPosition ) )
					return retValue;
				retValue = isActionEnabled( actionMask, bitPosition );
				if( ( maskPosition === 2 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 3 && retValue )
				{
					retValue = retValue && isSameUser;
				}

				return retValue;
			},

			isRowMoreMenuVisible : function( store, record, jsonData, itmId, menu )
			{
				var me = this;
				if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
					return false;
				var arrMenuItems = null;
				var isMenuVisible = false;
				var blnRetValue = true;
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;

				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId,
							arrMenuItems[ a ].maskPosition );
						isMenuVisible = ( isMenuVisible || blnRetValue ) ? true : false;
					}
				}
				return isMenuVisible;
			},

			enableDisableGroupActions : function(  actionMask, isSameUser ,isSubmitted, isUserLoggedOn,isDisabled)
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey || strBitMapKey == 0 )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 2 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 4 && blnEnabled )
							{
								blnEnabled = blnEnabled && (isSubmitted != undefined && !isSubmitted);
							}
							else if( item.maskPosition === 10 && blnEnabled )  //clear
							{
								blnEnabled = blnEnabled && (isEmpty(ADMINSSO) || ADMINSSO == 'N' || autousrcode != 'PRODUCT') && isUserLoggedOn  && !isDisabled ;
							}
							else if( item.maskPosition === 11 && blnEnabled )  // reset
							{
								blnEnabled = blnEnabled && (isEmpty(ADMINSSO) || ADMINSSO == 'N') && !isDisabled ;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},

			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push( me.createGroupActionColumn() );
				arrCols.push( me.createActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						
						if(objCol.colId == 'requestStateDesc')
						{
							cfgCol.locked = false;
							cfgCol.lockable = false;
							cfgCol.sortable = false;
							cfgCol.hideable = false;
							//cfgCol.resizable = false;
							cfgCol.draggable = false;
							cfgCol.hidden = false;
						}

						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
						if(objCol.colId == 'usrLastLogon')
						{
							cfgCol.width = 150;
						}
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},

			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				strRetValue = value;
				if (colId === 'col_usrDescription' && record.data.usrLoggedOn === 'Y') {
			        meta.tdAttr = 'title="' + getLabel( 'loggedIn', 'Logged In' ) + '"';
					strRetValue = ''+ value  + ' ' + '<a class="iconlink online_link">&nbsp;</a>';
				}
				 else if(colId === 'col_makerStamp'){
					if(!Ext.isEmpty(value)){
						var arrDateString = value.split(" ");
						strRetValue = arrDateString[0];
					}
				}
				else if(colId === 'col_usrLoggedOn'){
						if(record.data.usrLoggedOn === 'Y')
						{
							strRetValue = getLabel('Y', 'Yes');	
						}	
						else
						{
							strRetValue = getLabel('N', 'No');	
						}
				}
				if(colId === 'col_userDisableFlag')
				{
					if(record.data.userDisableFlag === 'Y')
					{
						strRetValue = getLabel('lblDisabledStatus', 'Disabled');
					}
					else if(record.data.userDisableFlag === 'N')
					{
						strRetValue = getLabel('lblActiveStatus', 'Active');
					}
					else if(record.data.userDisableFlag === 'D')
					{
						strRetValue = getLabel('lblDormantStatus', 'Dormant');
					}
					else if(record.data.userDisableFlag === 'M')
					{
						strRetValue = getLabel('lblMFADisabledStatus', 'MFA Disabled');
					}
				}
				else{
					strRetValue = value;
				}
				return strRetValue;
			},

			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
						colType : 'actioncontent',
						colId : 'groupaction',
						width : 150,
						locked : true,
						lockable : false,
						sortable : false,
						hideable : false,
						resizable : false,
						draggable : false,
						items: [{
									text : getLabel('prfMstActionSubmit', 'Submit'),
									itemId : 'submit',
									actionName : 'submit',
									maskPosition : 1
								},{
									text : getLabel('prfMstActionApprove', 'Approve'),
									itemId : 'accept',
									actionName : 'accept',
									maskPosition : 2
								},{
									text : getLabel('prfMstActionReject', 'Reject'),
									itemId : 'reject',
									actionName : 'reject',
									maskPosition : 3
								},{
									text : getLabel('prfMstActionDiscard', 'Discard'),
									itemId : 'discard',
									actionName : 'discard',
									maskPosition : 4
								},{
									text : getLabel('prfMstActionEnable', 'Enable'),
									itemId : 'enable',
									actionName : 'enable',
									maskPosition : 5
								}, {
									text : getLabel('prfMstActionDisable',	'Suspend'),
									itemId : 'disable',
									actionName : 'disable',
									maskPosition : 6
								},{
								itemId : 'clearUser',							
								text : getLabel( 'actionClearUser', 'Clear User' ),
								actionName : 'clearUser',
								maskPosition : 10
							},	{
								itemId : 'resetUser',								
								text : getLabel( 'actionResetUser', 'Reset User' ),
								actionName : 'resetUser',
								maskPosition : 11
							}]
					};
				return objActionCol;
			},

			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actioncontent',
					visibleRowActionCount : 1,
					align : 'left',
					width : 45,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							itemLabel : getLabel('viewToolTip','View Record'),
							maskPosition : 8
						},
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit Record' ),
							itemLabel : getLabel('edit','Edit'),
							maskPosition : 7
						},						
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							itemLabel : getLabel('historyToolTip','View History'),
							maskPosition : 9
						}
					]
				};
				return objActionCol;
			},

			handleRowMoreMenuClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var menu = btn.menu;
				var arrMenuItems = null;
				var blnRetValue = true;
				var store = tableView.store;
				var jsonData = store.proxy.reader.jsonData;

				btn.menu.dataParams =
				{
					'record' : record,
					'rowIndex' : rowIndex,
					'columnIndex' : columnIndex,
					'view' : tableView
				};
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;
				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, null,
							arrMenuItems[ a ].maskPosition );
						arrMenuItems[ a ].setVisible( blnRetValue );
					}
				}
				menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
			},

			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
					{
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function( tip )
						{
							var sellerFilter ='';
							var sellerFltId = me.getSellerFilter();
							if( !Ext.isEmpty( sellerFltId ) && !Ext.isEmpty( sellerFltId.getRawValue() ) )
							{
								sellerFilter = sellerFltId.getRawValue();
							}
							else
							{
								sellerFilter = getLabel('none', 'None');
							}
							var categoryCodeFilter = me.categoryCodeFilterVal == 'all' || Ext.isEmpty(me.categoryCodeFilterVal)
														? getLabel('none', 'None') : me.categoryCodeFilterVal;
							var statusFilter = me.statusFilterVal == 'all' || Ext.isEmpty(me.statusFilterVal) ? getLabel('all', 'ALL') : me.statusFilterVal;
							var userName = me.userCodeFilterVal == 'all' || Ext.isEmpty(me.userCodeFilterVal) ? getLabel('none', 'None') : me.userCodeFilterVal;
							var ssoLoginId = me.ssoUserIdFilterVal  == 'all' || Ext.isEmpty(me.ssoUserIdFilterVal) ? getLabel('none', 'None') : me.ssoUserIdFilterVal;
							if (ADMINSSO == 'Y' && autousrcode != 'PRODUCT') {
								var ssoLabel = getLabel( 'lbl.bankAdminUser.ssouserId', 'SSO User Id' );
								if( multipleSellersAvailable == true)
								{
									tip.update(getLabel( 'financialinstitution', 'Financial Institution' ) + ' : ' + sellerFilter + '<br/>' 
										+ getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ) + ' : '
										+ categoryCodeFilter + '<br/>'
										+ getLabel( 'lbl.bankAdminUser.userName', 'User Name' ) + ' : ' + userName + '<br/>'
										+ ssoLabel + ' : ' + ssoLoginId + '<br/>'
										+ getLabel( 'status', 'Status' ) + ' : ' + statusFilter );									
								}
								else
								{
							tip.update( getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ) + ' : '
								+ categoryCodeFilter + '<br/>'
								+ getLabel( 'lbl.bankAdminUser.userName', 'User Name' ) + ' : ' + userName + '<br/>'
								+ ssoLabel + ' : ' + ssoLoginId + '<br/>'
								+ getLabel( 'status', 'Status' ) + ' : ' + statusFilter );
						}
							
						}
							else if(autousrcode == 'PRODUCT'){								
								if (multipleSellersAvailable == true)
								{
									tip.update( getLabel( 'financialinstitution', 'Financial Institution' ) + ' : ' + sellerFilter + '<br/>'
									+ getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ) + ' : '
									+ categoryCodeFilter + '<br/>'
									+ getLabel( 'lbl.bankAdminUser.userName', 'User Name' ) + ' : ' + userName + '<br/>'									
									+ getLabel( 'status', 'Status' ) + ' : ' + statusFilter );
								}
								else
								{
								tip.update( getLabel( 'lbl.bankAdminUser.categoryCode', 'Role' ) + ' : '
										+ categoryCodeFilter + '<br/>'
										+ getLabel( 'lbl.bankAdminUser.userName', 'User Name' ) + ' : ' + userName + '<br/>'									
										+ getLabel( 'status', 'Status' ) + ' : ' + statusFilter );
								}
							}
							
							
							
					}
					}
				} );
			}

		} );
