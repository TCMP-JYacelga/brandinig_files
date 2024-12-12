Ext.define('GCP.view.ScmProductSelectPopup', {
			extend : 'Ext.window.Window',
			requires : ['Ext.ux.gcp.SmartGrid'],
			xtype : 'scmProductSelectPopup',
			width : 500,
			autoScroll : true,
			title : '',
			//cls: 'ux_no-padding',
			itemId : 'popup_view',
			cls : 't7-grid',
			mode : null,
			modal : true,
			module : null,
			isAllAssigned : 'N',
			isPrevAllAssigned : 'N',
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
					cls : 't7-grid',
					minHeight : 190,
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
							text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+locMessages.OK,
							itemId : 'gridOkBtn',
							cls:'ux_button-background-color ux_width-auto ux_no-border'
							//glyph: 'xf058@fontawesome'
						}];
				me.callParent(arguments);
			},
			addSelected : function(row, record, index, eopts) {
				var me = this;
				var scmProductSelectPopup = me.up("scmProductSelectPopup");
				var keyNode = me.keyNode;
				var alreadyPresent = scmProductSelectPopup.checkIfRecordExist(me.selectedRecordList, record);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == false)) {
					me.selectedRecordList.push(record);
					alreadyPresent = false;
				}
				/* Remove From De Selected List */
				scmProductSelectPopup.removeElementIfExist(me.deSelectedRecordList, record);
			},

			removeDeselected : function(row, record, index, eopts) {
				var me = this;
				var scmProductSelectPopup = me.up("scmProductSelectPopup");
				var keyNode = me.keyNode;
				/* Remove Ellement From Grid Selection List */
				var index = -1;
				scmProductSelectPopup.removeElementIfExist(me.selectedRecordList, record);
				
				var alreadyPresent = scmProductSelectPopup.checkIfRecordExist(me.deSelectedRecordList, record);
				/* Add to Grid Selection List */
				if (!alreadyPresent && (record.data['isAssigned'] == true)) {
					me.deSelectedRecordList.push(record);
					alreadyPresent = false;
				}
			},
			removeElementIfExist : function(arrayList, record){
				var index = -1;
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					if (rowRecord.data['productNode'] === record.data['productNode'] && rowRecord.data['mypRelClient'] === record.data['mypRelClient'])	{
						index = i;
						break;
					}
				}
				if (index > -1) {
					arrayList.splice(index, 1);
				}
			},
			checkIfRecordExist : function(arrayList, record){
				var isRecordPresent = false;
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					if (rowRecord.data['productNode'] === record.data['productNode'] && rowRecord.data['mypRelClient'] === record.data['mypRelClient']) {
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
						if (rowRecord.data['productNode'] === record.data['productNode'] && rowRecord.data['mypRelClient'] === record.data['mypRelClient']) {
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
						if (rowRecord.data['productNode'] === record.data['productNode'] && rowRecord.data['mypRelClient'] === record.data['mypRelClient']) {
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