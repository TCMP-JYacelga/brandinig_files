Ext.define('GCP.view.AdminProfileSeek', {
			extend : 'Ext.window.Window',
			xtype : 'adminProfileSeek',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			height : 300,
			modal : true,
			draggable : true,
			closeAction : 'hide',
			autoScroll : true,
			title : getLabel('copyadminprofile', 'Copy Admin Feature Profile'),
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null
			},

			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/copybyseek/adminFeatureProfileSeek.json';
				var colModel = me.getColumns();

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							showAllRecords : true,
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							minHeight : 150,
							columnModel : colModel,
							storeModel : {
								fields : ['name','value'],
								proxyUrl : strUrl,
								rootNode : 'd.filter',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});

				this.items = [adminListView];
				adminListView.on('cellclick', function(view, td, cellIndex, record,
							tr, rowIndex, e, eOpts) {
						var linkClicked = (e.target.tagName == 'SPAN');
						if (linkClicked) {
							var className = e.target.className;
							if (!Ext.isEmpty(className)
									&& className.indexOf('activitiesLink') !== -1) {
								me.selectProfile(me,record.get('value'));
							}
						}
					});
				this.buttons = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.close();
							}
						}];
				this.callParent(arguments);
			},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('admfeatureprfname', 'Admin Feature Profile Name')
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 330;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		
		if (colId === 'col_name'){
			
			strRetValue = '<span class="activitiesLink">'+value+'</span>';
		} else {
			strRetValue = value;
		}

		return strRetValue;
	},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				grid.loadGridData(strUrl, null, null, false);
			},
			
			selectProfile : function(parent,profileId){
				var form, inputField;
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'profileId', profileId));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				parentkey));

		form.action = 'doCopyAdminProfile.form';
		document.body.appendChild(form);
		form.submit();
		parent.close();
			},
			createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
		});
