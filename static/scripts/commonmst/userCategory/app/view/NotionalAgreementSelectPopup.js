
Ext.define('GCP.view.NotionalAgreementSelectPopup', {
			extend : 'Ext.window.Window',
			requires : ['Ext.ux.gcp.SmartGrid'],
			xtype : 'agreementSelectPopupType',
			width : 500,
			autoScroll : true,
			title : '',
			//cls: 'ux_no-padding',
			itemId : 'popup_view',
			mode : null,
			modal : true,
			module : null,
			isAllAssigned : 'N',
			closeAction : 'hide',
			keyNode : '',
			config : {
				searchFlag : false,
				layout : 'fit'
			},
			initComponent : function() {
				var me = this;
				var searchContainer = null;
				if (me.getSearchFlag() == true) {
					searchContainer = Ext.create('Ext.container.Container', {
								docked : 'top',
								padding : '10 0 5 0',
								layout : {
									type : 'hbox',
									pack : 'end'
								},
								items : [{
											xtype : 'label',
											text : getLabel( 'lblAgreementCode', 'Agreement Code' ),
											padding : '4 5 0 0'
										},	
								         {
											xtype : 'textfield',
											placeHolder : locMessages.SEARCH,
											cls: 'ux_largemargin-right',
											itemId : 'text_' + me.itemId
										}, {
											xtype : 'button',
											text : locMessages.SEARCH,
											itemId : 'btn_' + me.itemId,
											cls: 'ux_button-padding ux_button-background-color',
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
					maxHeight : 190,
					width : 'auto',
					padding : '5 0 0 0',
					stateful : false,
					showPager : true,
					showEmptyRow : false,
					showCheckBoxColumn : true,
					showHeaderCheckbox : false,
					columnModel : me.colModel,
					storeModel : me.storeModel,
					selectedRecordList : new Array(),
					deSelectedRecordList : new Array(),
					keyNode : me.keyNode,
					mode : me.mode,
					listeners : {
						gridPageChange : function(objGrid, strDataUrl,
								intPgSize, intNewPgNo, intOldPgNo, jsonSorter) {
							me.fireEvent('gridPageChange', objGrid, strDataUrl,
									intPgSize, intNewPgNo, intOldPgNo,
									jsonSorter);
						},
						gridSortChange : function(objGrid, strDataUrl,
								intPgSize, intNewPgNo, intOldPgNo, jsonSorter) {
							me.fireEvent('gridSortChange', objGrid, strDataUrl,
									intPgSize, intNewPgNo, intOldPgNo,
									jsonSorter);
						},
						select : me.addSelected,
						deselect : me.removeDeselected

					}
				}];

				me.buttons = [{
							text : locMessages.OK,
							itemId : 'gridOkBtn',
							cls:'ux_no-border ux_button-background-color ux_button-padding ux_width-auto ux_no-border'
						}];
				me.callParent(arguments);
			},
			addSelected : function(row, record, index, eopts) {
				var me = this;
				var usermstselectpopup = me.up("agreementSelectPopupType");
				var keyNode = me.keyNode;
				var alreadyPresent = usermstselectpopup.checkIfRecordExist(me.selectedRecordList,keyNode,record.data[keyNode]);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == false)) {
					me.selectedRecordList.push(record);
					alreadyPresent = false;
				}
				/* Remove From De Selected List */
				usermstselectpopup.removeElementIfExist(me.deSelectedRecordList,keyNode,record.data[keyNode]);
			},

			removeDeselected : function(row, record, index, eopts) {
				var me = this;
				var usermstselectpopup = me.up("agreementSelectPopupType");
				var keyNode = me.keyNode;
				/* Remove Ellement From Grid Selection List */
				var index = -1;
				usermstselectpopup.removeElementIfExist(me.selectedRecordList,keyNode,record.data[keyNode]);
				
				var alreadyPresent = usermstselectpopup.checkIfRecordExist(me.deSelectedRecordList,keyNode,record.data[keyNode]);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == true)) {
					me.deSelectedRecordList.push(record);
					alreadyPresent = false;
				}
			},
			removeElementIfExist : function(arrayList,keyNode,keyNodeValue){
				var index = -1;
				for ( var i = 0; i < arrayList.length; i++) {
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
			checkIfRecordExist : function(arrayList,keyNode,keyNodeValue){
				var isRecordPresent = false;
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					if (rowRecord.data[keyNode] === keyNodeValue) {
						isRecordPresent = true;
						break;
					}
				}
				return isRecordPresent;
				
			},
			checkIfRecordIsSelected : function(grid,record){
					var me = this;
					var isRecordPresent = false;
					var keyNode = grid.keyNode;
					for ( var i = 0; i < grid.selectedRecordList.length; i++) {
						var rowRecord = grid.selectedRecordList[i];
						if (rowRecord.data[keyNode] === record.get(keyNode)) {
							isRecordPresent = true;
							break;
						}
					}
				return isRecordPresent;
			},
			getKeyNodeValueList : function(arrayList,keyNode){
				var strRecords = '';
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					strRecords = strRecords + rowRecord.data[keyNode] +",";
				}
				return strRecords;
			},
			checkIfRecordIsDeSelected : function(grid,record){
					var me = this;
					var isRecordPresent = false;
					var keyNode = grid.keyNode;
					for ( var i = 0; i < grid.deSelectedRecordList.length; i++) {
						var rowRecord = grid.deSelectedRecordList[i];
						if (rowRecord.data[keyNode] === record.get(keyNode)) {
							isRecordPresent = true;
							break;
						}
					}
				return isRecordPresent;
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