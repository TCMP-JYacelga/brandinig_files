Ext.define('GCP.view.UserSelectSubsidiariesPopUp', {
			extend : 'Ext.window.Window',
			requires : ['Ext.ux.gcp.SmartGrid'],
			xtype : 'userSelectSubsidiariesPopUp',
			width : 520,
			y : 300,
			maxWidth : 735,
			minHeight : 156,
			maxHeight : 550,
			autoScroll : true,
			resizable : false,
			draggable : false,
			modal : true,
			title : '',
			itemId : 'popup_view',
			mode : null,
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
			cls:'settings-popup xn-popup',
			initComponent : function() {
				var me = this;
				var searchContainer = null;
				if (me.getSearchFlag() == true) {
					searchContainer = Ext.create('Ext.container.Container', {
								docked : 'top',
								padding : '0 0 5 0',
								layout : {
									type : 'hbox',
									pack : 'end'
								},
								items : [{
											xtype : 'textfield',
											placeHolder : locMessages.SEARCH,
											itemId : 'text_' + me.itemId
										}, {
											xtype : 'button',
											text : locMessages.SEARCH,
											itemId : 'btn_' + me.itemId,
											height : 25
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
							maxHeight : 395,
							width : 'auto',
							cls:'t7-grid',
							stateful : false,
							showEmptyRow : false,
							hideRowNumbererColumn : true,
							showCheckBoxColumn : true,
							showHeaderCheckbox : false,
							checkBoxColumnWidth : _GridCheckBoxWidth,
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
							text : getLabel('btnDone','Done'),
						//	glyph : 'xf058@fontawesome',
							itemId : 'gridOkBtn'
						}];
				me.callParent(arguments);
			},
			addSelected : function(row, record, index, eopts) {
				var me = this;
				var userSelectSubsidiariesPopUp = me
						.up("userSelectSubsidiariesPopUp");
				var keyNode = me.keyNode;
				var alreadyPresent = userSelectSubsidiariesPopUp
						.checkIfRecordExist(me.selectedRecordList, keyNode,
								record.data[keyNode]);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == false)) {
					me.selectedRecordList.push(record);
					alreadyPresent = false;
				}
				/* Remove From De Selected List */
				userSelectSubsidiariesPopUp.removeElementIfExist(
						me.deSelectedRecordList, keyNode, record.data[keyNode]);
			},

			removeDeselected : function(row, record, index, eopts) {
				var me = this;
				var userSelectSubsidiariesPopUp = me
						.up("userSelectSubsidiariesPopUp");
				var keyNode = me.keyNode;
				/* Remove Ellement From Grid Selection List */
				var index = -1;
				userSelectSubsidiariesPopUp.removeElementIfExist(
						me.selectedRecordList, keyNode, record.data[keyNode]);

				var alreadyPresent = userSelectSubsidiariesPopUp
						.checkIfRecordExist(me.deSelectedRecordList, keyNode,
								record.data[keyNode]);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == true)) {
					me.deSelectedRecordList.push(record);
					alreadyPresent = false;
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