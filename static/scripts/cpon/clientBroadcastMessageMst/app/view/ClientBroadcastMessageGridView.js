Ext.define('GCP.view.ClientBroadcastMessageGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel'],
	xtype : 'clientBroadcastMessageGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
	/*	this.items = [{
			xtype : 'panel',
			width : '100%',
			collapsible : true,			
			cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
			title : getLabel('broadcastMessages', 'Broadcast Messages'),
			itemId : 'clientSetupDtlView',
			items : [{
						xtype : 'container',
						cls: 'ux_largepaddinglr ux_border-top',
						layout : 'hbox',
						items : []

					}]
		}];*/
		
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

		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/clientBroadcastMsg/groupBy.json?',
			//cfgGroupByUrl : 'static/scripts/cpon/clientBroadcastMessageMst/data/groupBy.json',
			cfgSummaryLabel : 'BROADCAST MESSAGES',  
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : null,
			cfgSubGroupCode : null,
			cfgParentCt : me,
			// minHeight : 400,
			// renderTo : 'summaryDiv',
			cfgGridModel : {
				pageSize : _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : []
				},
				storeModel : {
							fields : [ 'identifier','htmlFileDesc', 'messageBody','messageName','startDateTime',
									'displayLevel', 'primaryKey', 'textorHtmlDesc', 'uploadFileName',
									'version', 'recordKeyNo','__metadata'
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
				defaultColumnModel : me.getColumnModel(CLIENT_BROADCAST_COLUMN_MODEL),
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
		{},
		columnRenderer : function(value, meta, record, rowIndex,
								colIndex, store, view, colId) {
						var strRetValue = "";			
						if (colId == 'col_displayLevel') {						
							strRetValue = '<font color="red">'+ value +'</font>';
						}
						else if (colId == 'col_messageName') {
								if (!Ext.isEmpty(record.data.textorHtmlDesc))
								{
									var htmlPathVal = record.data.textorHtmlDesc;									
									strRetValue =  value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:downloadView(\''+htmlPathVal+'\')">view</a>';
								}
						        else if(!Ext.isEmpty(record.data.messageBody))
								{
									var details = record.data.messageBody;
									details = details.replace(/([']|\\)/g, "\\$1");
									var popupTitle = record.data.messageName+' , '+record.data.startDateTime;
									strRetValue =  value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:showMsgPopup(\'' + popupTitle + '\', \'' + details + '\')";>view</a>';
								}
								else {
									strRetValue = value;
								}								
						}
						else if (colId == 'col_uploadFileName')
						{
								if (!Ext.isEmpty(record.data.uploadFileName))
								{
									strRetValue = '<a href="#" onclick="javascript:downloadPDFFile(\''+record.data.uploadFileName+'\');" ><i class="fa fa-paperclip fa-rotate-90 fa-lg"/></a>';
								}
						}
						else {
							strRetValue = value;
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
					}
	

});