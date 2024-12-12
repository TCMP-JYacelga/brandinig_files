Ext.define('GCP.controller.BankPrinterMstController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.util.Point'],
	views : ['GCP.view.BankPrinterMstView','GCP.view.BankPrinterMstFilterView','GCP.view.BankPrinterMstGridView',
		'GCP.view.BankPrinterMstActionBarView','GCP.view.BankPrinterMstHistoryPopup'],

	refs : [{
			ref : 'view',
			selector : 'bankPrinterMstView'
		},{
			ref : 'createNewToolBar',
			selector : 'bankPrinterMstView bankPrinterMstGridView toolbar[itemId="btnCreateNewToolBar"]'
		},{
			ref : 'filterView',
			selector : 'bankPrinterMstView bankPrinterMstFilterView'
		},{
			ref : 'gridHeader',
			selector : 'bankPrinterMstView bankPrinterMstGridView panel[itemId="gridDtlView"] container[itemId="gridHeader"]'
		},{
			ref : 'gridView',
			selector : 'bankPrinterMstView bankPrinterMstGridView grid[itemId="gridViewMstId"]'
		},{
			ref : 'gridDtlView',
			selector : 'bankPrinterMstView bankPrinterMstGridView panel[itemId="gridDtlView"]'
		},{
			ref : 'grid',
			selector : 'bankPrinterMstGridView smartgrid'
		},{
			ref : 'groupActionBar',
			selector : 'bankPrinterMstView bankPrinterMstGridView bankPrinterMstActionBarView'
		},{
			ref : 'specificFilterPanel',
			selector : 'bankPrinterMstView bankPrinterMstFilterView panel container[itemId="specificFilter"]'
		},{
			ref : 'sellerCombo',
			selector : 'bankPrinterMstView bankPrinterMstFilterView combobox[itemId="sellerCombo"]'
		},{
			ref : 'mediaIdFilter',
			selector : 'bankPrinterMstView bankPrinterMstFilterView textfield[itemId="mediaIdFilter"]'
		},{
			ref : 'statusFilter',
			selector : 'bankPrinterMstView bankPrinterMstFilterView combobox[itemId="statusFilter"]'
		}],
	config : {
		filterData : [],
		strProxyUrl : 'services/bankPrinterMst.json',
		strBatchActionUrl : 'services/bankPrinterMst/{0}.srvc',
		strAddUrl: 'addBankPrinterMst.form',
		strEditUrl: 'editBankPrinterMst.form',
		strViewUrl: 'viewBankPrinterMst.form',
		mediaIdSelected : false
	},
	init : function() {
		var me = this;
		me.control({
			'bankPrinterMstView bankPrinterMstFilterView' : {
			    render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'bankPrinterMstView bankPrinterMstGridView panel[itemId="gridDtlView"]' : {
				render : function() {
					me.handleGridHeader();
				}
			},
			'bankPrinterMstGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'bankPrinterMstGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex, records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex, records, jsonData);
				}
			},
			'bankPrinterMstGridView toolbar[itemId=bankPrinterMstActionBarView]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'bankPrinterMstView bankPrinterMstFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			'bankPrinterMstView bankPrinterMstGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateNew"]' : {
				click : function() {
					me.handleCreateAction();
				}
			}
		});
	},
	setInfoTooltip : function() {
		var me = this;
		Ext.create('Ext.tip.ToolTip', {
			target : 'imgFilterInfo',
			listeners : {
				beforeshow : function(tip) {
					var sellerFilter = '';
					var mediaIdFilter = '';
					var statusFilter = '';

					var sllerComboFilterId=me.getSellerCombo();
					var mediaIdFilterId = me.getMediaIdFilter();
					var statusFilterId = me.getStatusFilter();

					if (!Ext.isEmpty(sllerComboFilterId) && !Ext.isEmpty(sllerComboFilterId.getValue()))
						sellerFilter = sllerComboFilterId.getRawValue();
					else
						sellerFilter = getLabel( 'all', 'All' );

					if (!Ext.isEmpty(mediaIdFilterId) && !Ext.isEmpty(mediaIdFilterId.getValue()))
						mediaIdFilter = mediaIdFilterId.getRawValue();
					else
						mediaIdFilter = getLabel('none', 'None');

					if (!Ext.isEmpty(statusFilterId) && !Ext.isEmpty(statusFilterId.getRawValue()))
						statusFilter = statusFilterId.getRawValue();
					else
						statusFilter = getLabel( 'all', 'All' );

					tip.update(getLabel('seller', 'Financial Institution') + ' : '
							+ sellerFilter + '<br/>'
							+ getLabel('mediaId', 'Media Id') + ' : '
							+ mediaIdFilter + '<br/>'
							+ getLabel('status', 'Status') + ' : '
							+ statusFilter  + '<br/>');
				}
			}
		});
	},
	handleSpecificFilter : function() {
		var me = this;
		// seller
		var storeData = null;
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
		var comboStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preferences'
			}
		});
		var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
			displayField : 'DESCR',
			fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
			triggerBaseCls : 'xn-form-trigger',
			filterParamName : 'sellerCode',
			itemId : 'sellerCombo',
			valueField : 'CODE',
			name : 'sellerCode',
			editable : false,
			store : comboStore,
			value : strSellerId,
			width : 165,
			listeners : {
				'render' : function(combo, record) {
					combo.store.load();
					var mediaIdFilterId = me.getMediaIdFilter();
					mediaIdFilterId.reset();
				},
				'change' : function(combo, record) {
					var strSellerId=combo.getValue();
					setAdminSeller(strSellerId);
					var mediaIdFilterId = me.getMediaIdFilter();
					mediaIdFilterId.reset();
				}
			}
		});

		// media Id
		var mediaIdAuto = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
			cls:'ux_font-size14-normal',
			name : 'mediaId',
			itemId : 'mediaIdFilter',
			cfgUrl : 'services/userseek/{0}.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			matchFieldWidth:true,
			cfgSeekId : 'mediaIdFilterSeek',
			enableQueryParam:false,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'DESCR',
			cfgKeyNode:'CODE',
			listeners:{
				'select' : function(combo, record) {
					me.mediaIdSelected = true;
				},
				'change' : function(combo, record) {
				     me.mediaIdSelected = false;
				}
			}
		});

		// status
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ['name', 'value'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'cpon/statusList.json',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'd.filter'
				},
				noCache: false
			}
		});
		var statusComboField = Ext.create('Ext.form.field.ComboBox',{
				xtype : 'combobox',
				fieldCls : 'xn-form-field inline_block',
				triggerBaseCls : 'xn-form-trigger',
				width : 165,
				itemId : 'statusFilter',
				filterParamName : 'requestState',
				store : statusStore,
				valueField : 'name',
				displayField : 'value',
				editable : false,
				value : getLabel('all','All')
				});

		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		filterPanel.doLayout();
		filterPanel.add({
			   xtype : 'container',
			   columnWidth : 0.3,
			   padding : '5px',
	           hidden : true,
	           itemId : 'sellerFilter',
	           items: [{
					xtype : 'label',
					cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
					itemId : 'labelSeller',
					text : getLabel('seller', 'Financial Institution')
		          }, sellerComboField]
			},{
			   xtype : 'container',
			   columnWidth : 0.3,
			   padding : '5px',
			   flex : 1,
			   items : [{
					xtype : 'label',
					text : getLabel('mediaId', 'Media Id'),
					cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
				}, mediaIdAuto]
			},{
			   xtype : 'container',
			   columnWidth : 0.3,
			   padding : '5px',
			   itemId: 'statusFilterPanel',
			   items : [{
					xtype : 'label',
					text : getLabel('status', 'Status'),
					cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
				}, statusComboField]
			},{
				xtype : 'container',
				padding : '5px',
				itemId: 'buttonFilter',
				items : [{
					xtype : 'panel',
					layout : 'hbox',
					padding : '20 0 1 5',
					items : [{
							xtype : 'button',
							itemId : 'btnFilter',
							text : getLabel('search',
									'Search'),
							cls : 'ux_button-padding ux_button-background ux_button-background-color'
					}]
				}]
		});

		sellerComboField.store.on('load',function(store){
			if(store.getCount()===1) {
				filterPanel.down('container[itemId="sellerFilter"]').hide();
			} else {
				filterPanel.down('container[itemId="sellerFilter"]').show();
			}
		});
	},

	setDataForFilter : function() {
		var me = this;
		var sellerValue = null, mediaIdVal = null, mediaIdRawVal = null, statusVal = null;
		var jsonArray = [];
		var isPending = true;
		var filterView = me.getFilterView();
		if(!Ext.isEmpty(filterView)){
			var sellerFilter = me.getSellerCombo();
			var mediaIdFilter=me.getMediaIdFilter();

			if(!Ext.isEmpty(sellerFilter)){
				sellerValue = sellerFilter.getValue();
			}
			if(!Ext.isEmpty(mediaIdFilter)){
				if(me.mediaIdSelected === true){
					mediaIdVal = mediaIdFilter.getValue();
				} else {
					mediaIdRawVal = mediaIdFilter.getValue();
				}
			}
			if (!Ext.isEmpty(sellerValue)) {
				jsonArray.push({
					paramName : 'sellerId',
					paramValue1 : encodeURIComponent(sellerValue.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}

			if (!Ext.isEmpty(mediaIdVal)) {
				jsonArray.push({
					paramName : 'mediaId',
					paramValue1 : encodeURIComponent(mediaIdVal.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
		}
		if (!Ext.isEmpty(mediaIdRawVal)) {
			jsonArray.push({
				paramName : 'mediaDesc',
				paramValue1 : encodeURIComponent(mediaIdRawVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
				operatorValue : 'lk',
				dataType : 'S'
			});
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& getLabel('all', 'All').toLowerCase() != me.getStatusFilter().getValue().toLowerCase())
		{
			statusVal = me.getStatusFilter().getValue();
			var strInFlag = false;
			if (statusVal == 13)
			{
				statusVal  = new Array('5YN','4NN','0NY','1YY');
				isPending = false;
				jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						} );
				jsonArray.push({
							paramName : 'user',
							paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'ne',
							dataType : 'S'
						});
			}
		if(isPending)
			{	
			if (statusVal == 12 || statusVal == 3|| statusVal == 14) {
				if (statusVal == 12 || statusVal == 14)//12:New Submitted 14: Modified Submitted
				{			
					statusVal = (statusVal == 12)?0:1;
					jsonArray.push({
						paramName : 'isSubmitted',
						paramValue1 : 'Y',
						operatorValue : 'eq',
						dataType : 'S'
					});
					strInFlag = true;
				} else {
					// Valid/Authorized
					jsonArray.push({
						paramName : 'validFlag',
						paramValue1 : 'Y',
						operatorValue : 'eq',
						dataType : 'S'
					});
				}
			} else if (statusVal == 11) {
				// Disabled
				statusVal = 3;
				jsonArray.push({
					paramName : 'validFlag',
					paramValue1 : 'N',
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			else if (statusVal == 0 || statusVal == 1) {
				// New and Modified
				jsonArray.push({
					paramName : 'isSubmitted',
					paramValue1 : 'N',
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
					jsonArray.push({
						paramName : me.getStatusFilter().filterParamName,
						paramValue1 : statusVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
			}
			
		}
		me.filterData = jsonArray;
	},

	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},

	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		return strQuickFilterUrl;
	},

	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'' + ' and '
							+ '\'' + filterData[index].paramValue2 + '\'';
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
				default :
					// Default opertator is eq
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'';
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

	handleGridHeader : function() {
		var me = this;
		if(ACCESSNEW){
			var createNewPanel = me.getCreateNewToolBar();
			if (!Ext.isEmpty(createNewPanel))
			{
				createNewPanel.removeAll();
			}
			createNewPanel.add({
				xtype : 'button',
				border : 0,
				text : getLabel('actionCreateNew', 'Bank Printer Master'),
				cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
				glyph:'xf055@fontawesome',
				parent : this,
				itemId : 'btnCreateNew',
				disabled : false,
				hidden : false
			});
		}
	},

	handleSmartGridConfig : function() {
		var me = this;
		var grid = me.getGridView();
		var objConfigMap = me.getGridConfig();
		var arrCols = null;
		if (!Ext.isEmpty(grid))
			grid.destroy(true);
		arrCols = me.getColumns(objConfigMap.arrColsPref, objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
	},

	getGridConfig : function(){
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
				'mediaId' : 100,
				'mediaType' : 100,
				'mediaDesc' : 180,
				'requestStateDesc' : 140,
				'mediaDvcSpec' : 250,
				'micrPrntFlag' : 100,
				'teriminalId':100
			};

			arrColsPref = [{
				'colId' : 'mediaId',
				'colDesc' : getLabel('mediaId','Media Id')
			},{
				'colId' : 'mediaType',
				'colDesc' : getLabel('mediaType','Media Type')
			},{
				'colId' : 'mediaDesc',
				'colDesc' : getLabel('mediaDesc','Media Description')
			},{
				'colId' : 'requestStateDesc',
				'colDesc' : getLabel('status','Status')
			},{
				'colId' : 'mediaDvcSpec',
				'colDesc' : getLabel('mediaDeviceSpec','Media Device Spec')
			},{
				'colId' : 'micrPrntFlag',
				'colDesc' : getLabel('micrPrinterFlag','Micr Printer Flag')
			},{
				'colId' : 'teriminalId',
				'colDesc' : getLabel('teriminalId','Terminal Id')
			}];

			storeModel = {
					fields : ['mediaId','mediaType','mediaDesc','mediaDvcSpec','micrPrntFlag','teriminalId','history',
							'identifier','requestStateDesc','__metadata'],
				proxyUrl : me.strProxyUrl,
				rootNode : 'd.profile',
				totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			'objWidthMap' : objWidthMap,
			'arrColsPref' : arrColsPref,
			'storeModel' : storeModel
		};
		return objConfigMap;
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.lockable = true;
				cfgCol.draggable = true;
				cfgCol.locked = false;
				if(objCol.colId == 'requestStateDesc')
				{
					cfgCol.locked = false;
					cfgCol.lockable = false;
					cfgCol.sortable = false;
					cfgCol.hideable = false;
					cfgCol.resizable = false;
					cfgCol.draggable = false;
					cfgCol.hidden = false;
				}
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === 'number')
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	createGroupActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 120,
			locked : true,
			items: [{
				text : getLabel('actionSubmit', 'Submit'),
				itemId : 'submit',
				actionName : 'submit',
				maskPosition : 5
			}, {
				text : getLabel('actionDiscard', 'Discard'),
				itemId : 'discard',
				actionName : 'discard',
				maskPosition : 10
			}, {
				text : getLabel('actionApprove', 'Approve'),
				itemId : 'accept',
				actionName : 'accept',
				maskPosition : 6
			}, {
				text : getLabel('actionReject', 'Reject'),
				itemId : 'reject',
				actionName : 'reject',
				maskPosition : 7
			}, {
				text : getLabel('actionEnable', 'Enable'),
				itemId : 'enable',
				actionName : 'enable',
				maskPosition : 8
			}, {
				text : getLabel('actionSuspend', 'Suspend'),
				itemId : 'disable',
				actionName : 'disable',
				maskPosition : 9
			}]
		};
		return objActionCol;
	},

	createActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 85,
			locked : true,
			items : [{
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Edit Record'),
				maskPosition : 2
			}, {
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				maskPosition : 3
			}, {
				itemId : 'btnHistory',
				itemCls : 'grid-row-action-icon icon-history',
				itemLabel : getLabel('historyToolTip', 'View History'),
				toolTip : getLabel('historyToolTip', 'View History'),
				maskPosition : 4
			}]
		};
		return objActionCol;
	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var dispBankProdClrLocGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,	btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,	dataParams.columnIndex, menu, null, dataParams.record);
			}
	    });

		var gridDtlView = me.getGridDtlView();
		gridDtlView.add(dispBankProdClrLocGrid);
		gridDtlView.doLayout();
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		var reqState = null, submitFlag = null, validFlag = null;
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
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
		} else if (maskPosition === 2 && retValue) {
			reqState = record.raw.requestState;
			submitFlag = record.raw.isSubmitted;
			validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			reqState = record.raw.requestState;
			submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		}else if (maskPosition === 8 && retValue) {
			validFlag = record.raw.validFlag;
			reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		}
		else if (maskPosition === 9 && retValue) {
			validFlag = record.raw.validFlag;
			reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn, event, record) {
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

	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) 
			{
				me.showHistory(record.get('history').__deferred.uri, record.get('identifier'),record.get('mediaDesc'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm(me.strViewUrl, record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm(me.strEditUrl, record, rowIndex);
		}
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl,record);
		} else {
			me.preHandleGroupActions(strUrl, '',record);
		}
	},

	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('rejectRemarkPopUpTitle',	'Please enter reject remark');
			titleMsg = getLabel('rejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			multiline : 4,
			cls:'t7-popup',
			width: 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
    				if (Ext.isEmpty(text)) {
                       Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg',
                                            'Reject Remark field can not be blank'));
                    }else{
					   me.preHandleGroupActions(strActionUrl, text, record);
				    }
				}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records : [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
					serialNo : grid.getStore().indexOf(records[index]) + 1,
					identifier : records[index].data.identifier,
					userMessage : remark
				});
			}
			if (arrayJson){
				arrayJson = arrayJson.sort(function(valA, valB) {
					return valA.serialNo - valB.serialNo;
				});
			}

			Ext.Ajax.request({
				url : strUrl +'?'+ csrfTokenName + '=' + csrfTokenValue,
				method : 'POST',
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					var errorMessage = '';
					if(response.responseText != '[]') {
						var jsonData = Ext.decode(response.responseText);
						if(!Ext.isEmpty(jsonData)) {
							for(var i =0 ; i<jsonData.length;i++ ) {
								var arrError = jsonData[i].errors;
								if(!Ext.isEmpty(arrError)) {
									for(var j =0 ; j< arrError.length; j++) {
										errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+'<br/>';
									}
								}
							}
							if ('' != errorMessage && null != errorMessage) {
								Ext.MessageBox.show({
									title : getLabel('errorPopUpTitle','Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
							}
						}
					}
					me.enableDisableGroupActions('0000000000', true);
					grid.refreshData();
				},
				failure : function() {
					Ext.MessageBox.show({
						title : getLabel('errorPopUpTitle','Error'),
						msg : getLabel('errorPopUpMsg','Error while fetching data..!'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			});
		}
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var me = this;
		var actionBar = me.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = null;
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
				strBitMapKey = parseInt(item.maskPosition,10) - 1;
				if (strBitMapKey) {
					blnEnabled = isActionEnabled(actionMask, strBitMapKey);
					if((item.maskPosition === 6 && blnEnabled)){
						blnEnabled = blnEnabled && isSameUser;
					} else  if(item.maskPosition === 7 && blnEnabled){
						blnEnabled = blnEnabled && isSameUser;
					}else if (item.maskPosition === 8 && blnEnabled) {
						blnEnabled = blnEnabled && isDisabled;
					} else if (item.maskPosition === 9 && blnEnabled) {
						blnEnabled = blnEnabled && !isDisabled;
					} else if (item.maskPosition === 10 && blnEnabled) {
						blnEnabled = blnEnabled && !isSubmit;
					}
					item.setDisabled(!blnEnabled);
				}
			});
		}
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
	},

	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled, isSubmit);
	},

	submitExtForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var form;

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState', viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},

	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
		arrJsn['sellerId'] =  strSellerId;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData', Ext.encode(arrJsn)));
	},

	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	showHistory : function(url, id, mediaDesc) {
		Ext.create('GCP.view.BankPrinterMstHistoryPopup', {
					mediaDesc : mediaDesc,
					historyUrl : url,
					identifier : id
				}).show();
	},
	handleCreateAction : function(){
		var me = this;
		var form;
		var strUrl = me.strAddUrl;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId){
		var strRetVal = value;
		if(colId === 'col_micrPrntFlag'){
			if(value.toString() === 'Y')
			{
				strRetVal = getLabel('Y', 'Yes');	
			}	
			else
			{
				strRetVal = getLabel('N', 'No');	
			}
		}
		if(!Ext.isEmpty(strRetVal)) {
			meta.tdAttr = 'title="' + strRetVal + '"';
		}
		return strRetVal;
	}
});