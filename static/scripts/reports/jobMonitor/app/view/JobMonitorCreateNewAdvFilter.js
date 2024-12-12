Ext.define('GCP.view.JobMonitorCreateNewAdvFilter',{
			extend : 'Ext.panel.Panel',
			xtype : 'jobMonitorCreateNewAdvFilter',
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
				var arrStatusFilter = [{
						'key' : '',
						'value' : getLabel('jobStatus.ALL','All')
					},{
						'key' : 'N',
						'value' : getLabel('jobStatus.N','N')
					}, {
						'key' : 'P',
						'value' : getLabel('jobStatus.P','P')
					}, {
						'key' : 'L',
						'value' : getLabel('jobStatus.L','L')
					}, {
						'key' : 'R',
						'value' : getLabel('jobStatus.R','R')
					}, {
						'key' : 'S',
						'value' : getLabel('jobStatus.S','S')
					},{
						'key' : 'C',
						'value' : getLabel('jobStatus.C','C')
					},{
						'key' : 'E',
						'value' : getLabel('jobStatus.E','E')
					},{
						'key' : 'T',
						'value' : getLabel('jobStatus.T','T')
					}];
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
							// filter name
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
										defaults :
										{
											labelAlign : 'top'
										},
										items :
										[
											{
												xtype : 'label',
												cls : 'red',
												itemId : 'errorLabel',
												height : 10,
												hidden : true
											},
											{
												xtype : 'textfield',
												itemId : 'filterCode',
												fieldLabel : getLabel( 'filterName', 'Filter Name' ),
												maxLength : 20,
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
							},
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
												xtype : 'combobox',
												width : fieldWidth,
												fieldLabel : getLabel( 'status', 'Status' ),
												displayField : 'value',
												valueField : 'key',
												labelSeparator : '',
												itemId : 'statusFilterItemId',
												editable : false,
												store : comboStoreStatusFilter,
												fieldCls : 'xn-form-field inline_block',
												triggerBaseCls : 'xn-form-trigger',
												value : ''
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
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).reset();
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).reset();
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).reset();
			},

			enableDisableFields : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setDisabled( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setDisabled( boolVal );
			},

			removeReadOnly : function( objCreateNewFilterPanel, boolVal )
			{
				objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'textfield[itemId="fileNameFilterItemId"]' ).setReadOnly( boolVal );
				objCreateNewFilterPanel.down( 'combobox[itemId="statusFilterItemId"]' ).setReadOnly( boolVal );
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
