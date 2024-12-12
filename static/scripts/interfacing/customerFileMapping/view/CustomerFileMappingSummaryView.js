Ext.define('GCP.view.CustomerFileMappingSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'customerFileMappingSummaryView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.CustomerFileMappingSummaryFilterView',
			'GCP.view.CustomerFileMappingSummaryInfoView',
			'GCP.view.CustomerFileMappingSummaryTitleView', 'Ext.tab.Panel',
			'Ext.tab.Tab', 'Ext.layout.container.HBox', 'Ext.form.Label',
			'Ext.button.Button', 'Ext.Img', 'Ext.panel.Panel',
			'Ext.ux.portal.WidgetContainer', 'Ext.form.field.Text',
			'Ext.container.Container', 'Ext.form.RadioGroup'],
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var groupView = me.createGroupView();
		var menuItems = null;
		me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {};
		/*if (objGridViewPref) {
			var objJsonData = Ext.decode(objGridViewPref);
			objGroupByPref = objJsonData || {};
		}
		*/
		if (objPreference) {
			var objJsonData = Ext.decode(objPreference);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (CLIENT_INTERFACE_GENERIC_COLUMN_MODEL || '[]');
		}
		var cfgGroupByUrl = 'services/grouptype/customerFileMapping/groupBy.srvc';
		var strWidgetFilter = null;
		if(entityType == '0'){
			strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+ '&$filterGridId=GRD_ADM_INTERFACECEN' +'&$filter=seller eq '+'\''+strSeller+'\''+ '&$filterscreen=BANKADMIN';
		}
		else{
			strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+ '&$filterGridId=GRD_ADM_INTERFACECEN' +'&$filter=entityCode eq '+'\''+strClientId+'\' and seller eq '+'\''+strSeller+'\''+ '&$filterscreen=CLIENT';
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : getLabel('interfaces', 'Interfaces'),
					cfgGroupByLabel : getLabel('groupBy', 'Group By'),
					//padding:'12 0 0 0',
					cfgShowFilter:true,
					cfgShowRefreshLink : false,
					cfgSmartGridSetting : true,
					cfgGroupCode : objGeneralSetting.defaultGroupByCode||null,
					cfgParentCt : me,
					cfgCaptureColumnSettingAt : 'G',
					cfgPrefferedColumnModel : arrColumnSetting,			
					cls : 't7-grid',
					//cfgShowRefreshLink : false,
					enableQueryParam:false,
					cfgAutoGroupingDisabled : true,
					cfgFilterModel : {
					cfgContentPanelItems : [{
								xtype : 'customerFileMappingSummaryFilterView'
							}],
					cfgContentPanelLayout : {
						type : 'vbox',
						align : 'stretch'
						}
					},
					cfgGridModel : {
						pageSize : objGridSetting.defaultRowPerPage ||_GridSizeMaster,
						rowList : _AvailableGridSize,
						stateful : false,
						heightOption : objGridSetting.defaultGridSize,
						showPagerRefreshLink : false,
						//hideRowNumbererColumn : true,
						showCheckBoxColumn : true,
						checkBoxColumnWidth : _GridCheckBoxWidth,
						//showSummaryRow : true,
						enableColumnAutoWidth : _blnGridAutoColumnWidth,
						showEmptyRow : false,
						showPager : true,
						hideRowNumbererColumn : true,
						minHeight : 100,
						showSorterToolbar : _charEnableMultiSort,
						storeModel : {
							fields :
							[
									'mapId','interfaceName','interfaceType','reportTypeDesc','interfaceFlavor','parentInterfaceName','interfaceMedium',
									'interfaceCateory','entityCode','__metadata','identifier','requestStateDesc','recordKeyNo',
									'viewState','version','interfaceRecordKeyNmbr','interfaceVersion','interfaceMapMasterViewState',
									'standardCount','customisedCount','securityProfileId','securityProfileName','history','clientId','clientDesc','interfaceModule','entityType'
							],
							proxyUrl : 'customerFileMappingData/',
							rootNode : 'd.interfaceMapSummary',
							totalRowsNode : 'd.__count'
						},
						defaultColumnModel : me.getDefaultColumnModel(),
						groupActionModel : me.getGroupActionModel(),
						/**
						 * @cfg{Function} fnColumnRenderer Used as default
						 *                column renderer for all columns if
						 *                fnColumnRenderer is not passed to the
						 *                grids column model
						 */
						fnColumnRenderer : me.columnRenderer,
						fnRowIconVisibilityHandler : me.isRowIconVisible
					}
				});			
		return groupView;
	},
	getDefaultColumnModel : function() {
		var me = this, columnModel = null;
		columnModel = me.getColumns( CLIENT_INTERFACE_GENERIC_COLUMN_MODEL|| []);
		return columnModel;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push( me.createActionColumn() );
		if( !Ext.isEmpty( arrColsPref ) )
		{
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				objCol = arrColsPref[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
				}
				cfgCol.hidden=objCol.hidden;
				cfgCol.locked=objCol.locked;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				if(cfgCol.colId == 'requestStateDesc')
					cfgCol.sortable= false;
				cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width  : objClientInterfaceGridWidthMap[ objCol.colId ];
				//cfgCol.width =  200;
				if(cfgCol.colId == 'clientDesc'){
					if(clientCount > 1){
						arrCols.push( cfgCol );
					}
				}
				else{
					arrCols.push( cfgCol );
				}
			}
		}
		return arrCols;
	},	
	
	createActionColumn : function( widgetCodeVal )
	{
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'actioncontent',
			width : 108,
			colHeader: getLabel('actions', 'Actions'),
			sortable : false,
			locked : true,
			lockable: false,
			hideable: false,
			visibleRowActionCount : 1,
			items : [
						{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Modify Record'),
						itemLabel : getLabel('editToolTip', 'Modify Record'),
						maskPosition : 1
					},
						{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						itemLabel : getLabel('viewToolTip', 'View Record'),
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 9
					},  {
						itemId : 'btnSubmit',
						itemCls : 'grid-row-action-icon icon-submitBtn',
						itemLabel : getLabel('actionSubmit', 'Submit'),
						toolTip : getLabel('actionSubmit', 'Submit'),
						maskPosition : 2
					},{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						toolTip : getLabel('historyToolTip', 'View History'),
						maskPosition : 10
					},{
						itemId : 'btnSecurityProfile',
						itemCls : 'grid-row-action-icon icon-security',
						itemLabel : getLabel('securityPrfToolTip', 'Security Profile'),
						toolTip : getLabel('securityPrfToolTip', 'Security Profile'),
						maskPosition : 1
					},
					{
						itemId : 'customInterfaceDiscard',
						itemCls : 'grid-row-action-icon icon-discard',
						itemLabel : getLabel('actionDiscard', 'Discard'),
						toolTip : getLabel('actionDiscard', 'Discard'),
						maskPosition : 7
					},
					{
						itemId : 'customInterfaceReject',
						itemCls : 'grid-row-action-icon icon-rejectBtn',
						itemLabel : getLabel('actionReject', 'Reject'),
						toolTip : getLabel('actionReject', 'Reject'),
						maskPosition : 4
					},
					{
						itemId : 'customInterfaceApprove',
						itemCls : 'grid-row-action-icon icon-submitBtn',
						itemLabel : getLabel('actionApprove', 'Approve'),
						toolTip : getLabel('actionApprove', 'Approve'),
						maskPosition : 3
					},
					{
						itemId : 'customInterfaceEnable',
						itemCls : 'grid-row-action-icon icon-enableBtn',
						itemLabel : getLabel('actionEnable', 'Enable'),
						toolTip : getLabel('actionEnable', 'Enable'),
						maskPosition : 5
					},
					{
						itemId : 'customInterfaceDisable',
						itemCls : 'grid-row-action-icon icon-enableBtn',
						itemLabel : getLabel('actionDisable', 'Suspend'),
						toolTip : getLabel('actionDisable', 'Suspend'),
						maskPosition : 6
					}
					/*,{
						itemId : 'clone',
						text : 	'Copy Record',
						itemLabel : getLabel('actionClone', 'Copy Record'),
						toolTip : getLabel( 'actionClone', 'Copy Record' ),
						maskPosition : 8
					}*/]
		};
		return objActionCol;
	},
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var me=this;
			var strRetValue = "";
			
			if(colId === 'col_securityProfileId')
			{					
				strRetValue = record.get('securityProfileName');
				//strRetValue += '<a style="color:blue" href="#" id="selectSecurityProfile">'+getLabel('selectSecurityPrf','..Select')+'</a>';
			}
			else if(colId === 'col_interfaceModule')
			{		
				var configLabel = 'lbl.modules.{0}';
				var formattedLabelCode = Ext.String.format(configLabel, value);
				strRetValue = getLabel(formattedLabelCode, value);
			}
			else{
				strRetValue = value;
			}
			meta.tdAttr = 'title="' + strRetValue + '"';
			return strRetValue;
	},

	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Approve','Reject','Enable','Disable','Submit','Discard'];
		var objActions = {
			'Approve' : {
				actionName : 'customInterfaceApprove',
				// itemCls : 'icon-button icon-discard',
				disabled : false,
				itemText : getLabel('actionApprove', 'Approve'),
				maskPosition : 3
			},
			'Reject' : {
				actionName : 'customInterfaceReject',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('actionReject', 'Reject'),
				disabled : false,
				maskPosition : 4
			},
			'Enable' : {
				actionName : 'customInterfaceEnable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('actionEnable', 'Enable'),
				disabled : false,
				maskPosition : 5
			},
			'Disable' : {
				actionName : 'customInterfaceDisable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('actionDisable', 'Suspend'),
				disabled : false,
				maskPosition : 6
			},
			'Submit' : {
				actionName : 'customInterfaceSubmit',
				// itemCls : 'icon-button icon-submit',
				itemText : getLabel('actionSubmit', 'Submit'),
				disabled : false,
				maskPosition : 2
			},
			'Discard' : {
				actionName : 'customInterfaceDiscard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('actionDiscard', 'Discard'),
				disabled : false,
				maskPosition : 7
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		var maskSize = 10;
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
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
});