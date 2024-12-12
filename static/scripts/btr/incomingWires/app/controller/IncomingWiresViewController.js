Ext.define('GCP.controller.IncomingWiresViewController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.IncomingWiresGridView','Ext.ux.gcp.DateHandler'],
	views : ['GCP.view.IncomingWiresView','GCP.view.IncomingWiresAdvancedFilterPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'incomingWiresView',
				selector : 'incomingWiresView'
			},
	        {
				ref : 'incomingWiresGrid',
				selector : 'incomingWiresView incomingWiresGridView grid[itemId="gridViewMstId"]'
			},
			{
				ref : 'incomingWiresDtlView',
				selector : 'incomingWiresView incomingWiresGridView panel[itemId="incomingWiresDtlView"]'
			},
			{
				ref : 'incomingWiresGridView',
				selector : 'incomingWiresView incomingWiresGridView'
			}, 
			{
				ref : 'matchCriteria',
				selector : 'incomingWiresGridView radiogroup[itemId="matchCriteria"]'
			},
			{
				ref : 'searchTxnTextInput',
				selector : 'incomingWiresGridView textfield[itemId="searchTxnTextField"]'
			},
			{
				ref : 'incomingWiresFilterView',
				selector : 'incomingWiresFilterView'
			},
			{
				ref : 'fromDateLabel',
				selector : 'incomingWiresView incomingWiresFilterView label[itemId="dateFilterFrom"]'
			},
			{
				ref : 'toDateLabel',
				selector : 'incomingWiresView incomingWiresFilterView label[itemId="dateFilterTo"]'
			},
			{
				ref : 'dateLabel',
				selector : 'incomingWiresView incomingWiresFilterView label[itemId="dateLabel"]'
			},
			{
				ref : 'fromEntryDate',
				selector : 'incomingWiresView incomingWiresFilterView datefield[itemId="fromDate"]'
			},
			{
				ref : 'toEntryDate',
				selector : 'incomingWiresView incomingWiresFilterView datefield[itemId="toDate"]'
			},
			{
				ref : 'dateRangeComponent',
				selector : 'incomingWiresView incomingWiresFilterView container[itemId="dateRangeComponent"]'
			},
			{
				ref : 'entryDate',
				selector : 'incomingWiresView incomingWiresFilterView button[itemId="entryDate"]'
			},
			{
				ref : 'advFilterActionToolBar',
				selector : 'incomingWiresView incomingWiresFilterView toolbar[itemId="advFilterActionToolBar"]'
			},
			{
				ref : 'btnSavePreferences',
				selector : 'incomingWiresView incomingWiresFilterView button[itemId="btnSavePreferences"]'
			}, 
			{
				ref : 'btnClearPreferences',
				selector : 'incomingWiresView incomingWiresFilterView button[itemId="btnClearPreferences"]'
			},
			{
				ref : 'incomingWiresTypeToolBar',
				selector : 'incomingWiresView incomingWiresFilterView toolbar[itemId="incomingWiresTypeToolBar"]'
			},
			{
				ref : 'incomingWiresGridInformationView',
				selector : 'incomingWiresGridInformationView'
			},
			{
				ref : 'infoSummaryLowerPanel',
				selector : 'incomingWiresGridInformationView panel[itemId="infoSummaryLowerPanel"]'
			},
			{
				ref : 'tbarSubTotal',
				selector : 'incomingWiresView incomingWiresGridView grid[itemId="gridSubTotalTBar"]'
			},
			{
				ref : 'withHeaderCheckbox',
				selector : 'incomingWiresView incomingWiresGridTitleView menuitem[itemId="withHeaderId"]'
			},
			 {
				ref : 'advanceFilterPopup',
				selector : 'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"]'
			},
			{
				ref : 'advanceFilterTabPanel',
				selector : 'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
			}, {
				ref : 'createNewFilter',
				selector : 'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] incomingWireCreateNewAdvFilter'
			},
			{
				ref : 'filterDetailsTab',
				selector : 'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			},
			{
				ref : 'advFilterGridView',
				selector : 'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] incomingWireSummaryAdvFilterGridView'
			},
			{
				ref : 'saveSearchBtn',
				selector : 'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] incomingWireCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
			},
			{
				ref : 'withHeaderCheckboxRef',
				selector : 'incomingWiresGridTitleView menuitem[itemId="withHeaderId"]'
			},
			{
				ref : 'filterView',
				selector : 'incomingWiresView incomingWiresFilterView'
			},
			{
				ref : 'sellerClientMenuBar',
				selector : 'incomingWiresView incomingWiresFilterView panel[itemId="sellerClientMenuBar"]'
			},
			{
				ref : 'sellerMenuBar',
				selector : 'incomingWiresView incomingWiresFilterView panel[itemId="sellerMenuBar"]'
			},
			{
				ref : 'clientMenuBar',
				selector : 'incomingWiresView incomingWiresFilterView panel[itemId="clientMenuBar"]'
			},
			{
				ref : 'clientLoginMenuBar',
				selector : 'incomingWiresView incomingWiresFilterView panel[itemId="clientLoginMenuBar"]'
			}
			],
	config : {
		filterData : [],
		advFilterData : [],
		paymentTypeFilterVal : 'all',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		paymentActionFilterVal : 'all',
		paymentActionFilterDesc : 'all',
		paymentTypeFilterDesc : 'all',
		dateFilterVal : '12',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		dateFilterLabel : getLabel('latest', 'Latest'),
		objAdvFilterPopup : null,
		dateHandler : null,
		urlGridPref : 'userpreferences/incomingwire/gridView.srvc',
		urlGridFilterPref : 'userpreferences/incomingwire/gridViewFilter.srvc',
		commonPrefUrl : 'services/userpreferences/incomingwire.json',
		showClientFlag : false,
		arrSorter:[]
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
		
		this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
		me.updateFilterConfig();
		me.updateAdvFilterConfig();
		var btnClearPref = me.getBtnClearPreferences();
		if(btnClearPref)
		{
			btnClearPref.setEnabled(false);
		}
		me.objAdvFilterPopup = Ext.create('GCP.view.IncomingWiresAdvancedFilterPopup', {
			parent : 'incomingWiresView',
			itemId : 'gridViewAdvancedFilter',
			filterPanel : {
				xtype : 'incomingWireCreateNewAdvFilter',
				margin : '4 0 0 0',
				callerParent : 'incomingWiresView'
			}
		});
		
		me.control({
			'incomingWiresView' : {
			beforerender : function(panel, opts) {
			},
			afterrender : function(panel, opts) {
			},
			performReportAction : function(btn, opts) {
				me.handleReportAction(btn, opts);
			}
		},
			'incomingWiresGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.setGridInfo();
				}
			},

			'incomingWiresGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, grid.store.sorters);					
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				},
				statechange : function(grid) {
					me.toggleSavePrefrenceAction(true);
				},
				pagechange : function(pager, current, oldPageNum) {
					me.toggleSavePrefrenceAction(true);
				}
			},
			'incomingWiresGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'incomingWiresGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'incomingWiresView incomingWiresFilterView' : {
				'handleClientChange' : function(client,  clientDesc) {
								
				                    if( clientDesc.indexOf('All')==-1  )
				                    {
				                        me.filterApplied = 'ALL';
				                        me.applySeekFilter();
				                    }
								
							},
				render : function(panel, opts) {
					me.setInfoTooltip();
					me.getAllSavedAdvFilterCode(panel);
					me.setComboListVal(panel);
					me.showHideSellerClientMenuBar(entityType);
				},
				filterType : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleType(btn);
				},
				dateChange : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					this.filterApplied = 'Q';
					if (btn.btnValue !== '7') {
						me.setDataForFilter();
						me.applyQuickFilter();
						me.toggleSavePrefrenceAction(true);
					}

				},
				afterrender : function( panel, opts ) 	 	
					{ 	 	
					if(me.filterCodeValue != null) { 	 	 	
					me.handleFilterItemClick( me.filterCodeValue, null ); 	 	
					panel.highlightSavedFilter(me.filterCodeValue); 	 	
						} 	 	
					}
			},
			'incomingWiresView incomingWiresFilterView toolbar[itemId="dateToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.updateDateFilterView();
				}
			},
			'incomingWiresView incomingWiresFilterView button[itemId="goBtn"]' : {
				click : function(btn, opts) {
					var frmDate = me.getFromEntryDate().getValue();
					var toDate = me.getToEntryDate().getValue();
					
					if(!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate))
					{
					var dtParams = me.getDateParam('7');
					me.dateFilterFromVal = dtParams.fieldValue1;
					me.dateFilterToVal = dtParams.fieldValue2;
					this.filterApplied = 'Q';
					me.setDataForFilter();
					me.applyQuickFilter();
					me.toggleSavePrefrenceAction(true);
					}
				}
			},
			'incomingWiresView incomingWiresFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'incomingWiresView incomingWiresFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleClearPreferences();
				}
			},
			'incomingWiresView incomingWiresGridInformationView panel[itemId="incomingWiresSummInfoHeaderBarGridView"] container[itemId="summInfoShowHideGridView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
					if (image.hasCls("icon_collapse_summ")) {
						image.removeCls("icon_collapse_summ");
						image.addCls("icon_expand_summ");
						objAccSummInfoBar.hide();
					} else {
						image.removeCls("icon_expand_summ");
						image.addCls("icon_collapse_summ");
						objAccSummInfoBar.show();
					}
				}
			},
			'incomingWiresGridInformationView' : {
				render : this.onIncomingWireSummaryInformationViewRender
			},
			'incomingWiresView incomingWiresGridTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				},
				afterrender : function() {
				}
			},
			'incomingWiresView incomingWiresFilterView button[itemId="newFilter"]' : {
				click : function(btn, opts) {
					me.advanceFilterPopUp(btn);
				}
			},
			'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] incomingWireCreateNewAdvFilter' : {
				handleSearchActionGridView : function(btn) {
					me.handleSearchActionGridView(btn);
				},
				handleSaveAndSearchGridAction : function(btn) {
					me.handleSaveAndSearchGridAction(btn);
				},
				closeGridViewFilterPopup : function(btn) {
					me.closeGridViewFilterPopup(btn);
				},
				handleRangeFieldsShowHide : function(objShow) {
					me.handleRangeFieldsShowHide(objShow);
				}
			},
			'incomingWiresAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] incomingWireSummaryAdvFilterGridView' : {
				orderUpGridEvent : me.orderUpDown,
				deleteGridFilterEvent : me.deleteFilterSet,
				viewGridFilterEvent : me.viewFilterData,
				editGridFilterEvent : me.editFilterData
			},
			'incomingWiresView incomingWiresFilterView toolbar[itemId="advFilterActionToolBar"]' : {
				handleSavedFilterItemClick : me.handleFilterItemClick

			},
			'incomingWiresView incomingWiresFilterView combo[itemId="bankSellerId"]' : {
				select : function(combo, record, index) {
					var objFilterPanel = me.getSellerMenuBar();
					me.applySeekFilter();
				}
				/*change : function( combo, record, index )
				{
					if(entityType === '0')
					{
	                    if( record == null )
	                    {
	                        me.filterApplied = 'ALL';
	                        me.applySeekFilter();
	                    }
						var objFilterPanel = me.getSellerClientMenuBar();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeId"]' );
						objAutocompleter.cfgUrl = 'services/userseek/incomingAdminUserClientSeek.json';
						objAutocompleter.cfgSeekId = 'bankClientSeek';
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams = [{key : '$sellerCode', value : record }];
						me.applySeekFilter();
					}
				}*/
			},
			'incomingWiresView incomingWiresFilterView AutoCompleter[itemId="clientCodeId"]' : {
				select : function(combo, record, index) {
					var objFilterPanel = me.getClientMenuBar();
					me.applySeekFilter();
				},
				change : function( combo, record, index )
				{
					 if( record == null )
	                 {
	                        me.filterApplied = 'ALL';
	                        me.applySeekFilter();
	                 }
				}
			},
			'incomingWiresView incomingWiresFilterView combo[itemId="clientCodeComboId"]' : {
				change : function( combo, record, index )
				{
					if(entityType === '1')
					{
	                    if( record == null )
	                    {
	                        me.filterApplied = 'ALL';
	                        me.applySeekFilter();
	                    }
						me.applySeekFilter();
					}
				}
			}
		});
	},

	handleSmartGridConfig : function() {
		var me = this;
		var incomingWiresGrid = me.getIncomingWiresGrid();
		var objConfigMap = me.getNonCMSConfiguration();
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		if( Ext.isEmpty( incomingWiresGrid ) )
		{
			if( !Ext.isEmpty( objGridViewPref ) )
			{
				var data = Ext.decode( objGridViewPref );
				objPref = data[ 0 ];
				arrColsPref = objPref.columns;
				arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
				pgSize =objPref.pageSize || _GridSizeTxn;
				
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
			else if( objConfigMap.arrColsPref )
			{
				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				pgSize = 10;
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
		}
		else
		{
			me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
		}
	},
	
	handleSmartGridLoading : function(arrCols, storeModel,pgSize) {
		var me = this;
		incomingWiresGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			hideRowNumbererColumn : true,
			showSummaryRow : true,
			padding : '5 10 10 10',
			rowList : [10, 25, 50, 100, 200, 500],
			minHeight : 100,
			//maxHeight : 280,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(grid, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(grid, rowIndex, columnIndex, btn,
						event, record);
			},

			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			}
		});
		var incomingWiresDtlView = me.getIncomingWiresDtlView();
		incomingWiresDtlView.add(incomingWiresGrid);
		incomingWiresDtlView.doLayout();
	},
	
	handleRowIconClick : function(grid, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'btnView') {
			var strUrl = 'incomingWireDetail.seek';
			/*strUrl += '?'+csrfTokenName+'=' + tokenValue;
			strUrl += '&txtRecordIndex=' + rowIndex;
			strUrl += '&viewState=' + record.data.identifier;
			window.open(strUrl); */
			
			$( '#detailPopup' ).dialog(
				{
					autoOpen : false,
					height : 560,
					width : 989,
					modal : true,
					title : 'Incoming Wire Details',
					buttons :
					{
						"Cancel" : function()
						{
							$( this ).dialog( "close" );
						}
					}
				} );
			
			$.ajax(
				{
					url : strUrl,
					type : "POST",
					context : this,
				    async: false,
					error : function()
					{
					},
					data :
					{
						viewState : record.data.identifier,
						csrfTokenName : tokenValue,
						txtRecordIndex : rowIndex
					},
					success : function( response )
					{

						document.getElementById('detailPopup').innerHTML = response;
						
						$("#tabs").tabs();
						
						$( '#detailPopup' ).dialog( "open" );

					}
				});
			

			
			//me.submitForm(strUrl, record, rowIndex);
		} 
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',	viewState));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	getNonCMSConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		if( !Ext.isEmpty( objGridViewPref ) )
			{
				var data = Ext.decode( objGridViewPref );
				var objPref = data[ 0 ];
				me.arrSorter = objPref.sortState;
				console.log(me.arrSorter);
			}
		if(entityType === '0' || me.showClientFlag)
			objWidthMap = {
				"clientDesc" :100,
				"valueDate" : 100,
				"fedReference" : 110,
				"receiverAccNmbr" : 100,
				"receiverAccName" : 130,
				"drCrFlag" : 50,
				"paymentAmount" : 100,
				"senderName" : 110,
				"senderBankName" : 110,
				"senderBankABA" : 120
			};
		else
		{
			objWidthMap = {
					"valueDate" : 100,
					"fedReference" : 110,
					"receiverAccNmbr" : 100,
					"receiverAccName" : 130,
					"drCrFlag" : 50,
					"paymentAmount" : 100,
					"senderName" : 110,
					"senderBankName" : 110,
					"senderBankABA" : 120
				};
		}
		if(entityType === '0' || me.showClientFlag)
		{
			arrColsPref = [{
						"colId" : "clientDesc",
						"colHeader" : "Client"
					},{
						"colId" : "valueDate",
						"colHeader" : "Wire Date"
					}, {
						"colId" : "fedReference",
						"colHeader" : "FED Reference"
					}, {
						"colId" : "receiverAccNmbr",
						"colHeader" : "Account"
					}, {
						"colId" : "receiverAccName",
						"colHeader" : "Account Name"
					}, {
						"colId" : "drCrFlag",
						"colHeader" : "Dr/Cr"
					},
					{
						"colId" : "paymentAmount",
						"colHeader" : "Amount",
						"colType" : "number"
					},
					{
						"colId" : "senderName",
						"colHeader" : "Sender Name"
					},
					{
						"colId" : "senderBankName",
						"colHeader" : "Sending Bank"
					},
					{
						"colId" : "senderBankABA",
						"colHeader" : "Sending Bank ABA"
					}];
		}
		else
		{
			arrColsPref = [{
				"colId" : "valueDate",
				"colHeader" : "Wire Date"
			}, {
				"colId" : "fedReference",
				"colHeader" : "FED Reference"
			}, {
				"colId" : "receiverAccNmbr",
				"colHeader" : "Account"
			}, {
				"colId" : "receiverAccName",
				"colHeader" : "Account Name"
			}, {
				"colId" : "drCrFlag",
				"colHeader" : "Dr/Cr"
			},
			{
				"colId" : "paymentAmount",
				"colHeader" : "Amount",
				"colType" : "number"
			},
			{
				"colId" : "senderName",
				"colHeader" : "Sender Name"
			},
			{
				"colId" : "senderBankName",
				"colHeader" : "Sending Bank"
			},
			{
				"colId" : "senderBankABA",
				"colHeader" : "Sending Bank ABA"
			}];
		}

			storeModel = {
				fields : ['valueDate', 'fedReference', 'receiverAccNmbr', 'receiverAccName',
						'drCrFlag','paymentAmount','senderName',
						'__metadata','identifier', 'senderBankName','senderBankABA','__subTotal','crCount','drCount','crSummary','drSummary','clientDesc'],
				proxyUrl : 'incomingWiresList.srvc',
				rootNode : 'd.incomingWire',
				sortState:me.arrSorter,
				totalRowsNode : 'd.__count'
			};
		
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel"  : storeModel
		};
		return objConfigMap;
	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null);		
	},
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		var grid = me.getIncomingWiresGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl,null);
		}
	},
	setDataForFilter : function() {
		var me = this;
		me.getSearchTxnTextInput().setValue('');
		if (this.filterApplied === 'Q') {
			this.filterData = this.getQuickFilterQueryJson();
		} else if (this.filterApplied === 'A') {
			var objOfCreateNewFilter = this.getCreateNewFilter();
			var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson(objOfCreateNewFilter);
			this.advFilterData = objJson;
			var filterCode = objOfCreateNewFilter.down('textfield[itemId="filterCode"]').getValue();
			this.advFilterCodeApplied = filterCode;
		}
		if (this.filterApplied === 'ALL') {
			this.advFilterData = [];
			this.filterData = this.getQuickFilterQueryJson();
		} 
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', strActionStatusUrl = '', isFilterApplied = 'false';
		if(me.filterApplied === 'ALL')
		{
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl = strQuickFilterUrl;
				isFilterApplied = true;
			}
			return strUrl;
		}
		else
		{
			if(me.filterApplied === 'Q')
			{
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
				if (!Ext.isEmpty(strQuickFilterUrl)) {
					strUrl = strQuickFilterUrl;
					isFilterApplied = true;
				}
			}
			if(me.filterApplied === 'A')
			{
				strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
				if (!Ext.isEmpty(strAdvFilterUrl)) {
					strUrl = strAdvFilterUrl;
					isFilterApplied = true;
				}
				else{
					strUrl = '&$filter=' ;
				}
			}
			return strUrl;
		}
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var paymentTypeFilterVal = me.paymentTypeFilterVal;
		var paymentActionFilterVal = this.paymentActionFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(index != '12')
		{
			jsonArray.push({
						paramName : me.getEntryDate().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					});
		}
		if (paymentTypeFilterVal != null && paymentTypeFilterVal != 'all') {
			jsonArray.push({
						paramName : me.getIncomingWiresTypeToolBar().filterParamName,
						paramValue1 : paymentTypeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (paymentActionFilterVal != null && paymentActionFilterVal != 'all') {
			jsonArray.push({
						paramName : this.getIncomingWiresTypeToolBar().filterParamName,
						paramValue1 : paymentActionFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		
		var objOfCreateNewFilter = me.getSellerMenuBar();
		if (!Ext.isEmpty(objOfCreateNewFilter)) {
			var sellerCode = objOfCreateNewFilter.down('combo[itemId="bankSellerId"]');
			if (!Ext.isEmpty(sellerCode)) {
				var sellerCodeValue = objOfCreateNewFilter.down('combo[itemId="bankSellerId"]').getValue();
				if (Ext.isEmpty(sellerCodeValue)) {
					sellerCodeValue = sessionSellerCode;
				}
				if (!Ext.isEmpty(sellerCodeValue) && "" != sellerCodeValue) {
					jsonArray.push({
						paramName : 'sellerCode',
						operatorValue : 'eq',
						paramValue1 : sellerCodeValue,
						dataType : 'S'
					});
				} 
			}
		}
		
		/*var objOfCreateNewFilter = me.getClientMenuBar();
		if (!Ext.isEmpty(objOfCreateNewFilter)) {
			var clientCode = objOfCreateNewFilter.down('AutoCompleter[itemId="clientCodeId"]');
			if (!Ext.isEmpty(clientCode)) {
				var clientCodeValue = objOfCreateNewFilter.down('AutoCompleter[itemId="clientCodeId"]').getValue();
				if (!Ext.isEmpty(clientCodeValue) && clientCodeValue !== null) {
					jsonArray.push({
						paramName : 'clientCode',
						operatorValue : 'eq',
						paramValue1 : clientCodeValue,
						dataType : 'S'
					});
				}
			}
		}*/
		var filterView = me.getFilterView();
		var clientCode = filterView.clientCode;
		if (!Ext.isEmpty(clientCode) && clientCode !== null) {
			jsonArray.push({
				paramName : 'clientCode',
				operatorValue : 'eq',
				paramValue1 : clientCode,
				dataType : 'S'
			});
		}
		else
		{
			var objOfCreateNewFilter = me.getIncomingWiresView();
			if (!Ext.isEmpty(objOfCreateNewFilter)) {
				var clientCode = objOfCreateNewFilter.down('AutoCompleter[itemId="clientAutoCompleter"]');
				if (!Ext.isEmpty(clientCode) && clientCode.isVisible() ) {
					var clientCodeValue = objOfCreateNewFilter.down('AutoCompleter[itemId="clientAutoCompleter"]').getValue();
					if (!Ext.isEmpty(clientCodeValue) && clientCodeValue !== null) {
						jsonArray.push({
							paramName : 'clientCode',
							operatorValue : 'eq',
							paramValue1 : clientCodeValue,
							dataType : 'S'
						});
					}
				}
			}
		}

		var objOfCreateNewFilter = me.getClientLoginMenuBar();
		if (!Ext.isEmpty(objOfCreateNewFilter)) {
			var clientComboCode = objOfCreateNewFilter.down('combo[itemId="clientCodeComboId"]');
			if (!Ext.isEmpty(clientComboCode)) {
				var clientComboCodeValue = objOfCreateNewFilter.down('combo[itemId="clientCodeComboId"]').getValue();
				if (!Ext.isEmpty(clientComboCodeValue) && clientComboCodeValue !== null) {
					jsonArray.push({
						paramName : 'clientCode',
						operatorValue : 'eq',
						paramValue1 : clientComboCodeValue,
						dataType : 'S'
					});
				}
			}
		}
		return jsonArray;
	},
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
	},
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getIncomingWiresGrid();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);

		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}
		return retValue;
	},
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.locked = objCol.locked;
				cfgCol.hidden = objCol.hidden;
				cfgCol.colId = objCol.colId;
				
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				if (objCol.colId === 'valueDate') 
				{
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, colId) {
						var strRet = getLabel('lblsubtotal', 'Sub Total');
						return strRet;
					}
				}
				if (objCol.colId === 'paymentAmount') 
				{
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, colId) {
						var incomingWiresGrid = me.getIncomingWiresGrid();
						if (!Ext.isEmpty(incomingWiresGrid) && !Ext.isEmpty(incomingWiresGrid.store)) 
						{
							var data = incomingWiresGrid.store.proxy.reader.jsonData;
							if (data && data.d && data.d.__subTotal) 
							{
								strRet = '$' + data.d.__subTotal;
							}
						}
						return strRet;
					}
				}
				
				cfgCol.width = !Ext.isEmpty(objCol.width)
				? objCol.width
				: objWidthMap[objCol.colId];
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me=this;
		var strRetValue = "";
		if(colId === "col_paymentAmount")
		{
			strRetValue = '$' + value;
		}
		else
		{
			strRetValue = value;
		}
		return strRetValue;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'action',
			width : 40,
			align : 'center',
			locked : true,
			items : [{
						itemId  : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 1
					}]
		};
		return objActionCol;
	},
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'incomingWiresFilterView-1068_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var paymentTypeVal = '';
							//var paymentActionVal = '';
							var dateFilter = me.dateFilterLabel;

							if (me.paymentTypeFilterVal == 'all' && me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								paymentTypeVal = me.paymentTypeFilterDesc;
							}

							/*if (me.paymentActionFilterVal == 'all') {
								paymentActionVal = 'All';
							} else {
								paymentActionVal = me.paymentActionFilterDesc;
							}*/
							var advfilter = me.showAdvFilterCode;
							if (advfilter == '' || advfilter == null)
							{
								advfilter = getLabel('none', 'None');
							}

							tip.update('Sending Bank'
									+ ' : ' + paymentTypeVal + '<br/>'
									+ getLabel('date', 'Date') + ' : '
									+ dateFilter + '<br/>'
									//+ getLabel('actions', 'Actions') + ' : '
									//+ paymentActionVal + '<br/>'
									+getLabel('advancedFilter', 'Advance Filter') + ':'
									+ advfilter);
						}
					}
				});
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);

	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	updateDateFilterView : function() {
		var me = this;
		var dtEntryDate = null;
		if (!Ext.isEmpty(me.dateFilterVal)) {
			me.handleDateChange(me.dateFilterVal);
			if (me.dateFilterVal === '7') {
				if (!Ext.isEmpty(me.dateFilterFromVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterFromVal, "Y-m-d");
					me.getFromEntryDate().setValue(dtEntryDate);
				}
				if (!Ext.isEmpty(me.dateFilterToVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
					me.getToEntryDate().setValue(dtEntryDate);
				}
			}
		}

	},
	handleDateChange : function(index) {
		var me = this;
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		var objDateParams = me.getDateParam(index);
		if (index == '7') {
			var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
					strExtApplicationDateFormat ));
			
			me.getDateRangeComponent().show();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();			
			me.getFromEntryDate().setValue( dtEntryDate );
			me.getToEntryDate().setValue( dtEntryDate );
			me.getFromEntryDate().setMinValue(clientFromDate);
			me.getToEntryDate().setMinValue(clientFromDate);
		} else if(index == '12')
		{
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();
		}else {
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().show();
			me.getToDateLabel().show();
		}

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('date', 'Wire Date') + "("
					+ me.dateFilterLabel + ")");
		}
		if (index !== '7' && index !== '12') {
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			if (index === '1' || index === '2') {
				fromDateLabel.setText(vFromDate);
				toDateLabel.setText("");
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
			}
		}
	},
	getDateParam : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Date Range
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '8':
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '9':
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '10':
				// This Year
				dtJson = objDateHandler.getYearToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '11':
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '12':
				break;
		}
		// comparing with client filter condition
		if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	setGridInfo : function( grid )
	{
		var me = this;
		var incomingWiresGrid = me.getIncomingWiresGrid();
		var incomingWireGridInfo = me.getIncomingWiresGridInformationView();
		var drCountId = incomingWireGridInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="drCountId"]' );
		var drInfoId = incomingWireGridInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="drSumId"]' );
		var crCountId = incomingWireGridInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="crCountId"]' );
		var crInfoId = incomingWireGridInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="crSumId"]' );
		var dataStore = incomingWiresGrid.store;
		dataStore.on( 'load', function( store, records )
		{
			var i = records.length - 1;
			if( i >= 0 )
			{
				drCount = records[i].get('drCount');
				drCountId.setText(drCount);
				drInfo = records[i].get('drSummary');
				drInfoId.setText(drInfo);
				crCount = records[i].get( 'crCount' );
				crCountId.setText(crCount);
				crInfo = records[i].get('crSummary');
				crInfoId.setText(crInfo);
			}
			else
			{
				drCountId.setText("0");
				drInfoId.setText("0.00");
				crCountId.setText("0");
				crInfoId.setText("0.00");
			}
		} );
	},

	onIncomingWireSummaryInformationViewRender : function() {
		var me = this;
		var accSummInfoViewRef1 = me.getIncomingWiresGridInformationView();
		accSummInfoViewRef1.createSummaryLowerPanelView();
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		var objDateLbl = {
				'12' : getLabel( 'latest', 'Latest' ),
				'1' : getLabel( 'today', 'Today' ),
                '2' : getLabel( 'yesterday', 'Yesterday' ),
                '3' : getLabel( 'thisweek', 'This Week' ),
                '4' : getLabel( 'lastweek', 'Last Week To Date' ),
                '5' : getLabel( 'thismonth', 'This Month' ),
                '6' : getLabel( 'lastmonth', 'Last Month To Date' ),
                '7' : getLabel( 'daterange', 'Date Range' ),
                '8' : getLabel( 'thisquarter', 'This Quarter' ),
                '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
                '10' : getLabel( 'thisyear', 'This Year' ),
                '11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
		};
		if (!Ext.isEmpty(objGridViewFilter)) {
			var data = Ext.decode(objGridViewFilter);
			var strDtValue = data.quickFilter.entryDate;
			var strDtFrmValue = data.quickFilter.entryDateFrom;
			var strDtToValue = data.quickFilter.entryDateTo;
			var strPaymentType = data.quickFilter.paymentType;
			 me.filterCodeValue = data.advFilterCode;
               filterPanelCollapsed = data.filterPanelCollapsed;
			  infoPanelCollapsed = data.infoPanelCollapsed;
			if (!Ext.isEmpty(strDtValue)) {
				me.dateFilterLabel = objDateLbl[strDtValue];
				me.dateFilterVal = strDtValue;
				if (strDtValue === '7') {
					if (!Ext.isEmpty(strDtFrmValue))
						me.dateFilterFromVal = strDtFrmValue;

					if (!Ext.isEmpty(strDtToValue))
						me.dateFilterToVal = strDtToValue;
				}
				me.paymentTypeFilterVal = !Ext.isEmpty(strPaymentType)
						? strPaymentType
						: 'all';				
			}

		}
		if (!Ext.isEmpty(me.dateFilterVal)) {
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			if (me.dateFilterVal !== '7') {
				var dtParams = me.getDateParam(me.dateFilterVal);
				if (!Ext.isEmpty(dtParams)
						&& !Ext.isEmpty(dtParams.fieldValue1)) {
					strOpt = dtParams.operator;
					strVal1 = dtParams.fieldValue1;
					strVal2 = dtParams.fieldValue2;
				}
			} else {
				if (!Ext.isEmpty(me.dateFilterVal)
						&& !Ext.isEmpty(me.dateFilterFromVal)) {
					strVal1 = me.dateFilterFromVal;

					if (!Ext.isEmpty(me.dateFilterToVal)) {
						strOpt = 'bt';
						strVal2 = me.dateFilterToVal;
					}
				}
			}
			if(me.dateFilterVal != '12')
			{
				arrJsn.push({
							paramName : 'EntryDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
			}
		}
		if (!Ext.isEmpty(me.paymentActionFilterVal)
				&& me.paymentActionFilterVal != 'all') {
			arrJsn.push({
						paramName : 'paymentAction',
						paramValue1 : me.paymentActionFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		
		if( !Ext.isEmpty( me.paymentTypeFilterVal ) && me.paymentTypeFilterVal != 'all' )
		{
			arrJsn.push(
			{
				paramName : 'paymentType',
				paramValue1 : me.paymentTypeFilterVal,
				operatorValue : 'eq',
				dataType : 'S'
			} );
		}
	
		me.filterData = arrJsn;
	},
	updateAdvFilterConfig : function()
	{
		var me = this;
		if( !Ext.isEmpty( objGridViewFilter ) )
		{
			var data = Ext.decode( objGridViewFilter );
			if( !Ext.isEmpty( data.advFilterCode ) )
			{
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/incomingWireFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, data.advFilterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					async : false,
					method : 'GET',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var applyAdvFilter = false;
						me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
						var objOfCreateNewFilter = me.getCreateNewFilter();
						if(!Ext.isEmpty( objOfCreateNewFilter ))
						{
							var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );
							me.advFilterData = objJson;
						}
						this.advFilterCodeApplied = data.advFilterCode;
						me.savePrefAdvFilterCode = '';
						me.filterApplied = 'A';
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'errorTitle', 'Error' ),
							msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			}
		}
	},
	generateUrlWithQuickFilterParams : function(me) {

		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
					}
					break;
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	advanceFilterPopUp : function(btn) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle('Create New Filter');

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel,
				false);
				
		me.filterCodeValue = null;

		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.IncomingWiresAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
			me.objAdvFilterPopup.show();

		}

	},
	handleSearchActionGridView : function(btn) {
		var me = this;
		me.doAdvSearchOnly();

	},
	doAdvSearchOnly : function() {
		var me = this;
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.applyAdvancedFilter();
	},
	handleSaveAndSearchGridAction : function(btn) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		if (me.filterCodeValue === null) {
			var FilterCode = objCreateNewFilterPanel
					.down('textfield[itemId="filterCode"]');
			var FilterCodeVal = FilterCode.getValue();
		} else {
			var FilterCodeVal = me.filterCodeValue;
		}

		var callBack = this.postDoSaveAndSearch;
		if (Ext.isEmpty(FilterCodeVal)) {
			var errorlabel = objCreateNewFilterPanel
					.down('label[itemId="errorLabel"]');
			errorlabel.setText(getLabel('filternameMsg',
					'Please Enter Filter Name'));
			errorlabel.show();
		} else {
			me.postSaveFilterRequest(FilterCodeVal, callBack);
		}
	},
	closeGridViewFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
	handleRangeFieldsShowHide : function(objShow) {
		var me = this;

		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var toobj = objCreateNewFilterPanel.down('numberfield[itemId="toAmt"]');
		var tolabelObj = objCreateNewFilterPanel
				.down('label[itemId="Tolabel"]');
		if (toobj && tolabelObj) {
			if (objShow) {
				toobj.show();
				tolabelObj.show();
			} else {
				toobj.hide();
				tolabelObj.hide();
			}
		}
	},
	applyAdvancedFilter : function() {
		var me = this;
		var grid = me.getIncomingWiresGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);		
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			me.getIncomingWiresGrid().setLoading(true);
		    //grid.loadGridData(strUrl, null);
		}
		me.closeGridViewFilterPopup();
		
	},
	postDoSaveAndSearch : function() {
		var me = this;

		me.doAdvSearchOnly();
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		var strUrl = 'userfilters/incomingWireFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, FilterCodeVal);
		var objJson;
		var objOfCreateNewFilter = me.getCreateNewFilter();
		objJson = objOfCreateNewFilter.getAdvancedFilterValueJson(
				FilterCodeVal, objOfCreateNewFilter);
		Ext.Ajax.request({
					url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
					method : 'POST',
					jsonData : Ext.encode(objJson),
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.filters
								&& responseData.d.filters.success)
							isSuccess = responseData.d.filters.success;

						if (isSuccess && isSuccess === 'N') {
							title = getLabel('instrumentSaveFilterPopupTitle',
									'Message');
							strMsg = responseData.d.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							// objFilterCode.setValue(filterCode);
							// me.setAdvancedFilterTitle(filterCode);
							fncallBack.call(me);
							me.reloadGridRawData();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	reloadGridRawData : function()
	{
		var me = this;
		var strUrl = 'userfilterslist/incomingWireFilter.srvc?';
		var gridView = me.getAdvFilterGridView();
		Ext.Ajax.request(
		{
			url : strUrl ,
			headers: objHdrCsrfParams,
			method : 'GET',
			success : function( response )
			{
				var decodedJson = Ext.decode( response.responseText );
				var arrJson = new Array();

				if( !Ext.isEmpty( decodedJson.d.filters ) )
				{
					for( i = 0 ; i < decodedJson.d.filters.length ; i++ )
					{
						arrJson.push(
						{
							"filterName" : decodedJson.d.filters[ i ]
						} );
					}
				}
				gridView.store.loadRawData( arrJson );
				me.addAllSavedFilterCodeToView( decodedJson.d.filters );
			},
			failure : function( response )
			{
				// console.log("Ajax Get data Call Failed");
			}
		} );
	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);
		if (!record) {
			return;
		}
		var index = rowIndex;
		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
		} else {
			index++;
			if (index >= grid.getStore().getCount()) {
				return;
			}
		}
		var store = grid.getStore();
		store.remove(record);
		store.insert(index, record);

		this.sendUpdatedOrederJsonToDb(store);
	},
	deleteFilterSet : function(grid, rowIndex) {
		var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		
		grid.getStore().remove(record);

		if (this.advFilterCodeApplied == record.data.filterName) {
			this.advFilterData = [];
			me.filterApplied = 'A';
			me.applyAdvancedFilter();
		}

		var store = grid.getStore();
		me.deleteFilterCodeFromDb( objFilterName );
	},
	deleteFilterCodeFromDb : function( objFilterName )
	{
		var me = this;
		if( !Ext.isEmpty( objFilterName ) )
		{
			var strUrl = 'userfilters/incomingWireFilter/{0}/remove.srvc?' + csrfTokenName + '=' + csrfTokenValue;
			strUrl = Ext.String.format( strUrl, objFilterName );

			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				success : function( response )
				{
					me.getAllSavedAdvFilterCode();
				},
				failure : function( response )
				{
					console.log( "Error Occured" );
				}
			} );
		}
	},
	sendUpdatedOrederJsonToDb : function(store) {
		var me = this;

		var preferenceArray = [];

		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'userpreferences/incomingwire/incomingGridViewAdvanceFilter.srvc?'+csrfTokenName+'='+csrfTokenValue,
			method : 'POST',
			jsonData : objJson,
			success : function(response) {
				me.updateAdvActionToolbar();
			},
			failure : function() {
				console.log("Error Occured - Addition Failed");
			}
		});
	},
	updateAdvActionToolbar : function() {
		var me = this;
		Ext.Ajax.request({
			url : 'userpreferences/incomingwire/incomingGridViewAdvanceFilter.srvc',
			headers: objHdrCsrfParams,
			method : 'GET',
			/*params :
			{
				csrfTokenName : tokenValue
			},*/
			success : function(response) {
				var responseData = Ext.decode(response.responseText);

				var filters = JSON.parse(responseData.preference);

				me.addAllSavedFilterCodeToView(filters.filters);

			},
			failure : function() {
				console.log("Error Occured - Addition Failed");
			}
		});
	},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();

		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));

		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);

		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var objTabPanel = me.getAdvanceFilterTabPanel();
		var applyAdvFilter = false;

		me.getSaveSearchBtn().hide();
		
		me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,
				applyAdvFilter);

		objTabPanel.setActiveTab(1);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objOfCreateNewFilter = me.getCreateNewFilter();
		var objJson;
		var strUrl = 'userfilters/incomingWireFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					headers: objHdrCsrfParams,
					method : 'GET',
					/*params :
					{
						csrfTokenName : tokenValue
					},*/
					success : function(response) {
						var responseData = Ext.decode(response.responseText);

						fnCallback.call(me, filterCode, responseData,
								applyAdvFilter);

					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	editFilterData : function(grid, rowIndex) {

		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel,
				false);
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setDisabled(true);
		var objTabPanel = me.getAdvanceFilterTabPanel();
		var applyAdvFilter = false;

		me.getSaveSearchBtn().show();

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);

		objTabPanel.setActiveTab(1);

	},
	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {

		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;

			var fieldVal = filterData.filterBy[i].value1;

			var fieldOper = filterData.filterBy[i].operator;
/*
			if (fieldOper != 'eq') {
				objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]')
						.setValue(fieldOper);
			}*/

			if (fieldName === 'fedReference' || fieldName === 'customerRef'
					|| fieldName === 'receiverCharges' || fieldName === 'filterCode' || fieldName === 'senderName') {
				var fieldType = 'textfield';
			} else if (fieldName === 'receiverAccNmbr' || fieldName === 'receiverAccName' || fieldName === 'receiverBankFiIid'
				|| fieldName === 'senderBankName') {
				var fieldType = 'AutoCompleter';
			} else if (fieldName === 'paymentAmount') {
				var fieldType = 'numberfield';
			} else if (fieldName === 'rangeCombo' || fieldName === 'drCrFlag') {
				var fieldType = 'combobox';
			}
			
			var fieldObj = objCreateNewFilterPanel.down('' + fieldType
					+ '[itemId="' + fieldName + '"]');

			if(!Ext.isEmpty(fieldObj)) {
				if(fieldType == "label")
				 	fieldObj.setText(fieldVal);
				else
					fieldObj.setValue(fieldVal);				
			}
		}
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
			.setValue(filterCode);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, true);
	},
	handleFilterItemClick : function(filterCode, btn) {
		var me = this;
		var objToolbar = me.getAdvFilterActionToolBar();

		objToolbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
		if(!Ext.isEmpty(btn)){
		btn.addCls('xn-custom-heighlight');
		}
		if (!Ext.isEmpty(filterCode)) {
			var applyAdvFilter = true;
			me.getSavedFilterData(filterCode, this.populateSavedFilter,applyAdvFilter);
		}

		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		me.toggleSavePrefrenceAction(true);
	},
	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		Ext.Ajax.request({
					url : 'userfilterslist/incomingWireFilter.srvc',
					headers: objHdrCsrfParams,
					method : 'GET',
					async:false,
					/*params :
					{
						csrfTokenName : tokenValue
					},*/
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if (filterData) {
							arrFilters = filterData;
						}
						me.addAllSavedFilterCodeToView(arrFilters);

					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},
	addAllSavedFilterCodeToView : function(arrFilters) {
		var me = this;
		var objToolbar = this.getAdvFilterActionToolBar();
		if (objToolbar.items && objToolbar.items.length > 0)
			objToolbar.removeAll();

		if (arrFilters && arrFilters.length > 0) {
			var count = arrFilters.length;
			if (count > 2)
				count = 2;
			var toolBarItems = [];
			var item;
			for (var i = 0; i < count; i++) {
				item = Ext.create('Ext.Button', {
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							itemId : arrFilters[i],
							tooltip : arrFilters[i],
							text : Ext.util.Format.ellipsis(arrFilters[i],11),
							handler : function(btn, opts) {
								objToolbar.fireEvent(
										'handleSavedFilterItemClick',
										btn.itemId, btn);
							}
						});
				toolBarItems.push(item);
			}
			item = Ext.create('Ext.Button', {
						cls : 'cursor_pointer xn-account-filter-btnmenu button_underline',
						text : getLabel('moreText', 'more') +'&nbsp;>>',
						itemId : 'AdvMoreBtn',
						handler : function(btn, opts) {
							me.handleMoreAdvFilterSet(btn.itemId);
						}
					});
			var imgItem = Ext.create('Ext.Img',{
				src : 'static/images/icons/icon_spacer.gif',
				height : 16,
				cls : 'ux_hide-image'
			});
			
			toolBarItems.push(imgItem);
			toolBarItems.push(item);
			objToolbar.removeAll();
			objToolbar.add(toolBarItems);
		}
	},
	handleMoreAdvFilterSet : function(btnId) {
		var me = this;
		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(0);
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('filterDetails',
					'Filter Details'));
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.IncomingWiresAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(0);
			me.objAdvFilterPopup.show();
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('filterDetails',
					'Filter Details'));
		}
	},
	handleSavePreferences : function() {
		var me = this;
		me.savePreferences();
	},
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		me.clearWidgetPreferences();
	},
	savePreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null;
		var strUrl = me.urlGridPref;
		var grid = me.getIncomingWiresGrid();
		var arrColPref = new Array();
		var arrPref = new Array();
		var gridState=grid.getGridState();
		arrPref.push(gridState);
		/*
		if (!Ext.isEmpty(grid)) {
			arrCols = grid.getView().getGridColumns();
			for (var j = 0; j < arrCols.length; j++) {
				objCol = arrCols[j];
				if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
						&& objCol.itemId.startsWith('col_')
						&& !Ext.isEmpty(objCol.xtype)
						&& objCol.xtype !== 'actioncolumn')
					arrColPref.push({
								colId : objCol.dataIndex,
								colDesc : objCol.text
							});

			}
			objPref.pgSize = grid.pageSize;
			objPref.gridCols = arrColPref;
			arrPref.push(objPref);
		}
     */
		if (arrPref)
			Ext.Ajax.request({
						url :  strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrPref),
						/*params :
						{
							jsonData : Ext.encode( arrPref ),
							csrfTokenName : tokenValue
						},*/
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var isSuccess;
							var title, strMsg, imgIcon;
							if (responseData.d.preferences
									&& responseData.d.preferences.success)
								isSuccess = responseData.d.preferences.success;
							if (isSuccess && isSuccess === 'N') {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.getBtnSavePreferences()
											.setDisabled(false);
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											icon : imgIcon
										});

							} else
								me.saveFilterPreferences();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});

	},
	saveFilterPreferences : function() {
		var me = this;
		var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var objFilterPref = {};
		var infoPanel = me.getIncomingWiresGridInformationView();
		var filterViewCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 
		var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.paymentType = me.paymentTypeFilterVal;
		objQuickFilterPref.paymentAction = me.paymentActionFilterVal;
		objQuickFilterPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {
			//objQuickFilterPref.entryDateFrom = me.dateFilterFromVal;
			//objQuickFilterPref.entryDateTo = me.dateFilterToVal;
			
			if(!Ext.isEmpty(me.dateFilterFromVal) && !Ext.isEmpty(me.dateFilterToVal)){
				
				objQuickFilterPref.entryDateFrom = me.dateFilterFromVal;
				objQuickFilterPref.entryDateTo = me.dateFilterToVal;
				}
				else
				{
							var strSqlDateFormat = 'Y-m-d';
							var frmDate = me.getFromEntryDate().getValue();
							var toDate = me.getToEntryDate().getValue();
							fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
							fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
					   objQuickFilterPref.entryDateFrom = fieldValue1;
					   objQuickFilterPref.entryDateTo = fieldValue2;
				}
		}

		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;
		objFilterPref.filterPanelCollapsed = filterViewCollapsed;
		objFilterPref.infoPanelCollapsed = infoViewCollapsed;	

		if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(objFilterPref),
						/*params :
						{
							jsonData : Ext.encode(objFilterPref),
							csrfTokenName : tokenValue
						},*/
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var title = getLabel('SaveFilterPopupTitle',
									'Message');
							if (data.d.preferences
									&& data.d.preferences.success === 'Y') {
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.INFO
										});
							} else if (data.d.preferences
									&& data.d.preferences.success === 'N'
									&& data.d.error
									&& data.d.error.errorMessage) {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.toggleSavePrefrenceAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : data.d.error.errorMessage,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
	},
	clearWidgetPreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null,objWdgtPref = null;
		var strUrl = me.commonPrefUrl+"?$clear=true";
		var grid = me.getIncomingWiresGrid();
		var arrColPref = new Array();
		var arrPref = new Array();
		if (!Ext.isEmpty(grid)) {
			arrCols = grid.getView().getGridColumns();
			for (var j = 0; j < arrCols.length; j++) {
				objCol = arrCols[j];
				if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
						&& objCol.itemId.startsWith('col_')
						&& !Ext.isEmpty(objCol.xtype)
						&& objCol.xtype !== 'actioncolumn')
					arrColPref.push({
								colId : objCol.dataIndex,
								colDesc : objCol.text
							});

			}
			objWdgtPref = {};
			objWdgtPref.pgSize = grid.pageSize;
			objWdgtPref.gridCols = arrColPref;
			arrPref.push({
							"module" : "",
							"jsonPreferences" : objWdgtPref
						});
		}
		if (arrPref) {
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						//jsonData : Ext.encode(arrPref),
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var isSuccess;
							var title, strMsg, imgIcon;
							if (responseData.d.preferences
									&& responseData.d.preferences.success)
							isSuccess = responseData.d.preferences.success;
							if (isSuccess && isSuccess === 'N') {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.toggleSavePrefrenceAction(true);
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											icon : imgIcon
										});
	
							}
							else
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefClearedMsg', 'Preferences Cleared Successfully' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
							}
	
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	generateUrlWithAdvancedFilterParams : function(me) {
		var thisClass = this;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
	    var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;

		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'eq'
								|| operator === 'lk' || operator === 'gt' || operator === 'lt'))
					strTemp = strTemp + ' and ';
				switch (operator) {
					case 'bt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].value2 + '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' and '
									+ '\'' + filterData[index].value2 + '\'';
						}
						break;
					case 'st' :
						if (!isOrderByApplied) {
							strTemp = strTemp + ' &$orderby=';
							isOrderByApplied = true;
						} else {
							strTemp = strTemp + ',';
						}
						strTemp = strTemp + filterData[index].value1 + ' '
								+ filterData[index].value2;
						break;
					case 'lk' :
						isFilterApplied = true;
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' ' + '\''
								+ filterData[index].value1 + '\'';
						break;
					case 'eq' :
						isInCondition = this.isInCondition(filterData[index]);
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							isFilterApplied = true;
							for (var i = 0; i < objArray.length; i++) {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + '\'' + objArray[i] + '\'';
								if (i != objArray.length - 1)
									strTemp = strTemp + ' or '
							}
							break;
						}
					case 'gt' :
					case 'lt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						}
						break;
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied)
			strFilter = strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	isInCondition : function(data) {
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		if (displayType && displayType === 4 && strValue && strValue.match(reg)) {
			retValue = true;
		}

		return retValue;

	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		
		if(!Ext.isEmpty(objCreateNewFilterPanel))
		{
			
			for (i = 0; i < filterData.filterBy.length; i++)
			{
				var fieldName = filterData.filterBy[i].field;
				var fieldOper = filterData.filterBy[i].operator;
				var fieldVal = filterData.filterBy[i].value1;
				
				/*if (fieldOper != 'eq') {
					objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]')
							.setValue(fieldOper);
				}*/

				if (fieldName === 'fedReference' || fieldName === 'customerRef' || fieldName === 'receiverCharges' || fieldName === 'filterCode' || fieldName === 'senderName') {
					var fieldType = 'textfield';
				} else if (fieldName === 'receiverAccNmbr' || fieldName === 'receiverAccName' || fieldName === 'receiverBankFiIid'
					|| fieldName === 'senderBankName') {
					var fieldType = 'AutoCompleter';
				} else if (fieldName === 'paymentAmount') {
					var fieldType = 'numberfield';
				} else if (fieldName === 'rangeCombo' || fieldName === 'drCrFlag') {
					var fieldType = 'combobox';
				} else 
					var fieldType = 'label';

				var fieldObj = objCreateNewFilterPanel.down('' + fieldType
						+ '[itemId="' + fieldName + '"]');

				if(!Ext.isEmpty(fieldObj)) {
					if(fieldType == "label")
					 	fieldObj.setText(fieldVal);
					else
						fieldObj.setValue(fieldVal);				
				}
			}
		}
	
		if (applyAdvFilter) {
			me.filterApplied = 'A';
			me.setDataForFilter();
			me.applyAdvancedFilter();
		}
	},
	handleType : function(btn)
	{
		var me = this;
		me.toggleSavePrefrenceAction(true); 
	    me.toggleClearPrefrenceAction(true);
		var oneBankComboArray = null;
		
		me.getIncomingWiresTypeToolBar().items.each( function( item )
		{
			
			if( item.itemId == 'oneBankCombo' )
			{
				if( item.menu.items.items.length > 0)
				{
					oneBankComboArray = item.menu.items.items;
					
					for(var counter = 0; counter < oneBankComboArray.length ; counter++ )
					{
						var temp = oneBankComboArray[counter];
						temp.removeCls( 'xn-custom-heighlight' );
						temp.addCls( 'xn-account-filter-btnmenu' );
					}
					
				}
				
			}
			else
			{
				item.removeCls( 'xn-custom-heighlight' );
				item.addCls( 'xn-account-filter-btnmenu' );
				
			}
		} );
		btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
		me.paymentTypeFilterVal = btn.code;
		me.paymentTypeFilterDesc = btn.btnDesc;
		me.setDataForFilter();
		if( me.paymentTypeFilterVal === 'all' )
		{
			me.filterApplied = 'ALL';
			me.applyAdvancedFilter();
		}
		else
		{
			me.filterApplied = 'Q';
			me.applyQuickFilter();
		}
		
	},
	renderTypeFilter : function()
	{
		var me = this;
		var oneBankComboArray = null;
		
		me.getIncomingWiresTypeToolBar().items.each( function( item )
		{
			if( !Ext.isEmpty(me.paymentTypeFilterVal)  )
			{			
				if( item.code == 'all' && me.paymentTypeFilterVal == 'all')
				{
					item.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
					
				}	
				else if( item.itemId == 'oneBankCombo' )
				{
					if( item.menu.items.items.length > 0 )
					{
						oneBankComboArray = item.menu.items.items;
						
						for(var counter = 0; counter < oneBankComboArray.length ; counter++ )
						{
							var temp = oneBankComboArray[counter];
							temp.removeCls( 'xn-custom-heighlight' );
							temp.addCls( 'xn-account-filter-btnmenu' );
							
							if( !Ext.isEmpty(temp.code) && me.paymentTypeFilterVal == temp.code)
							{
								temp.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
								break;
							}
						}
					}
				}
				else
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				}
			}
		} );
		me.setDataForFilter();
		if( me.paymentTypeFilterVal === 'all' )
		{
			me.filterApplied = 'ALL';
			me.applyAdvancedFilter();
		}
		else
		{
			me.filterApplied = 'Q';
			me.applyQuickFilter();
		}
		
	},
	setComboListVal : function(panel)
	{
		var me = this;
		var sendingBankFilterRef = me.getIncomingWiresFilterView();
		var dtParams = me.getDateParam(me.dateFilterVal);
		var operator = dtParams.operator;
		var fieldValue1 = dtParams.fieldValue1;
		var fieldValue2 = dtParams.fieldValue2;
		var strUrl = 'sendingBank.srvc?'; 
		if (!Ext.isEmpty(me.dateFilterVal))
		{
			if (Ext.isEmpty(dtParams.fieldValue1)) {
				fieldValue1 = me.dateFilterFromVal;
				fieldValue2 = me.dateFilterToVal;
			}
			if(!Ext.isEmpty(fieldValue1) || !Ext.isEmpty(fieldValue2))
			{
				if ("eq" === dtParams.operator) {
					strUrl = strUrl + '$filter=' + 'EntryDate' + ' ' + operator
							+ ' ' + 'date\'' + fieldValue1 + '\'';
				} else {
					strUrl = strUrl + '$filter=' + 'EntryDate' + ' ' + operator
							+ ' ' + 'date\'' + fieldValue1 + '\'' + ' and '
							+ 'date\'' + fieldValue2 + '\'';
				}
			}
		}
		strUrl = strUrl+'&'+csrfTokenName+'='+csrfTokenValue;
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			/*params :
			{
				csrfTokenName : tokenValue
			},*/
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if (!Ext.isEmpty(data)) 
				{
					me.createSendingBankList(data.d.incomingWire);
				}
			},
			failure : function( response )
			{
				console.log( 'Bad : Something went wrong with your request' );
			}
		} );
	},
	createSendingBankList : function(jsonData) {
		var me=this;
		var objTbar = me.getIncomingWiresTypeToolBar();
		var infoArray = this.createSendingMenuList(jsonData,me);
		objTbar.add({
						xtype : 'button',
						border : 0,
						filterParamName : 'oneBank',
						itemId : 'oneBankCombo',// Required
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph : 'xf0d7@fontawesome',
						menu  : Ext.create('Ext.menu.Menu', { 
							items : infoArray
						})
		})
		me.renderTypeFilter();
	},
	createSendingMenuList : function(jsonData,me) {
		var infoArray = new Array();
		if(jsonData)
		{
			for (var i = 0; i < jsonData.length; i++) 
			{ 
				infoArray.push({
					text : getLabel( 'label'+i, jsonData[i].senderBankName ),
					btnId : 'btn'+jsonData[i].senderBankName,
					btnDesc: jsonData[i].senderBankName,
					btnValue : i,
					code : jsonData[i].senderBankName,
					parent : this,
					handler : function( btn, opts )
					{
						me.handleType(btn);
					}
				});
			}
		}
		return infoArray;
	},
	handleReportAction : function( btn, opts )
	{
		var me = this;
		me.downloadReport( btn.itemId );
	},
	downloadReport : function( actionName )
	{
		var me = this;
		var withHeaderFlag = me.getWithHeaderCheckboxRef().checked;
		var arrExtension =
		{
			downloadXls : 'xls',
			downloadCsv : 'csv',
			loanCenterDownloadPdf : 'pdf',
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
		strUrl = 'services/getIncomingWireList/getIncomingWireDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
		var strQuickFilterUrl = me.getFilterUrl();
		strUrl += strQuickFilterUrl;
		var grid = me.getIncomingWiresGrid();
		viscols = grid.getAllVisibleColumns();
		for( var j = 0 ; j < viscols.length ; j++ )
		{
			col = viscols[ j ];
			if( col.dataIndex && arrSortColumn[ col.dataIndex ] )
			{
				if( colMap[ arrSortColumn[ col.dataIndex ] ] )
				{
					// ; do nothing
				}
				else
				{
					colMap[ arrSortColumn[ col.dataIndex ] ] = 1;
					colArray.push( arrSortColumn[ col.dataIndex ] );

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
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	},
	applySeekFilter : function() {
		var me = this;
		me.toggleSavePrefrenceAction(true);
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyQuickFilter();
	},
	showHideSellerClientMenuBar : function(entityType) {
		var me = this;
		var storeData = null;
		if (entityType === '1') {
		Ext.Ajax.request({
					url : 'services/clientList.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.filterList;
						if (!Ext.isEmpty(data)) {
							storeData = data;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});
		if (!Ext.isEmpty(storeData)) {
			var objClientStore = Ext.create('Ext.data.Store', {
				fields : ['clientId', 'clientDescription'],
						data : storeData,
						reader : {
								type : 'json',
								root : 'filterList'
								}
							});		
			objClientStore.load();
			if (objClientStore.getCount() > 1) {
				me.showClientFlag = true;
			}
		}
		/*var objClientStore = Ext.create('Ext.data.Store', {
					fields : ['clientId', 'clientDescription'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'filterList'
					}
				});		
		objClientStore.load();
		if (objClientStore.getCount() > 1) {
			me.showClientFlag = true;
		}
			me.getSellerMenuBar().hide();
			//me.getClientMenuBar().hide();
			if(me.showClientFlag)
			{
				me.getClientLoginMenuBar().show();
			}
			else
			{
				me.getClientLoginMenuBar().hide();
		}
		} else {
			me.getClientMenuBar().show();
			me.getSellerMenuBar().show();
			me.getClientLoginMenuBar().hide();
		}*/
		}
	}
});