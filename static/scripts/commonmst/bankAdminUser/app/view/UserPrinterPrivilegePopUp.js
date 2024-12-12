var selectedpk = new Array();
Ext.define('BANKUSER.view.UserPrinterPrivilegePopUp', {
			extend : 'Ext.window.Window',
			requires : ['Ext.ux.gcp.SmartGrid'],
			xtype : 'UserPrinterPrivilegePopUp',
			width : 650,
			y : 200,
			maxWidth : 650,
			minHeight : 156,
			maxHeight : 550,
			autoScroll : false,
			scroll:'vertical',
			resizable : false,
			draggable : false,
			modal : true,
			title : '',
			itemId : 'printer_view',
			mode : pageMode,
			keyNode : '',
			closeAction : 'hide',
			config : {
				searchFlag : false,
				layout : 'fit',
				isAllAssigned:'N',
				isPrevAllAssigned:'N'
			},
			listeners : {
				resize : function(){
					this.center();
				}
			},	
			//cls:'xn-popup',
			cls:'settings-popup non-xn-popup',
			initComponent : function() {
				var me = this;
				var searchContainer = null;
				if (me.getSearchFlag() == true) {
					searchContainer = Ext.create('Ext.container.Container', {
								xtype : 'container',
								layout : 'vbox',
								layout : {
									type : 'hbox'
								},
								items : [{
									xtype : 'AutoCompleter',
									padding : '0 0 5 0',
								fieldCls : 'xn-form-text popup-searchBox xn-suggestion-box',
								fieldLabel : getLabel('PrinterCode', 'Printer Code'),
								emptyText : getLabel('searchByPrinterCode','Search by Printer Code'),
								cfgUrl : 'services/userseek/{0}.json',
								fieldLabel : 'Printer Code',
								itemId : 'printerFilter',
								cfgQueryParamName : '$autofilter',
								cfgExtraParams : [{key : '$filtercode1', value : strUsrCode}],
								cfgRecordCount : -1,
								cfgSeekId : 'userPrinterList',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'CODE',
								cfgKeyNode : 'DESCRIPTION',
								displayField : 'DESCRIPTION',
								cfgProxyMethodType : 'POST',
								listeners : {
									'select' : function(record) {
										userPrinterVal = record.getRawValue();
											$(document).trigger('fetchprinters');
										},
										'change' : function(record) {
												userPrinterVal = record.getRawValue();
												if(Ext.isEmpty(userPrinterVal))
												{
													$(document).trigger('fetchprinters');
								}
								 }
									}
										}]
							});
				}
				var pgSize = null;
				pgSize = _GridSizeMaster;

				me.items = [searchContainer, {
							xtype : 'smartgrid',
							pageSize : pgSize,
							itemId : 'grid_' + me.itemId,
							rowList : _AvailableGridSize,
							minHeight : 40,
							maxHeight : 210,
							width : 'auto',
							cls:'t7-grid',
							stateful : false,
						//	scroll:'vertical',
							showEmptyRow : false,
						//	hideRowNumbererColumn : true,
							showCheckBoxColumn : (pageMode == 'VERIFY' || pageMode == 'VIEW') ? false : true,
							showHeaderCheckbox : false,
							checkBoxColumnWidth : 39,
							columnModel : me.colModel,
							storeModel : me.storeModel,
							selectedRecordList : new Array(),
							deSelectedRecordList : new Array(),
							mode : me.mode,
							keyNode : me.keyNode,
							listeners : {
								select : me.addSelected,
								deselect : me.removeDeselected
							}
						}];

				me.bbar = ['->',{
							//text : getLabel('btnClose','Close'),//locMessages.OK,
							text : getLabel('btnOk','OK'),
						//	glyph : 'xf058@fontawesome',
							itemId : 'gridOkBtn'
						}];
				me.callParent(arguments);
			},
			addSelected : function(row, record, index, eopts) {
				var me = this;
				var alreadyPresent = false;
				for(var i=0; i<selectedpk.length;i++) {
					if(selectedpk[i].data.printerCode===record.data.printerCode){	
						alreadyPresent = true;			
						break;
					}
				}
				if(!alreadyPresent) {
					me.selectedRecordList.push(record);
					selectedpk.push(record);
					alreadyPresent = false;
				}
				/* Remove From De Selected List */
			},

			removeDeselected : function(row, record, index, eopts) {
				var me = this;
				var index= -1;
				for(var i=0; i<selectedpk.length;i++) {
					if(selectedpk[i].data.printerCode===record.data.printerCode){	
						index = i;		
						break;
					}
				}
				if (index > -1) {
					me.deSelectedRecordList.push(record);
					selectedpk.splice(index, 1);
				}
			},
			removeElementIfExist : function(arrayList, keyNode, keyNodeValue) {
				var index = -1;
				for (var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					if (rowRecord.data[keyNode] === keyNodeValue) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					arrayList.splice(index, 1);
				}
			},
			checkIfRecordExist : function(arrayList, keyNode, keyNodeValue) {
				var isRecordPresent = false;
				for (var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					if (rowRecord.data[keyNode] === keyNodeValue) {
						isRecordPresent = true;
						break;
					}
				}
				return isRecordPresent;

			},
			checkIfRecordIsSelected : function(grid, record) {
				var me = this;
				var isRecordPresent = false;
				var keyNode = grid.keyNode;
				for (var i = 0; i < grid.selectedRecordList.length; i++) {
					var rowRecord = grid.selectedRecordList[i];
					if (rowRecord.data[keyNode] === record.get(keyNode)) {
						isRecordPresent = true;
						break;
					}
				}
				return isRecordPresent;
			},
			getKeyNodeValueList : function(arrayList, keyNode) {
				var strRecords = '';
				for (var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					strRecords = strRecords + rowRecord.data[keyNode] + ",";
				}
				return strRecords;
			},
			getTotalModifiedRecordList : function(grid){
				var totalModifiedRecordList =  new Array();
				for ( var i = 0; i < grid.selectedRecordList.length; i++) {
						var rowRecord = grid.selectedRecordList[i];
						totalModifiedRecordList.push(rowRecord);
				}
				for ( var i = 0; i < grid.deSelectedRecordList.length; i++) {
						var rowRecord = grid.deSelectedRecordList[i];
						totalModifiedRecordList.push(rowRecord);
				}
				return totalModifiedRecordList;
			}
		});