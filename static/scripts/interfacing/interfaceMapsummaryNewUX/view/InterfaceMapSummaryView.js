Ext.define('GCP.view.InterfaceMapSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interfaceMapSummaryView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.InterfaceMapSummaryFilterView',
			'GCP.view.InterfaceMapSummaryInfoView',
			'GCP.view.InterfaceMapSummaryTitleView', 'Ext.tab.Panel',
			'Ext.tab.Tab', 'Ext.layout.container.HBox', 'Ext.form.Label',
			'Ext.button.Button', 'Ext.Img', 'Ext.panel.Panel',
			'Ext.ux.portal.WidgetContainer', 'Ext.form.field.Text',
			'Ext.container.Container', 'Ext.form.RadioGroup'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		var menuItems = null;
		if (isBankFlag === 'true') {
			menuItems = [
					{
							//xtype : 'panel',//Commented as Button text was being overlapped.
						xtype : 'toolbar',
						itemId : 'uploadId',
						margin : '12 0 0 0',
						layout :
						{
							type : 'hbox'
						},
						items :
						[
						/*{
							xtype : 'label',
							margin : '7 0 3 0',
							cls : 'ux_font-size14',
							text : getLabel('createNew', 'Create : ')
						},*/ {
							xtype : 'button',
							itemId : 'uploadDefId',
							name : 'alert',
							//margin : '7 0 5 0',
							text : getLabel('uploadDefinition','Create Upload Definition'),
							glyph : 'xf055@fontawesome',
							cls : 'ux_toolbar xn-btn ux-button-s'
						}, {
							xtype : 'button',
							itemId : 'downloadDefId',
							name : 'alertDownload',
							//margin : '7 0 5 0',
							text : getLabel('downloadDefinition','Create Download Definition'),
							disabled : false,
							glyph : 'xf055@fontawesome',
							cls : 'ux_toolbar xn-btn ux-button-s'
						}]
					}];
		}
		me.items = [{
			xtype : 'interfaceMapSummaryTitleView',
			cls : 'ux_no-border ux_largepaddingtb ',
			width : '100%'
				// margin : '0 0 1 0'
			}, {
			xtype : 'panel',
			layout : {
				type : 'hbox'
			},
			items : menuItems
		}, {
			xtype : 'interfaceMapSummaryFilterView',
			// margin : '0 0 10 0',
			title : getLabel('filterBy', 'Filter By: ')
		}, 
		
		groupView
		
		];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {};
		if (objGridViewPref) {
			var objJsonData = Ext.decode(objGridViewPref);
			objGroupByPref = objJsonData || {};
		}
		var cfgGroupByUrl = 'services/grouptype/interfaceMapCenter/groupBy.srvc';
		var strWidgetFilter = null;
		if(entityType == '0'){
			strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+strSeller+'\''+ '&$filterscreen=BANKADMIN';
		}
		else{
			strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+'&$filter=entityCode eq '+'\''+strClientId+'\' and seller eq '+'\''+strSeller+'\''+ '&$filterscreen=CLIENT';
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : 'Interfaces',
					cfgGroupByLabel : 'Group By',
					cfgGroupCode : objGroupByPref.groupCode || null,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					cfgGridModel : {
						pageSize : _GridSizeTxn,
						rowList : _AvailableGridSize,
						stateful : false,
						hideRowNumbererColumn : true,
						showCheckBoxColumn : true,
						showSummaryRow : true,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel : {
							fields :
							[
									'mapId','interfaceName','interfaceType','interfaceFlavor','parentInterfaceName','interfaceMedium',
									'interfaceCateory','entityCode','__metadata','identifier','requestStateDesc','recordKeyNo',
									'viewState','version','interfaceRecordKeyNmbr','interfaceVersion','interfaceMapMasterViewState',
									'standardCount','customisedCount','securityProfileId','securityProfileName','history','clientId','clientDesc','interfaceModule'
							],
							proxyUrl : 'loadUploadWidgetsData/',
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
		if(entityType == '0'){
			columnModel = me.getColumns( BANK_INTERFACE_GENERIC_COLUMN_MODEL|| []);
		}
		else{
			columnModel = me.getColumns( CLIENT_INTERFACE_GENERIC_COLUMN_MODEL|| []);
		}
		
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
				
				if(cfgCol.colId === 'schCnt' || cfgCol.colId === 'pregen')
				{
					cfgCol.align = "right";
				}
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
				}

				if( objCol.hidden === true )
				{
					cfgCol.hideable = true;
					cfgCol.hidden = true;
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				
				if(entityType == '0'){
						cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width  : objBankInterfaceGridWidthMap[ objCol.colId ];
				}
				else{
						cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width  : objClientInterfaceGridWidthMap[ objCol.colId ];
				}
								
				//cfgCol.width =  200;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},	
	
	createActionColumn : function( widgetCodeVal )
	{
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			align : 'right',
			sortable : false,
			locked : true,
			lockable: false,
			hideable: false,
			items : [
						{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit'),
						maskPosition : 1
					},
					{
						itemId : 'btnSubmit',
						itemCls : 'grid-row-action-icon icon-submitBtn',
						toolTip : getLabel('submitToolTip', 'Submit'),
						maskPosition : 2
					},	{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						itemLabel : getLabel('viewToolTip', 'View Record'),
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 9
					},{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip', 'View History'),
						toolTip : getLabel('historyToolTip', 'View History'),
						maskPosition : 10
					},{
						itemId : 'clone',
						text : 	'Copy Record',
						itemLabel : getLabel('actionClone', 'Copy Record'),
						toolTip : getLabel( 'actionClone', 'Copy Record' ),
						maskPosition : 8
					}]
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
				strRetValue += '<a style="color:blue" href="#" id="selectSecurityProfile">..Select</a>';
			}
			if(colId === 'col_interfaceModule')
			{		
				var configLabel = 'lbl.modules.{0}';
				var formattedLabelCode = Ext.String.format(configLabel, value);
				strRetValue = getLabel(formattedLabelCode, value);
			}
			else{
				strRetValue = value;
			}
			return strRetValue;
	},

	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Approve','Reject','Enable','Disable','Discard'];
		var objActions = {
			'Approve' : {
				actionName : 'interfaceApprove',
				// itemCls : 'icon-button icon-discard',
				disabled : false,
				itemText : getLabel('interfaceActionApprove', 'Approve'),
				maskPosition : 3
			},
			'Reject' : {
				actionName : 'interfaceReject',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('interfaceActionReject', 'Reject'),
				disabled : false,
				maskPosition : 4
			},
			'Enable' : {
				actionName : 'interfaceEnable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('interfaceActionEnable', 'Enable'),
				disabled : false,
				maskPosition : 5
			},
			'Disable' : {
				actionName : 'interfaceDisable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('interfaceActionDisable', 'Disable'),
				disabled : false,
				maskPosition : 6
			},
			'Discard' : {
				actionName : 'interfaceDiscard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('interfaceActionDiscard', 'Discard'),
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