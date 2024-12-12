Ext.define('GCP.controller.MessageFormMstFilterController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.MessageFormMstFilterView'],
	views : ['GCP.view.MessageFormMstMainView'],

	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'messageFormMstMainViewRef',
				selector : 'messageFormMstMainViewType'
			}, {
				ref : 'btnSavePreferencesRef',
				selector : 'messageFormMstFilterViewType button[itemId="btnSavePreferencesItemId"]'
			}, {
				ref : 'statusFilterToolBarRef',
				selector : 'messageFormMstFilterViewType toolbar[itemId="statusFilterToolBarItemId"]'
			}, {
				ref: 'sellerfilter',
				selector: 'messageFormMstMainViewType messageFormMstFilterViewType panel[itemId="sellerFilter"]'
			}, {
				ref: 'sellerField',
				selector: 'messageFormMstMainViewType messageFormMstFilterViewType panel combobox[itemId="broadcastMsgSellerCode"]'
			}, {
				ref: 'moreStatusFiltersRef',
				selector: 'messageFormMstFilterViewType button[itemId="moreStatusFilters"]'
			},
			{
				ref : 'messageFormMstFilterView',
				selector : 'messageFormMstMainViewType messageFormMstFilterViewType'
			}
	],
	config : {
		lstURL : 'getMessageFormMstList.srvc',
		filterData : [],
		sellerFilterVal : 'all',
		formGroupFilterVal : 'all',
		formDestinationFilterVal : 'all',
		statusFilterVal : 'all',
		requestState : '',
		validFlag : '',
		urlGridPref : 'userpreferences/messageFormMaster/gridView.srvc?',
		urlGridFilterPref : 'userpreferences/messageFormMaster/gridViewFilter.srvc?'
	},

	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */

	init : function() {
		var me = this;
		me.control({
			'messageFormMstMainViewType' : {
				render : function(panel) {
				},
				addNewFormEvent : function() {
					var sellerFilterField = null;
					var selectedSellerId = null;
					var strFilterData = me.setFilterParameters();
					sellerFilterField = me.getSellerField();
					if (!Ext.isEmpty(sellerFilterField) && !Ext.isEmpty(sellerFilterField.getValue())){
					selectedSellerId = sellerFilterField.getValue();
					}
					showAddNewMessageForm(selectedSellerId,strFilterData);
				}
			},
			'messageFormMstFilterViewType' : {
				render : function(panel, opts) {
					me.updateFilterConfig();
					this.getController('MessageFormMstGridController')
							.handleSmartGridConfig();
				}
			},
			'messageFormMstFilterViewType AutoCompleter[itemId="formGroupFilterItemId"]' :
			{
				select : function( combo, record, index )
				{
					me.formGroupFilterVal = record[ 0 ].data.CODE;
				},
				change : function( combo, record, index )
				{
					if( Ext.isEmpty( record ) )
					{
						me.formGroupFilterVal ='all';
					}
				}
			},
			'messageFormMstFilterViewType AutoCompleter[itemId="formDestinationFilterItemId"]' :
			{
				select : function( combo, record, index )
				{
					me.formDestinationFilterVal = record[ 0 ].data.CODE;
				},
				change : function( combo, record, index )
				{
					if( Ext.isEmpty( record ) )
					{
						me.formDestinationFilterVal ='all';
					}
				}
			},
			'messageFormMstFilterViewType combobox[itemId="requestStateFilterItemId"]' :
			{
				select : function( combo, record, index )
				{
					me.statusFilterVal = record[ 0 ].data.key;
				}
			},
			'messageFormMstFilterViewType AutoCompleter[itemId="entitledSellerIdItemId"]' : {
				select : function(combo, record, index) {
					me.handleSellerFilter(record[0].data.CODE);
				}
			},
			'messageFormMstMainViewType messageFormMstFilterViewType' : {
				render : function() {
					me.setInfoTooltip();
				}				
			},
			'messageFormMstMainViewType messageFormMstFilterViewType panel combobox[itemId="broadcastMsgSellerCode"]' : {
				select : function(combo, record, index) {
					var me = this;
					var temp = me.filterData;
					var flag = false;
				}				
			},
			'messageFormMstFilterViewType button[itemId="btnSavePreferencesItemId"]' : {
				click : function(btn, opts) {
					// me.toggleSavePrefrenceAction( false );
					me.handleSavePreferences();
				}
			},
			'messageFormMstFilterViewType button[itemId="filterBtnId"]' : {
				click : function(btn, opts) {
					this.getController('MessageFormMstGridController')
				.callHandleLoadGridData(me.getFilterUrl());
				}
			}

		});

	},

	

	handleSellerFilter : function(selectedValue) {
		var me = this;
		me.sellerFilterVal = selectedValue;
	},

	setDataForFilter : function() {
		var me = this;
		// me.getSearchTxnTextInput().setValue( '' );
		this.filterData = this.getFilterQueryJson();
	},

	getFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		var isPending = true;

		if (me.sellerFilterVal != 'all') {
			jsonArray.push({
						paramName : 'entitledSellerId',
						paramValue1 : encodeURIComponent(me.sellerFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (me.formGroupFilterVal != 'all') {
			jsonArray.push({
						paramName : 'formGroup',
						paramValue1 : encodeURIComponent(me.formGroupFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (me.formDestinationFilterVal != 'all') {
			jsonArray.push({
						paramName : 'formDestination',
						paramValue1 : encodeURIComponent(me.formDestinationFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (me.statusFilterVal != 'all') 
		{
			if(me.statusFilterVal  == '13NY')
			{
				 me.statusFilterVal  = new Array('5YY','4NY','0NY','1YY');
				 isPending = false;
				 jsonArray.push({
					 			paramName : 'statusFilter',
								paramValue1 : me.statusFilterVal,
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
				if(me.statusFilterVal  == '0NY' || me.statusFilterVal  == '1YY' )
				{
					me.statusFilterVal  = (me.statusFilterVal  == '0NY')?'0NY':'1YY';
					jsonArray.push(
								{
									 paramName : 'statusFilter',
									 paramValue1 : me.statusFilterVal,
									 operatorValue : 'eq',
									 dataType : 'S'
								} );
				}
				else 
				{
					jsonArray.push(
						  {
								paramName : 'statusFilter',
								paramValue1 : me.statusFilterVal,
								operatorValue : 'eq',
								dataType : 'S'
						  } );
				}
			}
		}
		return jsonArray;
	},

	getFilterUrl : function() {
		var me = this;
		me.setDataForFilter();
		var strFilterUrl = '';
		var strUrl = '';

		strFilterUrl = me.generateUrlWithFilterParams(this);
		if (!Ext.isEmpty(strFilterUrl)) {
			strUrl += strFilterUrl;
			isFilterApplied = true;
		}
		return strUrl;
	},

	generateUrlWithFilterParams : function(thisClass) {

		var filterDataObj = thisClass.filterData;
		if (!Ext.isEmpty(this.getMessageFormMstMainViewRef().globalFilterData)) {
			filterDataObj = this.getMessageFormMstMainViewRef().globalFilterData;
		}
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';

		for (var index = 0; index < filterDataObj.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';

			switch (filterDataObj[index].operatorValue) {
				case 'eq' :
					strTemp = strTemp + filterDataObj[index].paramName + ' '
							+ filterDataObj[index].operatorValue + ' ' + '\''
							+ filterDataObj[index].paramValue1 + '\'';
					break;
				case 'in' :
					var arrId = filterDataObj[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterDataObj[index].paramName
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
					strTemp = strTemp + filterDataObj[index].paramName + ' '
							+ filterDataObj[index].operatorValue + ' ' + '\''
							+ filterDataObj[index].paramValue1 + '\'';
					break;
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';

		this.getMessageFormMstMainViewRef().globalFilterReportData = strFilter;

		return strFilter;
	},
	handleSavePreferences : function() {
		var me = this;
		me.savePreferences();
	},
	savePreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null;
		var strUrl = me.urlGridPref;
		var arrColPref = new Array();
		var arrPref = new Array();
		var grid = massageFormMstGrid;
		if (!Ext.isEmpty(grid)) {
			arrCols = massageFormMstGrid.headerCt.getGridColumns();
			for (var j = 0; j < arrCols.length; j++) {
				objCol = arrCols[j];
				if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
						&& objCol.itemId.startsWith('col_')
						&& !Ext.isEmpty(objCol.xtype)
						&& objCol.xtype !== 'actioncolumn'
						&& objCol.itemId !== 'col_textaction')
					arrColPref.push({
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden
							});

			}
			objPref.pgSize = massageFormMstGrid.pageSize;
			objPref.gridCols = arrColPref;
			arrPref.push(objPref);
		}

		if (arrPref) {
			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
								if (!Ext.isEmpty(me.getBtnSavePreferencesRef()))
									me.getBtnSavePreferencesRef()
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
											cls : 'ux_popup',
											icon : imgIcon
										});
							} else {
								me.saveFilterPreferences();
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('filterPopupTitle',
												'Error'),
										msg : getLabel('filterPopupMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	saveFilterPreferences : function() {
		var me = this;
		var strUrl = me.urlGridFilterPref;
		var objFilterPref = {};
		var objQuickFilterPref = {};

		objQuickFilterPref.formGroup = me.formGroupFilterVal;
		objQuickFilterPref.formDestination = me.formDestinationFilterVal;
		objQuickFilterPref.status = me.statusFilterVal;
		objQuickFilterPref.sellerFilter = me.sellerFilterVal;

		objFilterPref.quickFilter = objQuickFilterPref;
		// objFilterPref.push(objQuickFilterPref);

		if (objFilterPref) {
			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
											cls : 'ux_popup',
											icon : Ext.MessageBox.INFO
										});
							} else if (data.d.preferences
									&& data.d.preferences.success === 'N'
									&& data.d.error
									&& data.d.error.errorMessage) {
								if (!Ext.isEmpty(me.getBtnSavePreferencesRef()))
									// me.toggleSavePrefrenceAction( true );
									Ext.MessageBox.show({
												title : title,
												msg : data.d.error.errorMessage,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
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
												'filterPopupMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},

	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferencesRef();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},

	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		// TODO : Localization to be handled..

		if (!Ext.isEmpty(objDefaultGridViewPref)) {
			var data = Ext.decode(objDefaultGridViewPref);

			var strFormGroupValue = data.quickFilter.formGroup;
			var strFormDestinationValue = data.quickFilter.formDestination;
			var strStatusValue = data.quickFilter.status;
			var strSellerFilterValue = data.quickFilter.sellerFilter;
		}

		if (!Ext.isEmpty(strFormGroupValue) && strFormGroupValue != 'all') {
			arrJsn.push({
						paramName : 'formGroup',
						paramValue1 : strFormGroupValue,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(strFormDestinationValue)
				&& strFormDestinationValue != 'all') {
			arrJsn.push({
						paramName : 'formDestination',
						paramValue1 : strFormDestinationValue,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (!Ext.isEmpty(strStatusValue) && strStatusValue != 'all') {
			arrJsn.push({
						paramName : 'submitFlag',
						paramValue1 : strStatusValue,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(strSellerFilterValue) && strSellerFilterValue != 'all') {
			arrJsn.push({
						paramName : 'entitledSellerId',
						paramValue1 : strSellerFilterValue,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		me.filterData = arrJsn;
		me.getMessageFormMstMainViewRef().globalFilterData = arrJsn;
	}
	,
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form){
		var me = this;
		var arrJsn = {};
		var clinetFilterField = null;
		var sellerFilterField = null;
		var selectedSellerId = null;
		sellerFilterField = me.getSellerField();
		if (!Ext.isEmpty(sellerFilterField)
				&& !Ext.isEmpty(sellerFilterField.getValue())) {
			selectedSellerId = sellerFilterField.getValue();
		} else {
			selectedSellerId = strSellerId;
		}
		var clinetFilterField = null;
		var fldGroupFilterVal = me.formGroupFilterVal;
		var fldFormDestinationVal = me.formDestinationFilterVal;
		var fldStatusFilterVal = me.statusFilterVal;
		
		arrJsn['sellerId'] = selectedSellerId;
		arrJsn['group']= fldGroupFilterVal;
		arrJsn['formDestination']= fldFormDestinationVal;
		arrJsn['status']= fldStatusFilterVal;
		return arrJsn;
	},
	setFilterRetainedValues : function(){
		var me = this;
		var clinetFilterField = null;
		var fldGroupFilterVal = me.formGroupFilterVal;
		var fldFormDestinationVal = me.formDestinationFilterVal;
		var fldStatusFilterVal = me.statusFilterVal;
		// Set Seller Id Filter Value
		var selectedSellerId = me.getSellerField();
		if(!Ext.isEmpty(selectedSellerId)){
        selectedSellerId.setValue(strSellerId);
		}
				
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfo',
					listeners : {
						beforeshow : function(tip) {
							var clientValue = '';
							var grp='';
							var dest = '';
							var FI = me.getSellerField().getRawValue();
							var msgFilterView = me.getMessageFormMstFilterView();
							var formGrp = msgFilterView.down('combobox[itemId=formGroupFilterItemId]');
							var formDest = msgFilterView.down('combobox[itemId=formDestinationFilterItemId]');
							var status = msgFilterView.down('combobox[itemId=requestStateFilterItemId]');
							if (!Ext.isEmpty(formGrp)
									&& !Ext.isEmpty(formGrp.getValue())) {
								grp =formGrp.getValue();
							}else
								grp = getLabel('none','None');	
							if (!Ext.isEmpty(formDest)
									&& !Ext.isEmpty(formDest.getValue())) {
								dest =formDest.getValue();
							}else
								dest = getLabel('none','None');	
							if (!Ext.isEmpty(status)
									&& !Ext.isEmpty(status.getValue())) {
								status = status.getRawValue();
							}else
								status = getLabel('all','ALL');	
							tip.update(getLabel('financialinstitution', 'Financial Institution') + ' : ' 
							        + FI + '<br/>'
									+getLabel('formGroup', 'Form Group') + ' : '
									+ grp+ '<br/>'
									+getLabel('formDestination', 'Form Destination') + ' : '
									+ dest+ '<br/>'
									+ getLabel('status', 'Status')+':'
									+ status);
						}
					}
				});
	}
});
