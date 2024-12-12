Ext.define('GCP.controller.IncomingWiresViewController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.IncomingWiresGridGroupView','Ext.ux.gcp.DateHandler','Ext.ux.gcp.PreferencesHandler','Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.IncomingWiresView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},
	        {
				ref : 'incomingWiresView',
				selector : 'incomingWiresView'
			},
			{
				ref : 'incomingWiresGridGroupView',
				selector : 'incomingWiresView incomingWiresGridGroupView'
			},
			{
				ref : 'groupView',
				selector : 'incomingWiresGridGroupView groupView'
			},
			{
				ref : 'incomingWiresFilterView',
				selector : 'incomingWiresFilterView'
			},
			/*Quick Filter starts...*/
			{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
			},{
				ref:'quickFilterClientCombo',
				selector:'incomingWiresFilterView combo[itemId="quickFilterClientCombo"]'
			},{
				ref : 'entryDate',
				selector : 'incomingWiresFilterView button[itemId="entryDate"]'
			},{
				ref : 'dateLabel',
				selector : 'incomingWiresFilterView label[itemId="dateLabel"]'
			},{
				ref : 'sendingBankFilterAuto',
				selector : 'incomingWiresFilterView  AutoCompleter[itemId="sendingBankLst"]'
			},{
				ref : 'savedFiltersCombo',
				selector : 'incomingWiresFilterView  combo[itemId="savedFiltersCombo"]'
			}
			/*Quick Filter ends...*/
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
		dateRangeFilterVal : '',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		dateFilterLabel : getLabel('latest', 'Latest'),
		objAdvFilterPopup : null,
		dateHandler : null,
		urlGridPref : 'userpreferences/incomingwire/gridView.srvc',
		urlGridFilterPref : 'userpreferences/incomingwire/gridViewFilter.srvc',
		commonPrefUrl : 'services/userpreferences/incomingwire.json',
		urlAdvFilter : 'services/userpreferences/incomingwire/{0}.json',
		showClientFlag : false,
		arrSorter:[],
		strDefaultMask : '000000000000000000',
		reportGridOrder : null,
		savePrefAdvFilterCode : null,
		previouGrouByCode : null,
		SearchOrSave : false,
		datePickerSelectedDate : [],
		savedFilterVal : '',
		clientFilterVal : 'all',
		clientFilterDesc : null,
		sendingBankFilterVal : 'all',
		sendingBankDesc : null,
		isSendingBank : false,
		oldSendingBank : '',
		preferenceHandler : null,
		strPageName : 'incomingwire',
		pageSettingPopup : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
		
		this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.updateFilterConfig();
		//me.updateAdvFilterConfig();

		$(document).on('filterDateChange',function(event, filterType, btn, opts) {
			if (filterType=="entryDateQuickFilter"){
				 me.handleEntryDateChange(filterType,btn,opts);
			 }
		});
		$(document).on('handleSavedFilterClick', function(event) {
			me.handleSavedFilterClick();
		});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
        });

		$(document).on('saveAndSearchActionClicked', function() {
			me.saveAndSearchActionClicked(me);
				});
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
				});
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
				});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
		$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
				});
		$(document).on('orderUpGridEvent',
				function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
		$(document).on('savePreference', function(event) {
					me.disablePreferencesButton("clearPrefMenuBtn",false);
					me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
					me.disablePreferencesButton("savePrefMenuBtn",true);
					me.handleClearPreferences();
				});
		$(document).on('performReportAction', function(event,actionName) {
					 me.handleReportAction(actionName);
				});
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		me.control({
			'incomingWiresView' : {
			beforerender : function(panel, opts) {
			},
			afterrender : function(panel, opts) {
			},
			performReportAction : function(btn, opts) {
				//me.handleReportAction(btn, opts);
			}
		},
		'pageSettingPopUp' : {
			'applyPageSetting' : function(popup,data,strInvokedFrom) {
				me.applyPageSetting(data,strInvokedFrom);
			},
			'restorePageSetting' : function(popup,data,strInvokedFrom) {
				me.restorePageSetting(data,strInvokedFrom);
			},
							'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				}
		},	
		 'incomingWiresGridGroupView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);		
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
						tabPanel, newCard, oldCard);
					me.setGridInfo();
				},
				'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, filterData) {					
						me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, filterData);
						me.setGridInfo();
				},
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridStateChange' : function(grid) {
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.handleRowIconClick(grid, rowIndex, columnIndex,
						actionName, record);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
				},
				'render' : function() {
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					if (objIncomningWirePref) {
						var objJsonData = Ext.decode(objIncomningWirePref);
						if (!Ext.isEmpty(objJsonData.d.preferences)
								&& Ext.isEmpty(widgetFilterUrl)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							}
						}
					}
				},
				afterrender : function() {
					if (objGridViewPref) {
					}
				},'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}
			},
			'filterView' : {
					afterrender : function(tbar, opts) {
						me.handleDateChange(me.dateFilterVal);
					},
					beforerender : function() {
						var useSettingsButton = me.getFilterView()
								.down('button[itemId="useSettingsbutton"]');
						if (!Ext.isEmpty(useSettingsButton)) {
							useSettingsButton.hide();
						}
					}
				},		
			'incomingWiresFilterView component[itemId="checkEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
								monthsToShow : 1,
								changeMonth : true,
								changeYear : true,
								dateFormat : strApplicationDefaultFormat,
								rangeSeparator : '  to  ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.dateRangeFilterVal = '13';
										me.datePickerSelectedDate = dates;
										me.dateFilterVal = me.dateRangeFilterVal;
										me.dateFilterLabel = getLabel('daterange', 'Date Range');
										me.handleDateChange(me.dateRangeFilterVal);
										me.setDataForFilter();
										me.applyQuickFilter();
									}
								}
					});
					
					me.dateFilterVal = defaultDateIndex; // Set to default as Latest
					me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
					me.handleDateChange(me.dateFilterVal);
					me.setDataForFilter();
					me.applyQuickFilter();
				}
			},
			'incomingWiresFilterView' : {
						afterrender : function(view){
							/*var clientContainer = view.down('container[itemId="clientContainer"]');
							var combo = clientContainer.down('combo[itemId="quickFilterClientCombo"]');
							if(combo.getStore().data.length <= 2)
							{
								clientContainer.hide();
							}*/
						},
						handleSavedFilterItemClick : function(comboValue,
								comboDesc) {
							me.doHandleSavedFilterItemClick(comboValue);
						},
						/*handleClientChangeInQuickFilter : function(combo) {
							me.handleClientChangeInQuickFilter(combo);
						},*/
						handleSendingBankFilterChange : function(combo) {
							me.handleSendingBankFilterChange(combo);
						}
					},
			'incomingWiresFilterView combo[itemId="savedFiltersCombo"]' : {
						'afterrender' : function(combo, newValue, oldValue, eOpts) {
							if (!Ext.isEmpty(me.savedFilterVal)) {
								combo.setValue(me.savedFilterVal);
							}
						}
					},
			'incomingWiresFilterView  combo[itemId="quickFilterClientCombo"]' : {
					'afterrender' : function(combo, newValue, oldValue, eOpts) {
						if (!Ext.isEmpty(me.clientFilterVal)) {
							combo.setValue(me.clientFilterVal);
						}
					}
				},
			'incomingWiresFilterView  combo[itemId="quickFilterSendingBankCombo"]' : {
					'afterrender' : function(combo, newValue, oldValue, eOpts) {
						if (!Ext.isEmpty(me.sendingBankFilterVal)) {
							combo.setValue(me.sendingBankFilterVal);
						}
					}
				},
				'incomingWiresFilterView AutoCompleter[itemId=sendingBankLst]' : {
					select : function(btn, opts) {
						me.filterApplied = 'Q';
						me.setDataForFilter();
						me.applyQuickFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
						me.isSendingBank = true;
					},
					change : function(combo, newValue, oldValue, eOpts) {
						me.oldSendingBank = oldValue;
						if (newValue == '' || null == newValue) {						
							me.setDataForFilter();
							if(oldValue && oldValue != '%')
							me.applyQuickFilter();
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);	
							me.isSendingBank = true;
							me.oldSendingBank = "";
						}
					},
					keyup : function(combo, e, eOpts){
						me.isSendingBank = false;
					}				
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvanceFilterPopup();
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			}
			/*'incomingWiresView incomingWiresFilterView button[itemId="btnSavePreferences"]' : {
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
				},
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
			}*/
		});
	},
	handleRowIconClick : function(grid, rowIndex, columnIndex,
						actionName, record) {
		var me = this;
		if (actionName === 'btnView') {
			var strUrl = 'incomingWireDetail.seek';
			$( '#detailPopup' ).dialog(
				{
					autoOpen : false,
					/*height : 560,
					width : 989,*/
					minWidth : 400,
					width : 735,
					//minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					dialogClass:'ft-tab-bar',
					modal : true,
					//title : 'Incoming Wire Details',
					/*buttons :
					showPaymentAdvice === 'true' ? [
						{
							text :  getLabel('lblCreditAdvice', 'Credit Advice'),
							click : function()
							{
			                    me.downloadCreditAdvice(record);	
							}
						}, 
						{
							text: getLabel('lblReport', 'Report'),
							click: function()
							{
			                    me.downloadDetailReport(record);	
							}
						}
						,
						{
							text : getLabel('lblCancel', 'Cancel'),
							click: function()
							{
								$( this ).dialog( "close" );
							}
						}
					] :
					[
						{
							text: getLabel('lblReport', 'Report'),
							click: function()
							{
			                    me.downloadDetailReport(record);	
							}
						}
						,
						{
							text : getLabel('lblCancel', 'Cancel'),
							click: function()
							{
								$( this ).dialog( "close" );
							}
						}
					],*/
					open:function(){
						$("#detailsTabs").barTabs();
						$('#detailsTabs').tabs("option", "selected", 0);
						me.doHandleContainerCollapse();
						
						if(showPaymentAdvice === 'true'){
							$("#reportPayAdvice").show();
							$("#createAdvice").show();
							$("#report").hide();
						}
						else{
							$("#reportPayAdvice").hide();
							$("#createAdvice").hide();
							$("#report").show();
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
						$("#detailsTabs").barTabs();
						$( '#detailPopup' ).dialog( "open" );				
												
						$('#cancelBtn').bind('click',function(){
							$('#detailPopup').dialog("close");
						});
						
						$('#reportPayAdviceBtn').bind('click',function(){
							me.downloadDetailReport(record);
							//$('#detailPopup').dialog("close");
						});
						
						$('#createAdviceBtn').bind('click',function(){
							me.downloadCreditAdvice(record);
							//$('#detailPopup').dialog("close");
						});
						
						$('#reportBtn').bind('click',function(){
							me.downloadDetailReport(record);
						});
						$('#reportBtn').bind('keydown',function(){
							autoFocusOnFirstElement(event, 'buttongroup', false);
						});
						
						autoFocusOnFirstElement(null, 'buttongroup', true);
						$('#filterView-1012_header').css("background-image","none");

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
				"colHeader" : getLabel("clientDesc","Client")
			},{
				"colId" : "valueDate",
				"colHeader" : getLabel("valueDate","Value Date")
			}, {
				"colId" : "fedReference",
				"colHeader" : getLabel("fedReference","FED Reference Number")
			}, {
				"colId" : "receiverAccNmbr",
				"colHeader" : getLabel("receiverAccNmbr","Account")
			}, {
				"colId" : "receiverAccName",
				"colHeader" : getLabel("receiverAccName","Account Type")
			}, {
				"colId" : "drCrFlag",
				"colHeader" : getLabel("drCrFlag","Dr/Cr")
			},
			{
				"colId" : "paymentAmount",
				"colHeader" : getLabel("paymentAmount","Amount"),
				"colType" : "number"
			},
			{
				"colId" : "senderName",
				"colHeader" : getLabel("senderName","Sender Name")
			},
			{
				"colId" : "senderBankName",
				"colHeader" : getLabel("senderBankName","Sending Bank")
			},
			{
				"colId" : "senderBankABA",
				"colHeader" : getLabel("senderBankABA","Sending Bank Identifier")
			}];
		}
		else
		{
			arrColsPref = [{
					"colId" : "valueDate",
					"colHeader" : getLabel("valueDate","Value Date")
				}, {
					"colId" : "fedReference",
					"colHeader" : getLabel("fedReference","FED Reference Number")
				}, {
					"colId" : "receiverAccNmbr",
					"colHeader" : getLabel("receiverAccNmbr","Account")
				}, {
					"colId" : "receiverAccName",
					"colHeader" : getLabel("receiverAccName","Account Type")
				}, {
					"colId" : "drCrFlag",
					"colHeader" : getLabel("drCrFlag","Dr/Cr")
				},
				{
					"colId" : "paymentAmount",
					"colHeader" : getLabel("paymentAmount","Amount"),
					"colType" : "number"
				},
				{
					"colId" : "senderName",
					"colHeader" : getLabel("senderName","Sender Name")
				},
				{
					"colId" : "senderBankName",
					"colHeader" : getLabel("senderBankName","Sending Bank")
				},
				{
					"colId" : "senderBankABA",
					"colHeader" : getLabel("senderBankABA","Sending Bank Identifier")
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
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [];
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		
		if(arrOfParseQuickFilter) {
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
		me.reportGridOrder = strUrl;
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null, null, false);		
	grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
	},
	handleGridRowClick : function(record, grid, columnType) {
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
			var me = this;
			var columnModel = null;
			var columnAction = null;
			if (!Ext.isEmpty(grid.columnModel)) {
				columnModel = grid.columnModel;
				for (var index = 0; index < columnModel.length; index++) {
					if (columnModel[index].colId == 'actioncontent') {
						columnAction = columnModel[index].items;
						break;
					}
				}
			}
			var arrVisibleActions = [];
			var arrAvailableActions = [];
			if (!Ext.isEmpty(columnAction))
				arrAvailableActions = columnAction;
			var store = grid.getStore();
			var jsonData = store.proxy.reader.jsonData;
			if (!Ext.isEmpty(arrAvailableActions)) {
				for (var count = 0; count < arrAvailableActions.length; count++) {
					var btnIsEnabled = false;
					if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
						btnIsEnabled = grid.isRowIconVisible(store, record,
								jsonData, arrAvailableActions[count].itemId,
								arrAvailableActions[count].maskPosition);
						if (btnIsEnabled == true) {
							arrVisibleActions.push(arrAvailableActions[count]);
							btnIsEnabled = false;
						}
					}
				}
			}
			if (!Ext.isEmpty(arrVisibleActions)) {
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			}
		} else {
		}
	},
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var selectedRecord=grid.getSelectionModel().getSelection()[0];
		var rowIndex = grid.store.indexOf(selectedRecord);
		if (actionName === 'btnView') {
			if (actionName === 'btnView') {
			var strUrl = 'incomingWireDetail.seek';
			$( '#detailPopup' ).dialog(
				{
					autoOpen : false,
					/*height : 560,
					width : 989,*/
					minWidth : 400,
					width : 735,
					//minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					dialogClass:'ft-tab-bar',
					modal : true,
					//title : 'Incoming Wire Details',
					/*buttons :
					showPaymentAdvice === 'true' ? [
						{
							text :  getLabel('lblCreditAdvice', 'Credit Advice'),
							click : function()
							{
			                    me.downloadCreditAdvice(record);	
							}
						}, 
						{
							text: getLabel('lblReport', 'Report'),
							click: function()
							{
			                    me.downloadDetailReport(record);	
							}
						}
						,
						{
							text : getLabel('lblCancel', 'Cancel'),
							click: function()
							{
								$( this ).dialog( "close" );
							}
						}
					] :
					[
						{
							text: getLabel('lblReport', 'Report'),
							click: function()
							{
			                    me.downloadDetailReport(record);	
							}
						}
						,
						{
							text : getLabel('lblCancel', 'Cancel'),
							click: function()
							{
								$( this ).dialog( "close" );
							}
						}
					],*/
					open:function(){
						$("#detailsTabs").barTabs();
						$('#detailsTabs').tabs("option", "selected", 0);

						if(showPaymentAdvice === 'true'){
							$("#reportPayAdvice").show();
							$("#createAdvice").show();
							$("#report").hide();
						}
						else{
							$("#reportPayAdvice").hide();
							$("#createAdvice").hide();
							$("#report").show();
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
						$("#detailsTabs").barTabs();
						$( '#detailPopup' ).dialog( "open" );
						
						$('#cancelBtn').bind('click',function(){
							$('#detailPopup').dialog("close");
						});
						
						$('#reportPayAdviceBtn').bind('click',function(){
							me.downloadDetailReport(record);
							//$('#detailPopup').dialog("close");
						});
						
						$('#createAdviceBtn').bind('click',function(){
							me.downloadCreditAdvice(record);
							//$('#detailPopup').dialog("close");
						});
						
						$('#reportBtn').bind('click',function(){
							me.downloadDetailReport(record);
							//$('#detailPopup').dialog("close");
						});
					}
				});
			

			
			//me.submitForm(strUrl, record, rowIndex);
		} 
		}
		
	},
	/* Page setting handling starts here */
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
							ok: getLabel('btnOk', 'OK')
							} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			if (strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView(), subGroupInfo = groupView
						.getSubGroupInfo()
						|| {}, objPref = {}, groupInfo = groupView
						.getGroupInfo()
						|| '{}', strModule = subGroupInfo.groupCode;
				Ext.each(arrPref || [], function(pref) {
							if (pref.module === 'ColumnSetting') {
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else{
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
				}
		}
	},
	restorePageSetting : function(arrPref, strInvokedFrom) {
		var me = this;
		if (strInvokedFrom === 'GRID'
				&& _charCaptureGridColumnSettingAt === 'L') {
			var groupView = me.getGroupView(), subGroupInfo = groupView
					.getSubGroupInfo()
					|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			args['strInvokedFrom'] = strInvokedFrom;
			Ext.each(arrPref || [], function(pref) {
						if (pref.module === 'ColumnSetting') {
							pref.module = strModule;
							return false;
						}
					});
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView(), gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					}
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
							 ok: getLabel('btnOk', 'OK')
							} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
							 ok: getLabel('btnOk', 'OK')
							} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn;strTitle = null, subGroupInfo={};

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objIncomningWirePref)) {
			objPrefData = Ext.decode(objIncomningWirePref);
			objGeneralSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GeneralSetting
					? objPrefData.d.preferences.GeneralSetting
					: null;
			objGridSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GridSetting
					? objPrefData.d.preferences.GridSetting
					: null;
			/**
			 * This default column setting can be taken from
			 * preferences/gridsets/uder defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnModel() || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/incomingWireFilter';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
		"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')   : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	getDefaultColumnModel : function() {
	    var me = this;
		var data = null;
		var arrCols = [];
		if( !Ext.isEmpty( objGridViewPref ) )
		{
			data = Ext.decode( objGridViewPref );
		}
		if(entityType === '0' || me.showClientFlag)
		{
			arrCols = [{
						"colId" : "clientDesc",
						"colHeader" : getLabel('clientDesc','Client'),
						width : 100
					   },{
						"colId" : "valueDate",
						"colHeader" : getLabel('valueDate','Value Date'),
						width : 100
					   },{
						"colId" : "fedReference",
						"colHeader" : getLabel('fedReference','FED Reference Number'),
						width : 110
					   },{
						"colId" : "receiverAccNmbr",
						"colHeader" : getLabel('receiverAccNmbr','Account'),
						width : 100
					   },{
						"colId" : "receiverAccName",
						"colHeader" : getLabel('receiverAccName','Account Type'),
						width : 140
					   },{
						"colId" : "drCrFlag",
						"colHeader" : getLabel('drCrFlag','Dr/Cr'),
						width : 50
					   },{
						"colId" : "paymentAmount",
						"colHeader" : getLabel('paymentAmount','Amount'),
						"colType" : "number",
						"align" : 'right',
						width : 100
					   },{
						"colId" : "senderName",
						"colHeader" : getLabel('senderName','Sender Name'),
						width : 110
					   },{
						"colId" : "senderBankName",
						"colHeader" : getLabel('senderBankName','Sending Bank'),
						width : 110
					   },{
						"colId" : "senderBankABA",
						"colHeader" : getLabel('senderBankABA','Sending Bank Identifier'),
						width : 120
					   }];
		}
		else
		{
			arrCols = [{
						"colId" : "valueDate",
						"colHeader" : getLabel('valueDate','Value Date'),
						width : 100
					   },{
						"colId" : "fedReference",
						"colHeader" : getLabel('fedReference','FED Reference Number'),
						width : 110
					   },{
						"colId" : "receiverAccNmbr",
						"colHeader" : getLabel('receiverAccNmbr','Account'),
						width : 100
					   },{
						"colId" : "receiverAccName",
						"colHeader" : getLabel('receiverAccName','Account Type'),
						width : 140
					   },{
						"colId" : "drCrFlag",
						"colHeader" : getLabel('drCrFlag','Dr/Cr'),
						width : 50
					   },{
						"colId" : "paymentAmount",
						"colHeader" : getLabel('paymentAmount','Amount'),
						"colType" : "number",
						"align" : 'right',
						width : 100
					   },{
						"colId" : "senderName",
						"colHeader" : getLabel('senderName','Sender Name'),
						width : 110
					   },{
						"colId" : "senderBankName",
						"colHeader" : getLabel('senderBankName','Sending Bank'),
						width : 110
					   },{
						"colId" : "senderBankABA",
						"colHeader" : getLabel('senderBankABA','Sending Bank Identifier'),
						width : 120
					   }];
		}
		return arrCols;
	},
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
			//adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInAdv) && reqJsonInAdv!= null) {
				arrAdvJson = advJsonData;
				arrAdvJson = me
						.removeFromAdvanceArrJson(arrAdvJson,paramName);
				me.advFilterData = arrAdvJson;
				
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromAdvanceArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData,quickJsonData.length);
			me.refreshData();
		}
	},
	resetFieldInAdvAndQuickOnDelete : function(objData,len){
		var me = this,strFieldName;
			if(len==0)
		{		
			var savedFilterComboBox = me.getIncomingWiresFilterView()
			.down('combo[itemId="savedFiltersCombo"]');
			savedFilterComboBox.setValue(me.savedFilterVal);
			$("#msSavedFilter").val("");
			$("#msSavedFilter").multiselect("refresh");			
		}		

		if(!Ext.isEmpty(objData)){
			strFieldName = objData.paramName || objData.field;
		}	
		if (strFieldName ==='sendingBank' && !Ext.isEmpty(me.getSendingBankFilterAuto())) {
			me.getSendingBankFilterAuto().setValue('');
		}
		if(strFieldName === 'EntryDate'){
			var datePickerRef = $('#entryDataPicker');
			var toDatePickerRef = $('#entryDataToPicker');
			me.dateFilterLabel = '';
			datePickerRef.val('');
			toDatePickerRef.val('');
			me.filterApplied = 'Q';
			me.getDateLabel().setText(getLabel('requestDate', 'Value Date')+ me.dateFilterLabel);
		}
		/*else if(strFieldName ==='receiverAccNmbr'){
			$("#receiverAccNmbr").val(getLabel("select", "Select"));
			$("#receiverAccNmbr_jq").val('');
		}*/
		else if(strFieldName ==='clientCode'){
			/*$("#msClient").val("");
			if(_availableClients> 1)
				$("#summaryClientFilterSpan").text('All Companies');
			$("#summaryClientFilter").val('');*/
			
			if(isClientUser()){
				var clientComboBox = me.getIncomingWiresFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			} else {
				var clientComboBox = me.getIncomingWiresFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
		else if(strFieldName ==='receiverAccName'){
	        resetAllMenuItemsInMultiSelect("#receiverAccName")
		}
		else if(strFieldName ==='sendingBank'){
			$("#sendingBank").val(getLabel("select", "Select"));
		}
		else if(strFieldName ==='drCrFlag'){
			$("#drCrFlag").val("");
		}
		else if(strFieldName ==='fedReferenceNo'){
			$("input[type='text'][id='fedReferenceNo']").val("");
		}
		else if(strFieldName ==='amountOperator'){
			$("#amountOperator").val("eq");
		}
		else if(strFieldName ==='paymentAmount'){
			$("input[type='text'][id='paymentAmount']").val("");
		}
		else if(strFieldName ==='paymentAmount'){
			$("#msSavedFilter").val("");
			$("#msSavedFilter").multiselect("refresh");
		}
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				reqJson = ai;
			}
		}
		return reqJson;
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
   doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'INCOMINGWIRE_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'INCOMINGWIRE_OPT_ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;
	},
doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Need to refactor for non us market
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') 
		{
				args = {
					scope : me
				};
			if (groupInfo.groupTypeCode === 'INCOMINGWIRE_OPT_ADVFILTER') {
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode != 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						me.savePrefAdvFilterCode = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.SearchOrSave = true;
						me.getSavedFilterData(strFilterCode,
								me.postHandleAdvancedFilterTabChange, false);
					}
					//me.toggleSavePrefrenceAction(true);
				} 
				else {
					strModule = subGroupInfo.groupCode
					strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
					me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);	
				} 			
			} 
			else{
				me.postHandleDoHandleGroupTabChange();
			}
		}
		else
		{
				if (groupInfo.groupTypeCode === 'INCOMINGWIRE_OPT_ADVFILTER') {
				strFilterCode = subGroupInfo.groupCode;
					if (strFilterCode != 'all') {
						if (!Ext.isEmpty(strFilterCode)) {
							me.savePrefAdvFilterCode = strFilterCode;
							me.showAdvFilterCode = strFilterCode;
							me.SearchOrSave = true;
							me.getSavedFilterData(strFilterCode,
									me.postHandleAdvancedFilterTabChange, false);
						}
						//me.toggleSavePrefrenceAction(true);
					} else {
						me.savePrefAdvFilterCode = null;
						me.showAdvFilterCode = null;
						me.filterApplied = 'ALL';
						strUrl = Ext.String.format(me.urlAdvFilter, 'ADVFILTER');				
						args = {
							scope : me
						};
						me.getSavedPreferences(strUrl,
								me.postHandleDoHandleGroupTabChange, args);
						}	
				}
				else
					me.postHandleDoHandleGroupTabChange();
		}

	
	},	
	getSavedPreferences : function(strUrl, fnCallBack, args) {
		var me = this;
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var data = null;
						if (response && response.responseText)
							data = Ext.decode(response.responseText);
						Ext.Function.bind(fnCallBack, me);
						if (fnCallBack)
							fnCallBack(data, args);
					},
					failure : function() {
					}

				});
	},
	postHandleAdvancedFilterTabChange : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strUrl = null;

		me.populateSavedFilter(filterCode, filterData, false);
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.handleAdvanceFilterCleanUp();
		strUrl = Ext.String.format(me.urlAdvFilter, 'ADVFILTER');				
		args = {
			scope : me
		};
		me.getSavedPreferences(strUrl,
				me.postHandleDoHandleGroupTabChange, args);
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
	},
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl,null);
		}
		me.refreshData();
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getIncomingWiresGridGroupView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel
				}
			}
		}
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	setDataForFilter : function() {
		var me = this;
		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		if(!Ext.isEmpty(filterCode))
		me.advFilterCodeApplied = filterCode;
	if (this.filterApplied === 'Q') {
		this.filterData = this.getQuickFilterQueryJson();
	} else if (this.filterApplied === 'A') {
	var objJson = getAdvancedFilterQueryJson();
		this.advFilterData = objJson;	
		this.filterData = this.getQuickFilterQueryJson();
		
		//var filterCode = $("input[type='text'][id='filterCode']");
		//this.advFilterCodeApplied = filterCode;	
	}
	if (this.filterApplied === 'ALL') {
		this.advFilterData = [];
		this.filterData = this.getQuickFilterQueryJson();
	}
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', strActionStatusUrl = '', isFilterApplied = 'false';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
								? subGroupInfo.groupQuery
								: '';
		if(me.filterApplied === 'ALL')
		{
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				//strUrl = strQuickFilterUrl;
				isFilterApplied = true;
			}
		}
		else
		{
			if(me.filterApplied === 'Q')
			{
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
				if (!Ext.isEmpty(strQuickFilterUrl)) {
					strUrl += '&$filter=' + strQuickFilterUrl;
					//strUrl = strQuickFilterUrl;
					isFilterApplied = true;
				}
			}
			if(me.filterApplied === 'A')
			{
				strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
				if (!Ext.isEmpty(strAdvFilterUrl)) {
					//strUrl = strAdvFilterUrl;
					if( strUrl == '' )
						strUrl += '&$filter=' + strAdvFilterUrl;
					else
						strUrl += ' and ' + strAdvFilterUrl;
					isFilterApplied = true;
				}
				else{
					//strUrl = '&$filter=' ;
				}
			}
		}
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		return strUrl;
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var sendingBankVal = null;
		var paymentTypeFilterVal = me.paymentTypeFilterVal;
		var paymentActionFilterVal = this.paymentActionFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var sendingBankFilterVal = me.sendingBankFilterVal;
		
		//var receiverAccNmbr =$("#receiverAccNmbr").val();
        var receiverAccName = $("#receiverAccName").getMultiSelectValueString();
        if(!Ext.isEmpty(filterRecAccNameCount)){
            var nameArray = receiverAccName.split(',');
            if(filterRecAccNameCount == nameArray.length)
            	receiverAccName='All';
        }
		var sendingBank =$("#sendingBank").val();
		var msSavedFilter =$("#msSavedFilter").val();	
		
		var incomingWiresFilterView = me.getIncomingWiresFilterView();
		var sendingBankLst = incomingWiresFilterView.down('combobox[itemId=sendingBankLst]');
		if (!Ext.isEmpty(sendingBankLst)
				&& !Ext.isEmpty(sendingBankLst.getValue())) {
			sendingBank = sendingBankLst.getValue(), sendingBankVal = sendingBank
					.trim();
		}
		
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(!Ext.isEmpty(index))
		{
			jsonArray.push({
						paramName : me.getEntryDate().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramIsMandatory : true,
						paramFieldLable : getLabel('requestDate', 'Value Date')
					});
		}
		
		if (this.filterApplied === 'Q')
		{
			if (!Ext.isEmpty(sendingBankVal)) {
				jsonArray.push({
							paramName : 'senderBankName',
							paramValue1 : encodeURIComponent(sendingBankVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S',
							paramFieldLable : getLabel('senderBankName','Sending Bank'),
							displayType : 5,
							displayValue1 : sendingBankVal
						});
			}
			$("#sendingBank").val(sendingBankVal);
		}
		else if(me.advFilterData.length == 0 && this.filterApplied === 'A'){
			var sendingBankComboBox = me.getIncomingWiresFilterView().down('combobox[itemId=sendingBankLst]');
		    sendingBankComboBox.setValue('');
			sendingBankFilterVal = null;
		}
		
		if (paymentTypeFilterVal != null && paymentTypeFilterVal != 'all') {
			jsonArray.push({
						paramName : me.getIncomingWiresTypeToolBar().filterParamName,
						paramValue1 : encodeURIComponent(paymentTypeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (paymentActionFilterVal != null && paymentActionFilterVal != 'all') {
			jsonArray.push({
						paramName : this.getIncomingWiresTypeToolBar().filterParamName,
						paramValue1 : encodeURIComponent(paymentActionFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != null && clientFilterVal != 'all') {
			jsonArray.push({
							paramName : 'clientCode',
							operatorValue : 'eq',
							paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
							dataType :'S',
							displayType : 5,
							paramFieldLable : getLabel('lblcompany', 'Company Name'),
							displayValue1 : clientFilterDesc
					});
			}
		if(me.advFilterData.length > 0){
		
		if(this.filterApplied === 'A')
		{
			if (!Ext.isEmpty(sendingBank) && sendingBank!= null && sendingBank != 'all')
			{
				jsonArray.push({
							field : 'senderBankName',
							paramName : 'senderBankName',
							operator : 'eq',
							operatorValue : 'eq',
							value1 : encodeURIComponent(sendingBank.replace(new RegExp("'", 'g'), "\''")),
							paramValue1 : encodeURIComponent(sendingBank.replace(new RegExp("'", 'g'), "\''")),
							dataType : 'S',
							displayType : 5,//4,
							fieldLabel : getLabel('senderBankName','Sending Bank'),
							displayValue1 : sendingBank
						});
			}
			me.getSendingBankFilterAuto().setValue(sendingBank);
		}
		
	/*	if (!Ext.isEmpty(receiverAccNmbr) && receiverAccNmbr!= null && receiverAccNmbr != 'all') {
				jsonArray.push({
							field : 'receiverAccNmbr',
							paramName : 'receiverAccNmbr',
							operator : 'eq',
							operatorValue : 'eq',
							value1 : encodeURIComponent(receiverAccNmbr.replace(new RegExp("'", 'g'), "\''")),
							paramValue1 : encodeURIComponent(receiverAccNmbr.replace(new RegExp("'", 'g'), "\''")),
							dataType : 'S',
							displayType : 5,//4,
							fieldLabel : getLabel('receiverAccNmbr','Account'),
							displayValue1 : receiverAccNmbr
						});
			}*/
			
		if (!Ext.isEmpty(receiverAccName) && receiverAccName!= null && receiverAccName != 'All') {
				jsonArray.push({
							field : 'receiverAccNmbr',
							paramName : 'receiverAccNmbr',
							operator : 'eq',
							operatorValue : 'eq',
							value1 : encodeURIComponent(receiverAccName.replace(new RegExp("'", 'g'), "\''")),
							paramValue1 : encodeURIComponent(receiverAccName.replace(new RegExp("'", 'g'), "\''")),
							dataType : 'S',
							displayType : 5,//4,
							fieldLabel : getLabel('receivingAccountName','Account Name'),
							displayValue1 : receiverAccName
						});
			}
				
		// Dr/Cr 
		var strDebitCreditDesc = '';
		var drCrFlag = $("select[id='drCrFlag']").val();
		if(drCrFlag == 'Dr')
			strDebitCreditDesc = 'Debit';
		else if(drCrFlag == 'Cr')
			strDebitCreditDesc = 'Credit';
		if( !Ext.isEmpty( drCrFlag ))
			{
				jsonArray.push({
					field : 'drCrFlag',
					paramName : 'drCrFlag',
					operator : 'eq',
					operatorValue : 'eq',
					value1 : encodeURIComponent(drCrFlag.replace(new RegExp("'", 'g'), "\''")),
					paramValue1 : encodeURIComponent(drCrFlag.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					paramValue2 : '',
					displayType : 5,
					fieldLabel : getLabel('drCrFlag','Dr/Cr'),
					displayValue1 : strDebitCreditDesc
				});
			}
			
		// FED Reference No.
		var fedReference = $("input[type='text'][id='fedReferenceNo']").val();
		if (!Ext.isEmpty(fedReference)) {
			jsonArray.push({
						field : 'fedReference',
						paramName : 'fedReference',
						operator : 'eq',
						operatorValue : 'eq',
						value1 : encodeURIComponent(fedReference.replace(new RegExp("'", 'g'), "\''")),
						paramValue1 : encodeURIComponent(fedReference.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						paramValue2 : '',
						displayType : 5,
						fieldLabel : getLabel('fedReference','FED Reference Number'),
						displayValue1 : fedReference
					});
		}
		var blnAutoNumeric = true;
		// Operator
		var opFilter = $("select[id='amountOperator']").val();
		var opFilterDesc = '';
		if(opFilter == 'eq')
			opFilterDesc = 'Equal To ';
		else if(opFilter == 'gt')
			opFilterDesc = 'Greater Than ';
		else if(opFilter == 'lt')
			opFilterDesc = 'Less Than ';
		// Wire Amount
		var paymentAmount = $("input[type='text'][id='paymentAmount']").val();
		// jquery autoNumeric formatting
		blnAutoNumeric = isAutoNumericApplied("paymentAmount");
		if (blnAutoNumeric)
			paymentAmount = $("#paymentAmount").autoNumeric('get');
		else
			paymentAmount = $("#paymentAmount").val();
		// jquery autoNumeric formatting
		if (!Ext.isEmpty(paymentAmount)) {
			jsonArray.push({
						field : 'paymentAmount',
						paramName : 'paymentAmount',
						operator : 'eq',
						operatorValue : 'eq',
						value1 : encodeURIComponent(paymentAmount.replace(new RegExp("'", 'g'), "\''")),
						paramValue1 : encodeURIComponent(paymentAmount.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						paramValue2 : '',
						displayType : 5,
						fieldLabel : getLabel('paymentAmount','Amount'),
						displayValue1 : opFilterDesc+paymentAmount
					});
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
	/*toggleSavePrefrenceAction : function(isVisible) {
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
	},*/
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
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#entryDataPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('requestDate', 'Value Date') + "("
					+ me.dateFilterLabel + ")");
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
		
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([
						vFromDate, vToDate]);
			}
		} else {
				if (index === '1' || index === '2') {
					datePickerRef.setDateRangePickerValue(vFromDate);							
				} else {
					datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
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
				/*var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt'; */
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
				// Latest
				var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
			    var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));		
				 
				fieldValue1 = Ext.Date.format(
							fromDate,
							strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
							toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '14' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '13' :
				// Date Range
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
				} else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);
					operator = 'bt';
				}
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
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/paymentsummary/groupViewAdvanceFilter.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
				me.resetAllFields();
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
	},
	
	setGridInfo : function( grid )
	{
		var me = this;
		var groupView = me.getGroupView();
		var incomingWiresGrid = groupView.getGrid();
		if (!Ext.isEmpty(incomingWiresGrid)) {
			var dataStore = incomingWiresGrid.store;
			dataStore.on( 'load', function( store, records )
			{
				var summaryData = [];
				var ammount = "$0.00";
				var i = records.length - 1;
				if( i >= 0 )
				{
					
					
					if(NONUSUSER == "Y")
					{
						if(!Ext.isEmpty(records[ i ].get( 'drSummary' )))
							ammount = records[ i ].get( 'drSummary' );
						summaryData.push({
							key: "Incoming Drawdown",
							value: ammount
							}) 
							ammount = "$0.00";	
					}
					
					if(!Ext.isEmpty(records[ i ].get( 'crSummary' )))
					ammount = records[ i ].get( 'crSummary' );
					
					summaryData.push({
						key: "Incoming Wire",
						value: ammount
						}) 
					ammount = "$0.00";					
				}
				else
				{
					ammount = "$0.00";
					if(NONUSUSER == "Y")
					{
						summaryData.push({
							key: "Incoming Drawdown",
							value: ammount
							}) 
					}
					
					summaryData.push({
						key: "Incoming Wire",
						value: ammount
						}) 
				}
				
				$('#summaryCarousal').carousel({
					data : me.getJsonObj(summaryData),
					titleNode : "key",
					contentRenderer: function(value) {
						return  value.value;
					}								
				});	
			} );
		}
	},
	getJsonObj : function(jsonObject) {
		var jsonObj ='';
		if(jsonObject  instanceof Object ==false)
			jsonObj =JSON.parse(jsonObject);
		if(jsonObject  instanceof Array)
			jsonObj =jsonObject;
		for (var i = 0; i < jsonObj.length; i++) {
			jsonObj[i].key =  getLabel(jsonObj[i].key,jsonObj[i].key);
		}
		if(jsonObject  instanceof Object ==false)
			jsonObj = JSON.stringify(jsonObj)
		return jsonObj;
	},
	/*onIncomingWireSummaryInformationViewRender : function() {
		var me = this;
		var accSummInfoViewRef1 = me.getIncomingWiresGridInformationView();
		accSummInfoViewRef1.createSummaryLowerPanelView();
	},*/
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		var objDateLbl = {
				'' : getLabel('latest', 'Latest'),
				'12' : getLabel( 'latest', 'Latest' ),
				'1' : getLabel( 'today', 'Today' ),
                '2' : getLabel( 'yesterday', 'Yesterday' ),
                '3' : getLabel( 'thisweek', 'This Week' ),
                '4' : getLabel( 'lastweek', 'Last Week To Date' ),
                '5' : getLabel( 'thismonth', 'This Month' ),
                '6' : getLabel( 'lastmonth', 'Last Month To Date' ),
                '14' : getLabel('lastmonthonly', 'Last Month Only'),
                '8' : getLabel( 'thisquarter', 'This Quarter' ),
                '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
                '10' : getLabel( 'thisyear', 'This Year' ),
                '11' : getLabel( 'lastyeartodate', 'Last Year To Date' ),
				'13' : getLabel('daterange', 'Date Range')
		};
		if (!Ext.isEmpty(objIncomningWirePref)) {
			var objJsonData = Ext.decode(objIncomningWirePref);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.entryDate;
				var strDtFrmValue = data.quickFilter.entryDateFrom;
				var strDtToValue = data.quickFilter.entryDateTo;
				var strPaymentType = data.quickFilter.sendingBankFilter;
				
				if (!Ext.isEmpty(strPaymentType)) 
				{
					me.sendingBankFilterVal = strPaymentType
				}
				
				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
					if (strDtValue === '13') {
						if (!Ext.isEmpty(strDtFrmValue))
							me.dateFilterFromVal = strDtFrmValue;

						if (!Ext.isEmpty(strDtToValue))
							me.dateFilterToVal = strDtToValue;
					}
					else
					{
						var dtParams = me.getDateParam(strDtValue);
						if (!Ext.isEmpty(dtParams)
								&& !Ext.isEmpty(dtParams.fieldValue1)) {
							me.dateFilterFromVal = dtParams.fieldValue1;
							me.dateFilterToVal = dtParams.fieldValue2;
						}
					}
				}
				var clientSelected = data.filterClientSelected;
				me.clientFilterVal = clientSelected;
				arrJsn = me.createAndSetJsonForFilterData();
				var advFilterCode = data.advFilterCode;
				me.savedFilterVal = advFilterCode;
				me.doHandleSavedFilterItemClick(advFilterCode);
			}
		}	
		me.filterData = arrJsn;
	},
	createAndSetJsonForFilterData : function() {
		var me = this;
		var arrJsn = new Array();
		if (!Ext.isEmpty(me.dateFilterVal)) {
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			if (me.dateFilterVal !== '13') {
				var dtParams = me.getDateParam(me.dateFilterVal);
				if (!Ext.isEmpty(dtParams)
						&& !Ext.isEmpty(dtParams.fieldValue1)) {
					strOpt = dtParams.operator;
					strVal1 = dtParams.fieldValue1;
					strVal2 = dtParams.fieldValue2;
				}
			} else {
				strOpt = 'bt';
				if (!Ext.isEmpty(me.dateFilterVal)
						&& !Ext.isEmpty(me.dateFilterFromVal)) {
					strVal1 = me.dateFilterFromVal;

					if (!Ext.isEmpty(me.dateFilterToVal)) {
						// strOpt = 'bt';
						strVal2 = me.dateFilterToVal;
					}
				}
			}
			if ((!Ext.isEmpty(strVal1) && (strOpt === 'eq' || strOpt === 'le'))
					|| (!Ext.isEmpty(strVal1) && !Ext.isEmpty(strVal2) && strOpt === 'bt'))
				arrJsn.push({
							paramName : 'EntryDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
			}	
		if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'clientCode',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (me.sendingBankFilterVal != null && me.sendingBankFilterVal != 'all' && me.sendingBankFilterVal != 'All') {
			arrJsn.push({
							paramName : 'type',
							operatorValue : 'eq',
							paramValue1 : me.sendingBankFilterVal,
							dataType :'S'
					});
		}
		return arrJsn;
	},
	/*updateAdvFilterConfig : function()
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
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
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
	},*/
	generateUrlWithQuickFilterParams : function(me) {

		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
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
	handleSearchActionGridView : function(btn) {
		var me = this;
		var filterCode = $('#filterCode').val();
		me.savedFilterVal = filterCode;
		me.doAdvSearchOnly();
		me.updateSavedFilterComboInQuickFilter();
	},
	doAdvSearchOnly : function() {
		var me = this;
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.applyAdvancedFilter();
		me.refreshData();
		//me.resetAllFields();
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.doAdvSearchOnly();
			if (savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
		}
	},
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		// if (me.filterCodeValue === null) {
		var FilterCode = $("#savedFilterAs").val();
		if (Ext.isEmpty(FilterCode)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.filterCodeValue = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
		}
		// } else {
		// strFilterCodeVal = me.filterCodeValue;
		// }
		me.savePrefAdvFilterCode = strFilterCodeVal;
		// if (Ext.isEmpty(strFilterCodeVal)) {
		// paintError('#advancedFilterErrorDiv',
		// '#advancedFilterErrorMessage', getLabel('filternameMsg',
		// 'Please Enter Filter Name'));
		// return;
		// } else {
		hideErrorPanel("advancedFilterErrorDiv");
		me.postSaveFilterRequest(me.filterCodeValue, callBack);
		// }
	},
	handleSaveAndSearchGridAction : function(btn) {	
		var me = this;
		me.savedFilterVal = null;
		var callBack = this.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		var FilterCode = $("input[type='text'][id='filterCode']");
		
		if (Ext.isEmpty(FilterCode)) {
			Ext.MessageBox.alert('Input', 'Enter Filter Name');
			return;
		}
		strFilterCodeVal = FilterCode.val();
		me.savedFilterVal = strFilterCodeVal;
		
		if (Ext.isEmpty(strFilterCodeVal)) {
			if ($('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').removeClass('ui-helper-hidden');
				$('#advancedFilterErrorMessage').text(getLabel('filternameMsg',
						'Please Enter Filter Name'));
			}
		} else {
			if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
			}
			me.postSaveFilterRequest(strFilterCodeVal, callBack);
		}
	},
	/*closeGridViewFilterPopup : function(btn) {
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
	},*/
	applyAdvancedFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		groupView.refreshData();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);		
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
		    grid.loadGridData(strUrl, null);
		}
	},
	postDoSaveAndSearch : function() {
		var me = this, objGroupView = null, savedFilterCombobox = me
		.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
		if (savedFilterCombobox) {
			savedFilterCombobox.getStore().reload();
			savedFilterCombobox.setValue(me.filterCodeValue);
		}
		var objAdvSavedFilterComboBox = $("#msSavedFilter");
		if (objAdvSavedFilterComboBox) {
			blnOptionPresent = $("#msSavedFilter option[value='"
					+ me.filterCodeValue + "']").length > 0;
			if (blnOptionPresent === true) {
				objAdvSavedFilterComboBox.val(me.filterCodeValue);
			} else if (blnOptionPresent === false) {
				$(objAdvSavedFilterComboBox).append($('<option>', {
							value : me.filterCodeValue,
							text : me.filterCodeValue
						}));
		
				if (!Ext.isEmpty(me.filterCodeValue))
					arrValues.push(me.filterCodeValue);
				objAdvSavedFilterComboBox.val(arrValues);
				objAdvSavedFilterComboBox.multiselect("refresh");
			}
		}
		me.doAdvSearchOnly();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		var strUrl = 'userfilters/incomingWireFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, FilterCodeVal);
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal);
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
										buttonText: {
													ok: getLabel('btnOk', 'OK')
												} ,
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							filterGrid.getStore().reload();
							me.reloadFilters(filterGrid.getStore());
							me.updateSavedFilterComboInQuickFilter();
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
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										} ,
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
			},
			failure : function( response )
			{
				// console.log("Ajax Get data Call Failed");
			}
		} );
	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);
		var store = grid.getStore();
		if (!record) {
			return;
		}
		var index = rowIndex;
		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
			var beforeRecord = store.getAt(index);
			store.remove(beforeRecord);
			store.remove(record);

			store.insert(index, record);
			store.insert(index + 1, beforeRecord);
		} else {
			if (index >= grid.getStore().getCount() - 1) {
				return;
			}
			var currentRecord = record;
			store.remove(currentRecord);
			var afterRecord = store.getAt(index);
			store.remove(afterRecord);
			store.insert(index, afterRecord);
			store.insert(index + 1, currentRecord);
		}
		this.sendUpdatedOrederJsonToDb(store);
	},
	deleteFilterSet : function(filterCode) {
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore=null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;

		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			this.filterData = this.getQuickFilterQueryJson();
			me.refreshData();
		}
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
			savedFilterCombobox.setValue('');
		}
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();
		//store.reload();
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
				me.updateSavedFilterComboInQuickFilter();
			},
			failure : function() {
				console.log("Error Occured - Addition Failed");
			}
		});
	},
	/*updateAdvActionToolbar : function() {
		var me = this;
		Ext.Ajax.request({
			url : 'userpreferences/incomingwire/incomingGridViewAdvanceFilter.srvc?'+csrfTokenName+'='+csrfTokenValue,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);

				var filters = JSON.parse(responseData.preference);

				me.addAllSavedFilterCodeToView(filters.filters);

			},
			failure : function() {
				console.log("Error Occured - Addition Failed");
			}
		});
	},*/
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objJson;
		var strUrl = 'userfilters/incomingWireFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					headers: objHdrCsrfParams,
					method : 'GET',
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
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										} ,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var filterCodeRef = $("input[type='text'][id='filterCode']");
		var applyAdvFilter = false;
		me.filterCodeValue = filterCode;
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;
			var fieldVal = filterData.filterBy[i].value1;
			var fieldOper = filterData.filterBy[i].operator;
			
			if (fieldName === 'fedReference') {
				$("#fedReferenceNo").val(fieldVal);
			} else if (fieldName === 'customerRef') {
				$("#customerRef").val(fieldVal);
			} else if (fieldName === 'senderName') {
				$("#senderName").val(fieldVal);
			} else if (fieldName === 'paymentAmount') {
				$("#paymentAmount").val(fieldVal);
			} else if (fieldName === 'receiverAccNmbr') {
				$("#receiverAccNmbr").val(fieldVal);
				$("#receiverAccNmbr").niceSelect('update');
			} else if (fieldName === 'receiverAccName') {
                fieldVal = decodeURIComponent(fieldVal);
                me.checkUnCheckMenuItems(fieldName, fieldVal,fieldSecondVal);
			} else if (fieldName === 'amountOperator') {
				$("#amountOperator").val(fieldVal);
				$("#amountOperator").niceSelect('update');
			} else if (fieldName === 'drCrFlag') {
				$("#drCrFlag").val(fieldVal);
				$("#drCrFlag").niceSelect('update');
			} else if (fieldName === 'receivingBankFiId') {
				$("#receivingBankFiId").val(fieldVal);
				$("#receivingBankFiId").niceSelect('update');
			} else if (fieldName === 'sendingBank') {
				$("#sendingBank").val(fieldVal);
				$("#sendingBank").niceSelect('update');
			}
		}
		$("#filterCode").val(filterCode);
		me.enableDisableFields(true);
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
		//me.toggleSavePrefrenceAction(true);
	},
	/*getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		Ext.Ajax.request({
					url : 'userfilterslist/incomingWireFilter.srvc?'+csrfTokenName+'='+csrfTokenValue,
					method : 'GET',
					async:false,
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
	},*/
	handleSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
			me.postHandleSavePreferences, null, me, true);
			me.disablePreferencesButton("savePrefMenuBtn",true);
		}
		//me.savePreferences();
	},
	handleClearPreferences : function() {
		var me = this;
		//me.clearWidgetPreferences();
		me.disablePreferencesButton("savePrefMenuBtn",true);
		var arrPref = me.getPreferencesToSave(false);
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		me.disablePreferencesButton("savePrefMenuBtn",true);
		me.disablePreferencesButton("clearPrefMenuBtn",false);	
	},	
	/*savePreferences : function() {
		var me = this;
		var strUrl = me.commonPrefUrl;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			Ext.Ajax.request({
						url :  strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrPref),
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var isSuccess;
							var title, strMsg, imgIcon;
							if (responseData.d.preferences
									&& responseData.d.preferences.success)
								isSuccess = responseData.d.preferences.success;
							if (isSuccess && isSuccess === 'N') {
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : imgIcon
										});

							} else{
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : Ext.MessageBox.INFO
										});
								me.disablePreferencesButton("savePrefMenuBtn",true);
								me.disablePreferencesButton("clearPrefMenuBtn",false);
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
	},*/
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null;
          if(groupView){
		    grid=groupView.getGrid()
			var gridState=grid.getGridState();				
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};

			objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
				if(( groupInfo.groupTypeCode !== 'INCOMINGWIRE_OPT_ADVFILTER' || groupInfo.groupTypeCode == 'INCOMINGWIRE_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all'))
				{
					arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : groupInfo.groupTypeCode,
							subGroupCode : subGroupInfo.groupCode
						}
					});
					arrPref.push({
						"module" : subGroupInfo.groupCode,
						"jsonPreferences" : {
							 'gridCols' : gridState.columns,
							 'pgSize' : gridState.pageSize,
							 'sortState':gridState.sortState
						}
					});
				}
			}
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var advFilterCode = null;
		var objFilterPref = {};
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.sendingBankFilter = me.sendingBankFilterVal;
		objQuickFilterPref.sendingBankDesc = me.sendingBankDesc;
		objQuickFilterPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {		
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
		if (!Ext.isEmpty(me.clientFilterVal))
		{
			objFilterPref.filterClientSelected = me.clientFilterVal;
			objFilterPref.filterClientDesc = me.clientFilterDesc;
		}
		return objFilterPref;
	},
	/*clearWidgetPreferences : function() {
		var me = this;
		var strUrl = me.commonPrefUrl+"?$clear=true";
		var arrPref = me.getPreferencesToSave(false);
		
		if (arrPref) {
			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				jsonData : Ext.encode(arrPref),
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var isSuccess;
					var title, strMsg, imgIcon;
					if (responseData.d.preferences
							&& responseData.d.preferences.success)
						isSuccess = responseData.d.preferences.success;
					if (isSuccess && isSuccess === 'N') {
						title = getLabel('SaveFilterPopupTitle', 'Message');
						strMsg = responseData.d.preferences.error.errorMessage;
						imgIcon = Ext.MessageBox.ERROR;
						Ext.MessageBox.show({
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : imgIcon
								});

					} else {
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefClearedMsg',
											'Preferences Cleared Successfully'),
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : Ext.MessageBox.INFO
								});
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",true);
					}

				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
	},*/
	generateUrlWithAdvancedFilterParams : function(me) {
		var thisClass = this;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
	   // var strFilter = '&$filter=';
		var strFilter = '';
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
								|| operator === 'lk' || operator === 'gt' || operator === 'lt' || operator === 'in'))
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
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						//objValue = objValue.replace(reg, '');
						objValue = decodeURIComponent(objValue);
						var objArray = objValue.split(',');
						if (objArray.length > 0) {
							if (objArray[0] != 'All') {
								if (isFilterApplied) {
									strTemp = strTemp + ' and ';
								} else {
									isFilterApplied = true;
								}

								strTemp = strTemp + '(';
								for (var i = 0; i < objArray.length; i++) {
									strTemp = strTemp + filterData[index].field
											+ ' eq ';
									strTemp = strTemp + '\'' + objArray[i]
											+ '\'';
									if (i != objArray.length - 1)
										strTemp = strTemp + ' or ';
								}
								strTemp = strTemp + ')';
							}
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
		for (i = 0; i < filterData.filterBy.length; i++)
		{
			var fieldName = filterData.filterBy[i].field;
			var fieldOper = filterData.filterBy[i].operator;
			var fieldVal = filterData.filterBy[i].value1;
			var fieldSecondVal = filterData.filterBy[i].value2;
			if (fieldName === 'fedReference') {
				$("#fedReferenceNo").val(fieldVal);
			} else if (fieldName === 'paymentAmount') {
				$("#paymentAmount").val(fieldVal);
			} else if (fieldName === 'receiverAccNmbr') {
				fieldVal = decodeURIComponent(fieldVal);
				me.checkUnCheckMenuItems(fieldName, fieldVal,fieldSecondVal);
			} else if (fieldName === 'receiverAccName') {
				fieldVal = decodeURIComponent(fieldVal);
				me.checkUnCheckMenuItems(fieldName, fieldVal,fieldSecondVal);
			} else if (fieldName === 'amountOperator') {
				$("#amountOperator").val(fieldVal);
				$("#amountOperator").niceSelect('update');
			} else if (fieldName === 'drCrFlag') {
				$("#drCrFlag").val(fieldVal);
				$("#drCrFlag").niceSelect('update');
			}  else if (fieldName === 'sendingBank' || fieldName === 'senderBankName') {
				$("#sendingBank").val(fieldVal);
			}
		}
		$("#filterCode").val(filterCode);
		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
			$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
		}
		if (applyAdvFilter) {
			me.filterApplied = 'A';
			me.setDataForFilter();
			me.applyAdvancedFilter();
			//me.resetAllFields();
		}
	},
	handleType : function(btn)
	{
		var me = this;
		//me.toggleSavePrefrenceAction(true); 
	  //  me.toggleClearPrefrenceAction(true);
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
	handleReportAction : function( actionName )
	{
		var me = this;
		me.downloadReport( actionName );
	},
	downloadReport : function( actionName )
	{
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
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
		var temp = new Array();
		var counter = 0;
		var groupView = me.getGroupView();
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};

		strExtension = arrExtension[ actionName ];
		strUrl = 'services/getIncomingWireList/getIncomingWireDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
		var strQuickFilterUrl = me.getFilterUrl(subGroupInfo, groupInfo);
		strUrl += strQuickFilterUrl;
		var strOrderBy = me.reportGridOrder;
		if(!Ext.isEmpty(strOrderBy)){
			var orderIndex = strOrderBy.indexOf('orderby');
			if(orderIndex > 0){
				strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if(indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0,indexOfamp);
				strUrl += '&$'+strOrderBy;
			}				
		}	
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		// cnt counter startes with 2 as 0th and 1st column are action columns. (not GRID columns)
		for (var cnt = 1; cnt < grid.columns.length ; cnt ++)
		{
			if( grid.columns[cnt].hidden == false )
			{
				temp[counter++] = grid.columns[cnt];
			}
		}
		//viscols = grid.getAllVisibleColumns();
		viscols = temp;
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
	downloadDetailReport : function( record )
	{
		var me = this;
		var strUrl = '';

		strUrl = 'services/getIncomingWireList/getIncomingWireDetailReport.pdf';
		//strUrl += '?$skip=1';

		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
		//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'Recordkey', '15060400SZ9E' ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'Identifier', record.data.identifier ) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	},
	downloadCreditAdvice : function( record )
	{
		var me = this;
		var strUrl = '';

		strUrl = 'services/getIncomingWireList/generateCreditAdviceReport.pdf';
		//strUrl += '?$skip=1';

		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
		//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'Recordkey', '15060400SZ9E' ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.data.identifier ) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
			
	},
	applySeekFilter : function() {
		var me = this;
		//me.toggleSavePrefrenceAction(true);
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
	},
	handleAdvanceFilterCleanUp : function() {
		var me = this;
		var searchOrSaveFlag = me.SearchOrSave;
		if (!Ext.isEmpty(searchOrSaveFlag)) {
			if (searchOrSaveFlag) {
				me.resetAllFields();
				me.enableDisableFields(false);
				/*if (!Ext.isEmpty(objCreateNewFilterPanel)) {
					objCreateNewFilterPanel
							.resetAllFields(objCreateNewFilterPanel);
					objCreateNewFilterPanel.enableDisableFields(
							objCreateNewFilterPanel, false);
					objCreateNewFilterPanel.removeReadOnly(
							objCreateNewFilterPanel, false);
				}*/
			}
		}

	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		if (isSessionClientFilter)
		{
			me.clientFilterVal = selectedFilterClient;
		    code1 = me.clientFilterVal
		}
		else
		{
			me.clientFilterVal = isEmpty(selectedClient)
					? 'all'
					: selectedClient;
			code1 = me.clientFilterVal
		}
		me.clientFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},
	handleSendingBankFilterChange : function(combo) {
		var me = this;
		me.sendingBankFilterVal = combo.getValue();
		me.sendingBankDesc = combo.getRawValue();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.sendingBankFilterVal == 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid) {
			if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}
		}
		objGroupView.refreshData();		
	},
	handleEntryDateChange:function(filterType,btn,opts){
		var me=this;
		if(filterType=="entryDateQuickFilter"){
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.filterAppiled='Q';
			me.setDataForFilter();
			me.applyQuickFilter();
		}
	},
	reloadFilters: function(store){
		store.reload({
					callback : function() {
						var storeGrid = filterGridStore();
						store.loadRecords(
								storeGrid.getRange(0, storeGrid
												.getCount()), {
									addRecords : false
								});

					}
			});
	},
	resetAllFields : function() {
		var me = this;
		$("input[type='text'][id='paymentAmount']").val("");
		$("input[type='text'][id='fedReferenceNo']").val("");
		/*$("#receiverAccNmbr").val('');
		$("#receiverAccNmbr").niceSelect('update');*/
		//$("#receiverAccName").val('');
		//$("#receiverAccName").niceSelect('update');
		$("#amountOperator").val('eq');
		$("#amountOperator").niceSelect('update');
		$("#drCrFlag").val('');
		$("#drCrFlag").niceSelect('update');
		$("#sendingBank").val("");			
		$("input[type='text'][id='filterCode']").val("");
		$("input[type='text'][id='filterCode']").prop('disabled', false);
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		$("#savedFilterAslbl").removeClass("required");		
		removeMarkRequired('#savedFilterAs');
		
		//$('#entryDataPicker').val("");
		
		if(me.clientFilterDesc !='all'){				
			if(isClientUser()){
				var clientComboBox = me.getIncomingWiresFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			} else {
				var clientComboBox = me.getIncomingWiresFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
		
		if (!Ext.isEmpty(me.getSendingBankFilterAuto())) {
			me.getSendingBankFilterAuto().setValue('');
		}
		resetAllMenuItemsInMultiSelect("#receiverAccName")
		me.enableDisableFields(false);
	},
	handleClearSettings : function() {
		var me = this;
		//var clientComboBox = me.getIncomingWiresFilterView().down('combo[itemId="quickFilterClientCombo"]');
		me.clientFilterVal = 'all';
		me.savedFilterVal='';
		//clientComboBox.setValue(me.clientFilterVal);
		
		var sendingBankLst = me.getIncomingWiresFilterView().down('combobox[itemId=sendingBankLst]');
		sendingBankLst.setValue('');
		me.getSendingBankFilterAuto().setValue('');
		var savedFilterComboBox = me.getIncomingWiresFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		var entryDate = me.getIncomingWiresFilterView()
				.down('component[itemId="entryDate"]');
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.getDateLabel().setText(getLabel('requestDate', 'Value Date')+ me.dateFilterLabel);
		me.handleDateChange(me.dateFilterVal);
		var datePickerRef = $('#entryDataPicker');
		var toDatePickerRef = $('#entryDataToPicker');
		//datePickerRef.val('');
		toDatePickerRef.val('');		
		me.filterApplied = 'ALL';
		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();
	},
	updateSavedFilterComboInQuickFilter : function() {
		var me = this;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterCombobox)) {
			me.reloadFilters(savedFilterCombobox.getStore());
			if (me.savedFilterVal == null) {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
		}
	},
	
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.resetAllFields();
			me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
		}
		me.showAdvFilterCode = filterCode;
		me.savePrefAdvFilterCode = filterCode;
	},
	enableDisableFields : function(booleanFlag) {
		$("input[type='text'][id='fedReferenceNo']").prop('disabled', booleanFlag);
		$("input[type='text'][id='paymentAmount']").prop('disabled', booleanFlag);
		$("input[type='text'][id='receiverCharges']").prop('disabled', booleanFlag);
		$("input[type='text'][id='filterCode']").prop('disabled', booleanFlag);
		//$("#receiverAccNmbr_jq").prop('disabled', booleanFlag);
		$("#receiverAccName_jq").prop('disabled', booleanFlag);
		$("#amountOperator").prop('disabled', booleanFlag);
		$("#drCrFlag").prop('disabled', booleanFlag);
		$("#sendingBank").prop('disabled', booleanFlag);
	},
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			$("#"+btnId).css("color",'grey');
		else
			$("#"+btnId).css("color",'#FFF');
	},
	doHandleContainerCollapse: function(){
		
		$('span.fa').toggleClass("fa-caret-up fa-caret-down");
		
		$('#personalDetailsInfoDiv1,#personalDetailsInfoDiv2,#personalDetailsInfoDiv3,#personalDetailsInfoDiv4')
			.toggle();
		$('#personalDetailsInfoDiv6,#personalDetailsInfoDiv7').toggle();
		$('#personalDetailsInfoDiv8,#personalDetailsInfoDiv9,#personalDetailsInfoDiv10,#personalDetailsInfoDiv11')
			.toggle();
		
		$("#personalDetailsInfoCaret1").click(function() {
	    	$('#personalDetailsInfoCaret1').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv1').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret2").click(function() {
	    	$('#personalDetailsInfoCaret2').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv2').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret3").click(function() {
	    	$('#personalDetailsInfoCaret3').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv3').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret4").click(function() {
	    	$('#personalDetailsInfoCaret4').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv4').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret5").click(function() {
	    	$('#personalDetailsInfoCaret5').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv5').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret6").click(function() {
	    	$('#personalDetailsInfoCaret6').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv6').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret7").click(function() {
	    	$('#personalDetailsInfoCaret7').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv7').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret8").click(function() {
	    	$('#personalDetailsInfoCaret8').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv8').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret9").click(function() {
	    	$('#personalDetailsInfoCaret9').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv9').toggle();
	    	return false;
	    });
		
		$("#personalDetailsInfoCaret10").click(function() {
	    	$('#personalDetailsInfoCaret10').toggleClass("fa-caret-up fa-caret-down");
	     	$('#personalDetailsInfoDiv10,#personalDetailsInfoDiv11').toggle();
	    	return false;
	    });
	},
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if(componentName === 'receiverAccNmbr'){
			menuRef = $("select[id='receiverAccName']");
			elementId = '#receiverAccName';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");
			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}
			
			var dataArray;
			
			if(Ext.isNumeric(data))
				dataArray = [data];
			else
				dataArray = data.split(',');
						
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (dataArray[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=" + itemArray[index].value
								+ "]").prop("selected", true);
						break;
					}
				}
			}
			$(elementId).multiselect("refresh");
			
			}
	}
});