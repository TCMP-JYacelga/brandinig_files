var dtEntryDateVal = new Date( Ext.Date.parse( dtApplicationDate,
     strExtApplicationDateFormat ));
Ext.define( 'GCP.view.PassThruFileACHCreateAdvFilter',
{
	extend : 'Ext.panel.Panel',
	xtype : 'passThruFileACHCreateNewAdvFilterType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	callerParent : null,
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;
		if(screenType == 'ACH')
			var hideField = false;
		else if(screenType == 'POSITIVEPAY')
			var hideField = true;
		
		var comboBoxStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[
				{
					"key" : "All",
					"value" : "All"
				},
				{
					"key" : "0",
					"value" : "New"
				},
				{
					"key" : "3",
					"value" : "Approved"
				},
				{
					"key" : "4",
					"value" : "Rejected"
				},
				{
					"key" : "7",
					"value" : "Aborted"
				},
				{
					"key" : "8",
					"value" : "Completed"
				},
				{
					"key" : "9",
					"value" : "Pending For Process"
				},
				{
					"key" : "2",
					"value" : "Processed"
				}
			]
		} );

		this.items =
		[
			{
				xtype : 'container',
				cls : 'filter-container-cls',
				width : '100%',
				itemId : 'parentContainer',
				layout : 'hbox',
				items :
				[
					{
						xtype : 'container',
						//columnWidth : 0.5,
						flex : 1,
						layout : 'vbox',
						cls: 'ux_largepadding-left',
						defaults :
						{
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'label',
								cls : 'red',
								itemId : 'errorLabel',
								heigth : 10,
								hidden : true
							},
							{
								xtype : 'container',
								cls : 'ux_verylargepaddingtop',
								layout : 'vbox',
								items : [{
									xtype : 'label',
									text : getLabel('fileName', 'File Name'),
									cls : 'ux_font-size14 ux_normalpadding-bottom'
								},{
									xtype : 'textfield',
									itemId : 'FileName',
									width : 165
								}/*{
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									width : 165,
									cls : 'autoCmplete-field ux_autoCmplete-field',
									labelSeparator : '',
									name : 'FileName',
									itemId : 'FileName',
									cfgUrl : 'services/userseek/fileNameSeek.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'fileNameSeek',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'CODE'
								}*/]
							},
							{
								xtype : 'container',
								cls : 'ux_verylargepaddingtop',
								layout : 'vbox',
								items : [{
									xtype : 'label',
									text : getLabel('totalCrAmount', 'Total Credit Amount'),
									cls : 'ux_font-size14 ux_normalpadding-bottom'
								},{
									xtype : 'textfield',
									itemId : 'totalCrAmount',
									width : 165
								}]
							},
							{
								xtype : 'container',
								cls : 'ux_verylargepaddingtop',
								layout : 'vbox',
								hidden : hideField,
								items : [{
									xtype : 'label',
									text : getLabel('totalDrAmount', 'Total Debit Amount'),
									cls : 'ux_font-size14 ux_normalpadding-bottom'
								},{
									xtype : 'textfield',
									itemId : 'totalDrAmount',
									width : 165
								}]
							},
							{
								xtype : 'container',
								layout : 'vbox',
								margin : '0 0 0 0',
								cls : 'ux_verylargepaddingtop',
								items :
								[
									{
										xtype : 'label',
										itemId : 'status',
										text : getLabel( 'status', 'Status' ),
										cls : 'black ux_font-size14 ux_normalpadding-bottom',
										width : 165
									},
									{
										xtype : 'combobox',
										width : 165,
										displayField : 'value',
										itemId : 'uploadStatus',
										store : comboBoxStore,
										valueField : 'key',
										triggerBaseCls : 'xn-form-trigger',
										cls : 'ux_dropdown',
										value : 'All',
										padding : '0 8 0 0'
									}
								]
							},
							{
								xtype : 'container',
								cls : 'ux_verylargepaddingtop',
								layout : 'vbox',
								hidden : hideField,
								items : [{
									xtype : 'label',
									text : getLabel('noOfCompany', 'No of Company'),
									cls : 'ux_font-size14 ux_normalpadding-bottom'
								},{
									xtype : 'textfield',
									itemId : 'noOfCompany',
									width : 165
								}]
							}
						]
					},
					{
						xtype : 'container',
						//columnWidth : 0.5,
						flex : 1,
						layout : 'vbox',
						cls : 'ux_verylargepaddingtop',
						padding : '0 0 0 10',
						defaults :
						{
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[	
						/**	{
								xtype : 'container',
								layout : 'vbox',
								items : [{
									xtype : 'label',
									cls : 'ux_font-size14 ux_normalpadding-bottom',
									text : 'Upload Date Time'
								},{
									xtype : 'datefield',
									itemId : 'importDateTime',
									editable :false,
									hideTrigger : true,
									width : 165,
									minValue : clientFromDate,
									value : dtEntryDateVal
								}]
							},  **/
							{
								xtype : 'container',
								layout : 'vbox',
								cls : 'ux_verylargepaddingtop',
								items : [{
									xtype : 'label',
									cls : 'ux_font-size14 ux_normalpadding-bottom',
									text : getLabel('totalCrCount', 'Total Credit Count')
								},{
									xtype : 'textfield',
									itemId : 'totalCrCount',
									width : 165
								}]
							},
							{
								xtype : 'container',
								layout : 'vbox',
								cls : 'ux_verylargepaddingtop',
								hidden : hideField,
								items : [{
									xtype : 'label',
									cls : 'ux_font-size14 ux_normalpadding-bottom',
									text : getLabel('totalDrCount', 'Total Debit Count')
								},{
									xtype : 'textfield',
									itemId : 'totalDrCount',
									width : 165
								}]
							},
							
							{
								xtype : 'container',
								layout : 'vbox',
								cls : 'ux_verylargepaddingtop',
								items : [{
									xtype : 'label',
									cls : 'ux_font-size14 ux_normalpadding-bottom',
									text : getLabel('filterCode', 'Filter Name')
								},{
									xtype : 'textfield',
									itemId : 'filterCode',
									width : 165,
									maxLength : 20,
									enforceMaxLength : true,
									enableKeyEvents : true,
									listeners :
									{
										keypress : function( text )
										{
											if( text.value.length === 20 )
												me.showErrorMsg();
										}
									}
								}]
							}
							/*{
								xtype : 'textfield',
								itemId : 'filterCode',
								fieldLabel : getLabel( 'filterName', 'Filter Name' ),
								labelWidth : 150,
								maxLength : 20,
								enforceMaxLength : true,
								enableKeyEvents : true,
								listeners :
								{
									keypress : function( text )
									{
										if( text.value.length === 20 )
											me.showErrorMsg();
									}
								}
							}*/
						]
					}
				]
			}
		];

		this.dockedItems =
		[
			{
				xtype : 'toolbar',
				cls: 'ux_largepadding-left',
				margin : '20 0 0 0',
				dock : 'bottom',
				items :
				[
					'->',
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						glyph : 'xf002@fontawesome',
						text : getLabel( 'btnSearch', 'Search' ),
						itemId : 'searchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'passThruFileACHViewType' )
							{
								me.fireEvent( 'handleSearchActionGridView', btn );
							}
							else if( me.callerParent == 'passThruFileACHstdView' )
							{
								me.fireEvent( 'handleSearchAction', btn );
							}
						}
					},
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel( 'btnSaveAndSearch', 'Save and Search' ),
						itemId : 'saveAndSearchBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'passThruFileACHViewType' )
							{
								me.fireEvent( 'handleSaveAndSearchGridAction', btn );
							}
							else if( me.callerParent == 'passThruFileACHstdView' )
							{
								me.fireEvent( 'handleSaveAndSearchAction', btn );
							}

						}
					},
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button ux_largemargin-left',
						glyph : 'xf056@fontawesome',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						handler : function( btn )
						{
							if( me.callerParent == 'passThruFileACHViewType' )
							{
								me.fireEvent( 'closeGridViewFilterPopup', btn );
							}
							else if( me.callerParent == 'passThruFileACHstdView' )
							{
								me.fireEvent( 'closeFilterPopup', btn );
							}

						}
					},'->'
				]
			}
		];

		this.callParent( arguments );
	},
	getAdvancedFilterValueJson : function( FilterCodeVal, objOfCreateNewFilter )
	{
		var objJson = null;
		var jsonArray = [];

		var FileName = objOfCreateNewFilter.down( 'textfield[itemId="FileName"]' ).getValue();
		if( !Ext.isEmpty( FileName ) )
		{
			jsonArray.push(
			{
				field : 'FileName',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="FileName"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var totalCrAmount = objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmount"]' ).getValue();
		if( !Ext.isEmpty( totalCrAmount ) )
		{
			jsonArray.push(
			{
				field : 'totalCrAmount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmount"]' ).getValue(),
				value2 : ''
			} );
		}

		var uploadStatus = objOfCreateNewFilter.down( 'combobox[itemId="uploadStatus"]' ).getValue();
		if( !Ext.isEmpty( uploadStatus ) && uploadStatus != 'ALL' )
		{
			jsonArray.push(
			{
				field : 'uploadStatus',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="uploadStatus"]' ).getValue(),
				value2 : ''
			} );
		}

		var noOfCompany = objOfCreateNewFilter.down( 'textfield[itemId="noOfCompany"]' ).getValue();
		if( !Ext.isEmpty( noOfCompany ) )
		{
			jsonArray.push(
			{
				field : 'noOfCompany',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="noOfCompany"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var totalCrCount = objOfCreateNewFilter.down( 'textfield[itemId="totalCrCount"]' ).getValue();
		if( !Ext.isEmpty( totalCrCount ) )
		{
			jsonArray.push(
			{
				field : 'totalCrCount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalCrCount"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var totalDrCount = objOfCreateNewFilter.down( 'textfield[itemId="totalDrCount"]' ).getValue();
		if( !Ext.isEmpty( totalDrCount ) )
		{
			jsonArray.push(
			{
				field : 'totalDrCount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalDrCount"]' ).getValue(),
				value2 : ''
			} );
		}
		

		var totalDrAmount = objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmount"]' ).getValue();
		if( !Ext.isEmpty( totalDrAmount ) )
		{
			jsonArray.push(
			{
				field : 'totalDrAmount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmount"]' ).getValue(),
				value2 : ''
			} );
		}
		
/**	 var importDateTime =objOfCreateNewFilter.down('datefield[itemId="importDateTime"]').getValue();
		 if(!Ext.isEmpty(importDateTime)) { 
			  jsonArray.push({
				  field :'importDateTime',
				  operator :'eq',
				  value1 : Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="importDateTime"]').getValue(),
					'Y-m-d'),
				  value2 : ''
			   }); 
		   }  **/
		   
		var filterCode = '';
		objJson = {};
		objJson.filterBy = jsonArray;
		if( FilterCodeVal && !Ext.isEmpty( FilterCodeVal ) )
			objJson.filterCode = FilterCodeVal;
		return objJson;
	},
	getAdvancedFilterQueryJson : function( objOfCreateNewFilter )
	{
		var objJson = null;

		var jsonArray = [];

		var FileName = objOfCreateNewFilter.down( 'textfield[itemId="FileName"]' ).getValue();
		if( !Ext.isEmpty( FileName ) )
		{
			jsonArray.push(
			{
				field : 'FileName',
				operator : 'lk',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="FileName"]' ).getValue(),
				value2 : ''
			} );
		}

		var totalCrAmount = objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmount"]' ).getValue();
		if( !Ext.isEmpty( totalCrAmount ) )
		{
			jsonArray.push(
			{
				field : 'totalCrAmount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalCrAmount"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var totalDrAmount = objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmount"]' ).getValue();
		if( !Ext.isEmpty( totalDrAmount ) )
		{
			jsonArray.push(
			{
				field : 'totalDrAmount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalDrAmount"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var uploadStatus = objOfCreateNewFilter.down( 'combobox[itemId="uploadStatus"]' ).getValue();
		if( !Ext.isEmpty( uploadStatus ) && uploadStatus != 'All' )
		{
			jsonArray.push(
			{
				field : 'uploadStatus',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="uploadStatus"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var noOfCompany = objOfCreateNewFilter.down( 'textfield[itemId="noOfCompany"]' ).getValue();
		if( !Ext.isEmpty( noOfCompany ) )
		{
			jsonArray.push(
			{
				field : 'noOfCompany',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="noOfCompany"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var totalCrCount = objOfCreateNewFilter.down( 'textfield[itemId="totalCrCount"]' ).getValue();
		if( !Ext.isEmpty( totalCrCount ) )
		{
			jsonArray.push(
			{
				field : 'totalCrCount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalCrCount"]' ).getValue(),
				value2 : ''
			} );
		}
		
		var totalDrCount = objOfCreateNewFilter.down( 'textfield[itemId="totalDrCount"]' ).getValue();
		if( !Ext.isEmpty( totalDrCount ) )
		{
			jsonArray.push(
			{
				field : 'totalDrCount',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'textfield[itemId="totalDrCount"]' ).getValue(),
				value2 : ''
			} );
		}
		
	/** var importDateTime =objOfCreateNewFilter.down('datefield[itemId="importDateTime"]').getValue();
	   if(!Ext.isEmpty(importDateTime)) { 
		  jsonArray.push({
			  field :'importDateTime',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="importDateTime"]').getValue(),
			  					'Y-m-d'),
			  value2 : '',
			  dataType: 1,
			  displayType:5
		   }); 
	   } **/
		

		objJson = jsonArray;
		return objJson;
	},
	resetAllFields : function( objCreateNewFilterPanel )
	{
		objCreateNewFilterPanel.down( 'label[itemId="errorLabel"]' ).setText( ' ' );
		objCreateNewFilterPanel.down( 'textfield[itemId="FileName"]' ).reset();
		objCreateNewFilterPanel.down( 'combobox[itemId="uploadStatus"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrAmount"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrAmount"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="noOfCompany"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrCount"]' ).reset();
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrCount"]' ).reset();
	//	objCreateNewFilterPanel.down( 'datefield[itemId="importDateTime"]' ).reset();
	},
	enableDisableFields : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="FileName"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="uploadStatus"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrAmount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="noOfCompany"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrAmount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrCount"]' ).setDisabled( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrCount"]' ).setDisabled( boolVal );
		//objCreateNewFilterPanel.down( 'datefield[itemId="importDateTime"]' ).setDisabled( boolVal );
	},
	removeReadOnly : function( objCreateNewFilterPanel, boolVal )
	{
		objCreateNewFilterPanel.down( 'textfield[itemId="FileName"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'combobox[itemId="uploadStatus"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrAmount"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="noOfCompany"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrAmount"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalCrCount"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="totalDrCount"]' ).setReadOnly( boolVal );
		//objCreateNewFilterPanel.down( 'textfield[itemId="importDateTime"]' ).setReadOnly( boolVal );
		objCreateNewFilterPanel.down( 'textfield[itemId="filterCode"]' ).setReadOnly( boolVal );
	},
	showErrorMsg : function()
	{
		var me = this;
		var objErrorLabel = me.down( 'label[itemId="errorLabel"]' );
		objErrorLabel.setText( getLabel( 'filterCodeLength', 'The max length of Filter Name is 20' ) );
		objErrorLabel.show();
	}
} );
