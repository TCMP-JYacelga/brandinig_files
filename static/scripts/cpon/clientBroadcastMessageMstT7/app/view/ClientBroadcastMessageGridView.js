Ext.define('GCP.view.ClientBroadcastMessageGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel','GCP.view.ClientBroadcastMessageFilterView'],
	xtype : 'clientBroadcastMessageGridView',	
	initComponent : function() {
				var me = this;	
				var groupView = me.createGroupView();
				me.items = [groupView];
				me.on('resize', function() {
							me.doLayout();
					});
		this.callParent(arguments);
	},
		createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objGroupByPref = {}
		
		/*if (objGridViewPref) {
			var objJsonData = Ext.decode(objGridViewPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}*/
		if (objGridViewPref) {
			var objJsonData = Ext.decode(objGridViewPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (CLIENT_BROADCAST_COLUMN_MODEL || '[]');
		}

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/clientBroadcastMsg/groupBy.json?$filterGridId=GRD_ADM_BROADCASTMSG',
			//cfgGroupByUrl : 'static/scripts/cpon/clientBroadcastMessageMstT7/data/groupBy.json',
			cfgSummaryLabel : 'Broadcast Message',  
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'clientBroadcastMessageFilterView' 
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createActionColumn()]
			},
			// minHeight : 400,
			// renderTo : 'summaryDiv',
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				showSorterToolbar : _charEnableMultiSort,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				//minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : false,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
							fields : [ 'identifier','htmlFileDesc', 'messageBody','messageName','startDateTime',
									'displayLevel', 'primaryKey', 'textorHtmlDesc', 'uploadFileName',
									'version', 'recordKeyNo', 'htmlFileName', 'broadcastId', '__metadata'
									],
							 proxyUrl : 'cpon/clientBroadcastMessage.json',
							 rootNode : 'd.profile',							 
							 totalRowsNode : 'd.__count'
				},
				/**
				 * @cfg {Array} groupActionModel This is used to create the
				 *      items in Action Bar
				 * 
				 * @example
				 * The example for groupActionModel as below : 
				 * 	[{
				 *	  //@requires Used while creating the action url.
				 *		actionName : 'submit',
				 *	  //@optional Used to display the icon.
				 *		itemCls : 'icon-button icon-submit',
				 *	  //@optional Defaults to true. If true , then the action will considered
				 *	            in enable/disable on row selection.
				 *		isGroupAction : false,
				 *	  //@optional Text to display
				 *		itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				 *	  //@requires The position of the action in mask.
				 *		maskPosition : 5
				 *	  //@optional The position of the action in mask.
				 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
				 *						record) {
				 *		},
				 *	}, {
				 *		actionName : 'verify',
				 *		itemCls : 'icon-button icon-verify',
				 *		itemText : getLabel('instrumentsActionVerify', 'Verify'),
				 *		maskPosition : 13
				 *}]
				 */
				//groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(CLIENT_BROADCAST_COLUMN_MODEL || []),
				/**
				 * @cfg{Function} fnColumnRenderer Used as default column
				 *                renderer for all columns if fnColumnRenderer
				 *                is not passed to the grids column model
				 */
				fnColumnRenderer : me.columnRenderer,
				/**
				 * @cfg{Function} fnSummaryRenderer Used as default column
				 *                summary renderer for all columns if
				 *                fnSummaryRenderer is not passed to the grids
				 *                column model
				 */
				// fnSummaryRenderer : function(value, summaryData, dataIndex,
				// rowIndex, colIndex, store, view, colId) {
				// },
				/**
				 * @cfg{Function} fnRowIconVisibilityHandler Used as default
				 *                icon visibility handler for all columns if
				 *                fnVisibilityHandler is not passed to the grids
				 *                "actioncontent" column's actions
				 * 
				 * @example
				 * fnRowIconVisibilityHandler : function(store, record, jsonData,
				 *		iconName, maskPosition) { 
				 * 	return true;
				 *}
				 * 
				 * @param {Ext.data.Store}
				 *            store The grid data store
				 * @param {Ext.data.Model}
				 *            record The record for current row
				 * @param {JSON}
				 *            jsonData The response json data
				 * @param {String}
				 *            iconName The name of the icon
				 * @param {Number}
				 *            maskPosition The position of the icon action in
				 *            bit mask
				 * @return{Boolean} Returns true/false
				 */
				fnRowIconVisibilityHandler : me.isRowIconVisible

			}
		});
		return groupView;
	},
		isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) 
		{
			return true;
		},
		columnRenderer : function(value, meta, record, rowIndex,
								colIndex, store, view, colId) {
						var strRetValue = "";			
						if (colId == 'col_displayLevel') {						
							strRetValue = '<font color="red">'+ '<span title="' + value + '">' +getLabel(value,value) + '</span>' +'</font>';
						}
/*						else if (colId == 'col_messageName') {
								if (!Ext.isEmpty(record.data.textorHtmlDesc))
								{
									var htmlPathVal = record.data.textorHtmlDesc;									
									strRetValue =  '<span title="' + value + '">' + value + '</span>' + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:downloadView(\''+htmlPathVal+'\')">view</a>';
								}
						        else if(!Ext.isEmpty(record.data.messageBody))
								{
									var details = record.data.messageBody;
									details = details.replace(/([']|\\)/g, "\\$1");
									details = getDecodedValue(details);
									var subject = record.data.messageName;
									subject = subject.replace(/([']|\\)/g, "\\$1");
									subject = getDecodedValue(subject);
									var popupTitle = subject+' , '+record.data.startDateTime;
									var txtId = colId +'_'+rowIndex;
									strRetValue =  '<span title="' + value + '">' + value + '</span>' + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:showMsgPopup(\'' + popupTitle + '\', \'' + txtId + '\')";>view</a>';
									strRetValue = strRetValue + '&nbsp; <textarea id='+txtId+' cols="20" rows="20" style="display:none;">'+ details+' </textarea>';
								}
								else {
									strRetValue = '<span title="' + value + '">' + value + '</span>';
								}								
						}
*/						else if (colId == 'col_uploadFileName')
						{
								if (!Ext.isEmpty(record.data.uploadFileName))
								{
									strRetValue = '<a title="'+ value +'"><i id="downloadAttachment" class="fa fa-paperclip fa-rotate-90 fa-lg"/></a>';
								}
						}
						else {
							strRetValue = '<span title="' + value + '">' + value + '</span>';
						}						
						return strRetValue;
					},
					 showMsgPopup : function(popupTitle, details) {
						var msgPopup = Ext.create('GCP.view.ClientBroadcastDetailsPopup', {
							title: popupTitle,
							minHeight: 200,
							autoHeight: true,
							width: 500,
							resizable: false,
							recordDtl: details
						});
						msgPopup.show();		
					},
					downloadView : function(htmlUrl)					
					{
						if(!Ext.isEmpty(htmlUrl))
							 window.open(htmlUrl,"Ratting","left=250,top=180,width=600,height=400,0,status=0,");
					},
					downloadPDFFile : function(strFileName)					
					{
							var frm = document.getElementById('clientDownloadNewsForm');
							frm.target = "downloadWin";
							frm.action = "clientDownloadNewsAttachment.form";
							document.getElementById('downloadFileName').value = strFileName;
							frm.submit();
					},
					getColumnModel : function(arrColsPref) {
					
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						// arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colHeader;
								cfgCol.colId = objCol.colId;
								cfgCol.hidden = objCol.hidden;
								cfgCol.locked = objCol.locked;
								cfgCol.width = objCol.width;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}
								if(cfgCol.colId=='uploadFileName')
								{
									cfgCol.align = 'center';
								}								
								/*cfgCol.width = !Ext
										.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId]
										: 120;	*/																			
							cfgCol.fnColumnRenderer = me.columnRenderer;
							arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},
					createActionColumn : function()
					{
							var objActionCol =
							{
								colType : 'actioncontent',
								colId : 'actioncontent',
								colHeader : getLabel('action', 'Actions'),
								//visibleRowActionCount : 1,
								width : 130,
								locked : true,
								lockable : false,
								sortable : false,
								hideable : false,
								resizable : false,
								draggable : false,
								items :
								[
									{
										itemId : 'btnView',
										itemCls : 'grid-row-action-icon icon-view',
										toolTip : getLabel('viewToolTip', 'View Record'),
										itemLabel : getLabel('viewToolTip', 'View Record')								
									},
									{
										itemId : 'btnDownload',
										itemCls : 'grid-row-action-icon icon-view',
										toolTip : getLabel('lblAttachment', 'Attachment'),
										itemLabel : getLabel('lblAttachment', 'Attachment')									
									}
								 ]
							};							
						return objActionCol;
					}
	
});

function getDecodedValue(str)
{
	var parser = new DOMParser;
	var dom = parser.parseFromString(
	    '<!doctype html><body>' + str,
	    'text/html');
	var decodedString = dom.body.textContent;
	return decodedString ;
}