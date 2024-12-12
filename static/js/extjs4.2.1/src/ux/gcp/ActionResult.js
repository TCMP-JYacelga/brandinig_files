/**
 * @class Ext.ux.gcp.ActionResult
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.ActionResult', {
			extend : 'Ext.panel.Panel',
			xtype : 'actionresult',
			config : {
				storeData : null,
				currentPage : null,
				store : null
			},
			/**
		     * @cfg {boolean} header
		     * Whether to hide panel header
		     * defaults to true
		     */
			header : true,
			 /**
		     * @cfg {number} width
		     * width of component in pixels.
		     */
			width : '100%',
			/**
		     * @cfg {number} minHeight
		     * minimum Height of component in pixels.
		     */
			minHeight : 100,
			 /**
		     * @cfg {boolean} closable
		     * True to display the 'close' tool button and allow the user to close the window, false to hide the button and disallow closing the window.
		     */
			closable : 'true',
			/**
		     * @cfg {String} closeAction
		     * The action to take when the close header tool is clicked:
		     * defaults value : destroy 
		     */
			closeAction : 'hide',
			 /**
		     * @cfg {number} componentCls
		     * CSS Class to be added to a components root level element to give distinction to it via styling.
		     */
			componentCls : 'xn-panel',
			/**
			 * @cfg {String} title
			 * The title text to be used to display in the panel header. When a title is specified the Ext.panel.
			 * Header will automatically be created and displayed unless header is set to false.
			 */
			title : 'Recent Action Result',
			hidden : true,
			autoHeight : true,
			defaultFields :  ['status','serialNo','actualSerailNo', 'actionMessage','lastActionUrl','parentRecord','errors','success'],
			fields : [],
			transactionInfo : null,
					
			initComponent : function() {
				var me = this;
				var actionItems =  null;
				var storeFields = !Ext.isEmpty(me.fields) ? me.fields : [];
				storeFields = me.defaultFields.concat(storeFields);
				this.config.store = Ext.create('Ext.data.Store', {
							fields : storeFields,
							autoLoad : false,
							pageSize : 1
						});
				actionItems = me.generateActionItems();
				if(!Ext.isEmpty(me.id))
						me.itemId = me.id;
				this.items = [{
					xtype : 'grid',
					hideHeaders : true,
					width : '100%',
					height : 'auto',
					viewConfig : {
						stripeRows : false
					},
					store : this.config.store,
					columns : [
					{
						xtype : 'actioncolumn',
						hideable : false,
						sortable : false,
						align : 'center',
						width : '5%',
						tdCls : 'xn-grid-cell-padding xn-no-border xn-valign-middle',
						items : [{
							scope : this,
							getClass : me.getStatusIcon
						}]
					}, {
						dataIndex : 'actionMessage',
						sortable : false,
						hideable : false,
						width : '80%',
						tdCls : 'xn-grid-cell-padding xn-no-border xn-valign-middle',
						renderer : function(value, metaData, record) {
							return value;
						}
					}, {
						xtype : 'actioncolumn',
						hideable : false,
						sortable : false,
						align : 'left',
						tdCls : 'xn-grid-cell-padding xn-no-border xn-valign-middle',
						width : '15%',
						items : actionItems
					}]
				}];
				this.dockedItems = [{
							xtype : 'toolbar',
							dock : 'bottom',
							displayInfo : true,
							items : [{
										btnId : 'btnPrev',
										text : '<<',
										handler : function()
										{
											me.handlePagination('prev');
										}
									}, '->', {
										btnId : 'btnNext',
										text : '>>',
										handler : function()
										{
											me.handlePagination('next');
										}
									}]
						}];
				this.callParent();
			},
			getStatusIcon : function (value, metaData, record,	rowIndex, colIndex, store, view)
			{
				if (record.get('status') === 'SUCCESS')
					return 'icon_success';
				else if (record.get('status') === 'WARN')
					return 'icon_warn';
				else if (record.get('status') === 'ERROR')
					return 'icon_error';
				
			},
			generateActionItems : function()
			{
				var me = this;
				var arrItem = [];
				var objItem = {};
				var isVisible = null,objTemp = null,itemCls = '';
				var jsonData = null;
				if(!Ext.isEmpty(me.actions))
					{
						for(var i = 0;i<me.actions.length;i++)
							{
								objTemp = me.actions[i];
								objItem = {};
								objItem.itemId = objTemp.itemId;
								isVisible = objTemp.fnVisibilityHandler;
								itemCls = objTemp.itemCls + ' cursor_pointer x_margin_r_5';
								if(!Ext.isEmpty(objTemp.toolTip))
									objItem.tooltip =  objTemp.toolTip;
								if(!Ext.isEmpty(isVisible) && (isVisible === true || isVisible === false || typeof isVisible == 'function'))
										{
												objItem.getClass =Ext.Function.bind(
													function(value, metaData, record, rowIndex,	colIndex, store, view, itmCls,itmId) {
															var isEnabled = false;
															jsonData = store.proxy.reader.jsonData;
															if(typeof isVisible == 'function')
																isEnabled = isVisible(store,record,jsonData,itmId);
															else
																isEnabled = isVisible;
															if (isEnabled)
																return itmCls;
															else
																return 'xn-hide';
											},'',[itemCls,objTemp.itemId], true);
										}
								if(!Ext.isEmpty(objTemp.fnClickHandler))
									objItem.handler=objTemp.fnClickHandler;
								arrItem.push(objItem);
							}
					}
				return arrItem;
			},
			handlePagination : function(strAction) {
				var me = this;
				var errorGrid = me.down('grid');
				var prev, next, totalRecords;
				var storeData = me.storeData;
				var currentPage = me.currentPage;
				if (!Ext.isEmpty(storeData)) {
					totalRecords = storeData.length;
					switch (strAction) {
						case 'next' :
							next = currentPage + 1;
							if (next <= totalRecords) {
								errorGrid.setLoading(true);
								errorGrid.store.removeAll();
								me.currentPage = next;
								errorGrid.store.loadData([storeData[next - 1]]);
								errorGrid.reconfigure();
								errorGrid.setLoading(false);
							}
							break;
						case 'prev' :
							prev = currentPage - 1;
							if (prev > 0 && prev <= totalRecords) {
								errorGrid.setLoading(true);
								me.currentPage = prev;
								errorGrid.store.loadData([storeData[prev - 1]]);
								errorGrid.reconfigure();
								errorGrid.setLoading(false);
							}
							break;
					}
				}
			},
			clearActionResult : function() {
				var me = this;
				var errorGrid = me.down('grid');
				if (me)
					me.storeData = null;
				if (errorGrid)
					errorGrid.store.removeAll();
			},
			getGrid : function() {
				return this.down('grid');
			},
			getData : function() {
				return this.storeData;
			},
			setData : function(data) {
				this.storeData = data;
			},
			setCurrentPage : function(pgNo) {
				this.currentPage = pgNo;
			},
			getCurrentPage : function() {
				return this.currentPage;;
			},
			handleActionResult : function(resultData , grid, strLastActionUrl) {
				if(Ext.isEmpty(grid) || Ext.isEmpty(resultData))
					return false;
				var me = this;
				var arrActionMsg = new Array(),intValue = 0,msg = '', errCode = '', record = '',status='',txnDetails='',arrTxnInfo = new Array();
				var strActionSuccess ='Action Successful';
				var cfg = {};
				
				if(!Ext.isEmpty(me.transactionInfo) && Ext.isArray(me.transactionInfo))
					arrTxnInfo = me.transactionInfo;
				else if(!Ext.isEmpty(me.transactionInfo) && Ext.isArray(me.transactionInfo))
					arrTxnInfo = me.transactionInfo;
					
				for(var i = 0; i<resultData.length;i++){
					var result = resultData[i];
					if(result.serialNo)
					{
						txnDetails = '';
						record = grid.getRecord(result.serialNo);
						intValue = grid.getRowNumber(result.serialNo);
						if (intValue == 'undefined' ||intValue == null)
							intValue = parseInt(result.serialNo);
						msg = '';
						for (var j=0;j<result.errors.length;j++){
									var error = result.errors[j];
									msg = msg + error.code + ' : ' + error.errorMessage	+ '<br/>';
									errCode = error.code;
								}
						for(var k = 0;k<arrTxnInfo.length;k++) {
								txnDetails = txnDetails + arrTxnInfo[k].label + ' : <b>'+ record.get(''+arrTxnInfo[k].dataNode) + '</b><br/>';
							}
						msg =  	'# '+intValue	+ '<br/>' + txnDetails + msg;
						if(result.success === 'Y')
							status = 'SUCCESS';
						else if(result.success === 'N')
							status = 'ERROR';
						var cfg ={
								success : result.success,
								status : status,
								serialNo : intValue,
								actualSerailNo : result.serialNo,
								lastActionUrl : strLastActionUrl,
								parentRecord : record,
								actionMessage : result.success === 'Y'	? strActionSuccess : msg,
								errors : result.errors
							};
						for(var a = 0 ;a<me.fields.length;a++) {
								var strFld = me.fields[a];
								cfg[strFld] = result[strFld];
							
							}
						arrActionMsg.push(cfg);
						me.loadActionResultData(arrActionMsg);
						me.show();
					}
				}
				
			},
			updateActionResult : function(resultData , strLastActionUrl, errRecord ) {
				if(Ext.isEmpty(resultData))
					return false;
				var me = this;
				var arrActionMsg = new Array(),intValue = 0,msg = '', errCode = '', record = '',status='',txnDetails='',arrTxnInfo = new Array();
				var strActionSuccess ='Action Successful';
				var cfg = {};
				
				if(!Ext.isEmpty(me.transactionInfo) && Ext.isArray(me.transactionInfo))
					arrTxnInfo = me.transactionInfo;
				else if(!Ext.isEmpty(me.transactionInfo) && Ext.isArray(me.transactionInfo))
					arrTxnInfo = me.transactionInfo;
					
					var result = resultData;
					if(result.serialNo)
					{
						txnDetails = '';
						record = errRecord;
						intValue = errRecord.get('serialNo');
						if (intValue == 'undefined' ||intValue == null)
							intValue = parseInt(result.serialNo);
						msg = '';
						for (var j=0;j<result.errors.length;j++){
									var error = result.errors[j];
									msg = msg + error.code + ' : ' + error.errorMessage	+ '<br/>';
									errCode = error.code;
								}
						for(var k = 0;k<arrTxnInfo.length;k++) {
								txnDetails = txnDetails + arrTxnInfo[k].label + ' : <b>'+ record.get(''+arrTxnInfo[k].dataNode) + '</b><br/>';
							}
						msg =  	'# '+intValue	+ '<br/>' + txnDetails + msg;
						if(result.success === 'Y')
							status = 'SUCCESS';
						else if(result.success === 'N')
							status = 'ERROR';
						var cfg ={
								success : result.success,
								status : status,
								serialNo : intValue,
								actualSerailNo : result.serialNo,
								lastActionUrl : strLastActionUrl,
								parentRecord : record,
								actionMessage : result.success === 'Y'	? strActionSuccess : msg,
								errors : result.errors
							};
						for(var a = 0 ;a<me.fields.length;a++) {
								var strFld = me.fields[a];
								cfg[strFld] = result[strFld];
							
							}
						arrActionMsg.push(cfg);
						me.updateActionResultData(arrActionMsg);
						me.show();
					}
				
			},
			loadActionResultData : function(data)
			{
				var me = this;
				var errorGrid = me.down('grid');
				if (!Ext.isEmpty(data) && Ext.isArray(data)) {
					me.clearActionResult();
					var storeData = me.getData();
					var errorGrid = me.getGrid();
					if (!storeData) {
							storeData = data;
							me.setData(storeData);
					} else {
						if (data) {
							for(var k=0;k<data.length;k++)
								storeData.push(data[k]);
							storeData = storeData.sort(function(valA, valB) {
										return valA.serialNo - valB.serialNo
									});
							me.setData(storeData);
						}
					}
					me.setCurrentPage(1);
					if(!Ext.isEmpty(errorGrid))
						{
							errorGrid.store.loadData([storeData[0]]);
							errorGrid.reconfigure();
						}
				}
			},
			updateActionResultData : function(data)
			{
				var me = this;
				var errGrid = me.down('grid');
				if (!Ext.isEmpty(data) && Ext.isArray(data)) {
					var storeData = me.getData();
					if (!Ext.isEmpty(storeData)) {
						for (var i = 0; i < storeData.length; i++) {
							if (storeData[i].serialNo === data[0].serialNo) {
								storeData[i] = data[0];
								
								me.setCurrentPage(i+1);
								me.setData(storeData);
								if(!Ext.isEmpty(errGrid)) {
										errGrid.store.loadData([storeData[i]]);
										errGrid.reconfigure();
									}
							}
						}
					}
				}
			}

		});