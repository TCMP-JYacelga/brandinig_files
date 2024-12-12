/**
 * @class Ext.ux.gcp.PageSettingPopUp
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 * @author Vinay Thube
 */
Ext.define('GCPA.view.EndClientClosureSummaryPopUp', {
	extend : 'Ext.window.Window',	
	autoHeight : true,
	closeAction : 'destroy',
	xtype :'endClientClosureSummaryPopup',
	cls : 'xn-popup pagesetting',
	modal : true,
	requires : ['Ext.form.field.ComboBox', 'Ext.form.Label'],
	width : '60%',
	itemId : 'accountClosureSummaryItemId',
	draggable : false,
	resizable : false,
	constrainHeader : true,
	title : getLabel("lbl.subAccountClosureSummary", "Sub-Account Closure Summary"),	
	cfgGridHeight : 'auto',
	/**
	 * @cfg{JSON} cfgPopUpData, The cfgPopUpData used for page setting popup
	 *            initiatlization
	 * 
	 * @example {
	 *	"groupByData": [{
	 *		"groupTypeDesc": "Status",
	 *		"groupTypeCode": "PAYSUM_OPT_STATUS",
	 *		"autoRefresh": "N",
	 *		"groups": [{
	 *			"groupId": "STATUS",
	 *			"groupCode": "STATUS_DRAFT",
	 *			"groupDescription": "Draft and Repair",
	 *			"groupQuery": "hasInstrDraft eq 1"
	 *		}, {
	 *			"groupId": "STATUS",
	 *			"groupCode": "STATUS_PENDING",
	 *			"groupDescription": "Pending Approval and Posting",
	 *			"groupQuery": "hasInstrPending eq 1"
	 *		}]
	 *	}, {
	 *		"groupTypeDesc": "Payment Category",
	 *		"groupTypeCode": "PAYSUM_OPT_PRODCAT",
	 *		"autoRefresh": "N",
	 *		"groups": [{
	 *			"groupId": "productCategory",
	 *			"groupCode": "CAT_ACCTRAN",
	 *			"groupDescription": "Account Transfer",
	 *			"groupQuery": "ProductCategory eq 'ACCOUNTTRF'",
	 *			"columns": [{
	 *				"colId": "clientReference",
	 *				"colDesc": "Payment Reference",
	 *				"width": 160,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "string",
	 *				"colHeader": "Payment Reference",
	 *				"colSequence": 1,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}, {
	 *				"colId": "sendingAccount",
	 *				"colDesc": "Sending Account#",
	 *				"width": 140,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "string",
	 *				"colHeader": "Sending Account#",
	 *				"colSequence": 2,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}]
	 *		}, {
	 *			"groupId": "productCategory",
	 *			"groupCode": "CAT_ACH",
	 *			"groupDescription": "ACH",
	 *			"groupQuery": "ProductCategory eq 'ACH'",
	 *			"columns": [{
	 *				"colId": "recieverName",
	 *				"colDesc": "Receiver Name ",
	 *				"width": 160,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "string",
	 *				"colHeader": "Receiver Name ",
	 *				"colSequence": 3,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}, {
	 *				"colId": "amount",
	 *				"colDesc": "Amount ",
	 *				"width": 140,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "amount",
	 *				"colHeader": "Amount ",
	 *				"colSequence": 4,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}]
	 *		}]
	 *	}],
	 *	"filterUrl": "services/userfilterslist/groupViewFilter.json",
	 *	"rowPerPage": [10, 25, 50, 100, 200, 500],
	 *	"groupByVal": "PAYSUM_OPT_STATUS",
	 *	"filterVal": "",
	 *	"gridSizeVal": "M",
	 *	"rowPerPageVal": 50
	 *	}
	 * 
	 * @default null
	 */
	cfgPopUpData : null,
	/**
	 * @cfg{Array} cfgDefaultColumnModel This is default/super set of columns
	 *             applicable if groupview's cfgCaptureColumnSettingAt has value
	 *             G i.e global. This will be either from gridset/use
	 *             defined/preferences.
	 * 
	 * @example [{
	 * 				"allowSubTotal": "N",
	 *				"colDesc": "Sending Account#",
	 *				"colHeader": "Sending Account#",
	 *				"colId": "sendingAccount",
	 *				"colType": "string",
	 *				"hidden": false,
	 *				"hideable": true,
	 *				"isTypeCode": "N",
	 *				"width": 140,
	 *				"locked": true,
	 *				"metaInfo": "",
	 *				"colSequence": 2
	 *			}, {
	 *				"allowSubTotal": "N",
	 *				"colDesc": "Payment Reference",
	 *				"colHeader": "Payment Reference",
	 *				"colId": "clientReference",
	 *				"colType": "string",
	 *				"hidden": false,
	 *				"hideable": false,
	 *				"isTypeCode": "N",
	 *				"width": 160,
	 *				"locked": true,
	 *				"metaInfo": "",
	 *				"colSequence": 1
	 *			}]
	 * @default []
	 */
	cfgDefaultColumnModel : [],
	/**
	 * @cfg{Ext.ux.gcp.GroupView} cfgGroupView Instance of groupview
	 * @default null
	 */
	cfgGroupView : null,
	cfgViewOnly : false,
	/**
	 * @cfg{String} cfgInvokedFrom Invoked from. i.e PAGE : Page Setting click,
	 *              GRID : Grid setting clicked
	 * 
	 * @default null
	 */
	cfgInvokedFrom : 'PAGE',
	cfgSummaryContent : null,
	initComponent : function() {
		var me = this, cfgData = me.cfgPopUpData, arrItems = new Array(), objFilterPanel = null, objGridPanel = null;
		me.cfgViewOnly = !Ext.isEmpty(me.cfgViewOnly)
				&& typeof me.cfgViewOnly === 'boolean' ? me.cfgViewOnly : false;
		//objFilterPanel = me.createFilterPanel();	
		objGridPanel = me.createGridPanel(cfgData);	
		arrItems.push(objGridPanel);
		me.items = arrItems;
		me.bbar = [{
					xtype : 'button',
					text : getLabel('btncancel', 'Cancel'),
					itemId : 'cancelBtn',
					cls : 'ft-btn-light',
					handler : function() {
						  me.submitAccountForClosure(cfgData,'R'); //Cancel the txn.
					}
				}, '->', {
					xtype : 'button',
					text : getLabel('btnSubmit', "Submit"),
					cls : 'ft-btn-primary',
					hidden : me.cfgViewOnly,
					handler : function() {
						me.submitAccountForClosure(cfgData,'T');//Transfer to next Action
					}
				}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	listeners:{
        close : function(){          
             var me = this;
             me.submitAccountForClosure(me.cfgPopUpData,'R'); //Cancel the txn.
            }
        },
    
	createGridPanel : function(objData) {
		var me = this;
		var objGridContainer, objGrid, objGridFieldSet = null, objGridStore = null, arrColumns = [], objSmartGrid = me.cfgGroupView
				? me.cfgGroupView.getGrid()
				: null;		
		var closureData = [
							['Total Credit Interest', objData.ENDCLIENTCLOSURETXNBEAN.nodeCurrency + '  ' + objData.ENDCLIENTCLOSURETXNBEAN.totalCreditInterest],
							['Total Debit Interest',objData.ENDCLIENTCLOSURETXNBEAN.nodeCurrency + '  ' +objData.ENDCLIENTCLOSURETXNBEAN.totalDebitInterest],
							['Net Admin Fee',objData.ENDCLIENTCLOSURETXNBEAN.nodeCurrency + '  ' +objData.ENDCLIENTCLOSURETXNBEAN.netAdminFee],
							['VAT Amount',objData.ENDCLIENTCLOSURETXNBEAN.nodeCurrency + '  ' +objData.ENDCLIENTCLOSURETXNBEAN.vatFee],
							['Fidelity Fund Fee',objData.ENDCLIENTCLOSURETXNBEAN.nodeCurrency + '  ' +objData.ENDCLIENTCLOSURETXNBEAN.fidelityFundFee]];
					arrayData = new Ext.data.ArrayStore({
								fields : [ 'columnDesc', 'columnAmount']
							});
					arrayData.loadData(closureData);
		objGridStore = arrayData;
		objGridContainer = Ext.create('Ext.container.Container', {
					itemId : 'gridContainer',
					width : '100%',
					autoHeight : true
				});
		
		var endClientSummaryPanel  = [{

			xtype : 'panel',
			width : '100%',
			cls:'ft-padding-bottom',
			layout : 'hbox',
			items : [{
						xtype : 'label',
						text : getLabel('lblEndClient', 'End-Client Name') + " :"
					}, {
						xtype : 'label',
						text : me.cfgSummaryContent,
						padding : '0 3 0 2',
						width : '200'
					}]
		}];
		
		var disclaimerNote = [{

			xtype : 'panel',
			width : '100%',
			cls:'ft-padding-bottom',
			layout : 'hbox',
			items : [{
						xtype : 'label',
						text : "To Proceed with Sub-Account Closure, Click on Submit"
					}]
		}];
		
		objGridContainer.add(endClientSummaryPanel);

		objGrid = Ext.create('Ext.grid.Panel', {
			store : objGridStore,
			height : me.cfgGridHeight,
			itemId : 'endClientClosureGrid',
			forceFit : true,
			cls : 't7-grid',
			columns : [ {
				text : getLabel('lblDescription', 'Description'),
				dataIndex : 'columnDesc',
				itemId : 'columnDesc',
				flex:0.24,
				sortable : false,
				menuDisabled : true,
				align : 'left',
				resizable: false,
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					value = me.columnRenderer(value, meta, record, rowIndex,
							colIndex, store, view);
					return value;
				}
			},{
				text : getLabel('lblAmount', 'Amount'),
				dataIndex : 'columnAmount',
				itemId : 'columnAmount',				
				sortable : false,
				menuDisabled : true,
				align : 'right',
				flex:0.24,
				resizable: false,
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					value = me.columnRenderer(value, meta, record, rowIndex,
							colIndex, store, view);
					return value;
				}
			}]		
		});		
		objGridContainer.add(objGrid);
		objGridContainer.add(disclaimerNote);
		return objGridContainer;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view) {
		if(!Ext.isEmpty(colIndex) && colIndex === 1)
			meta.tdAttr = 'title="'+value+'"';
		return value;
	},
	submitAccountForClosure : function(cfgData,strAction) {
		var me = this;
		var arrayJson = new Array();
		var strUrl = Ext.String.format('services/endClient/{0}', 'closeSubmit');	
		if(cfgData) {			
			arrayJson.push({
				serialNo : cfgData.ENDCLIENTCLOSURETXNBEAN.executionId,
				identifier : cfgData.identifier,
				userMessage : strAction,
				recordDesc : me.cfgSummaryContent
			});
			
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			
			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				jsonData : Ext.encode(arrayJson),
				success : function(response) {				
					var errorMessage = '';
					if (response.responseText != '[]') {
						var jsonData = Ext
								.decode(response.responseText);
						if(null!= jsonData.ERROR){	
							errorMessage = jsonData.ERROR.errors[0].errorCode + " : "+ jsonData.ERROR.errors[0].defaultMessage + "<br/>";
	        				isErrorPresent=true;
						}
						
						me.fireEvent('refreshGridData');
						
						if(!Ext.isEmpty(jsonData))
				        {						        	
					        if('' != errorMessage && null != errorMessage)
					        {
					         //Ext.Msg.alert("Error",errorMessage);
					        	Ext.MessageBox.show({
									title : getLabel('errorTitle','Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});				        	
					        	
					        }					      
				        }	
					}
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('errorTitle', 'Error'),
								msg : getLabel('errorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
			
			me.destroy();
			
		}		
				
	},
	sortByKey : function(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
});