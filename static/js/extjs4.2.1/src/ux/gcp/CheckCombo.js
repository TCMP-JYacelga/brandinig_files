Ext.define('Ext.ux.gcp.CheckCombo', {
	extend : 'Ext.form.field.ComboBox',
	alias : 'widget.checkcombo',
	multiSelect : true,
	allSelector : false,
	noData : false,
	noDataText : getLabel("nocombodata","No combo data"),
	addAllSelector : false,
	allSelectorHidden : false,
	enableKeyEvents : true,
	afterExpandCheck : false,
	selectedOptions : [],
	allSelectText : getLabel('checkAll','Check All'),
	allDeselectText : getLabel('uncheckAll','Uncheck All'),
	oldValue : '',
	initComponent : function() {
		var me = this;
		var rawValue = '';
		me.setRawValue(rawValue);
		me.callParent(arguments);
		me.addListener('boxready', function() {
			var me = this;
			// For the first time set all the options selected
			if (!Ext.isEmpty(me.selectedOptions)) {
				me.select(me.selectedOptions);
				// me.fireEvent('select', me, me.selectedOptions);
			} else {
				me.selectAllValues();
			}
			me.updateSelectionCount();
		});
		me.addListener('expand', function() {
			var me = this;
			me.alignPicker();
			me.updateSelectionCount();
		});
		me.addListener('change', function() {
			var me = this;
			me.updateSelectionCount();
		});
	},
	listeners : {
		/*
		 * uncomment if you want to reload store on every combo expand
		 * beforequery: function(qe) { this.store.removeAll(); delete
		 * qe.combo.lastQuery; },
		 */
		focus : function(cpt) {
			cpt.oldValue = cpt.getValue();
		},
		keydown : function(cpt, e, eOpts) {
			var value = cpt.getRawValue(), oldValue = cpt.oldValue;

			/*if (value != oldValue)
				cpt.setValue('');*/
		}
	},
	getRawValue : function() {
		var me = this;
		return me.rawValue;
	},
	setRawValue : function(rawValue) {
		var me = this;
		me.rawValue = rawValue;
	},
	createPicker : function() {
		var me = this, picker, menuCls = Ext.baseCSSPrefix + 'menu', opts = Ext
				.apply({
					pickerField : me,
					selModel : {
						mode : me.multiSelect ? 'SIMPLE' : 'SINGLE'
					},
					floating : true,
					hidden : true,
					ownerCt : me.ownerCt,
					cls : me.el.up('.' + menuCls) ? menuCls : '',
					store : me.store,
					displayField : me.displayField,
					focusOnToFront : false,
					pageSize : me.pageSize,
					tpl : [
							'<ul><tpl for=".">',
							'<li title="{'+me.displayField+'}" role="option" class="'
									+ Ext.baseCSSPrefix
									+ 'boundlist-item"><span class="x-combo-checker">&nbsp;</span> {'
									+ me.displayField + '}</li>', '</tpl></ul>']
				}, me.listConfig, me.defaultListConfig);

		picker = me.picker = Ext.create('Ext.view.BoundList', opts);
		if (me.pageSize) {
			picker.pagingToolbar.on('beforechange', me.onPageChange, me);
		}

		me.mon(picker, {
					itemclick : me.onItemClick,
					refresh : me.onListRefresh,
					scope : me
				});

		me.mon(picker.getSelectionModel(), {
					'beforeselect' : me.onBeforeSelect,
					'beforedeselect' : me.onBeforeDeselect,
					'selectionchange' : me.onListSelectionChange,
					scope : me
				});

		me.store.on('load', function(store) {
					if (store.getTotalCount() == 0) {
						me.allSelectorHidden = true;
						if (me.allSelector != false)
							me.allSelector.setStyle('display', 'none');
						if (me.noData != false)
							me.noData.setStyle('display', 'block');
					} else {
						me.allSelectorHidden = false;
						if (me.allSelector != false)
							me.allSelector.setStyle('display', 'block');
						if (me.noData != false)
							me.noData.setStyle('display', 'none');
							me.alignPicker();
					}
				});

		return picker;
	},
	reset : function() {
		var me = this;

		me.setValue('');
	},
	setValue : function(value) {
		this.value = value;
		if (!value) {
			/*if (this.allSelector != false)
				this.allSelector.removeCls('x-boundlist-selected');*/
			return this.callParent(arguments);
		}

		if (typeof value == 'string') {
			var me = this, records = [], vals = value.split(',');

			if (value == '') {
				/*if (me.allSelector != false)
					me.allSelector.removeCls('x-boundlist-selected');*/
			} else {
				if (vals.length == me.store.getCount() && vals.length != 0) {
					if (me.allSelector != false) {
						/*me.allSelector.addCls('x-boundlist-selected');*/
					} else {
						me.afterExpandCheck = true;
					}
				}
			}

			Ext.each(vals, function(val) {
						var record = me.store.getById(parseInt(val));
						if (record)
							records.push(record);
					});

			return me.setValue(records);
		} else
			return this.callParent(arguments);
	},
	setSelectedValues : function(arrSelectedVals) {
		var me = this,
			records = [];
		Ext.each(arrSelectedVals, function(val) {
			var record = me.store.getById(parseInt(val));
			if (record) {
				records.push(record);
			}
		});
		return me.setValue(records);
	},
	getSelectedValues : function() {
		var me = this;
		var returnValue = [];
		if(!Ext.isEmpty(me.value) && !Ext.isEmpty(me.value[0])) {
			returnValue = me.value;
		} 
		return returnValue;
	},
	getValue : function() {
		if (typeof this.value == 'object')
			return this.value.join(',');
		else
			return this.value;
	},
	getSubmitValue : function() {
		return this.getValue();
	},
	expand : function() {
		var me = this, bodyEl, picker, collapseIf;

		if (me.rendered && !me.isExpanded && !me.isDestroyed) {
			bodyEl = me.bodyEl;
			picker = me.getPicker();
			collapseIf = me.collapseIf;

			// show the picker and set isExpanded flag
			picker.show();
			me.isExpanded = true;
			me.alignPicker();
			bodyEl.addCls(me.openCls);

			if (me.noData == false)
				me.noData = picker.getEl().down('.x-boundlist-list-ct')
						.insertHtml(
								'beforeBegin',
								'<div class="x-boundlist-item" role="option">'
										+ me.noDataText + '</div>', true);

			if (me.addAllSelector == true && me.allSelector == false) {
				me.allSelector = picker
						.getEl()
						.down('.x-boundlist-list-ct')
						.insertHtml(
								'beforeBegin',
								'<div class="ui-multiselect-header ui-helper-clearfix"><ul><li><a id="checkAllLink" class="ui-multiselect-all"><span class="fa fa-check ui-multiselect-action-icon"></span><span>'
									+ me.allSelectText + '</span></a></li><li><a id="uncheckAllLink" class="ui-multiselect-none"><span class="fa fa-close ui-multiselect-action-icon"></span><span>'
									+ me.allDeselectText + '</span></a></li></ul></div>', true);
				me.allSelector.on('click', function(e) {
					if(e.target.nodeName === "SPAN") {
						if(e.target.parentNode.id === "checkAllLink") {
							me.selectAllValues(true);
						} else if(e.target.parentNode.id === "uncheckAllLink") {
							me.setValue('');
							me.fireEvent('select', me, []);
						}
						
						me.updateSelectionCount();
						
					}
					
							/*if (me.allSelector.hasCls('x-boundlist-selected')) {
								me.allSelector
										.removeCls('x-boundlist-selected');
								me.setValue('');
								me.fireEvent('select', me, []);
							} else {
								var records = [];
								me.store.each(function(record) {
											records.push(record);
										});
								me.allSelector.addCls('x-boundlist-selected');
								me.select(records);
								me.fireEvent('select', me, records);
							}*/
						});

				if (me.allSelectorHidden == true)
					me.allSelector.hide();
				else
					me.allSelector.show();

				if (me.afterExpandCheck == true) {
					/*me.allSelector.addCls('x-boundlist-selected');*/
					me.afterExpandCheck = false;
				}
			}

			// monitor clicking and mousewheel
			me.mon(Ext.getDoc(), {
						mousewheel : collapseIf,
						mousedown : collapseIf,
						scope : me
					});
			Ext.EventManager.onWindowResize(me.alignPicker, me);
			me.fireEvent('expand', me);
			me.onExpand();

		} else {
			me.fireEvent('expand', me);
			me.onExpand();
		}
	},
	alignPicker : function() {
		var me = this, picker = me.getPicker();
		
		me.callParent();
		
		if (me.addAllSelector == true) {
			var height = picker.getEl().down('.x-boundlist-list-ct').getHeight();
			height = parseInt(height) + 40;
			picker.getEl().setStyle('height', height + 'px');
			/* commenting below code as picker is not opening if the store gets modified.
			 if (picker.isFloating()) {
                me.doAlign();
            } */
		}
	},
	onListSelectionChange : function(list, selectedRecords) {
		var me = this, isMulti = me.multiSelect, hasRecords = selectedRecords.length > 0;
		// Only react to selection if it is not called from setValue, and if our
		// list is
		// expanded (ignores changes to the selection model triggered elsewhere)
		if (!me.ignoreSelection && me.isExpanded) {
			if (!isMulti) {
				Ext.defer(me.collapse, 1, me);
			}
			/*
			 * Only set the value here if we're in multi selection mode or we
			 * have a selection. Otherwise setValue will be called with an empty
			 * value which will cause the change event to fire twice.
			 */
			if (isMulti || hasRecords) {
				me.setValue(selectedRecords, false);
			}
			if (hasRecords) {
				me.fireEvent('select', me, selectedRecords);
			}
			me.inputEl.focus();

			/*if (me.addAllSelector == true && me.allSelector != false) {
				if (selectedRecords.length == me.store.getTotalCount())
					me.allSelector.addCls('x-boundlist-selected');
				else
					me.allSelector.removeCls('x-boundlist-selected');
			}*/
		}
		me.updateSelectionCount();
	},
	
	updateSelectionCount : function() {
		var me = this;
		var selectedCount = 0;
		
		if(me.value[0] && me.value[0] !== "") {
			selectedCount = me.value.length;
		}
		
		if(me.isAllSelected()) {
			me.setComboText(getLabel('all','All') +' '+ getLabel('selected',' Selected'));
		} else if(selectedCount !== 0) {
			me.setComboText(selectedCount +' '+ getLabel('selected',' Selected'));
		} else {
			me.setComboText(getLabel('selectOptions','Select Options'));
		}
	},
	
	setComboText : function(textVal) {
		var me = this;
		if(me.inputEl) {
			me.inputEl.dom.value = textVal;
		}
	},
	
	isAllSelected : function() {
		var me = this;
		var selectedCount = 0;
		
		if(me.value[0] && me.value[0] !== "") {
			selectedCount = me.value.length;
		}
		
		return (selectedCount !== 0 && me.store.getTotalCount() === selectedCount);
		
	},
	selectAllValues : function(fireSlectEventFlag) {
		var me = this;
		var records = [];
		if(me.store) {
			me.store.each(function(record) {
				records.push(record);
			});
		}
		me.select(records);
		if(fireSlectEventFlag) {
			me.fireEvent('select', me, records);
		}
	}
});