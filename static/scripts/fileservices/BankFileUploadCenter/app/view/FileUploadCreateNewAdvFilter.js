Ext.define('GCP.view.FileUploadCreateNewAdvFilter',{
			extend : 'Ext.panel.Panel',
			xtype : 'fileUploadCreateNewAdvFilter',
			requires :
			[
				'Ext.ux.gcp.DateHandler', 'Ext.ux.gcp.AutoCompleter'
			],
			callerParent : null,
			width : 600,
			//width : 'auto',
			height : 'auto',
			layout :
			{
				type : 'vbox'
			},
			config : {
				sellerVal : null,
				queueType : null
			},
			
			initComponent : function()
			{
				var me = this;
				var arrStatusFilter = [];
				for (var index = 0; index < advFilterJsonArray.length; index++) {
					arrStatusFilter.push({
								value : advFilterJsonArray[index].value,
								key : advFilterJsonArray[index].key
							});
				}
				
				var comboStoreStatusFilter = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data : arrStatusFilter
				} );

				var fieldWidth = 220;
				this.items =
				[
					{
						xtype : 'container',
						layout : 'vbox',
						cls : 'filter-container-cls',
						width : 'auto',
						itemId : 'parentContainer',
						defaults :
						{
							margin : '5 0 0 3'
						},
						items :
						[
							// file name, status 
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'fileNameFilterItemId',
												fieldLabel : getLabel( 'fileName', 'File Name' ),
												maxLength : 255,
												labelSeparator : '',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'userFilterItemId',
												fieldLabel : getLabel( 'user', 'User' ),
												maxLength : 255,
												labelSeparator : '',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'combobox',
												maxLength : 255,
												fieldLabel : getLabel( 'status', 'Status' ),
												displayField : 'value',
												valueField : 'key',
												labelSeparator : '',
												itemId : 'statusFilterItemId',
												editable : false,
												store : comboStoreStatusFilter,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : 'All'
											}
										]
									}
															
								]
							},
							{
								xtype : 'container',
								layout : 'hbox',
								defaults :
								{
									labelAlign : 'top'
								},
								items :
								[
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'datefield',
												format : strExtApplicationDateFormat,
												name : 'receivedOn',
												itemId : 'importDateFrmFilterItemId',
												editable : false,
												labelSeparator : '',
												fieldLabel : getLabel( 'importDateFrom', 'Import Date From' ),
												//labelStyle : 'padding-left:10px',
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												allowBlank : true,
												labelCls: 'frmLabel',
												hideTrigger : true
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'datefield',
												format : strExtApplicationDateFormat,
												name : 'receivedOn',
												itemId : 'importDateToFilterItemId',
												editable : false,
												fieldLabel : getLabel( 'importDateTo', 'Import Date To' ),
												//labelStyle : 'padding-left:10px',
												labelCls: 'frmLabel',
												fieldCls : 'xn-valign-middle xn-form-text w10_5',
												allowBlank : true,
												hideTrigger : true,
												labelSeparator : ''
											}
										]
									},
									{
										xtype : 'container',
										layout : 'vbox',
										width : fieldWidth,
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'textfield',
												itemId : 'saveFilterAsFilterItemId',
												fieldLabel : getLabel( 'saveFilterAs', 'Save Filter As' ),
												maxLength : 255,
												labelSeparator : '',
												enforceMaxLength : true,
												enableKeyEvents : true,
												listeners :
												{
													'keypress' : function( text )
													{
														//if( text.value.length === 20 )
														//	me.showErrorMsg();
													}
												}
											}
										]
									}
								]
							}
					]
				}];

				this.dockedItems =
				[{
					xtype : 'container',
					height : 10,
					dock : 'top',
					items : [{
								xtype : 'label',
								cls : 'red errmsg',
								itemId : 'errorLabel',
								hidden : true
							}]
				}, {
					xtype : 'toolbar',
					padding : '10 0 3 0',
					dock : 'bottom',
					items : ['->', {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						text : getLabel('btnSearch', 'Search'),
						glyph : 'xf002@fontawesome',
						itemId : 'searchBtn',
						handler : function(btn)
						{
							me.fireEvent('handleSearchAction', btn);
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn)
						{
							me.fireEvent('handleSaveAndSearchAction', btn);
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn)
						{
							me.resetAllFields(me);
							me.fireEvent('closeFilterPopup', btn);
						}
					},'->']
				}];
				this.callParent( arguments );
			},

			getAdvancedFilterValueJson : function( filterCodeVal, objOfCreateNewFilter )
			{
				var objJson = null;
				var jsonArray = [];

				var fileNameFilter = objOfCreateNewFilter.down( 'textfield[itemId="fileNameFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( fileNameFilter ) )
				{
					jsonArray.push(
					{
						field : 'fileName',
						operator : 'lk',
						value1 : fileNameFilter,
						value2 : ''
					} );
				}
				
				// Currency
				/*var currencyValue = objOfCreateNewFilter
						.down('radiogroup[itemId="currencyRadioGroup"]').getValue().crossCurrency;
				if (!Ext.isEmpty(currencyValue) && currencyValue!== 'All') {
					jsonArray.push({
								field : 'crossCurrency',
								operator : 'eq',
								value1 : currencyValue,
								value2 : '',
								dataType : 0,
								displayType : 4
							});
				}*/
				// Payment Type
				var statusFilter = objOfCreateNewFilter.down( 'textfield[itemId="statusFilterItemId"]' )
					.getValue();
				if( !Ext.isEmpty( statusFilter ) && statusFilter != 'All' )
				{
					jsonArray.push(
					{
						field : 'status',
						operator : 'eq',
						value1 : statusFilter,
						value2 : ''
					} );
				}
				
				//Need parameter Names
				/*var instAmount = objOfCreateNewFilter.down( 'textfield[itemId="instAmountFilterItemId"]' ).getValue();
				if( !Ext.isEmpty( instAmount ))
				{
					jsonArray.push(
					{
						field : 'instAmount',
						operator : 'eq',
						value1 : instAmount,
						value2 : ''
					} );
				}*/

				//var filterCode = '';
				objJson = {};
				objJson.filterBy = jsonArray;
				if( filterCodeVal && !Ext.isEmpty( filterCodeVal ) )
					objJson.filterCode = filterCodeVal;
				return objJson;
			},
			resetAllFields : function( objCreateNewFilterPanel )
			{
				objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
				objCreateNewFilterPanel.down( 'textfield[itemId="saveFilterAsFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setValue('All');
				objCreateNewFilterPanel.down( 'textfield[itemId="userFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="importDateFrmFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'datefield[itemId="importDateToFilterItemId"]' ).reset();
			},

			enableDisableFields : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="saveFilterAsFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="userFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="importDateFrmFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="importDateToFilterItemId"]' ).setDisabled( boolVal );
			},

			removeReadOnly : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="saveFilterAsFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="userFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="importDateFrmFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'datefield[itemId="importDateToFilterItemId"]' ).setReadOnly( boolVal );
			},

			showErrorMsg : function()
			{
				var me = this;
				var objErrorLabel = me.down( 'label[itemId="errorLabel"]' );
				objErrorLabel.setText( getLabel( 'filterCodeLength', 'The max length of Filter Name is 20' ) );
				objErrorLabel.show();
			},
			
			setSellerToClientAutoCompleterUrl : function() {
				var me = this;
				var sellerCombo = me.down('combobox[itemId="sellerFilterItemId"]');
				var seller = sellerCombo.getValue();
				var clientautoComplter = me
						.down('combobox[itemId="clientNameFilterItemId"]');
				clientautoComplter.reset();
				clientautoComplter.cfgExtraParams = [{
							key : '$filtercode1',
							value : seller
						}];
			},
			hideShowFields : function(objCreateNewFilterPanel, queueType){
				if(queueType === 'R' || queueType === 'W' || queueType === 'V') {
					objCreateNewFilterPanel.down('container[itemId="crossCurrencyContainer"]').hide();
					objCreateNewFilterPanel.down('container[itemId="cashInContainer"]').hide();
				}
				if(queueType != 'W'){
					//objCreateNewFilterPanel.down('combobox[itemId="clientCountryFilterItemId"]').hide();
					objCreateNewFilterPanel.down('container[itemId="clientCountryContainerItemId"]').hide();
				}
			}

		} );
