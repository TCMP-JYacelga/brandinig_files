$(function() {
	$.widget("custom.multiselectgrid", {
		options : {
			title : 'Seek',
			root : 'd.root',
			code : 'code',
			description : 'description',
			single : false,
			onSelectionChange : function(values) {
			}
		},
		_create : function() {
			Ext.require(['Ext.ux.data.PagingMemoryProxy']);
			var me = this;
			var meElement = this.element;
			var selection = [];
			if (meElement.val() != null) {
				selection = meElement.val();
			}
			var id = meElement.attr('id');
			var popupId = 'popup-' + id;
			var parent = meElement.parent();
			me.inputCntrlDiv = $('<div class="form-inline"></div>');
			me.input = $('<input type="text" readonly class="form-control" style="width: 90%; margin-right:5px;"></input>');
			me.input.val(selection.length + getLabel('selected',' Selected'));
			me.span = $('<span tabindex="1" class="fa fa-search"></span>');
			me.popupDiv = $('<div id="' + popupId + '" title="'
					+ me.options.title + '" class="t7-grid"></div>');
			var innerDiv = $('<div class="row"><div class="col-sm-12"><div class="form-group"><label>'+ getLabel('search','Search') +'</label><input class="form-control multiselectgridsearch"></input></div></div></div>');
			me.popupDiv.append(innerDiv);
			var searchInput = $(".search", innerDiv);
			var popupgrid = null;
			meElement.hide();
			me.inputCntrlDiv.append(me.input);
			me.inputCntrlDiv.append(me.span);
			parent.append(me.inputCntrlDiv);
			me.span.on('click', function() {
				me.popupDiv.dialog({
					maxHeight : 750,
					width : 700,
					modal : true,
					buttons :  [
						{
							text:getLabel('btnOk','Ok'),
							click : function() {
								$(this).dialog("close");
								if (me.options.single) {
									me.input.val(selection[0]);
								} else {
									me.input.val(selection.length + getLabel('selected',' Selected'));
								}
								meElement.val(selection);
								me.options.onSelectionChange(selection);
							}
						},
						{
							text:getLabel('btnCancel','Cancel'),
							click : function() {
								$(this).dialog("close");
							}
						}],
					open : function(event, ui) {
						selection = [];
						if (meElement.is('select')) {
							if (meElement.val() != null) {
								selection = meElement.val();
							}
						} else {
							if (meElement.val() != null
									&& meElement.val().trim() != '') {
								selection = meElement.val().split(",");
							}
						}

						if (!popupgrid) {
							var proxy = {};
							if (me.options.url) {
								proxy = {
									type : 'ajax',
									url : me.options.url,
									reader : {
										type : 'json',
										root : me.options.root
									}
								};
							} else if (me.options.data) {
								proxy = {
									type : 'pagingmemory',
									data : me.options.data,
									reader : {
										type : 'json',
										root : me.options.root
									}
								};
							} else if (meElement.is('select')) {
								me.options.root = "data";
								me.options.code = "value";
								me.options.description = "text";
								me.options.single = !meElement.attr("multiple");
								var values = [];
								$("option", meElement).each(function() {
									if ($(this).val() != undefined
											&& $(this).val() != '') {
										values.push({
													'value' : $(this).val(),
													'text' : $(this).text()
												});
									}
								});
								var data = {
									'data' : values
								};
								proxy = {
									type : 'pagingmemory',
									data : data,
									reader : {
										type : 'json',
										root : me.options.root
									}
								};
							}

							var myStore = Ext.create('Ext.data.Store', {
										pageSize : 5,
										fields : [me.options.code,
												me.options.description],
										proxy : proxy,
										autoLoad : true
									});

							var sm = Ext.create('Ext.selection.CheckboxModel',
									{
										headerWidth : 40,
										injectCheckbox : 'last',
										checkOnly : true,
										listeners : {
											select : function(row, record,
													index, eopts) {
												if (me.options.single) {
													var selectRecords = [];
													selectRecords.push(record);
													popupgrid
															.getSelectionModel()
															.select(selectRecords);
													selection = [];
													selection
															.push(record
																	.get(me.options.code));
												} else {
													if (!Ext.Array
															.contains(
																	selection,
																	record
																			.get(me.options.code))) {
														selection
																.push(record
																		.get(me.options.code));
													}
												}
											},
											deselect : function(row, record,
													index, eopts) {
												Ext.Array
														.remove(
																selection,
																record
																		.get(me.options.code));
											}
										}
									});
							popupgrid = Ext.create('Ext.grid.Panel', {
								popup : true,
								width : 'auto',
								store : myStore,
								selModel : sm,
								columns : [{
									text : '#',
									align : 'center',
									hideable : false,
									sortable : false,
									draggable : false,
									resizable : false,
									menuDisabled : true,
									width : 50,
									minWidth : 35,
									renderer : function(value, metaData,
											record, rowIdx, colIdx, store) {
										if (record.get('isEmpty')) {
											if (rowIdx === 0) {
												metaData.style = "display:inline;text-align:center;position:absolute;white-space: nowrap !important;empty-cells:hide;";
												return getLabel(
														'gridNoDataMsg',
														'No records present at this moment!');
											} else
												return '';
										} else {
											var curPage = store.currentPage;
											var pageSize = store.pageSize;
											var intValue = ((curPage - 1) * pageSize)
													+ rowIdx + 1;
											if (Ext.isEmpty(intValue))
												intValue = rowIdx + 1;
											return intValue;
										}
									}
								}, {
									text : getLabel('accountcode',
									'Code'),
									dataIndex : me.options.code,
									width : 180,
									sortable: false,
									draggable: false,
									lockable: false,
									resizable: false
								}, {
									text : getLabel('accountdescription',
									'Description'),
									dataIndex : me.options.description,
									width : 400,
									sortable: false,
									draggable: false,
									lockable: false,
									resizable: false
								}],
								dockedItems : [{
//											xtype : 'pagingtoolbar',
//											store : myStore,
//											dock : 'bottom'
										}],
								renderTo : popupId
							});
							var gridSmartPager = Ext.create('Ext.ux.gcp.GCPPager', {
								store : myStore,
								baseCls : 'xn-paging-toolbar',
								dock : 'bottom',
								displayInfo : true
							});
							popupgrid.addDocked(gridSmartPager);
							myStore.on('load', function(store, records) {
								var selectRecords = [];
								Ext.each(records, function(record) {
											if (Ext.Array
													.contains(
															selection,
															record
																	.get(me.options.code))) {
												selectRecords.push(record);
											}
										});
								popupgrid.getSelectionModel()
										.select(selectRecords);
							});
							$(me.popupDiv).on('keyup',
									'.multiselectgridsearch', function() {
										var value = $(this).val().toUpperCase().trim();
										console.log(myStore.getCount());
										myStore.clearFilter(true);
										if(!isEmpty(value)){
										var filteredValues = values.filter(function(val) {
											return (val.value.toUpperCase().indexOf(value)>-1 ||
													val.text.toUpperCase().indexOf(value)>-1 );
										});
										myStore.loadData(filteredValues.slice(0,5));
										}else
										popupgrid.store.reload();
										/*myStore.filterBy(function(record, id) {
											if (record.get(me.options.code)
													.indexOf(value) > -1
													|| record
															.get(me.options.description)
															.indexOf(value) > -1) {
												return true;
											}
											return false;
										}, this);*/
									});
						} else {
							popupgrid.store.reload();
						}
						me.input.val(selection.length + getLabel('selected',' Selected'));
					}
				});
			});
		},
		destroy : function() {
			$.Widget.prototype.destroy.call(this);
			this.input.remove();
			this.span.remove();
			this.inputCntrlDiv.remove();
			this.popupDiv.remove();
			this.element.show();
		},
		refresh : function() {
			var selection = [], meElement = this.element;
			if (meElement.val() != null) {
				selection = meElement.val();
			};
			this.input.val(selection.length + getLabel('selected',' Selected'));
		}
	});
});