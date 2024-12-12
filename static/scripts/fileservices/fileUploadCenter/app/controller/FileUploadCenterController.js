Ext.define('GCP.controller.FileUploadCenterController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.FileUploadCenterGridView','Ext.ux.gcp.DateHandler'],
	views : ['GCP.view.FileUploadCenterView',
				'GCP.view.FileUploadCenterAdvancedFilterPopup',
				'Ext.ux.gcp.AutoCompleter','Ext.tip.ToolTip'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'fileUploadCenterView',
				selector : 'fileUploadCenterView'
			},
			{
				ref : 'groupView',
				selector : 'fileUploadCenterView groupView'
			},
			{
				ref : 'fileUploadCenterFilterView',
				selector : 'fileUploadCenterFilterView'
			},
	        {
				ref : 'fileUploadCenterGridViewRef',
				selector : 'fileUploadCenterView fileUploadCenterGridView grid[itemId="gridViewMstId"]'
			},
			{
				ref : 'fileUploadCenterDtlView',
				selector : 'fileUploadCenterView fileUploadCenterGridView panel[itemId="fileUploadCenterDtlViewId"]'
			},
			{
				ref : 'fileUploadCenterGridView',
				selector : 'fileUploadCenterView fileUploadCenterGridView'
			}, 
			{
				ref : 'matchCriteria',
				selector : 'fileUploadCenterGridView radiogroup[itemId="matchCriteria"]'
			},
			{
				ref : 'searchTxnTextInput',
				selector : 'fileUploadCenterGridView textfield[itemId="searchTxnTextField"]'
			},
			{
				ref : 'fileUploadCenterView',
				selector : 'fileUploadCenterView'
			},
			{
				ref : 'fromDateLabel',
				selector : 'fileUploadCenterView fileUploadCenterFilterView label[itemId="dateFilterFrom"]'
			},
			{
				ref : 'toDateLabel',
				selector : 'fileUploadCenterView fileUploadCenterFilterView label[itemId="dateFilterTo"]'
			},
			{
				ref : 'dateLabel',
				selector : 'fileUploadCenterView fileUploadCenterFilterView label[itemId="dateLabel"]'
			},
			{
				ref : 'fromUploadDate',
				selector : 'fileUploadCenterView fileUploadCenterFilterView datefield[itemId="fromDate"]'
			},
			{
				ref : 'toUploadDate',
				selector : 'fileUploadCenterView fileUploadCenterFilterView datefield[itemId="toDate"]'
			},
			{
				ref : 'dateRangeComponent',
				selector : 'fileUploadCenterView fileUploadCenterFilterView container[itemId="dateRangeComponent"]'
			},
			{
				ref : 'uploadDate',
				selector : 'fileUploadCenterView fileUploadCenterFilterView button[itemId="uploadDate"]'
			},
			{
				ref : 'advFilterActionToolBar',
				selector : 'fileUploadCenterView fileUploadCenterFilterView toolbar[itemId="advFilterActionToolBar"]'
			},
			{
				ref : 'btnSavePreferences',
				selector : 'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnSavePreferences"]'
			},
			{
				ref : 'btnClearPreferences',
				selector : 'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnClearPreferences"]'
			},
			{
				ref : 'fileUploadCenterTypeToolBar',
				selector : 'fileUploadCenterView fileUploadCenterFilterView toolbar[itemId="fileUploadCenterTypeToolBar"]'
			},
			{
				ref : 'withHeaderCheckbox',
				selector : 'fileUploadCenterView fileUploadCenterTitleView menuitem[itemId="withHeaderId"]'
			},
			{
				ref : 'advanceFilterPopup',
				selector : 'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"]'
			},
			{
				ref : 'advanceFilterTabPanel',
				selector : 'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
			}, {
				ref : 'createNewFilter',
				selector : 'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] fileUploadCenterCreateNewAdvFilter'
			},
			{
				ref : 'filterDetailsTab',
				selector : 'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			},
			{
				ref : 'advFilterGridView',
				selector : 'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] fileUploadCenterAdvFilterGridView'
			},
			{
				ref : 'saveSearchBtn',
				selector : 'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] fileUploadCenterCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
			},
			{
				ref : 'fileUploadDtlRef',
				selector : 'fileUploadPopUp[itemId="fileUploadPopupId"] container[itemId="fileUploadItemId"]'
			},
			{
				ref : 'fileUploadRef',
				selector : 'fileUploadPopUp[itemId="fileUploadPopupId"]'
			},
			{
				ref : 'statusLabel',
				selector : 'fileUploadCenterView fileUploadCenterFilterView label[itemId="strStatusValue"]'
			},
			{
				ref : 'taskStatusItemId',
				selector : 'fileUploadCenterView fileUploadCenterFilterView button[itemId="taskStatusItemId"]'
			},
			{
				ref : 'sellerClientMenuBar',
				selector : 'fileUploadCenterView fileUploadCenterFilterView panel[itemId="sellerClientMenuBar"]'
			},
			{
				ref : 'withHeaderCheckboxRef',
				selector : 'fileUploadCenterTitleView menuitem[itemId="withHeaderId"]'
			}],
	config : {
		filterData : [],
		advFilterData : [],
		typeFilterVal : 'All',		
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		typeFilterDesc : 'All',
		dateFilterVal : '12',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		dateFilterLabel : getLabel('latest', 'Latest'),
		gridInfoDateFilterLabel : getLabel( 'today', 'Today' ),
		dateHandler : null,
		commonPrefUrl : 'services/userpreferences/fileUpload.json',
		urlGridFilterPref : 'services/userpreferences/fileUploadCenter.json',
		strModifySavedFilterUrl : 'services/userfilters/fileUploadCenter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/fileUploadCenter/{0}/remove.json',
		strCommonPrefUrl : 'services/userpreferences/fileUploadCenter.json',
		strGetModulePrefUrl : 'services/userpreferences/fileUploadCenter/{0}.json',
		strBatchActionUrl : 'services/templatesbatch/{0}.json',
		strAdvFilterUrl : 'services/userpreferences/fileUploadCenter/groupViewAdvanceFilter.json',
		objUploadFilePopup : null,
		objAdvFilterPopup: null,
		sellerVal : null,
		reportGridOrder : null,
		sellerFilterVal : null,
		clientFilterVal : null,
		clientFilterDesc: null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		this.dateHandler = Ext.create('Ext.ux.gcp.DateHandler');
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		//clientFromDate = me.dateHandler.getDateBeforeDays(date);
		var btnClearPref = me.getBtnClearPreferences();
		if(btnClearPref)
		{
			btnClearPref.setEnabled(false);
		}
		me.updateFilterConfig();
		me.updateAdvFilterConfig();
		me.objAdvFilterPopup = Ext.create('GCP.view.FileUploadCenterAdvancedFilterPopup', {
			parent : 'fileUploadCenterView',
			itemId : 'gridViewAdvancedFilter',
			filterPanel : {
				xtype : 'fileUploadCenterCreateNewAdvFilter',
				margin : '4 0 0 0',
				callerParent : 'fileUploadCenterView'
			}
		});
		me.objUploadFilePopup = Ext.create( 'GCP.view.FileUploadPopUp',
				{
					parent : 'fileUploadCenterView',
					itemId : 'fileUploadPopupId'
				} );
		me.control({		
			'fileUploadCenterView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					 me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo,
						tabPanel, newCard, oldCard) {
					me.toggleSavePrefrenceAction(true);
					me.toggleClearPrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridStateChange' : function(grid) {
					me.toggleSavePrefrenceAction(true);
				},
				'gridRowActionClick' : function(grid, rowIndex,
						columnIndex, actionName, record) {
					me.handleRowIconClick(actionName, grid, record);
				},
				'groupActionClick' : function(actionName,
						isGroupAction, maskPosition, grid,
						arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'render' : function() {
					if (objFileUploadCenterPref) {
						var objJsonData = Ext.decode(objFileUploadCenterPref);
						objGroupByPref = objJsonData.d.preferences.groupByPref;
						if (!Ext.isEmpty(objGroupByPref)) {
							me.toggleSavePrefrenceAction(false);
							me.toggleClearPrefrenceAction(true);
						}
					}
				}
			},
					
			
			'fileUploadCenterView' : {
			beforerender : function(panel, opts) {
			},
			afterrender : function(panel, opts) {
			},
			uploadFileEvent : function(btn) {
				me.handleFileUpload(btn);
			},
			performReportAction : function( btn, opts )
			{
				me.handleReportAction( btn, opts );
			}
		},
			'fileUploadCenterView fileUploadCenterFilterView' : {
				render : function(panel, opts) {
					me.setInfoTooltip();
					me.getAllSavedAdvFilterCode(panel);
					me.showHideSellerClientMenuBar(entityType);
				},
				filterType : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleType(btn);
					me.updateStatusFilterView();
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
				handleClientCodeChange : function(client, clientDesc) {
					me.handleClientChange(client, clientDesc);
				},
				handleClientChange : function(client, clientDesc) {
					if(client === 'all')
					{
						me.clientFilterVal  = '';
						me.clientFilterDesc = '';
					}
					else
					{
						me.clientFilterVal  = client;
						me.clientFilterDesc = clientDesc;
					}
					me.applySeekFilter();
					
				},
				resetClientChange : function() {
					me.handleClientChange(null, null);
				}
			},
			'fileUploadCenterView fileUploadCenterFilterView toolbar[itemId="statusToolBar"]' :
			{
				afterrender : function( tbar, opts )
				{
					me.updateStatusFilterView();
				}
			},
			'fileUploadCenterView fileUploadCenterFilterView toolbar[itemId="dateToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.updateDateFilterView();
				}
			},
			'fileUploadCenterView fileUploadCenterFilterView button[itemId="goBtn"]' : {
				click : function(btn, opts) {
					var frmDate = me.getFromUploadDate().getValue();
					var toDate = me.getToUploadDate().getValue();
					
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
			'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
					me.toggleClearPrefrenceAction(true);
				}
			},
			'fileUploadCenterView fileUploadCenterFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleClearPreferences();
					me.toggleClearPrefrenceAction(false);
				}
			},
			'fileUploadCenterView fileUploadCenterTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				},
				afterrender : function() {
				}
			},
			'fileUploadCenterView fileUploadCenterFilterView button[itemId="newFilter"]' : {
				click : function(btn, opts) {
					me.advanceFilterPopUp(btn);
				}
			},
			'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] fileUploadCenterCreateNewAdvFilter' : {
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
				},
				handleResetAction : function(objShow){
					me.handleResetAction(objShow);
				}
				
			},
			'fileUploadCenterAdvancedFilterPopup[itemId="gridViewAdvancedFilter"] fileUploadCenterAdvFilterGridView' : {
				orderUpGridEvent : me.orderUpDown,
				deleteGridFilterEvent : me.deleteFilterSet,
				viewGridFilterEvent : me.viewFilterData,
				editGridFilterEvent : me.editFilterData
			},
			'fileUploadCenterView fileUploadCenterFilterView toolbar[itemId="advFilterActionToolBar"]' : {
				handleSavedFilterItemClick : me.handleFilterItemClick

			},
			'fileUploadCenterView fileUploadCenterFilterView combo[itemId="sellerCodeID"]' : {
				change : function( combo, record, index )
				{
					 if( record == null )
	                 {
                        me.filterApplied = 'ALL';
                        me.applySeekFilter();
	                 }
					 var objFilterPanel = me.getSellerClientMenuBar();
					 var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeId"]' );
					 objAutocompleter.cfgUrl = 'services/userseek/clientCodeSeekAdmin.json';
					 objAutocompleter.setValue( '' );
					 objAutocompleter.cfgExtraParams = [{key : '$sellerCode', value : record }];
					 me.applySeekFilter();
				}
			},
			'fileUploadCenterView fileUploadCenterFilterView combo[itemId="clientCodeComboId"]' : {
				change : function( combo, record, index )
				{
                    me.filterApplied = 'ALL';
                    me.applySeekFilter();
	                    
				}
			}
		});
	},
	
	
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;
	},
	handleClientChange : function(client, clientDesc) {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();

		me.filterApplied = 'Q';
		me.advFilterData = null;

		me.clientFilterVal = client;
		me.clientFilterDesc = clientDesc;
		me.advFilterSelectedClientCode = client;
		me.advFilterSelectedClientDesc = clientDesc;

		// TODO: To be handled
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
				objGroupView.setActiveTab('all');
			} else
				me.refreshData();
		} else {
			me.filterApplied = 'Q';
			me.applyQuickFilter();
		}
		me.toggleSavePrefrenceAction(true);
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
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) { 	
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			if (groupInfo.groupTypeCode === 'ADVFILTER') {
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode !== 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						me.savedFilterVal = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.doHandleSavedFilterItemClick(strFilterCode);
					}
				} else {
					me.savedFilterVal = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
					var gridModel = {
						showCheckBoxColumn : false
					};
					objGroupView.reconfigureGrid(gridModel);
				}

			} else {
				args = {
					scope : me
				};
				strModule = subGroupInfo.groupCode;
				strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				me.getSavedPreferences(strUrl,
						me.postHandleDoHandleGroupTabChange, args);
			}
		}

	},
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
		}
		me.showAdvFilterCode = filterCode;
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getFileUploadCenterView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			colModel = objSummaryView.getColumnModel(arrCols);
			arrSortState = objPref.sortState;
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					showCheckBoxColumn : false,
					storeModel : {
						sortState : arrSortState
					}
				};
			}
		} else {
			gridModel = {
				showCheckBoxColumn : false
			};
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.reportGridOrder = strUrl;
		me.setDataForFilter();
		strUrl = strUrl + me.generateFilterUrl(subGroupInfo, groupInfo);
		strUrl = strUrl + '&' + csrfTokenName + '=' + csrfTokenValue;
		strUrl += me.generateColumnFilterUrl(filterData,strUrl);
		grid.loadGridData(strUrl, null, null, false);
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
						eventObj) {
					me.handleGridRowDoubleClick(record, grid);
				});
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
		} else {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
			strAdvancedFilterUrl = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				if (Ext.isEmpty(strUrl)) {
					strUrl = "&$filter=";
				}
				strUrl += strAdvancedFilterUrl;
				isFilterApplied = true;
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
	generateColumnFilterUrl : function(filterData,url) {
		var strUrl = '', strTempUrl = '';
		var obj = null, arrValues = null;
		var arrNested = null
		if (filterData) {
			for (var key in filterData) {
				obj = filterData[key] || {};
				arrValues = obj.value || [];
				if (obj.type === 'list') {
					Ext.each(arrValues, function(item) {
								if (item) {
									arrNested = item.split(',');
									Ext.each(arrNested, function(value) {
												strTempUrl += strTempUrl
														? ' or '
														: '';
												strTempUrl += arrSortColumn[key]
														+ ' eq \''
														+ value
														+ '\'';
											});
								}
							});
					if (strTempUrl)
						strTempUrl = '( ' + strTempUrl + ' )';
				}
			}
		}
		if (strTempUrl)
		{
		 if(!Ext.isEmpty(url) && url.indexOf('$filter')> -1)
		   {
			strUrl = ' and ' + strTempUrl;
			}
			else
			{
			  strUrl ='&$filter=' + strTempUrl;
			}
			
		}
		return strUrl;

	},
	handleRowIconClick : function(actionName, grid, record) {
		var me = this;
		if (actionName === 'btnViewError' || actionName === 'btnViewRepair') {    //Redirect to Payment center is not available in other module .hence to maintain the consistency the change has been done and remeoved from Payment
			me.showErrorReport(record);
		} else if (actionName === 'btnViewOk') {
			me.viewPaymentRejectRepair(record);
		}
	},
	viewPaymentRejectRepair : function(record)
	{
		var me = this;
		var strUrl = 'editMultiPayment.form';
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',record.get('paymentIdentifier')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',record.get('phdProduct')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPaymentType','BB'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',record.get('phdNumber')));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild( form );
	},
	viewUploadedFile : function(record)
	{
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		strUrl = "viewUploadedFile.srvc";
		form.appendChild( me.createFormField('INPUT', 'HIDDEN', 'recordKeyNo', record.get('recordKeyNo')));
		form.appendChild( me.createFormField('INPUT', 'HIDDEN', 'ahtskSrc', record.get('ahtskSrc')));
		form.appendChild( me.createFormField('INPUT', 'HIDDEN', 'ahtskid', record.get('ahtskid')));
		form.appendChild( me.createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild( form );
	},
	showErrorReport : function(record)
	{
		/*Ext.create( 'GCP.view.FileUploadErrorPopUp',
			{
				record : record,
				url:'fileUploadCenterList/errorReport.srvc?'+ csrfTokenName + "=" + csrfTokenValue,
				identifier : record.get("identifier"),
				ahtskid:record.get("ahtskid")
			} ).show();*/
		var me = this;
		var strUrl = 'services/getFileUploadCenterList/getUploadErrorReport.pdf'
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.get("ahtskdata") ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', record.get("ahtskclient") ) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
			
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getFileUploadCenterGridViewRef();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			me.getFileUploadCenterGridViewRef().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	applyQuickFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
	setDataForFilter : function() {
		var me = this;
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
		var strQuickFilterUrl = '',  strUrl = '', isFilterApplied = 'false',strAdvFilterUrl ='';
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
		else
		{
			strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
			
			if(!Ext.isEmpty(strAdvFilterUrl))
			{
				strUrl += strAdvFilterUrl;
				isFilterApplied = true;
			}else{
				strUrl = '&$filter=' ;
			}
			return strUrl;
		}
	},
	generateUrlWithAdvancedFilterParams : function( me )
	{
		var thisClass = this;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;

		if( !Ext.isEmpty( filterData ) )
		{
			for( var index = 0 ; index < filterData.length ; index++ )
			{
				isInCondition = false;
				operator = filterData[ index ].operator;
				if( isFilterApplied
					&& ( operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'gt' || operator === 'lt' ) )
					strTemp = strTemp + ' and ';
				switch( operator )
				{
					case 'bt':
						isFilterApplied = true;
						if( filterData[ index ].dataType === 1 )
						{
							strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
								+ ' ' + 'date\'' + filterData[ index ].value1 + '\'' + ' and ' + 'date\''
								+ filterData[ index ].value2 + '\'';
						}
						else
						{
							strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
								+ ' ' + '\'' + filterData[ index ].value1 + '\'' + ' and ' + '\''
								+ filterData[ index ].value2 + '\'';
						}
						break;
					case 'st':
						if( !isOrderByApplied )
						{
							strTemp = strTemp + ' &$orderby=';
							isOrderByApplied = true;
						}
						else
						{
							strTemp = strTemp + ',';
						}
						strTemp = strTemp + filterData[ index ].value1 + ' ' + filterData[ index ].value2;
						break;
					case 'lk':
						isFilterApplied = true;
						strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
							+ ' ' + '\'' + filterData[ index ].value1 + '\'';
						break;
					case 'eq':
						isInCondition = this.isInCondition( filterData[ index ] );
						if( isInCondition )
						{
							var reg = new RegExp( /[\(\)]/g );
							var objValue = filterData[ index ].value1;
							objValue = objValue.replace( reg, '' );
							var objArray = objValue.split( ',' );
							isFilterApplied = true;
							for( var i = 0 ; i < objArray.length ; i++ )
							{
								strTemp = strTemp + filterData[ index ].field + ' '
									+ filterData[ index ].operator + ' ' + '\'' + objArray[ i ] + '\'';
								if( i != objArray.length - 1 )
									strTemp = strTemp + ' or '
							}
							break;
						}
					case 'gt':
					case 'lt':
						isFilterApplied = true;
						if( filterData[ index ].dataType === 1 )
						{
							strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
								+ ' ' + 'date\'' + filterData[ index ].value1 + '\'';
						}
						else
						{
							strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
								+ ' ' + '\'' + filterData[ index ].value1 + '\'';
						}
						break;
				}
			}
		}
		if( isFilterApplied )
		{
			strFilter = strFilter + strTemp;
		}
		else if( isOrderByApplied )
		{
			strFilter = strTemp;
		}
		else
		{
			strFilter = '';
		}
		return strFilter;
	},
	isInCondition : function( data )
	{
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp( /^\((\d\d*,)*\d\d*\)$/ );
		if( displayType && displayType === 4 && strValue && strValue.match( reg ) )
		{
			retValue = true;
		}
		return retValue;
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var actionFilterVal = this.actionFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(index != '12')
		{
			jsonArray.push({
						paramName : me.getUploadDate().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
			});
		}
		if( me.typeFilterVal != null && me.typeFilterVal != 'All' )
		{
			jsonArray.push(
			{
				paramName : me.getTaskStatusItemId().filterParamName,
				paramValue1 : me.typeFilterVal,
				operatorValue : 'eq',
				dataType : 'S'
			} );
		}
		if (!Ext.isEmpty(me.clientFilterVal) &&  me.clientFilterVal !== null) 
			{
				jsonArray.push({
						paramName : 'clientCode',
						operatorValue : 'eq',
						paramValue1 : me.clientFilterVal,
						dataType :'S'
				});
			}
		var objOfCreateNewFilter = me.getSellerClientMenuBar();
		if (!Ext.isEmpty(objOfCreateNewFilter)){
			if(entityType === '1')
			{
				var clientCodeComboId = objOfCreateNewFilter.down('combobox[itemId="clientCodeComboId"]');
				if (!Ext.isEmpty(clientCodeComboId)) 
				{
					var clientCodeComboValue = objOfCreateNewFilter.down('combobox[itemId="clientCodeComboId"]').getValue();
					if (!Ext.isEmpty(clientCodeComboValue) && clientCodeComboValue !== null) 
					{
						jsonArray.push({
								paramName : 'clientCode',
								operatorValue : 'eq',
								paramValue1 : clientCodeComboValue,
								dataType :'S'
						});
						me.clientFilterVal = clientCodeComboValue;
					}
				}
			}
		}
		return jsonArray;
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

		var grid = me.getFileUploadCenterGridViewRef();
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
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '000';
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
		actionMask = doAndOperation(maskArray, 3);
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoGridView',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var fileUploadCenterFilterView = me.getFileUploadCenterFilterView();
							var client;
							var clientCombo = fileUploadCenterFilterView.down('combobox[itemId="clientCodeId"]');
							var paymentTypeVal = '';
							var paymentActionVal = '';
							var dateFilter = me.dateFilterLabel;
							if (!Ext.isEmpty(clientCombo) && 
								!Ext.isEmpty(clientCombo.getValue())) {
								client = clientCombo.rawValue;
							} else {
								client = getLabel('none', 'None');
							}
							if (me.typeFilterVal == 'all' && me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								paymentTypeVal = me.paymentTypeFilterDesc;
							}

							if (me.paymentActionFilterVal == 'all') {
								paymentActionVal = 'All';
							} else {
								paymentActionVal = me.paymentActionFilterDesc;
							}
							if (entityType == 0) {
								tip.update(getLabel("grid.column.company", "Company Name")
										+ ' : ' + client + '<br/>' +getLabel( 'date', 'Date' ) +':'+dateFilter+'<br/>'
										+ 'Type : '+me.typeFilterVal+'<br/>');
							}
							else {
									if(me.clientFilterDesc == "" || me.clientFilterDesc == null)
										client = 'All Companies';
									else
										client = me.clientFilterDesc; 
								tip.update(getLabel("grid.column.company", "Company Name")+ " : "+client+'<br>'+'Date : '+dateFilter+'<br/>' + 'Type : '+me.typeFilterVal+'<br/>');
							}
						}
					}
				});
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
		// TODO : To be handled
		var arrStdViewPref = {};

		var objMainNode = {};
		var objpreferences = {};
		objpreferences.preferences = arrStdViewPref;
		objMainNode.d = objpreferences;
		/*
		 * me.localPreHandler.fireEvent('savePreferencesToLocal', objMainNode,
		 * isVisible, me.pageKey);
		 */
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
					me.getFromUploadDate().setValue(dtEntryDate);
				}
				if (!Ext.isEmpty(me.dateFilterToVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
					me.getToUploadDate().setValue(dtEntryDate);
				}
			}
		}

	},
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		//var datePickerRef = $('#importDateQuickPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('importDate',
					'Upload Date')
					+ " (" + me.dateFilterLabel + ")");
		}

		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
				
		if (index == '7') {
		var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
					strExtApplicationDateFormat ));
			me.getDateRangeComponent().show();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();
			if(me.getFromUploadDate().getValue()== null)
				me.getFromUploadDate().setValue(dtEntryDate);
			if(me.getToUploadDate().getValue()== null)
				me.getToUploadDate().setValue(dtEntryDate);
			//me.getFromEntryDate().setMinValue(clientFromDate);
			//me.getToEntryDate().setMinValue(clientFromDate);
			
		} else {
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().show();
			me.getToDateLabel().show();
		}
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				fromDateLabel.setText(vFromDate);
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
			}
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12') {
					fromDateLabel.setText('' + '  ' + vFromDate);
				} else 
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
		var strSqlDateTimeFormat = 'Y-m-d h:i:s';
		var dateTime = new Date(Ext.Date.parse(dtApplicationDateTime, strSqlDateTimeFormat));
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
				// Last Week TO Date
				dtJson = objDateHandler.getLastWeekStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month TO Date
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
			if(me!=undefined && me.getFromUploadDate()!=undefined  && me.getFromUploadDate()!=undefined !=null &&
			me.getFromUploadDate().getValue()!=null )
			{
				// Date Range
				var frmDate = me.getFromUploadDate().getValue();
				var toDate = me.getToUploadDate().getValue();
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
			}
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
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		var objDateLbl = {
			'12' : getLabel( 'latest', 'Latest' ),
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel( 'lastweek', 'Last Week To Date' ),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel( 'lastmonth', 'Last Month To Date' ),
			'7' : getLabel('daterange', 'Date Range'),
            '8' : getLabel( 'thisquarter', 'This Quarter' ),
            '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
            '10' : getLabel( 'thisyear', 'This Year' ),
            '11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
		};
		if (!Ext.isEmpty(objFileUploadCenterPref)) {
			var objJsonData = Ext.decode(objFileUploadCenterPref);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.importDate;
				var strDtFrmValue = data.quickFilter.entryDateFrom;
				var strDtToValue = data.quickFilter.entryDateTo;

				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
				
					if (strDtValue === '7') {
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
			/*
			 * if (me.dateFilterVal === '12') { // do nothing. } else
			 */if (me.dateFilterVal !== '13') {
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
							paramName : 'uploadDateFilter',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
		}
		
		if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'Client',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		return arrJsn;
	},
	updateAdvFilterConfig : function()
	{
		var me = this;
		if( !Ext.isEmpty( objFileUploadCenterPref ) )
		{
			var data = Ext.decode( objFileUploadCenterPref );
			if( !Ext.isEmpty( data.advFilterCode ) )
			{
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/fileUploadCenter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, data.advFilterCode );
				Ext.Ajax.request(
				{
					url : strUrl,
					async : false,
					method : 'GET',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var applyAdvFilter = false;
						me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
						var objOfCreateNewFilter = me.getCreateNewFilter();
						var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );

						me.advFilterData = objJson;
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
	handleSavePreferences : function() {
		var me = this;
		me.savePreferences();
	},
	handleClearPreferences : function() {
		var me = this;
		me.clearWidgetPreferences();
	},
	
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null;
		if (groupView) {
			grid = groupView.getGrid()
			var gridState = grid.getGridState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};

			objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
			// TODO : Save Active tab for group by "Advanced Filter" to be
			// discuss
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode
					&& groupInfo.groupTypeCode !== 'ADVFILTER') {
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
								'sortState' : gridState.sortState
							}
						});
			}
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var advFilterCode = null;
		var objFilterPref = {};
		var filterPanel = me.getFileUploadCenterFilterView();
		if (!Ext.isEmpty(me.savedFilterVal)) {
			advFilterCode = me.savedFilterVal;
		}
		var quickPref = {};
		quickPref.importDate = me.dateFilterVal;
		if (me.dateFilterVal === '13') {
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {
				quickPref.importDateFrom = me.dateFilterFromVal;
				quickPref.importDateTo = me.dateFilterToVal;
			} else {
				var strSqlDateFormat = 'Y-m-d';
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
				fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
				quickPref.importDateFrom = fieldValue1;
				quickPref.importDateTo = fieldValue2;
			}
		}
		if (me.dateFilterVal === '7') {
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {
				quickPref.entryDateFrom = me.dateFilterFromVal;
				quickPref.entryDateTo = me.dateFilterToVal;
			} else {
				var strSqlDateFormat = 'Y-m-d';
				var frmDate = me.getFromUploadDate().getValue();
				var toDate = me.getToUploadDate().getValue();
				fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
				fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
				quickPref.entryDateFrom = fieldValue1;
				quickPref.entryDateTo = fieldValue2;
			}
		}
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = quickPref;
		if (!Ext.isEmpty(me.clientFilterVal))
			objFilterPref.filterClientSelected = me.clientFilterVal;
		return objFilterPref;
	},
	savePreferences : function() {
		var me =this;
		var strUrl = me.urlGridFilterPref + '?' + csrfTokenName + '='
				+ csrfTokenValue;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref)
			Ext.Ajax.request({
						url :  strUrl,
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
											cls : 'ux_popup',
											buttons : Ext.MessageBox.OK,
											icon : imgIcon
										});

							} else
							{
								me.toggleClearPrefrenceAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.INFO
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
	saveFilterPreferences : function() {
		var me = this;
		var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var objFilterPref = {};
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.paymentType = me.typeFilterVal;
		objQuickFilterPref.paymentAction = me.actionFilterVal;
		objQuickFilterPref.uploadDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {
			if(!Ext.isEmpty(me.dateFilterFromVal) && !Ext.isEmpty(me.dateFilterToVal)){
				
				objQuickFilterPref.uploadDateFrom = me.dateFilterFromVal;
				objQuickFilterPref.uploadDateTo = me.dateFilterToVal;
				}
				else
				{
							var strSqlDateFormat = 'Y-m-d';
							var frmDate = me.getFromUploadDate().getValue();
							var toDate = me.getToUploadDate().getValue();
							fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
							fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
					   objQuickFilterPref.uploadDateFrom = fieldValue1;
					   objQuickFilterPref.uploadDateTo = fieldValue2;
				}
		}

		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;

		if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(objFilterPref),
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
		var me = this;
		me.toggleSavePrefrenceAction(false);
		var strUrl = me.urlGridFilterPref + '?$clear=true' + '&'
				+ csrfTokenName + '=' + csrfTokenValue;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			Ext.Ajax.request({
						url : strUrl,
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
											icon : imgIcon
										});
	
							}
							else
							{
								me.toggleSavePrefrenceAction(true);
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
	handleType : function(btn)
	{
		var me = this;
		me.toggleSavePrefrenceAction( true );
		me.typeFilterVal = btn.btnValue;
		me.typeFilterDesc = btn.btnDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyFilterData();
	},
	applyFilterData : function()
	{
		var me = this;
		me.refreshData();
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
	handleFileUpload : function(btn) {
		var me = this;
		var objfileUploadPanel = me.getFileUploadDtlRef();

		if( null == me.clientFilterVal || '' == me.clientFilterVal )
		{
			/*
			 * In case of switch client filter value will be null and should be used from session value.
			 */
			if(null == me.sellerFilterVal || '' == me.sellerFilterVal)
			{
				showUploadPopup(false,uploadFile,'EXTJS',sellerCode,sessionClientCode,'');
			}
			else
			{
				showUploadPopup(false,uploadFile,'EXTJS',me.sellerFilterVal,sessionClientCode,'');
			}
			
		}
		else
		{
			showUploadPopup(false,uploadFile,'EXTJS',me.sellerFilterVal,me.clientFilterVal,me.clientFilterDesc);	
		}
	},
	createFileFormatList : function()
	{
		var me = this;
		var strUrl = 'fileFormatTypes.srvc?'; 
		strUrl = strUrl+'$filter='+'&'+csrfTokenName+'='+csrfTokenValue;
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			params :
			{
				csrfTokenName : tokenValue
			},
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if (!Ext.isEmpty(data)) 
				{
					me.createList(data.d.fileUploadCenter);
				}
			},
			failure : function( response )
			{
				console.log( 'Bad : Something went wrong with your request' );
			}
		} );
	},
	createList : function(jsonData) {
		var me=this;
		var objfileUploadDtlRefPanel = me.getFileUploadDtlRef();
		var infoArray = this.createFileFormatMenuList(jsonData,me);
		objfileUploadDtlRefPanel.add({
						xtype : 'button',
						border : 0,
						filterParamName : 'ccyCode',
						itemId : 'ccyCodeCombo',// Required
						cls : 'xn-custom-arrow-button cursor_pointer w1',
						menu  : Ext.create('Ext.menu.Menu', { 
							items : infoArray
						})
		})
	},
	createFileFormatMenuList : function(jsonData,me) {
		var infoArray = new Array();
		if(jsonData)
		{
			for (var i = 0; i < jsonData.length; i++) 
			{ 
				infoArray.push({
					text : getLabel( 'label'+i, jsonData[i].ccyCode ),
					btnId : 'btn'+jsonData[i].ccyCode,
					btnValue : i,
					code : jsonData[i].ccyCode,
					parent : this,
					handler : function( btn, opts )
					{
						me.setCcyCode(btn);
					}
				});
			}
		}
		return infoArray;
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
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
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel,
				false);
				
		me.filterCodeValue = null;

		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.FileUploadCenterAdvancedFilterPopup');
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
		var toobj1 = objCreateNewFilterPanel.down('combobox[itemId="ascDescCombo1"]');
		var soobj1 = objCreateNewFilterPanel.down('combobox[itemId="sortByCombo2"]');
		var toobj2 = objCreateNewFilterPanel.down('combobox[itemId="ascDescCombo2"]');
		var soobj2 = objCreateNewFilterPanel.down('combobox[itemId="sortByCombo3"]');
		var toobj3 = objCreateNewFilterPanel.down('combobox[itemId="ascDescCombo3"]');
		var soobj3 = objCreateNewFilterPanel.down('combobox[itemId="sortByCombo4"]');
		var toobj4 = objCreateNewFilterPanel.down('combobox[itemId="ascDescCombo4"]');
		if(toobj1){
			toobj1.setDisabled(false);
			soobj1.setDisabled(false);
		}
		
		if(toobj2){
			toobj2.setDisabled(false);
			soobj2.setDisabled(false);
		}
		
		if(toobj3){
			toobj3.setDisabled(false);
			soobj3.setDisabled(false);
		}
		
		if(toobj4){
			toobj4.setDisabled(false);
		}
		
	},
	handleResetAction : function(objShow){
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle('Create New Filter');

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
	},
	applyAdvancedFilter : function() {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.refreshData();
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);		
	},
	closeFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
	postDoSaveAndSearch : function() {
		var me = this;

		me.doAdvSearchOnly();
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		var strUrl = 'userfilters/fileUploadCenter/{0}.srvc';
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
							fncallBack.call(me);
							me.reloadGridRawData();
							me.updateAdvActionToolbar(responseData.d.filters);
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
	reloadGridRawData : function() {
		var me = this;
		var gridView = me.getAdvFilterGridView();
		var filterView = me.getFileUploadCenterFilterView();
		Ext.Ajax.request({
			url :'userfilterslist/fileUploadCenter.srvc',
			headers: objHdrCsrfParams,
			method : 'GET',
			success : function(response) {
				var decodedJson = Ext.decode(response.responseText);
				var arrJson = new Array();

				if (!Ext.isEmpty(decodedJson.d.filters)) {
					for (i = 0; i < decodedJson.d.filters.length; i++) {
						arrJson.push({
									"filterName" : decodedJson.d.filters[i]
								});
					}
				}
				gridView.getStore().loadRawData(arrJson)
				me.addAllSavedFilterCodeToView(decodedJson.d.filters);
			},
			failure : function(response) {
			}

		});
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
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrederJsonToDb(store);
	},
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = me.strRemoveSavedFilterUrl;
			strUrl = Ext.String.format(strUrl, objFilterName);

			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '='
								+ csrfTokenValue,
						method : 'POST',
						success : function(response) {

						},
						failure : function(response) {
							// console.log('Bad : Something went wrong with your
							// request');
						}
					});
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
			url : 'userfilters/fileUpload/{0}/remove.srvc?'+csrfTokenName+'='+csrfTokenValue,
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
			url :'services/userfilterslist/fileUploadCenter.json',
			headers: objHdrCsrfParams,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);

			//	var filters = JSON.parse(responseData.filters);

				me.addAllSavedFilterCodeToView(responseData.d.filters);

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
		var strUrl = 'userfilters/fileUploadCenter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		var urlSave = strUrl ;
		Ext.Ajax.request({
					url : urlSave,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function(response) {
						if (!Ext.isEmpty(response)
								&& !Ext.isEmpty(response.responseText)) {
							var responseData = Ext
									.decode(response.responseText);
							fnCallback.call(me, filterCode, responseData,
									applyAdvFilter);
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
									cls : 'ux_popup',
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

			if (fieldOper != 'eq') {
				objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]')
						.setValue(fieldOper);
			}

			if (fieldName === 'fileName' || fieldName === 'userName' || fieldName === 'filterCode') {
				var fieldType = 'textfield';
			} else if(fieldName === 'fromDate' || fieldName === 'toDate') { 
				var fieldType = 'datefield'; 
			} else if (fieldName === 'statusCombo') {
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
		btn.addCls('xn-custom-heighlight');
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
					url : 'userfilterslist/fileUploadCenter.srvc',
					headers: objHdrCsrfParams,
					method : 'GET',
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
						cls : 'cursor_pointer xn-account-filter-btnmenu',
						text : getLabel('moreText', 'more') + '<span class="extrapadding">'+'>>'+'</span>',
						itemId : 'AdvMoreBtn',
						handler : function(btn, opts) {
							me.handleMoreAdvFilterSet(btn.itemId);
						}
					});
			var imgItem = Ext.create('Ext.Img',{
				src : 'static/images/icons/icon_spacer.gif',
				height : 16,
				padding :'0 3 0 3'
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
					.create('GCP.view.FileUploadCenterAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(0);
			me.objAdvFilterPopup.show();
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('filterDetails',
					'Filter Details'));
		}
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();

		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;
			var fieldOper = filterData.filterBy[i].operator;
			var fieldVal = filterData.filterBy[i].value1;
			
			if (fieldOper != 'eq') {
				objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]')
						.setValue(fieldOper);
			}

			if (fieldName === 'fileName' || fieldName === 'userName' || fieldName === 'filterCode') {
				var fieldType = 'textfield';
			} else if(fieldName === 'fromDate' || fieldName === 'toDate') { 
				var fieldType = 'datefield'; 
			} else if (fieldName === 'statusCombo') {
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
		if (applyAdvFilter) {
			//me.filterApplied = 'A';
			//me.setDataForFilter();
			me.applyAdvancedFilter();
		}
	},
	updateStatusFilterView : function()
	{
		var me = this;
		var statuslabelValue = me.getStatusLabel();
		var objStatusLbl =
		{
			'All' : getLabel( 'AllStatus', 'All' ),
			'N' : getLabel( 'newStatus', 'New' ),
			'C' : getLabel( 'completedStatus', 'Completed' ),
			'E' : getLabel( 'abortedStatus', 'Aborted' ),
			'T' : getLabel( 'rejectedStatus', 'Rejected' ),
			'R' : getLabel( 'runningStatus', 'Running' ),
			'Q' : getLabel( 'inQueueStatus', 'In Queue' )
		};
		if( !Ext.isEmpty( me.typeFilterVal ) )
		{
			statuslabelValue.setText(objStatusLbl[me.typeFilterVal]);
		}
	},
	createSellerClientMenuList : function()
	{
	   var me = this;
	   var filterPanel = me.getSellerClientMenuBar();
	   
	   var objSellerStore = Ext.create('Ext.data.Store', {
           fields: ['sellerCode', 'description'],
           proxy: {
               type: 'ajax',
               autoLoad: true,
               url: 'services/sellerListFltr.json'
           }
       });
	   if (!Ext.isEmpty(filterPanel))
	   {
			filterPanel.removeAll();
	   }
	},
	createClientMenuList : function()
	{
	   var me = this;
	   var filterPanel = me.getSellerClientMenuBar();
	   
	   var objClientStore = Ext.create('Ext.data.Store', {
           fields: ['clientId', 'clientDescription'],
           proxy: {
               type: 'ajax',
               autoLoad: true,
               url: 'services/clientList.json'
           }
       });
	   if (!Ext.isEmpty(filterPanel))
	   {
			filterPanel.removeAll();
	   }
	},
	showHideSellerClientMenuBar : function(entityType)
	{
		var me = this;
		if(entityType === '0')
		{
			me.createSellerClientMenuList();
		}
		else
		{
			if(client_count > 1)
			{
				me.createClientMenuList();
			}
		}
		
	},
	applySeekFilter : function()
	{
		var me = this;
		me.toggleSavePrefrenceAction( true );		
		me.filterApplied = 'Q';
		me.setDataForFilter();
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
		strUrl = 'services/getFileUploadCenterList/getFileUploadCenterDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
		var strQuickFilterUrl = me.getFilterUrl();
		strUrl += strQuickFilterUrl;
		var grid = me.getGroupView().getGrid();
		viscols = grid.getAllVisibleColumns();
		var strOrderBy = me.reportGridOrder;
		if(!Ext.isEmpty(strOrderBy)){
			var orderIndex = strOrderBy.indexOf('orderby');
			if(orderIndex > 0){
				strOrderBy = strOrderBy.substring(orderIndex-2,strOrderBy.length);	
				strUrl += strOrderBy;
			}					
		}
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
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	},
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	}	
});