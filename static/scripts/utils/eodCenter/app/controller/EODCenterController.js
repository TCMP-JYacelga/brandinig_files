Ext.define('GCP.controller.EODCenterController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.EODCenterGridView','Ext.ux.gcp.DateHandler'],
	views : ['GCP.view.EODCenterView','Ext.ux.gcp.AutoCompleter'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'eodCenterView',
				selector : 'eodCenterView'
			},
	        {
				ref : 'eodCenterGridViewRef',
				selector : 'eodCenterView eodCenterGridView grid[itemId="gridViewMstId"]'
			},
			{
				ref : 'eodCenterDtlView',
				selector : 'eodCenterView eodCenterGridView panel[itemId="eodCenterDtlViewId"]'
			},
			{
				ref : 'eodCenterApplDate',
				selector : 'eodCenterView eodCenterGridView panel[itemId="preEodCenterDtlViewId"] container[itemId="preEodContainer"] container[itemId="datesContainer"] label[itemId="applDate"]'
			},
			{
				ref : 'eodCenterNextApplDate',
				selector : 'eodCenterView eodCenterGridView panel[itemId="preEodCenterDtlViewId"] container[itemId="preEodContainer"] container[itemId="datesContainer"] label[itemId="nextApplDate"]'
			},
			{
				ref : 'eodCenterGridView',
				selector : 'eodCenterView eodCenterGridView'
			},
			{
				ref : 'eodCenterProgressBar',
				selector : 'eodCenterView eodCenterGridView panel[itemId="eodCenterDtlViewId"] progressbar[itemId="eodProgressBar"]'
			},
			{
				ref : 'preEodButton',
				selector : 'eodCenterView eodCenterGridView panel[itemId="preEodCenterDtlViewId"] container[itemId="preEodContainer"] button[itemId="btnPreEoD"]'
			},
			{
				ref : 'withHeaderCheckboxRef',
				selector : 'eodCenterView  menuitem[itemId="withHeaderId"]'
			}			
			],
	config : {
		commonPrefUrl : 'services/userpreferences/eodCenter.json',
		urlGridPref : 'userpreferences/eodCenter/gridView.srvc',
		urlGridFilterPref : 'userpreferences/eodCenter/gridViewFilter.srvc',
		sellerVal : null,
		sellerFilterVal : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		GCP.getApplication().on(
				{
					runEodProcess : function(identifier)
					{
						me.runEodProcess(identifier);
					},
					runPreEodProcess : function(){
					    Ext.MessageBox.show({
					        title: getLabel('preEodConfirmTitle', 'Pre EOD'),
					        msg: getLabel('preEodConfirmMessage', 'Do you want to start pre EOD process?'),
					        buttons: Ext.MessageBox.OKCANCEL,
					        icon: Ext.MessageBox.QUESTION,
							animateTarget: me.getPreEodButton(),
							fn: function(btn){
					            if(btn == 'ok'){
			           				me.runPreEodProcess();
					            } else {
					                return;
					            }
					        }
					    });
					},
					disablePreEodProcess : function(isDisabled){
						if('true' === hasRunPermission){
							me.getPreEodButton().setDisabled(isDisabled);
						}
						else{
							me.getPreEodButton().setDisabled(false);
						}
					}
					
					
				}
		);
		this.dateHandler = Ext.create('Ext.ux.gcp.DateHandler');
		me.control({
			'eodCenterView' : {
			beforerender : function(panel, opts) {
			},
			afterrender : function(panel, opts) {
			},
			runPreEoDProcess : function(btn) {
				
				
			},
			performReportAction : function( btn, opts )
			{
				me.handleReportAction( btn, opts );
			}
		},
			'eodCenterGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},

			'eodCenterGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,grid.pageSize, 1, 1, null);					
				},
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				},
				afterrender : function(grid) {
					me.checkEodStatus();
				}
			},
			'eodCenterGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'eodCenterGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'eodCenterView eodCenterTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				},
				afterrender : function() {
				}
			}
		});
	},

	checkEodStatus :  function() {
		var me = this;
		var interval = setInterval(function(){
				Ext.Ajax.request({
							url :  'checkeodstatus.srvc'+'?'+csrfTokenName+'='+csrfTokenValue,
							method : 'POST',
							success : function(response) {
								var responseData = Ext
										.decode(response.responseText);
								if(responseData.d.success === 'false'){
									Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : !Ext.isEmpty(responseData.d.errormessage) ? responseData.d.errormessage : 'Error while fetching data..!',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
								else{
									if(responseData.d.processrunning === 'true'){
										me.getEodCenterView().setLoading(true);
										me.applyQuickFilter();
									}
									else if(responseData.d.eodstatus != 0 && responseData.d.eodstatus != 100){
										me.applyQuickFilter();
										me.paintProgressBar(me.getEodCenterProgressBar(), responseData.d.eodstatus, '');
										me.getEodCenterView().setLoading(false);
									}
									else {
										me.getEodCenterView().setLoading(false);
										me.applyQuickFilter();
										me.paintProgressBar(me.getEodCenterProgressBar(), responseData.d.eodstatus, '');
										if(responseData.d.eodstatus == 100)
										clearInterval(interval);
									}
								}
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'eodStatusErrorPopUpMsg',
													'Error on EOD Status Update.'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});
	       }, 5000);
	},

	handleSmartGridConfig : function() {
		var me = this;
		var eodCenterGrid = me.getEodCenterGridViewRef();
		var objConfigMap = me.getEodCenterConfiguration();
		var arrCols = new Array();
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		if( Ext.isEmpty( eodCenterGrid ) )
		{
			if( !Ext.isEmpty( objGridViewPref ) )
			{
				var data = Ext.decode( objGridViewPref );
				objPref = data[ 0 ];
				arrColsPref = objPref.gridCols;
				arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
				pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 100;
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
			else
			if( objConfigMap.arrColsPref )
			{
				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				pgSize = _GridSizeTxn;
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
		}
		else
		{
			me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
		}
	},
	
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 15;
		eodCenterGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			cls : 'ux_panel-transparent-background',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			autoDestroy : true,
			defaultSortable : false,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			hideRowNumbererColumn : true,
			padding : '5 0 0 0',
			rowList : _AvailableGridSize,
			minHeight : 140,
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
		
		var eodCenterDtlView = me.getEodCenterDtlView();
		eodCenterDtlView.add(eodCenterGrid);
		eodCenterDtlView.doLayout();
	},
	
	getEodCenterConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"groupId" : 50,
			"type" : 100,
			"status" : 120,
			"eoddescription" : 180,
			"errorDescription" : 200,
			"execute" : 120
		};
		arrColsPref = [{
					"colId" : "groupId",
					"colDesc" : getLabel('srNO', 'Sr No')
				}, 
				{
					"colId" : "type",
					"colDesc" : getLabel('type', 'Type')
				}, {
					"colId" : "eoddescription",
					"colDesc" : getLabel('module', 'Module')
				},{
					"colId" : "eodstatus",
					"colDesc" : getLabel('status', 'Status')
				},{
					"colId" : "errorDescription",
					"colDesc" : getLabel('remarks', 'Remarks')
				},{
					"colId" : "execute",
					"colDesc" : getLabel('execute', 'Execute')
				}];
			storeModel = {
				fields : ['type', 'eodstatus','groupId','eoddescription', 'eodprogress', 'execute','__metadata','identifier',
				'actionEnabled', 'errorCode', 'errorDescription', 'module','totaleodprogress','eodInProgress'],
				proxyUrl : 'eodStatus.srvc',
				rootNode : 'd.eodMasterList',
				totalRowsNode : 'd.__count',
				metaDataNode : 'd.__metadata'
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
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, null);
		me.reportGridOrder = strUrl;
		strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null);
		//me.getEodCenterProgressBar().updateProgress( overAllEoDProgress/100, overAllEoDProgress +'%', true );		
		me.paintProgressBar(me.getEodCenterProgressBar(), overAllEoDProgress, '');
	},
	checkProcessRunning : function() {
			Ext.Ajax.request({
						url :  'checkrunningprocess.srvc'+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						success : function(response) {
							
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
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		var grid = me.getEodCenterGridViewRef();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					null);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl,null);
		}
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '',  strUrl = '', isFilterApplied = 'false',strAdvFilterUrl ='';
		if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
		{
			if( !Ext.isEmpty( strQuickFilterUrl ) )
			{
				strUrl += strQuickFilterUrl;
				isFilterApplied = true;
			}
			return strUrl;
		}
		else
		{
			
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
		// var filterData = thisClass.filterData;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
		var strFilter = '&$filter=';
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
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				if(cfgCol.colId === 'execute'){
					cfgCol.fnColumnRenderer = me.startButtonColumnRenderer;
				}
				else{
					cfgCol.fnColumnRenderer = me.columnRenderer;
				}
				cfgCol.sortable = false;
				cfgCol.hideable = false;
				cfgCol.lockable = false;
				arrCols.push(cfgCol);
				
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me=this;
		var strRetValue = "";
		strRetValue = value;
		if(colId === 'col_eodstatus'){
			return getLabel('status.'+value,'');
		}
		return strRetValue;
	},
	startButtonColumnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me=this;
		var strRetValue = "";
		strRetValue = value;
        var buttonDisabled = !record.get('actionEnabled');
        var errorMessage = record.get('errorDescription');
        overAllEoDProgress = record.get('totaleodprogress');
        eodInProgressFlag = record.get('eodInProgress');
        if(Ext.isEmpty(eodInProgressFlag))
        	eodInProgressFlag = eodInProgress;
        if(Ext.isEmpty(overAllEoDProgress))
        {
        	overAllEoDProgress = 0;
        }
    	if(!Ext.isEmpty(errorMessage)){
			meta.tdAttr = 'title="' + errorMessage + '"';
    	}
    	if(record.get('actionEnabled') && 'true' === hasRunPermission )
    	{
    		if(eodInProgressFlag === 'N')
    		{
    			// pre-eod error
    			disablePreEodButton(false);
    			return "<input type='button' disabled='disabled' value=\""+getLabel('startButton', 'START')+"\"/>";
    		}
    		else if(autoEodBySystem == 'Y')
    		{
				disablePreEodButton(true);
    			return "<input type='button' disabled='disabled' value=\""+getLabel('startButton', 'START')+"\"/>";
    		}
    		else
    		{
    			// eod error
    			disablePreEodButton(true);
    			return "<input type='button' onclick='runEoD(\""+record.get('identifier')+"\");' value=\""+getLabel('startButton', 'START')+"\"/>";
    		}
    	}
    	else
    	{
    		//disablePreEodButton(true);
    		return "<input type='button' disabled='disabled' value=\""+getLabel('startButton', 'START')+"\">";
    	}
		    
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
	handleSavePreferences : function() {
		var me = this;
		me.savePreferences();
	},
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		me.clearWidgetPreferences();
		me.toggleClearPrefrenceAction(false);
	},
	getFilterPreferences : function() {
				var me = this;
				var advFilterCode = null;
				var objFilterPref = {};
				if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
					advFilterCode = me.savePrefAdvFilterCode;
				}
				if (!Ext.isEmpty(me.clientFilterVal))
				objFilterPref.filterClientSelected = me.clientFilterVal;
				return objFilterPref;
			},
	savePreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null,objFilterPref = null;
		var strUrl = me.urlGridPref;
		var grid = me.getEodCenterGridViewRef();
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
			objPref.pgSize = grid.pageSize;
			objPref.gridCols = arrColPref;
			arrPref.push(objPref);
			objFilterPref = me.getFilterPreferences();
					arrPref.push({
						"module" : "msgViewFilterPref",
						"jsonPreferences" : objFilterPref
					});	
		}

		if (arrPref)
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
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.toggleSavePrefrenceAction(true);
									//me.getBtnSavePreferences().setDisabled(false);
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
								//me.saveFilterPreferences();
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
		var me = this, objPref = {}, arrCols = null, objCol = null,objWdgtPref = null;
		var strUrl = me.commonPrefUrl+"?$clear=true";
		var grid = me.getEodCenterGridViewRef();
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
									me.toggleClearPrefrenceAction(false);
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
	handleType : function(btn)
	{
		var me = this;
		me.toggleSavePrefrenceAction( true );
		me.typeFilterVal = btn.btnValue;
		me.typeFilterDesc = btn.btnDesc;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyFilterData();
	},
	applyFilterData : function()
	{
		var me = this;
		me.getEodCenterGridViewRef().refreshData();
	},
	handleEodCenter : function(btn) {
		var me = this;
		var objeodCenterPanel = me.getEodCenterDtlRef();
		//me.createFileFormatList();
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
		
	
		/*if( !Ext.isEmpty( me.objViewInfoPopup ) )
		{
			me.objViewInfoPopup.show();
		}
		else
		{
			me.objViewInfoPopup = Ext.create( 'GCP.view.EODCenterPopUp' );
			me.objViewInfoPopup.show();
		}*/
	},
	addAllSavedFilterCodeToView : function(arrFilters) {},
	handleMoreAdvFilterSet : function(btnId) {},
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
			me.filterApplied = 'A';
			me.setDataForFilter();
			me.applyAdvancedFilter();
		}
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
			eodCenterDownloadPdf : 'pdf',
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
		strUrl = 'services/eodstatusreport.' + strExtension;
		strUrl += '?$skip=1';
		var strQuickFilterUrl = me.getFilterUrl();
		strUrl += strQuickFilterUrl;
		var grid = me.getEodCenterGridViewRef();
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
	
	runEodProcess : function(identifier){
			var errorData = new Array();
			var arrayData = new Array();
			var me = this;
			Ext.Ajax.request({
				url : 'services/starteodprocess('+identifier+').srvc',
				method : 'POST',
				async : false,
				success : function(response) {
					var data = Ext.decode(response.responseText);
					if(data.d && data.d.eodprocess){
						if(!Ext.isEmpty(data.d.eodprocess.errorCode) && 'false' === data.d.eodprocess.success){
							var errMsg = "";
							Ext.MessageBox.show({
								title : getLabel('error', 'Error') + ": " + data.d.eodprocess.errorCode,
								msg : !Ext.isEmpty(data.d.eodprocess.errorDescription) ? data.d.eodprocess.errorDescription : getLabel('errorProcess',
									'Error while fetching data..!'),
							    renderTo: Ext.getBody(),

								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							me.applyQuickFilter();
							overAllEoDProgress = data.d.eodprocess.eodprogress;
							eodInProgress = data.d.eodprocess.eodInProgress;
							me.paintProgressBar(me.getEodCenterProgressBar(), overAllEoDProgress, 'error');
						}
						else if('true' === data.d.eodprocess.success){
							if(data.d.eodprocess.eodprogress==='1' || data.d.eodprocess.eodprogress==='2' || data.d.eodprocess.eodprogress==='4'){
							Ext.MessageBox.show({
								title : getLabel('eodConfirmTitle', 'EOD'),
								msg : getLabel('eodConfirmMsg',
									'EOD initiated successfully..!'),
							    renderTo: Ext.getBody(),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO,
								fn: function(buttonId) {
									        if (buttonId === "ok") {
												me.checkEodStatus();
									        }
									    }
							});
							}
							else{
								Ext.MessageBox.show({
									title : getLabel('bodConfirmTitle', 'BOD'),
									msg : getLabel('bodConfirmMsg',
										'BOD initiated successfully..!'),
								    renderTo: Ext.getBody(),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									fn: function(buttonId) {
										        if (buttonId === "ok") {
													me.checkEodStatus();
										        }
										    }
								})
							}
							me.applyQuickFilter();
							overAllEoDProgress = data.d.eodprocess.eodprogress;
							eodInProgress = data.d.eodprocess.eodInProgress;
							me.paintProgressBar(me.getEodCenterProgressBar(), overAllEoDProgress, '');
							me.getEodCenterApplDate().setText(data.d.eodprocess.applDate);
							me.getEodCenterNextApplDate().setText(data.d.eodprocess.nextApplDate);
						}
							
					}
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('error', 'Error'),
								msg : getLabel('errorProcess',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							me.applyQuickFilter();
				}
			});	
			
		},
		runPreEodProcess : function(){ 
			var errorData = new Array();
			var arrayData = new Array();
			var me = this;
			Ext.Ajax.request({
				url : 'services/startpreeodprocess.srvc',
				method : 'POST',
				async : false,
				success : function(response) {
					var data = Ext.decode(response.responseText);
					if(data.d && data.d.eodprocess){
						if(!Ext.isEmpty(data.d.eodprocess.errorCode) && 'false' === data.d.eodprocess.success){
							var errMsg = "";
							Ext.MessageBox.show({
								title : getLabel('error', 'Error') + ": " + data.d.eodprocess.errorCode,
								msg : !Ext.isEmpty(data.d.eodprocess.errorDescription) ? data.d.eodprocess.errorDescription : getLabel('errorProcess',
									'Error while fetching data..!'),
							    renderTo: Ext.getBody(),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							me.applyQuickFilter();
							overAllEoDProgress = data.d.eodprocess.eodprogress;
							eodInProgress = data.d.eodprocess.eodInProgress;
							me.paintProgressBar(me.getEodCenterProgressBar(), overAllEoDProgress, '');
						}
						else if('true' === data.d.eodprocess.success){
							Ext.MessageBox.show({
								title : getLabel('preEodConfirmTitle', 'Pre EOD'),
								msg : getLabel('preEodProcessStartedSuccess',
									'Pre EOD initiated successfully..!'),
							    renderTo: Ext.getBody(),
								animateTarget: me.getPreEodButton(),
								waitConfig: {interval:4000},
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
							});
							me.applyQuickFilter();
							overAllEoDProgress = data.d.eodprocess.eodprogress;
							eodInProgress = data.d.eodprocess.eodInProgress;
							me.paintProgressBar(me.getEodCenterProgressBar(), overAllEoDProgress, '');
							me.getEodCenterApplDate().setText(data.d.eodprocess.applDate);
							me.getEodCenterNextApplDate().setText(data.d.eodprocess.nextApplDate);
						}
							
					}
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('error', 'Error'),
								msg : getLabel('errorProcess',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							me.applyQuickFilter();
				}
			});	
			
		},		
		paintProgressBar : function(progressBar, overAllProgress, status){
			progressBar.updateProgress( overAllProgress/100, overAllProgress +'%', true );
			progressBar.removeCls('x-progress-completed');
			progressBar.removeCls('x-progress-error');
			if(status == 'error'){
				progressBar.addCls('x-progress-error');
			}
			else if(overAllProgress == '100'){
				progressBar.addCls('x-progress-completed');
				if('true' === hasRunPermission)
	    			disablePreEodButton(false);
			}
		},
		createFormField : function(element, type, name, value) {
			var inputField;
			inputField = document.createElement(element);
			inputField.type = type;
			inputField.name = name;
			inputField.value = value;
			return inputField;
		}
		
});

function runEoD(identifier){
	GCP.getApplication().fireEvent( 'runEodProcess', identifier);
}

function runPreEoD(){
	GCP.getApplication().fireEvent( 'runPreEodProcess');
}

function disablePreEodButton(isDisabled){
	GCP.getApplication().fireEvent( 'disablePreEodProcess', isDisabled);
}
