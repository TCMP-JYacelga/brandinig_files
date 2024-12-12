Ext.define('GCP.view.Widget', {
	extend : 'Ext.ux.portal.Portlet',
	xtype : 'widget',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'Ext.toolbar.Toolbar', 'Ext.panel.Panel', 'Ext.button.Button', 
		'Ext.Img','Ext.util.Point','Ext.grid.column.Action','Ext.layout.container.HBox','Ext.form.Label','Ext.panel.Tool',
		'GCP.view.InterfaceMapGroupActionBarView'
	],
	anchor : '100%',
	frame : true,
	closable : false,
	collapsible : true,
	animCollapse : true,
	widgetModel : null,
//	avlActionsForWidget : [],
	visibleActions : [],
	autoHeight : true,
	widgetDesc : null,
	code : null,
	widgetCode : null,
	codeColumn : null,
	widgetEqCcy : null,
	widgetType : null,
	draggable : {
		moveOnDrag : false
	},
//	cls : 'x-portlet xn-panel',
	cls : 'xn-ribbon ux_nopanelpad ux_extralargemargin-bottom',
	getTools : function() {
		return [{
					xtype : 'tool',
					type : 'gear'
				}];
	},

	initComponent : function() {
		var me = this;
		var objWidthMap = null;
		var objBankWidthMap =
		{
			//"mapId" : 160,
			"clientDesc" :150,
			"interfaceName" : 160,
			"interfaceType" : 100,
			"interfaceFlavor" : 90,
			"parentInterfaceName" : 160,
			//"securityProfileId" : 70,
			"interfaceMedium" : 70,
			"interfaceCateory" : 100,
			"requestStateDesc" : 100
			
		};
		var objClientWidthMap =
		{
			//"mapId" : 160,
			"interfaceName" : 160,
			"interfaceType" : 100,
			"interfaceFlavor" : 90,
			"parentInterfaceName" : 160,
		 	"securityProfileId" : 180,
			"interfaceCateory" : 100,
			"requestStateDesc" : 100
		};
		
		if (!Ext.isEmpty(me.widgetModel)) {
			if(isBankFlag === 'false')
			{
				objWidthMap = objClientWidthMap;
			}
			else
			{
				objWidthMap = objBankWidthMap;
			}
			
			var viewActionBar = null, viewSmartGrid = null;
			var strTitle = "", objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;

			objPref = me.widgetModel;
			strTitle = me.widgetDesc;
			me.title = '<span class="block  ux-custom-header-font">' + strTitle + '</span>';
			me.itemId = me.widgetCode;
			arrColsPref = objPref.widgetPref.gridCols;
			arrCols = me.getColumns(arrColsPref,objWidthMap);
			
			pgSize = !Ext.isEmpty(objPref.widgetPref.pgSize)
					? parseInt(objPref.widgetPref.pgSize,10)
					: _GridSizeMaster;
			me.widgetDetails =
			{
				widgetCode : me.widgetCode,
				widgetDesc : me.widgetDesc,
				code : me.code,
				codeColumn : me.codeColumn,
				pgSize : pgSize
			};

			viewSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : Ext.String.format( 'uploadCenter_{0}', me.widgetCode ),
						itemId : Ext.String.format( 'uploadCenter_{0}', me.widgetCode ),
						pageSize : pgSize,
						stateful : false,
						showEmptyRow : false,
						rowList : _AvailableGridSize,
						height : 'auto',
						cls:' ux_largepaddinglr ux_largepadding-bottom ux_panel-transparent-background ux_border-top',
						columnModel : arrCols,
						hideRowNumbererColumn : true,
						storeModel : {
							fields :
								[
									'mapId','interfaceName','interfaceType','interfaceFlavor','parentInterfaceName','interfaceMedium',
									'interfaceCateory','entityCode','__metadata','identifier','requestStateDesc','recordKeyNo',
									'viewState','version','interfaceRecordKeyNmbr','interfaceVersion','interfaceMapMasterViewState',
									'standardCount','customisedCount','securityProfileId','securityProfileName','history','clientId','clientDesc'
								],
							proxyUrl : 'loadUploadWidgetsData/' + me.widgetType + '.srvc',
							rootNode : 'd.interfaceMapSummary',
							totalRowsNode : 'd.__count'
						},
						isRowIconVisible : me.isRowIconVisibleWidget,
						handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,menu, event, record) {
							me.handleMoreMenuItemClick(grid, rowIndex, cellIndex,menu, event, record);
						},
						handleRowIconClick : function(grid, rowIndex,columnIndex, btn, event, record) {
							me.handleRowIconClick(grid, rowIndex, columnIndex, btn,event, record);
						},

						listeners : {
							render : function(objGrid) {
								me.fireEvent('gridRender', me, objGrid,
										objGrid.store.dataUrl,
										objGrid.pageSize, 1, 1, null);
							},
							gridPageChange : function(objGrid, strDataUrl,
									intPgSize, intNewPgNo, intOldPgNo,
									jsonSorter) {
								me.widgetDetails.pgSize = intPgSize;
								me.fireEvent('gridPageChange', me, objGrid,
										strDataUrl, intPgSize, intNewPgNo,
										intOldPgNo, jsonSorter);
							},
							gridSortChange : function(objGrid, strDataUrl,
									intPgSize, intNewPgNo, intOldPgNo,
									jsonSorter) {
								me.fireEvent('gridSortChange', me, objGrid,
										strDataUrl, intPgSize, intNewPgNo,
										intOldPgNo, jsonSorter);
							},
							gridRowSelectionChange : function(objGrid,
									objRecord, intRecordIndex,
									arrSelectedRecords, jsonData) {
								me.fireEvent('gridRowSelectionChange', me,
										objGrid, objRecord, intRecordIndex,
										arrSelectedRecords, jsonData);
							},
							pagechange : function(pager, current, oldPageNum) {
								me.fireEvent('performComboPageSizeChange',
										pager, current, oldPageNum);
							},
							statechange : function(grid) {
								me.fireEvent('gridStateChange', grid);
							}
						}

					});

	viewSmartGrid.on( 'cellclick', function( view, td, cellIndex, record, tr, rowIndex, e, eOpts )
		{ 
			var anchorTagClicked = ( e.target.tagName == 'A' );
			var imgClicked = ( e.target.tagName == 'IMG' );
			var clickedId = e.target.id ;
			if( anchorTagClicked  && cellIndex == 1)
			{  
				//me.fireEvent('cloneProcess',record);
			}
			else if(clickedId == 'selectSecurityProfile')
			{
				me.fireEvent('selectSecurityProfile',record);
			}
			
		} );

		viewSmartGrid.store.on( 'load', function( store, records, options )
		{
			if( store.data.length == 0 )
			{
				 me.hide();
			}
			else
			{
				me.show();
			}
		} );
			
			var actionsForWidget = ['Submit','Approve','Reject','Enable','Disable','Discard'];
			if (!Ext.isEmpty(actionsForWidget)) {
				viewActionBar = Ext.create('GCP.view.InterfaceMapGroupActionBarView', {
							itemId : Ext.String.format('interfaceMapGroupActionBarView_{0}',me.widgetCode),
							cls:'ux_font-size14-normal',
							parent : me,
							avlActions : actionsForWidget
						});
				viewSmartGrid.addDocked({
							xtype : 'panel',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										text : 'Actions : ',
										cls : 'font_bold ux-ActionLabel',
										padding : '5 0 0 3'
									}, viewActionBar]
						}, 0);
			}

			me.items = [viewSmartGrid];
		}

		me.on('afterrender', function(panel) {
					if (!Ext.isEmpty(panel.header)
							&& !Ext.isEmpty(panel.header.titleCmp))
						panel.header.titleCmp.flex = 0;
				})
		Ext.EventManager.onWindowResize(function(w, h) {
					me.doComponentLayout();
				});
		this.callParent(arguments);
	},
	getColumns : function(arrColsPref,objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if( !Ext.isEmpty( objCol.colType ) )
					cfgCol.colType = objCol.colType;

				if( objCol.colHidden === true )
				{
					cfgCol.hideable = true;
					cfgCol.hidden = true;
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 60;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId) {
			var me=this;
			var strRetValue = "";
			
			if(colId === 'col_securityProfileId')
			{					
				strRetValue = record.get('securityProfileName');
				strRetValue += '<a style="color:blue" href="#" id="selectSecurityProfile">..Select</a>';
			}
			else{
				strRetValue = value;
			}
			return strRetValue;
	},
	handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,menu, event, record) {
		var me = this;
		var dataParams = null;
		if (!Ext.isEmpty(menu.dataParams))
			dataParams = menu.dataParams;
		if (!Ext.isEmpty(dataParams)){
			me.handleRowIconClick(grid,dataParams.rowIndex, dataParams.columnIndex, menu,event,dataParams.record);
		}
			
	},
	isRowIconVisibleWidget : function( store, record, jsonData, itmId, maskPosition )
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
		handleRowIconClick : function(grid, rowIndex, columnIndex, btn, event,record) {
		var me = this;
		var actionName = btn.itemId;
		if(actionName === 'btnEdit')
		{
			me.fireEvent('editProcess',record,rowIndex);
		}
		else if(actionName === 'btnView')
		{
			me.fireEvent('viewProcess',record,rowIndex);
		}
		else if(actionName === 'btnHistory')
		{
			me.fireEvent('historyProcess',record,rowIndex);
		}else if(actionName === 'clone')
		{
			me.fireEvent('cloneProcess',record);
		}
		else if(actionName === 'btnSubmit')
		{
			me.fireEvent('submitProcess',record);
		}
	}
});
