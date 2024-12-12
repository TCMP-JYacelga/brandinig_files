Ext.define( 'Pool.model',
{
	extend : 'Ext.data.Model',
	fields :
	[
		{
			name : 'nodeName',
			type : 'string'
		},
		{
			name : 'nodeType',
			type : 'string'
		},
		{
			name : 'sessionId',
			type : 'string'
		},
		{
			name : 'agreementRecKey',
			type : 'string'
		},
		{
			name : 'netBookBalance',
			type : 'string'
		},
		{
			name : 'grossDrBookBalance',
			type : 'string'
		},
		{
			name : 'grossCrBookBalance',
			type : 'string'
		},
		{
			name : 'clearedBalance',
			type : 'string'
		},
		{
			name : 'availableBalance',
			type : 'string'
		},
		{
			name : 'entryDate',
			type : 'string'
		},
		{
			name : 'drInterestProfRecKey',
			type : 'string'
		},
		{
			name : 'crInterestProfRecKey',
			type : 'string'
		},
		{
			name : 'drApportionmentProfRecKey',
			type : 'string'
		},
		{
			name : 'crApportionmentProfRecKey',
			type : 'string'
		}
	]
} );

Ext.define( 'GCP.controller.LmsNotionalPoolViewController',
{
	extend : 'Ext.app.Controller',
	requires :
	[
		'GCP.view.LmsNotionalPoolViewGridView', 'Ext.grid.*', 'Ext.util.*', 'Ext.tree.*', 'Ext.ux.CheckColumn'
	],
	views :
	[
		'GCP.view.LmsNotionalPoolView'
	],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs :
	[
		{
			ref : 'lmsNotionalPoolViewRef',
			selector : 'lmsNotionalPoolViewType'
		},
		{
			ref : 'lmsNotionalPoolViewGridViewRef',
			selector : 'lmsNotionalPoolViewType lmsNotionalPoolViewGridViewType'
		},
		{
			ref : 'lmsNotionalPoolViewGridRef',
			selector : 'lmsNotionalPoolViewType lmsNotionalPoolViewGridViewType panel[itemId="poolgrid"]'
		},
		{
			ref : 'lmsNotionalPoolViewFilterViewRef',
			selector : 'lmsNotionalPoolViewType lmsNotionalPoolViewFilterViewType'
		},
		{
			ref:'filterView',
			selector:'filterView'		
		}		
	],
	config :
	{
		addPoolPopup : null,
		sellerCodeFilterVal : null,
		sellerDescFilterVal : null,
		clientCodeFilterVal : null,
		clientCodeVal : null,
		agreementCodeFilterVal : null,
		agreementDescFilterVal : null,
		agreementRecKeyFilterVal : null,
		agreementSubType : 1,
		filterData : [],
		isSelectAggrCode : false,
		isSelectCompany : false
	},

	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */

	init : function()
	{
		var me = this;
		$(document).on('performReportAction', function(event, actionName) {
					me.callDownloadXlsPoolView();
		});	
		$(document).on('handleFilterPanelVisibility', function(event, actionName) {
					me.handleFilterPanelVisibility();
		});	
		$(document).on('redirectToInterestRateSlabDtls', function(event, strUrl, agreementFilters) {
			me.redirectToInterestRateSlabDtls(strUrl, agreementFilters);
		});
		
		me.sellerCodeFilterVal = strSellerId;

		me
			.control(
			{
				'lmsNotionalPoolViewType' :
				{
					render : function( panel )
					{
						me.setValuesFromInterestRateSlab();
						me.handleTreeGridConfig();
					}
				},

				'lmsNotionalPoolViewFilterViewType' :
				{
					render : function( panel, opts )
					{
						me.setInfoTooltip();
						
						if( entityType == '1'  )
						{
							var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/poolViewClientAgreementCodeSeek.json';
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : strClientId
								}
							];
						}
					}
				},

			/*	'lmsNotionalPoolViewGridViewType' :
				{
					callToDownloadXlsPoolView : function()
					{
						me.callDownloadXlsPoolView();
					}
				},*/

				'filterView button[itemId="clearSettingsButton"]' : {
					'click' : function() {
						me.handleClearSettings();
					}
				},
				'filterView' : {
					appliedFilterDelete : function(btn){
						me.handleAppliedFilterDelete(btn);
					}
				},
				'lmsNotionalPoolViewFilterViewType combobox[itemId="sellerIdItemId"]' :
				{
					select : function( combo, record, index )
					{
						var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
						var objAutocompleter = objFilterPanel
							.down( 'AutoCompleter[itemId="clientIdAutoCompleterItemId"]' );
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : record[ 0 ].data.sellerCode
							}
						];
						me.sellerCodeFilterVal = record[ 0 ].data.sellerCode;
						me.sellerDescFilterVal = combo.getRawValue();
						sellerValue = combo.getValue();
						sellerDisc =  combo.getRawValue();
						sellerCode = sellerValue;
					},
					change : function( combo, newValue , oldValue)
					{
						if (combo.value == '' || combo.value == null) {
							sellerValue = '';
							sellerDisc = '';
							sellerCode = '';
						}
						    
					},
					boxready : function(combo, width, height, eOpts) {
						if(!Ext.isEmpty(me.sellerCodeFilterVal))
							combo.setValue(me.sellerCodeFilterVal);
						else
							combo.setValue(combo.getStore().getAt(0));
					}
				},

				'lmsNotionalPoolViewFilterViewType combobox[itemId="clientIdComboItemId"]' :
				{
					select : function( combo, record, index )
					{
						var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : record[ 0 ].data.CODE
							}
						];
						me.clientCodeFilterVal = record[ 0 ].data.DESCRIPTION;
						me.clientCodeVal = record[ 0 ].data.CODE; 
						me.clientCodeFilterVal = null;
						me.agreementCodeFilterVal = null;
						me.agreementDescFilterVal = null;
						me.agreementRecKeyFilterVal = null;
						me.agreementSubType = null;						
						clientValue = record[ 0 ].data.CODE;
						clientDisc =  record[ 0 ].data.DESCRIPTION;
						clientCode = clientValue;
						clientDesc = clientDisc;
					},
					boxready : function(combo, width, height, eOpts) {
						if(!Ext.isEmpty(me.clientCodeVal))
							combo.setValue(me.clientCodeVal);
						else
							combo.setValue(combo.getStore().getAt(0));
					}
				},
				'lmsNotionalPoolViewFilterViewType AutoCompleter[itemId="clientIdAutoCompleterItemId"]' :
				{
					change : function(combo, newValue , oldValue) {
						var objFilterPanel = me
						.getLmsNotionalPoolViewFilterViewRef();
						var objAutocompleter = objFilterPanel
								.down('AutoCompleter[itemId="agreementCodeItemId"]');
						objAutocompleter.cfgSeekId = "poolViewAgreementCodeSeekAll";
						if (newValue == '' || newValue == null) {
							clientValue = '';
							clientDisc =  '';
							clientCode = '';
							clientDesc = '';
							me.clientCodeFilterVal = null;
							me.agreementCodeFilterVal = null;
							me.agreementDescFilterVal = null;
							me.agreementRecKeyFilterVal = null;
							me.agreementSubType = null;
							me.isSelectCompany = true;
							objAutocompleter.setValue( '' );
						}else{
							me.isSelectCompany = false;
						}
					},
					
					select : function( combo, record, index )
					{
						var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgSeekId = "poolViewAgreementCodeSeek";
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : record[ 0 ].data.CODE
							}
						];
						me.clientCodeFilterVal = record[ 0 ].data.DESCRIPTION;
						me.clientCodeVal = record[ 0 ].data.CODE;
						me.agreementCodeFilterVal = null;
						me.agreementDescFilterVal = null;
						me.agreementRecKeyFilterVal = null;
						me.agreementSubType = null;
						
						clientValue = record[ 0 ].data.CODE;
						clientDisc =  record[ 0 ].data.DESCRIPTION;
						clientCode = clientValue;
						clientDesc = clientDisc;
						me.isSelectCompany = true;
					},
					keyup :  function( combo, e, eOpts){
						me.isSelectCompany = false;
					},
					blur : function(combo, The, eOpts){
						if(!me.isSelectCompany){
							
							var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgSeekId = "poolViewAgreementCodeSeek";
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : combo.getRawValue()
								}
							];
							me.clientCodeFilterVal = combo.getValue();
							me.agreementCodeFilterVal = null;
							me.agreementDescFilterVal = null;
							me.agreementRecKeyFilterVal = null;
							me.agreementSubType = null;
							
							clientValue = combo.getValue();
							clientDisc =  combo.getValue();
							clientCode = clientValue;
							clientDesc = clientDisc;
							
							me.isSelectCompany = false;
						}
					},
					boxready : function(combo, width, height, eOpts) {
						if(!Ext.isEmpty(me.clientCodeFilterVal)){
							combo.setValue(me.clientCodeVal);
							combo.setRawValue(me.clientCodeFilterVal);
							
							var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
							objAutocompleter.setValue(me.agreementCodeFilterVal);
							objAutocompleter.cfgSeekId = "poolViewAgreementCodeSeek";
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : me.clientCodeVal
								}
							];
							me.isSelectCompany = true;
						}
					}
				},

				'lmsNotionalPoolViewFilterViewType AutoCompleter[itemId="agreementCodeItemId"]' :
				{
					select : function( combo, record, index )
					{
						me.agreementCodeFilterVal = record[ 0 ].data.CODE;
						me.agreementDescFilterVal = record[ 0 ].data.DESCRIPTION;
						me.agreementRecKeyFilterVal = record[ 0 ].data.RECORD_KEY_NO;
						me.agreementSubType = record[ 0 ].data.SUB_TYPE;
						
						agreementValue = record[ 0 ].data.CODE;
						agreementDisc =  record[ 0 ].data.DESCRIPTION;
						agreementDesc = agreementDisc;
						agreementCode = agreementValue;
						agreementSubType = me.agreementSubType;
						agreementRecKey = me.agreementRecKeyFilterVal;
						me.isSelectAggrCode = true;
					},
					change : function(combo, newValue , oldValue) {
						if (newValue == '' || newValue == null) {
							agreementValue  = '';
							agreementDisc =  '';
							me.agreementCodeFilterVal = null;
							me.agreementDescFilterVal = null;
							me.agreementRecKeyFilterVal = null;
							me.isSelectAggrCode = true;
							me.agreementSubType = null;
							agreementDesc = agreementDisc;
							agreementCode = agreementValue;
							agreementSubType = me.agreementSubType;
							agreementRecKey = me.agreementRecKeyFilterVal;
						}else{
							me.isSelectAggrCode = false;
						}
					},
					keyup :  function( combo, e, eOpts){
						me.isSelectAggrCode = false;
					},
					blur : function(combo, The, eOpts){
						if(!me.isSelectAggrCode){
							me.agreementCodeFilterVal = combo.getValue();
							me.agreementDescFilterVal = combo.getValue();							
							agreementValue = combo.getValue();
							agreementDisc =  combo.getValue();
							me.isSelectAggrCode = false;
							agreementDesc = agreementDisc;
							agreementCode = agreementValue;
							me.agreementRecKeyFilterVal = null;
							// agreementSubType = me.agreementSubType;
							agreementRecKey = me.agreementRecKeyFilterVal;
						}
					},
					boxready : function(combo, width, height, eOpts) {
						if(!Ext.isEmpty(me.agreementDescFilterVal)){
							combo.setValue(me.agreementCodeFilterVal);
							combo.setRawValue(me.agreementDescFilterVal);
							me.isSelectAggrCode = true;
						}
						me.appliedFilterCreation();
					}
				},

				'lmsNotionalPoolViewFilterViewType button[itemId="btnFilter"]' :
				{
					click : function( btn, opts )
					{
						 var errorSpan=$('#errorSpan');
						 var errorText=$('#errorText');
						 var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
						 var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
						 if(!Ext.isEmpty(objAutocompleter.getValue())){
							 errorSpan.addClass('ui-helper-hidden');
							 me.handleHeaderFilterPanelVisibility();
							 me.callHandleLoadGridData();
						 }else{
							  errorSpan.removeClass('ui-helper-hidden');
							  errorText.text("Ageement code is required");
							  me.callHandleLoadGridData();
							 
						 }
						
						
					}
				}
			} );
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
					var sellerFilter = me.sellerCodeFilterVal;
					var clientFilter = me.clientCodeFilterVal;
					var agreementFilter = me.agreementCodeFilterVal;

					tip.update( getLabel( 'lbl.lmsNotionalPoolView.seller', 'Financial Institution' ) + ' : '
						+ sellerFilter + '<br/>' + getLabel( 'grid.column.company', 'Company Name' ) + ' : '
						+ clientFilter + '<br/>' + getLabel( 'lbl.lmsNotionalPoolView.agreement', 'Agreement' ) + ' : '
						+ agreementFilter );
				}
			}
		} );
	},

	handleClearSettings:function(){
		var me=this;
		var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
		
		if( entityType == '0' )
		{
			if( isMultipleSellersAvailable == true )
			{
				var sellerField = objFilterPanel.down( 'combo[itemId="sellerIdItemId"]' );
				me.sellerDescFilterVal = null;
				me.sellerCodeFilterVal = null;
				sellerField.setValue('All');
			}
			
			var clientField = objFilterPanel.down( 'AutoCompleter[itemId="clientIdAutoCompleterItemId"]' );
			clientField.setValue('');
			me.clientCodeFilterVal = null;
			
			var agreementCodeField = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
			agreementCodeField.setValue('');
			me.agreementCodeFilterVal = null;
			me.agreementDescFilterVal = null;
			me.agreementRecKeyFilterVal = null;
			
		}
		else if( entityType == '1' )
		{
			var clientField = objFilterPanel.down( 'combo[itemId="clientIdComboItemId"]' );
			clientField.setValue('All Companies' );
			me.clientCodeFilterVal = null;
			
			var agreementCodeField = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
			agreementCodeField.setValue('');
			me.agreementCodeFilterVal = null;
			me.agreementDescFilterVal = null;
			me.agreementRecKeyFilterVal = null;			
		}

		me.callHandleLoadGridData();
	},
	/*Applied Filters handling starts here*/	
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				}
			me.resetFieldInQuickFilterOnDelete(objData);
		}
	},
	findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	resetFieldInQuickFilterOnDelete : function(objData){
		var me = this,strFieldName;
		var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if( entityType == '0' )
		{
			if( strFieldName == 'sellerCode' )
			{
				var sellerField = objFilterPanel.down( 'combo[itemId="sellerIdItemId"]' );
				me.sellerDescFilterVal = null;
				me.sellerCodeFilterVal = null;
				sellerField.setValue('All');
			}
			else if( strFieldName == 'clientCode' )
			{
				var clientField = objFilterPanel.down( 'AutoCompleter[itemId="clientIdAutoCompleterItemId"]' );
				clientField.setValue('');
				me.clientCodeFilterVal = null;
			}
			else if( strFieldName == 'agreementCode' )
			{
				var agreementCodeField = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
				agreementCodeField.setValue('');
				me.agreementCodeFilterVal = null;
				me.agreementDescFilterVal = null;
				me.agreementRecKeyFilterVal = null;				
			}			
		}
		else if( entityType == '1' )
		{
			if( strFieldName == 'clientCode' )
			{
				var clientField = objFilterPanel.down( 'combo[itemId="clientIdComboItemId"]' );
				clientField.setValue('Select Company');
				me.clientCodeFilterVal = null;
			}
			else if( strFieldName == 'agreementCode' )
			{
				var agreementCodeField = objFilterPanel.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );
				agreementCodeField.setValue('');
				me.agreementCodeFilterVal = null;
				me.agreementDescFilterVal = null;
				me.agreementRecKeyFilterVal = null;				
			}				
		}
		me.callHandleLoadGridData();
	},
	/*Applied Filters handling ends here*/	
	callDownloadXlsPoolView : function()
	{
		var me = this;
		var poolViewTreeGridRef = me.getLmsNotionalPoolViewGridViewRef();
		var gridRef = Ext.getCmp( 'poolgrid' );
		if( !Ext.isEmpty( gridRef.getRootNode().firstChild ) )
		{
			var sessionId = gridRef.getRootNode().firstChild.data.sessionId;
			var agreementRecKey = gridRef.getRootNode().firstChild.data.agreementRecKey;
			downloadXlsPoolView( sessionId, agreementRecKey );
		}
	},

	handleHeaderFilterPanelVisibility: function(){
		var me = this;
		var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
		var objGridPanel = me.getLmsNotionalPoolViewGridViewRef();
		var objReadOnlyFilterPnael = $('#headerReadOnlyDiv');
		objGridPanel.removeCls('ui-helper-hidden');
		objReadOnlyFilterPnael.removeClass('ui-helper-hidden');
	},
	handleFilterPanelVisibility: function(){
		var me = this;
		var objFilterPanel = me.getLmsNotionalPoolViewFilterViewRef();
		var objGridPanel = me.getLmsNotionalPoolViewGridViewRef();
		var objReadOnlyFilterPnael = $('#headerReadOnlyDiv');
		
		objFilterPanel.show();
		objReadOnlyFilterPnael.addClass('ui-helper-hidden');
		objGridPanel.addCls('ui-helper-hidden');

	},
	appliedFilterCreation : function()
	{
		var me = this;
		var arrOfParseQuickFilter = [];
		me.setDataForFilter();
		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		if(arrOfParseQuickFilter) {
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
	},
	callHandleLoadGridData : function()
	{
		var me = this;
		me.appliedFilterCreation();
	//	var arrOfParseQuickFilter = [];
		Ext.getCmp( 'poolgrid' ).destroy();
		me.handleTreeGridConfig();
	},
	setDataForFilter : function() {
		var me = this;
		this.filterData = this.getFilterQueryJson();
	},
	getFilterQueryJson : function() {
		var me = this,jsonArray = [];
		
		if( entityType === '0' && isMultipleSellersAvailable == true )
		{
			if( !Ext.isEmpty( me.sellerDescFilterVal ) && !Ext.isEmpty( me.sellerCodeFilterVal ))
			{
				jsonArray.push(
				{
					paramName : 'sellerCode',
					paramValue1 : me.sellerCodeFilterVal,
					operatorValue : 'eq',
					dataType : 'S',
					displayType : 5,
					paramFieldLable : getLabel( 'lbl.lmsNotionalPoolView.seller', 'Financial Institution' ),
					displayValue1 :  me.sellerDescFilterVal
				} );
			}
		}
		
		if( entityType === '0' )
		{
			if( !Ext.isEmpty( me.clientCodeFilterVal ) )
			{
				jsonArray.push(
				{
					paramName : 'clientCode',
					paramValue1 : me.clientCodeFilterVal,
					operatorValue : 'eq',
					dataType : 'S',
					displayType : 5,
					paramFieldLable : getLabel( 'lbl.companyname', 'Company Name' ),
					displayValue1 :  me.clientCodeFilterVal
				} );				
			}
		}
		else if( entityType === '1' )
		{
			if( !Ext.isEmpty( me.clientCodeFilterVal ) )
			{
				jsonArray.push(
				{
					paramName : 'clientCode',
					paramValue1 : me.clientCodeFilterVal,
					operatorValue : 'eq',
					dataType : 'S',
					displayType : 5,
					paramFieldLable : getLabel( 'lbl.lmsNotionalPoolView.client', 'Client Name' ),
					displayValue1 :  me.clientCodeFilterVal
				} );				
			}
		}
		
		if( !Ext.isEmpty( me.agreementCodeFilterVal ) && !Ext.isEmpty( me.agreementDescFilterVal ))
		{
			jsonArray.push(
			{
				paramName : 'agreementCode',
				paramValue1 : me.agreementCodeFilterVal,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 5,
				paramFieldLable : getLabel( 'lbl.lmsCmtmAccountStore.agreementCode', 'Agreement Code' ),
				displayValue1 :  me.agreementDescFilterVal
			} );
		}
		
		return jsonArray;
	},
	handleTreeGridConfig : function()
	{
		var me = this;
		poolViewTreeGrid = Ext.create( 'Ext.tree.Panel',
		{
			xtype : 'tree-grid',
			id : 'poolgrid',
			itemId : 'poolgrid',
			minHeight : 140,
			maxHeight : 415,
			useArrows : true,
			rootVisible : false,
			multiSelect : true,
			singleExpand : false,
			overflowX : 'auto',
			width : 'auto',
			store : new Ext.data.TreeStore(
			{
				model : Pool.model,
				proxy :
				{
					type : 'ajax',
					/*url : 'getLmsNotionalPoolViewTree.srvc?$viewState=' + encodeURIComponent( viewState ) + '&'
						+ csrfTokenName + "=" + csrfTokenValue,*/
					url : 'getLmsNotionalPoolViewTree.srvc?$agreementRecKey=' + me.agreementRecKeyFilterVal + '&'
						+ '$sellerId=' + me.sellerCodeFilterVal + '&' + csrfTokenName + "=" + csrfTokenValue,
					method : 'POST',
					afterRequest: function(req, res) {
						if(null!= req.operation.response) {
						var response = req.operation.response.responseText;
						var data = Ext.decode(response,true);
						if(null!= data &&  null!= data.error && !Ext.isEmpty(data.error)){							
							 var errorSpan=$('#errorSpan');
							 var errorText=$('#errorText');
							  errorSpan.removeClass('ui-helper-hidden');
							  errorText.text(data.error);							 
						}
					}
			        },
					reader :
					{
						type : 'json'
					},
					listeners : {
						exception : function(proxy, response, operation) {
							var msg = response.responseText;
							if(null!= msg && !Ext.isEmpty(msg)){
								 var errorSpan=$('#errorSpan');
								 var errorText=$('#errorText');
								  errorSpan.removeClass('ui-helper-hidden');
								  errorText.text(data.error);							
							}
						}
					}						
				},
				folderSort : true
			} ),
			columns :
			[
				{
					xtype : 'treecolumn', // this is so we know which
					// column will show the tree
					text : getLabel( 'lbl.lmsNotionalPoolView.nodeName', 'Node Name' ),
					locked : true,
					width : 200,
					sortable : false,
					dataIndex : 'nodeName',
					menuDisabled: true,
					autoSizeColumn: true
				},
				{
					text : 'Tree View',
					width : 130,
					sortable : false,
					menuDisabled: true,
					autoSizeColumn: true,
					align : 'left',
					dataIndex : 'viewstate',
					renderer : function( value, meta, record )
					{
					value='';
						
						if( record.get('nodeType') == 'P')
						{
							var strUrl123 ="viewAgreementNotionalTree.srvc','"+record.raw+"','1";
							value = value + ' <a href="#" >Tree View</a>';
						}
						return value;
					}
				},
				{
					text : getLabel( 'lbl.lmsNotionalPoolView.netBookBalance', 'Net Book Balance' ),
					width : 150,
					sortable : false,
					hidden : me.agreementSubType == 1 ? false : true,
					dataIndex : 'netBookBalance',
					align : 'right',
					menuDisabled: true,
					autoSizeColumn: true 
				},
				{
					text : getLabel( 'lbl.lmsNotionalPoolView.grossCrBookBalance', 'Gross Credit Book Balance' ),
					width : 210,
					sortable : false,
					dataIndex : 'grossCrBookBalance',
					align : 'right',
					menuDisabled: true,
					autoSizeColumn: true 
				},
				{
					text : getLabel( 'lbl.lmsNotionalPoolView.grossDrBookBalance', 'Gross Debit Book Balance' ),
					width : 200,
					sortable : false,
					dataIndex : 'grossDrBookBalance',
					align : 'right',
					menuDisabled: true,
					autoSizeColumn: true 
				},
				{
					text : getLabel( 'lbl.lmsNotionalPoolView.clearedBalance', 'Cleared Balance' ),
					width : 135,
					sortable : false,
					menuDisabled: true,
					dataIndex : 'clearedBalance',
					align : 'right',
					autoSizeColumn: true 
				},
				{
					text : getLabel( 'lbl.lmsNotionalPoolView.availableBalance', 'Available Balance' ),
					width : 145,
					sortable : false,
					menuDisabled: true,
					dataIndex : 'availableBalance',
					align : 'right',
					autoSizeColumn: true
				},
				{
					text : getLabel( 'lbl.lmsNotionalPoolView.entryDate', 'Time Stamp' ),
					width : 200,
					//flex: 1,
					sortable : false,
					menuDisabled: true,
					dataIndex : 'entryDate',
					align : 'right',
					autoSizeColumn: true,
					renderer : function( value, meta, record )
					{
						if( record.get('nodeType') != 'A')
						{
							value = '';
						}
						return value;
					}
				},
				{
					text : getLabel( 'lbl.lmsNotionalPoolView.interestRates', 'Interest Rates' ),
					width : 130,
					sortable : false,
					menuDisabled: true,
					autoSizeColumn: true,
					align : 'left',
					dataIndex : 'creditApportmentProfileDesc',
					renderer : function( value, meta, record )
					{
						var strUrl = 'viewInterestRateSlabDetails.popup?$creditBankProfile='+record.get('crInterestProfRecKey')
						+ '&$debitBankProfile='+record.get('drInterestProfRecKey')+'&$debitApportionProfile='+record.get('drApportionmentProfRecKey') 
						+ '&$creditApportionProfile='+record.get('crApportionmentProfRecKey') + '&'+ csrfTokenName+'='+csrfTokenValue;
						var flag = false;
						if( record.get('crInterestProfRecKey').length === 0 && 
						    record.get('drInterestProfRecKey').length === 0 && 
						    record.get('drApportionmentProfRecKey').length === 0 && 
						    record.get('crApportionmentProfRecKey').length === 0 ){
						    flag = true;	
						    }
						return flag ?'View Details': '<a href="#" onclick="javascript:callViewInterestRateSlabDetails(\'' + strUrl
							+ '\');">View Details</a>';
					}
				}		
			]
		} );

		poolViewTreeGrid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			if( clickedColumn && clickedColumn.text != 'Node Name' && clickedColumn.text != 'Interest Rates' && clickedColumn.text !='Tree View')
			{

				var agreementFilters = { 'agreementRecKey':me.agreementRecKeyFilterVal, 'agreementDesc': me.agreementDescFilterVal,
						   'agreementCode' : me.agreementCodeFilterVal, 'agreementSubType' : me.agreementSubType, 
						   'clientCode' : me.clientCodeVal, 'clientDesc' : me.clientCodeFilterVal, 'sellerCode' : me.sellerCodeFilterVal };
				
				var strUrl = 'viewInterestRateSlabDetails.popup?$creditBankProfile='+record.get('crInterestProfRecKey')
				+ '&$debitBankProfile='+record.get('drInterestProfRecKey')+'&$debitApportionProfile='+record.get('drApportionmentProfRecKey') 
				+ '&$creditApportionProfile='+record.get('crApportionmentProfRecKey') + /*'&$agreementFilters=' + Ext.encode( agreementFilters ) +*/ 
				'&'+ csrfTokenName+'='+csrfTokenValue;
				viewInterestRateSlabDetails(strUrl, agreementFilters);
			}
			if( clickedColumn.text =='Tree View')
			{
				showAgreementNotionalTree( 'viewAgreementNotionalTree.srvc', record, rowIndex );				
			}
			
		});
		var columnList = null;
		columnList = poolViewTreeGrid.columns;
		poolViewTreeGrid.store.on('load', function( poolViewTreeGrid, node, records, successful, eOpts )
		{
            var me = this, arrAllCols = columnList;
            if ( arrAllCols && arrAllCols.length > 1)
            {
            	if(Ext.isEmpty(records)){
            		Ext.each(arrAllCols, function(col) {
	                    // For single column grid this should not apply
	                    if (col.xtype != 'treecolumn') {
	                            col.autoSize();
	                    }
	            	});
            	}else{
            		Ext.each(arrAllCols, function(col) {
	                    // For single column grid this should not apply
	                    if (col.xtype != 'treecolumn' 
	                    	&& col.dataIndex != 'entryDate'
	                    		&& col.dataIndex != 'creditApportmentProfileDesc') {
	                            col.autoSize();
	                    }
	            	});
            	}
            }

            
		});
		
		/*poolViewTreeGrid.on('afterrender', function( poolGrid, eOpts )
				{
		            var arrAllCols = columnList;
		            if ( arrAllCols && arrAllCols.length > 1)
		            {
		            	Ext.each(arrAllCols, function(col) {
		                    // For single column grid this should not apply
		                    if (col.xtype != 'treecolumn' ) {
		                            col.autoSize();
		                    }
		            	});            	
		            }
				});*/
		
		
		
		
		var poolViewTreeGridRef = me.getLmsNotionalPoolViewGridViewRef();
		poolViewTreeGridRef.add( poolViewTreeGrid );
		
		
		/*var me = this, arrAllCols = columnList;
        if ( arrAllCols && arrAllCols.length > 1)
        {
        	Ext.each(arrAllCols, function(col) {
                // For single column grid this should not apply
        		 if (col.xtype != 'treecolumn' ) {
                     col.autoSize();
             }
        	});            	
        }*/
		
		poolViewTreeGridRef.doLayout();
		
		
		
		
	},
	redirectToInterestRateSlabDtls : function(strUrl, agreementFilters){
		var me = this;
		if(Ext.isEmpty(agreementFilters)){
			agreementFilters = { 'agreementRecKey':me.agreementRecKeyFilterVal, 'agreementDesc': me.agreementDescFilterVal,
					   'agreementCode' : me.agreementCodeFilterVal, 'agreementSubType' : me.agreementSubType, 
					   'clientCode' : me.clientCodeVal, 'clientDesc' : me.clientCodeFilterVal, 'sellerCode' : me.sellerCodeFilterVal };
		}
		viewInterestRateSlabDetails(strUrl, agreementFilters);
	},
	setValuesFromInterestRateSlab : function (){
		var me = this;
		if(null != agreementDesc && "" != agreementDesc)
			me.agreementDescFilterVal = agreementDesc;
		
		if(null != agreementCode && "" != agreementCode)
			me.agreementCodeFilterVal = agreementCode;
		
		if(null != agreementSubType && "" != agreementSubType)
			me.agreementSubType = agreementSubType;
		
		if(null != clientCode && "" != clientCode)
			me.clientCodeVal = clientCode;
		
		if(null != clientDesc && "" != clientDesc)
			me.clientCodeFilterVal = clientDesc;
		
		if(null != sellerCode && "" != sellerCode)
			me.sellerCodeFilterVal = sellerCode;
		
		if(null != agreementRecKey && "" != agreementRecKey)
			me.agreementRecKeyFilterVal = agreementRecKey;
	}
} );
