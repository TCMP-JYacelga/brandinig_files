var totalCondition;
const DATATYPE = {
			TEXT: 'text',
			AMOUNT: 'amount',
			NUMBER: 'number',
			DATE: 'date',
			SELECTBOX: 'selectbox',
			MULTIBOX: 'multibox',
			AUTOCOMPLETE: 'autocomplete',
			RADIO: 'radio',
			CHECKBOX: 'checkbox',
			ENUM: 'enum'
		};
		
const OPERATORS = {
			EQ: {'label': getDashLabel('filter.operator.equal'),'value':'eq'},
			LT: {'label': getDashLabel('filter.operator.lessThan'),'value':'lt'},
			GT: {'label': getDashLabel('filter.operator.greaterThan'),'value':'gt'},
			LE: {'label': getDashLabel('filter.operator.lessThanAndEqual'),'value':'le'},
			GE: {'label': getDashLabel('filter.operator.greaterThanAndEqual'),'value':'ge'},
			LK: {'label': getDashLabel('filter.operator.like'),'value':'lk'},
			IN: {'label': getDashLabel('filter.operator.in'),'value':'in'},
			BT: {'label': getDashLabel('filter.operator.between'),'value':'bt'}
		};
		
const TYPEOPERATORS = {
			'text'         : [OPERATORS.LK],
			'amount'       : [OPERATORS.EQ,OPERATORS.LT,OPERATORS.GT,OPERATORS.BT],
			'number'       : [OPERATORS.EQ,OPERATORS.LT,OPERATORS.GT,OPERATORS.BT],
			'date'         : [OPERATORS.EQ,OPERATORS.BT],
			'selectbox'    : [OPERATORS.EQ],
			'multibox'     : [OPERATORS.IN],
			'autocomplete' : [OPERATORS.EQ],
			'enum'         : [OPERATORS.EQ],
			'radio'        : [OPERATORS.EQ],
			'checkbox'     : [OPERATORS.IN]
		};

const DATEOPERATOR = {
			DR: getDashLabel('filter.dateOperator.dateRange'),
			LT: getDashLabel('filter.dateOperator.latest'),
			TD: getDashLabel('filter.dateOperator.today'),
			YT: getDashLabel('filter.dateOperator.yesterday'),
			TW: getDashLabel('filter.dateOperator.thisWeek'),
			WD: getDashLabel('filter.dateOperator.lastWeekToDate'),
			TM: getDashLabel('filter.dateOperator.thisMonth'),
			MD: getDashLabel('filter.dateOperator.lastMonthToDate'),
			LM: getDashLabel('filter.dateOperator.lastMonthOnly'),
			TQ: getDashLabel('filter.dateOperator.thisQuarter'),
			QD: getDashLabel('filter.dateOperator.lastQuarterToDate'),
			TY: getDashLabel('filter.dateOperator.thisYear')
		};
		
const filterModal = {
		createHeader : function(el, _oFilterId){		

		let titleRow = document.createElement('div');
			titleRow.className = 'col-md-8';
			titleRow.innerHTML = '<h5 class="modal-title">'+getDashLabel('filter')+'</h5>';

		let savedFltList = document.createElement('select');
			savedFltList.id = el.utils.actionIds.widgetFld_savedList;
			savedFltList.className = 'form-control';
			savedFltList.setAttribute('tabindex','1');
			
		/*let blankOption = document.createElement("option");
			blankOption.text = 'Select Filter';
			blankOption.value = '';
			savedFltList.add(blankOption);*/

		let savedFltRow = document.createElement('div');
			savedFltRow.className = 'col-md-3';
			savedFltRow.style = 'padding-left:170px';
            savedFltRow.appendChild(savedFltList);
		
		let	crossButton = document.createElement('button');
			crossButton.setAttribute('type','button');
            crossButton.setAttribute('class','close');
			crossButton.setAttribute('data-dismiss','modal');
			crossButton.setAttribute('aria-label','Close');
			crossButton.innerHTML = '<span aria-hidden="true">&times;</span>';
			
		let crossButtonDiv = document.createElement('div');
			crossButtonDiv.appendChild(crossButton);
			
		let hrdRow = document.createElement('div');
			hrdRow.className = 'row modal-header';
            hrdRow.appendChild(titleRow);
            hrdRow.appendChild(savedFltRow);
			hrdRow.appendChild(crossButtonDiv);
			

		return hrdRow;
	},
	createBody : function(el, _oFilterId){
		let filterSection = document.createElement('div');
			filterSection.className = 'filter-conditions';
			filterSection.id = el.utils.actionIds.widgetDiv_conditions;			
            filterSection.appendChild(this.createFieldRow(el, _oFilterId, 'NEW', 1));
		
		let lblFieldName = document.createElement('div');
			lblFieldName.className = 'col-md-2';
			lblFieldName.innerHTML = '<label class="font-weight-bold">'+getDashLabel('filter.fldName')+'</label>';
		
		let lblOperator = document.createElement('div');
			lblOperator.className = 'col-md-2';
			lblOperator.innerHTML = '<label class="font-weight-bold">'+getDashLabel('filter.operator','Operator')+'</label>';
			
		let lblValue1 = document.createElement('div');
			lblValue1.className = 'col-md-3';
			lblValue1.id = "widgetFilterModal_lbl_val1";
			lblValue1.innerHTML = '<label class="font-weight-bold">'+getDashLabel('filter.value1','Value 1')+'</label>';	
			
		let lblValue2 = document.createElement('div');
			lblValue2.className = 'col-md-3';
			lblValue2.id = "widgetFilterModal_lbl_val2";
			lblValue2.innerHTML = '<label class="font-weight-bold">'+getDashLabel('filter.value2','Value 2')+'</label>';
            lblValue2.setAttribute('style','visibility:hidden');			
		
		let labelsSection = document.createElement('div');
			labelsSection.className = 'row';		
            labelsSection.appendChild(lblFieldName);
            labelsSection.appendChild(lblOperator);
            labelsSection.appendChild(lblValue1);
            labelsSection.appendChild(lblValue2);
			
		let modalBody = document.createElement('div');
			modalBody.className = 'modal-body';	
            modalBody.appendChild(labelsSection);            
            modalBody.appendChild(filterSection);			
			
		
		return modalBody;
	},
	createFieldRow : function(el, _oFilterId, action, index){
		let fieldCount = el.metadata.filter.fields.length;
		
		let fldList = document.createElement('select');
			fldList.id = el.utils.actionIds.widgetFld_field+'_'+index;
			fldList.name = el.utils.actionIds.widgetFld_field+'_'+index;
			fldList.className = 'form-control';
			fldList.setAttribute('tabindex','1');
			fldList.setAttribute('required','true');
			
		let blankOption = document.createElement("option");
			blankOption.text = getDashLabel('filter.selectFld','Select Field Name');
			blankOption.value = '';
			fldList.add(blankOption);

		$.each(el.metadata.filter.fields, function(index,data) {
			let option = document.createElement("option");
				option.text = data.label;
				option.value = data.fieldName;
				option.setAttribute('data-type',data.type);
				option.setAttribute('filterSubType',data.filterSubType);
				fldList.add(option);
		});
		let fldListCol = document.createElement('div');
			fldListCol.className = 'col-md-2';
			fldListCol.id = el.utils.actionIds.widgetDiv_field+'_'+index;
            fldListCol.appendChild(fldList);
		
		let operators = document.createElement('select');
			operators.id = el.utils.actionIds.widgetFld_operator+'_'+index;
			operators.name = el.utils.actionIds.widgetFld_operator+'_'+index;
			operators.className = 'form-control';
			operators.setAttribute('tabindex','1');
			operators.setAttribute('required','true');
				
		let operatorsCol = document.createElement('div');
			operatorsCol.className = 'col-md-2';
			operatorsCol.id = el.utils.actionIds.widgetDiv_operator+'_'+index;
            operatorsCol.appendChild(operators);
		
		let value1 = document.createElement('input');
			value1.id = el.utils.actionIds.widgetFld_value1+'_'+index;
			value1.name = el.utils.actionIds.widgetFld_value1+'_'+index;
			value1.className = 'form-control';
			value1.setAttribute('tabindex','1');
			value1.setAttribute('autocomplete','off');
			value1.setAttribute('required','true');
			
		let value1Col = document.createElement('div');
			value1Col.className = 'col-md-3';
			value1Col.id = el.utils.actionIds.widgetDiv_value1+'_'+index;
			value1Col.appendChild(value1);

		let value2 = document.createElement('input');
			value2.id = el.utils.actionIds.widgetFld_value2+'_'+index;
			value2.name = el.utils.actionIds.widgetFld_value2+'_'+index;
			value2.className = 'form-control';
			value2.setAttribute('tabindex','1');
			value2.setAttribute('autocomplete','off');
			value2.setAttribute('required','true');

			
		let value2Col = document.createElement('div');
			value2Col.className = 'col-md-3';
			value2Col.id = el.utils.actionIds.widgetDiv_value2+'_'+index;
			value2Col.setAttribute('style','visibility:hidden');
			value2Col.appendChild(value2);
			
		let addBtn = document.createElement('button');
			addBtn.id = el.utils.actionIds.widgetBtn_add;
			addBtn.className = 'btn uxg-btn uxg-btn-primary';
			addBtn.innerHTML = '<i class="material-icons add-condition-row">add_circle_outline</i>';
			addBtn.setAttribute('tabindex','1');
			
		let removeBtn = document.createElement('button');
			removeBtn.className = 'btn uxg-btn uxg-btn-primary remove-condition-row';
			removeBtn.innerHTML = '<i class="material-icons">remove_circle_outline</i>';
			removeBtn.setAttribute('tabindex','1');		
			
		let addBtnCol = document.createElement('div');
			addBtnCol.className = 'col-md-2';
			addBtnCol.id = el.utils.actionIds.widgetDiv_addBtn;				
			if($('.filter-conditions-item').length > 0) {
			  addBtnCol.appendChild(removeBtn);	
			}
			addBtnCol.appendChild(addBtn);
		
		let filterFldSec = document.createElement('div');
			filterFldSec.className = 'row filter-conditions-item';
			filterFldSec.appendChild(fldListCol);
			filterFldSec.appendChild(operatorsCol);
			filterFldSec.appendChild(value1Col);
			filterFldSec.appendChild(value2Col);
			
			if(fieldCount > 1 && $('#widgetFilterModal_fld_savedList').val() != 'Default'){
				
				filterFldSec.appendChild(addBtnCol);
			}
			
		return 	filterFldSec;
	},
	createFooter : function(el, _oFilterId)
	{
		let closeBtn = document.createElement('button');
			closeBtn.className = 'btn btn-outline-primary';
			closeBtn.id = el.utils.actionIds.widgetBtn_cancel;
			closeBtn.innerHTML = getDashLabel('btn.cancel','Cancel');
			closeBtn.setAttribute('tabindex','1');
		
		let SaveApply = document.createElement('button');
			SaveApply.className = 'btn btn-raised btn-primary save-btn';
			SaveApply.id = el.utils.actionIds.widgetBtn_save;
			SaveApply.innerHTML = getDashLabel('btn.applySave','Apply & Save');
			SaveApply.setAttribute('tabindex','1');
		
		let apply = document.createElement('button');
			apply.className = 'btn btn-raised btn-primary apply-btn';
			apply.id = el.utils.actionIds.widgetBtn_apply;
			apply.innerHTML = getDashLabel('btn.apply','Apply');
			apply.setAttribute('tabindex','1');
			
		let footerRightPannel = document.createElement('div');
			footerRightPannel.className = 'col-md-6 text-right';
			footerRightPannel.appendChild(closeBtn);
			footerRightPannel.appendChild(SaveApply);				
			footerRightPannel.appendChild(apply);		

		let saveInput = document.createElement('input');
			saveInput.id = el.utils.actionIds.widgetFld_filterName;
			saveInput.name = el.utils.actionIds.widgetFld_filterName;
			saveInput.className = 'form-control save-filter-name';
			saveInput.setAttribute('placeholder',getDashLabel('filter.enterFieldName'));
			saveInput.setAttribute('maxlength','20');
			saveInput.setAttribute('minlength','4');
			saveInput.setAttribute('tabindex','1');
			saveInput.setAttribute('autocomplete','off');
			//saveInput.setAttribute('required','true');
			
		let footerLeftPannel = document.createElement('div');
			footerLeftPannel.className = 'col-md-6';
			footerLeftPannel.appendChild(saveInput);	

        let footerPannel = document.createElement('div');
			footerPannel.className = 'row w-100';
			footerPannel.appendChild(footerLeftPannel);	
			footerPannel.appendChild(footerRightPannel);			
			
			
		let footer = document.createElement('div');
			footer.className = 'modal-footer';				
			footer.appendChild(footerPannel);
			
		return footer;
	},
	createError : function(el, _oFilterId){
		let modalError = document.createElement('div');
		modalError.className = 'modal-error';		
		return modalError;
	},
	createGroupingRow : function(el, _oFilterId){			
		let lblGroupBy1 = document.createElement('div');
			lblGroupBy1.className = 'col-md-2';
			lblGroupBy1.innerHTML = '<label class="font-weight-bold">'+getDashLabel('filter.groupBy')+'</label>';
		
		let lblGroupBy2 = document.createElement('div');
			lblGroupBy2.className = 'col-md-2';
			lblGroupBy2.innerHTML = '<label class="font-weight-bold">'+getDashLabel('filter.thenGroupBy')+'</label>';
		
		let lblGroupBy3 = document.createElement('div');
			lblGroupBy3.className = 'col-md-2';
			lblGroupBy3.innerHTML = '<label class="font-weight-bold">'+getDashLabel('filter.thenGroupBy')+'</label>';			
		
		let labelsSection = document.createElement('div');
			labelsSection.className = 'row';		
			labelsSection.appendChild(lblGroupBy1);
			labelsSection.appendChild(lblGroupBy2);
			labelsSection.appendChild(lblGroupBy3);
		
		let modalGrouping = document.createElement('div');
		modalGrouping.className = 'modal-grouping';	
		modalGrouping.appendChild(labelsSection);		
		return modalGrouping;
	}
};	
	
const FilterActionUtils = {
	actionIds : {
	    'actionBtnId'        : 'actionbtn_filter_',
		'widgetModalId'      : 'widgetFilterModal',
		'widgetFld_savedList'    : 'widgetFilterModal_fld_savedList',
		'widgetDiv_field'    : 'widgetFilterModal_div_field',
		'widgetDiv_operator' : 'widgetFilterModal_div_opr',
		'widgetDiv_value1'   : 'widgetFilterModal_div_val1',
		'widgetDiv_value2'   : 'widgetFilterModal_div_val2',
		'widgetDiv_addBtn'   : 'widgetFilterModal_div_add',
		'widgetFld_field'    : 'widgetFilterModal_fld_field',
		'widgetFld_operator' : 'widgetFilterModal_fld_opr',
		'widgetFld_value1'   : 'widgetFilterModal_fld_val1',
		'widgetFld_value2'   : 'widgetFilterModal_fld_val2',
		'widgetFld_dtoption' : 'widgetFilterModal_fld_dtoption',
		'widgetBtn_add'      : 'widgetFilterModal_btn_add',
		'widgetBtn_save'     : 'widgetFilterModal_btn_save',
		'widgetBtn_apply'    : 'widgetFilterModal_btn_apply',
		'widgetBtn_cancel'   : 'widgetFilterModal_btn_cancel',
		'widgetFld_filterName'    : 'widgetFilterModal_fld_filterName',
		'widgetDiv_conditions'    :'cond_sec_widgetFilterModal'
	},   
	actionClasses : {
		'modal': 'modal'
	},
	
	getOperators: function (datatype) {
		return TYPEOPERATORS[datatype];
	},
	createFilterModal : function(el, filterModalId){
		let content = document.createElement('div');
			content.className = 'modal-content';
			content.appendChild(filterModal.createHeader(el, filterModalId));
			content.appendChild(filterModal.createError(el, filterModalId));
			content.appendChild(filterModal.createBody(el, filterModalId));
			if(el && el.metadata && el.metadata.sortMethod && el.metadata.sortMethod == 'group')
				content.appendChild(filterModal.createGroupingRow(el, filterModalId));
			content.appendChild(filterModal.createFooter(el, filterModalId));
			
	    let modalForm = document.createElement('form');
			modalForm.id = 'filterForm';
			//modalForm.setAttribute('action','');
			//modalForm.setAttribute('method','GET');			
			modalForm.appendChild(content);
		  
		let dialog = document.createElement('div');
			dialog.className = 'modal-dialog  modal-xl';
			dialog.appendChild(content);
		  
		let modal = document.createElement('div');
			modal.id = filterModalId;
			modal.className = 'modal widget-filter-container';
			modal.setAttribute('role','dialog');
			modal.setAttribute('data-backdrop','static');
			modal.setAttribute('data-keyboard','false');
            modal.appendChild(dialog);
		return modal;  
	},
	onFieldNameChange : function(el,_widgetEle, filterId){
		let dataType = $(el).find("option:selected").attr('data-type');
		let operators = _widgetEle.utils.getOperators(dataType);
		let condIndex =  $(el).attr('id').replace('widgetFilterModal_fld_field_','');
		
		$('#'+_widgetEle.utils.actionIds.widgetFld_operator+'_'+condIndex).empty();
		
		$.each(operators, function(index,data) {
			let option = document.createElement("option");
			option.text = data.label;
			option.value = data.value;
			$('#'+_widgetEle.utils.actionIds.widgetFld_operator+'_'+condIndex).append(option.outerHTML);
		});
		
		$('#'+_widgetEle.utils.actionIds.widgetDiv_value2+'_'+condIndex).attr('style','visibility:hidden');
		$('#widgetFilterModal_lbl_val2').attr('style','visibility:hidden');
		$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).datepicker('disable');
		$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).removeClass('hasDatepicker');
		$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).removeAttr('disabled');
	},
	onOperatorChange : function(el,_widgetEle, filterId, isDefault){
		let operatorValue = $(el).val();
		let condIndex =  $(el).attr('id').replace('widgetFilterModal_fld_opr_','');
        let dataType = $('#'+_widgetEle.utils.actionIds.widgetDiv_field+'_'+condIndex).find("option:selected").attr('data-type');
		if(operatorValue == OPERATORS.BT.value)
		{
			$('#widgetFilterModal_lbl_val1 label').text(getDashLabel('filter.value1','Value 1'));
			$('#widgetFilterModal_lbl_val2').attr('style','visibility:visibe');
			$('#'+_widgetEle.utils.actionIds.widgetDiv_value2+'_'+condIndex).removeAttr('style');
			$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).val('');
			
			if(dataType == 'date')
			{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value2+'_'+condIndex).find('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).remove();
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value2+'_'+condIndex).append('<input required="true" autocomplete="off" id="'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex+'" name="'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex+'" class="form-control" tabindex="1" />');
				if(!isDefault)
				{
					$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).datepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat:  _strDefaultDateFormat.replace('yyyy','yy').replace('MM','mm').replace('MMM','M').replace('MMMM','MM'),
						onSelect: function(date){
						   $('#widgetFilterModal_fld_dtoption_'+condIndex).val('DR');
						   $('#widgetFilterModal_fld_dtoption_'+condIndex+' + .select2-container .select2-selection').attr('title','Date Range');

						   $('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex+'-error').remove();
						}
					});					
				}				
				let fromDate = $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).datepicker('getDate');
				let selectedDate = new Date(fromDate);
				let msecsInADay = 86400000;
				let endDate = new Date(selectedDate.getTime() + msecsInADay);
				$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).datepicker( "option", "minDate", endDate );
				$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).attr('autocomplete','off');
			}
			else if(dataType == 'amount')
			{
				$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).keypress(function(e){
					 let val = $('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).val();
					 if (((e.which != 46 || (e.which == 46 && val == '')) ||
							val.indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
						e.preventDefault();
					 }
				});	
				
				$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex)
				.autoNumeric('init',
					{
						aSep : _strGroupSeparator ? _strGroupSeparator : ',', 
						aDec : _strDecimalSeparator ? _strDecimalSeparator : '.', 
						mDec : _strAmountMinFraction ? _strAmountMinFraction : '2', 
						vMin : 0,
						wEmpty : 'zero'
					});	
			}
			
			
			//$($('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex)).parent().parent().find('#widgetFilterModal_btn_add').attr('disabled','disabled');
			/*$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).change(function(){
				_widgetEle.utils.enableAddRow(this, _widgetEle, _widgetEle.utils.actionIds.widgetModalId);
			});*/
		}
		else
		{
			$('#'+_widgetEle.utils.actionIds.widgetDiv_value2+'_'+condIndex).attr('style','visibility:hidden');
			$('#widgetFilterModal_lbl_val2').attr('style','visibility:hidden');
			$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).datepicker('disable');
			$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).removeClass('hasDatepicker');
			$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).removeAttr('disabled');
			$('#widgetFilterModal_lbl_val1 label').text(getDashLabel('filter.value1','Value 1'));	

			if(dataType == 'date')
			{	
		      $('#widgetFilterModal_fld_dtoption_'+condIndex).val('DR');
			  $('#widgetFilterModal_fld_dtoption_'+condIndex+' + .select2-container .select2-selection').attr('title','Date Range');
			}		
		}
	},
	changeValueFields : function(el,_widgetEle, filterId, defaultValue, isDefalut){
		let widgetEle = _widgetEle;
		let dataType = $(el).find('option:selected').attr('data-type');
		let dataField = $(el).find('option:selected').val();
		let condIndex =  $(el).attr('id').replace('widgetFilterModal_fld_field_','');
		let dataFieldMetadata;
		
		$(_widgetEle.metadata.filter.fields).each(function(index, field){
			if(field.fieldName == dataField)
				dataFieldMetadata = field;
		});
		
		$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).unbind('keypress');
		$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).remove();
		$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).empty();
		let fieldValueAvail = false;
		switch(dataType){
			case 'selectbox':{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<select required="true" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control" tabindex="1"></select>');
				$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content').append('<div class="loading-indicator"></div>');
				if(dataFieldMetadata.ajax)
				{
					$.ajax({
						url : dataFieldMetadata.ajax.url,
						dataType : dataFieldMetadata.ajax.dataType,
						data : dataFieldMetadata.ajax.data,
						success : function(data){
							dataFieldMetadata.ajax.success(data, function(data){
								$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).empty();
								$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).append('<option value="">'+getDashLabel('filter.select','Select')+'</option>');
								$(data).each(function(index, dataObj){
									$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).append('<option value="'+dataObj.code+'">'+dataObj.label+'</option>');
								});
							});
							if(defaultValue)
							{
								$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defaultValue);
							    $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).trigger('change');
							}
							$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();
						}
					});					
				}
				else if(dataFieldMetadata.data)
				{
					$(dataFieldMetadata.data).each(function(index, dataObj){
						$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).append('<option value="'+dataObj.code+'">'+dataObj.label+'</option>');
					});			
					$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();
				}
				fieldValueAvail = true;
				break;
			}
			case 'multibox':{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<select required="true" multiple="multiple" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control multibox" tabindex="1"></select>');
				$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content').append('<div class="loading-indicator"></div>');
				if(dataFieldMetadata.ajax)
				{
					$.ajax({
						url : dataFieldMetadata.ajax.url,
						dataType : dataFieldMetadata.ajax.dataType,
						data : dataFieldMetadata.ajax.data,						
					})
					.done (function(data, textStatus, jqXHR) { 
						if(data)
						{
							dataFieldMetadata.ajax.success(data, function(data){
								$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).empty();
								$(data).each(function(index, dataObj){
									$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).append('<option value="'+dataObj.code+'">'+dataObj.label+'</option>');
								});
							});
													
							if(defaultValue)
							{
								let defalutValueArray = defaultValue.split(",");	
								$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defalutValueArray);
							    $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).trigger('change');
							}							
							$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();
						}
					})
					.always (function(jqXHROrData, textStatus, jqXHROrErrorThrown) {
						setTimeout(function(){ 
						  $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).next('span.select2').find('.select2-selection--multiple').attr('tabindex','1');

						  $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).next('span.select2').find('ul').html(function() {
							  let count = $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).select2('data').length;
							  return  "<li>" + count + " "+getDashLabel('filter.optionsSelected','options selected')+"</li>"
						  });
						}, 10);
					});				
				}
				else if(dataFieldMetadata.data)
				{
					$(dataFieldMetadata.data).each(function(index, dataObj){
						$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).append('<option value="'+dataObj.code+'">'+dataObj.label+'</option>');
					});	
					if(defaultValue)
					{
						let filterData = _widgetEle.metadata.filter.fields;
						let fldName = $('#widgetFilterModal_fld_field'+'_'+condIndex).val();
						let fieldMetadata = {};
						$(filterData).each(function(index, meta){
							if(meta.fieldName == fldName)
							{
								fieldMetadata = meta;
							}
						});
						let defalutValueArray2 = [];
						if(defaultValue)
							defaultValue = defaultValue.toString();
						let defalutValueArray = defaultValue.split(",");
						$(defalutValueArray).each(function(index){
							$(fieldMetadata.data).each(function(index2){
								let fldDataArray = fieldMetadata.data[index2].code ? fieldMetadata.data[index2].code.split(',') : [];
								if(fldDataArray.indexOf(defalutValueArray[index]) != (-1))
                                {
                                    defalutValueArray2.push(fieldMetadata.data[index2].code);
                                }
							});
						});
						
							
						$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defalutValueArray2);
						$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).trigger('change');
					}
					$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();					
				}
				
				$.fn.select2.amd.define('select2/selectAllAdapter', [
					'select2/utils',
					'select2/dropdown',
					'select2/dropdown/attachBody'
				], function (Utils, Dropdown, AttachBody)
				{
					function SelectAll() { }
					SelectAll.prototype.render = function (decorated) {
						var self = this,
							$rendered = decorated.call(this),
							$selectAll = $(
								'<button class="btn btn-xs btn-default" type="button" style="margin-left:6px;"><i class="fa fa-check-square-o"></i>'+getDashLabel('filter.selectAllStatus','All')+'</button>'
							),
							$btnContainer = $('<div style="margin-top:3px;">').append($selectAll);
						if (!this.$element.prop("multiple")) {
							// this isn't a multi-select -> don't add the buttons!
							return $rendered;
						}
						$rendered.find('.select2-dropdown').prepend($btnContainer);
						$selectAll.on('click', function (e) {
							let totalOption = $('#'+self.$element[0].id).find('option').length;
							let selectedOption = $('#'+self.$element[0].id).find('option:selected').length;
							if(totalOption == selectedOption)
							{
								$('#'+self.$element[0].id+" > option").prop("selected",false).trigger("change");
							}
							else
							{
								$("#"+self.$element[0].id+" > option").prop("selected","selected");
								$("#"+self.$element[0].id).trigger("change");
							}
							
							self.trigger('close');
						});
						return $rendered;
					};

					return Utils.Decorate(Utils.Decorate(Dropdown,AttachBody),SelectAll);
				});
				
				let multiselectbox = $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).select2({
					minimumResultsForSearch: 'Infinity',
					placeholder : "Select",
					dropdownAdapter: $.fn.select2.amd.require('select2/selectAllAdapter'),
					closeOnSelect : false,
					allowHtml: true,
					allowClear: true,
					tags: true,
					tabindex: 1,
					
				}).change(function () {
					  let select = $(this)
					  $(this).next('span.select2').find('ul').html(function() {
						let count = select.select2('data').length
						return "<li>" + count + " "+getDashLabel('filter.optionsSelected','options selected')+"</li>"
					  });
				  });
				
				setTimeout(function(){ 
				  $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).next('span.select2').find('.select2-selection--multiple').attr('tabindex','1');
				}, 10);				
				$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).on('select2:close', function() {
				  let select = $(this);
				  $(this).next('span.select2').find('ul').html(function() {
					let count = select.select2('data').length
					return "<li>" + count + " "+getDashLabel('filter.optionsSelected','options selected')+"</li>"
				  });
				});
				
				$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).next('span.select2').find('ul').html(function() {
				  let count = $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).select2('data').length;
				  return  "<li>" + count + " "+getDashLabel('filter.optionsSelected','options selected')+"</li>"
				});
				fieldValueAvail = true;
				break;
			}
			case 'radio':{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).empty();
				$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content').append('<div class="loading-indicator"></div>');
				if(dataFieldMetadata.ajax)
				{
					$.ajax({
						url : dataFieldMetadata.ajax.url,
						dataType : dataFieldMetadata.ajax.dataType,
						data : dataFieldMetadata.ajax.data,
						success : function(data){
							dataFieldMetadata.ajax.success(data, function(data){
								$(data).each(function(index, dataObj){
									$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<div class="custom-control custom-radio custom-control-inline  mt-3"> <input tabindex="1" class="custom-control-input" id="customRadio'+index+'" type="radio" name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  value="'+dataObj.code+'"> <label class="custom-control-label" for="customRadio'+index+'">'+dataObj.label+'</label> </div>');
								});
							});
													
							if(defaultValue)
							{
								$('input:radio[name='+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+']').val([defaultValue]);

							}							
							$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();
						}
					});					
				}
				else if(dataFieldMetadata.data)
				{
					
					$(dataFieldMetadata.data).each(function(index, dataObj){
						$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<div class="custom-control custom-radio custom-control-inline mt-3"> <input tabindex="1" class="custom-control-input" id="customRadio'+index+'" type="radio" name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  value="'+dataObj.code+'"> <label class="custom-control-label" for="customRadio'+index+'">'+dataObj.label+'</label> </div>');
					});	
					if(defaultValue)
					{
						$('input:radio[name='+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+']').val([defaultValue]);
					}	
					$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();					
				}
				
				fieldValueAvail = true;
				break;
			}
			case 'checkbox':{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).empty();
				$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content').append('<div class="loading-indicator"></div>');
				if(dataFieldMetadata.ajax)
				{
					$.ajax({
						url : dataFieldMetadata.ajax.url,
						dataType : dataFieldMetadata.ajax.dataType,
						data : dataFieldMetadata.ajax.data,
						success : function(data){
							dataFieldMetadata.ajax.success(data, function(data){
								$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).empty();
								$(data).each(function(index, dataObj){
									$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<div class="custom-control custom-checkbox w-100" style="margin: 0.7em 0px;"> <input tabindex="1" class="custom-control-input" id="customCheckbox'+index+'" type="checkbox" name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" value="'+dataObj.code+'"> <label class="custom-control-label" for="customCheckbox'+index+'">'+dataObj.label+'</label> </div>');
								});
							});
													
							if(defaultValue)
							{
								$('input:checkbox[name='+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+']').val([defaultValue]);
							}							
							$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();
						}
					});					
				}
				else if(dataFieldMetadata.data)
				{
					$(dataFieldMetadata.data).each(function(index, dataObj){
						$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<div class="custom-control custom-checkbox w-100" style="margin: 0.7em 0px;"> <input tabindex="1" class="custom-control-input" id="customCheckbox'+index+'" type="checkbox" name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" value="'+dataObj.code+'"> <label class="custom-control-label" for="customCheckbox'+index+'">'+dataObj.label+'</label> </div>');
					});

					if(defaultValue)
					{
						$('input:checkbox[name='+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+']').val([defaultValue]);
					}					
					$('#'+_widgetEle.utils.actionIds.widgetModalId+' .modal-content .loading-indicator').remove();					
				}
				
				fieldValueAvail = true;
				break;
			}
			case 'autocomplete':{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<input required="true" type="text" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control autocompletebox" placeholder="'+getDashLabel('filter.enterKeyword','Enter Keyword or')+'" %"" tabindex="1"></input>');
				
				$( '#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex ).autocomplete({
				  source: function( request, response ) {
					$.ajax( {
					  url: dataFieldMetadata.ajax.url,
					  dataType: dataFieldMetadata.ajax.dataType,
					  data: dataFieldMetadata.ajax.data(request.term),
					  success: function( data ) {
						response( dataFieldMetadata.ajax.success(data).results );
					  }
					} );
				  },
				  minLength: 1,
				  select: function( event, ui ) {
					$(this).val(ui.item.value);
				  }
				} );
				if(defaultValue)
				{
					$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defaultValue);
				}	
				fieldValueAvail = true;
				break;
			}
			case 'amount':{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<input required="true" autocomplete="off" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control only-amount" tabindex="1" />');
				$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).keypress(function(e){
					 let val = $('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val();
					 if (((e.which != 46 || (e.which == 46 && val == '')) ||
							val.indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
						e.preventDefault();
					 }
				});	
				if(defaultValue)
				{
					$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defaultValue);
				}
				$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex)
				.autoNumeric('init',
					{
						aSep : _strGroupSeparator ? _strGroupSeparator : ',', 
						aDec : _strDecimalSeparator ? _strDecimalSeparator : '.', 
						mDec : _strAmountMinFraction ? _strAmountMinFraction : '2', 
						vMin : 0,
						wEmpty : 'zero'
					});				
				fieldValueAvail = true;					
				break;
			}
			case 'number':{
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<input required="true" autocomplete="off" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control only-number" tabindex="1" />');
				if(defaultValue)
				{
					$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defaultValue);
				}
				fieldValueAvail = true;
				break;
			}
			case 'date':{
				let dtDiv = '<span class="date-option-fld">';
				dtDiv += '<select tabindex="1" class="dtoptionfld" datacount="'+condIndex+'" id="'+_widgetEle.utils.actionIds.widgetFld_dtoption+'_'+condIndex+'">';
				dtDiv += '<option value="DR">'+DATEOPERATOR.DR+'</option>';
				dtDiv += '<option value="LT">'+DATEOPERATOR.LT+'</option>';
				dtDiv += '<option value="TD">'+DATEOPERATOR.TD+'</option>';
				dtDiv += '<option value="YT">'+DATEOPERATOR.YT+'</option>';
				dtDiv += '<option value="TW">'+DATEOPERATOR.TW+'</option>';
				dtDiv += '<option value="WD">'+DATEOPERATOR.WD+'</option>';
				dtDiv += '<option value="TM">'+DATEOPERATOR.TM+'</option>';
				dtDiv += '<option value="MD">'+DATEOPERATOR.MD+'</option>';
				dtDiv += '<option value="LM">'+DATEOPERATOR.LM+'</option>';
				dtDiv += '<option value="TQ">'+DATEOPERATOR.TQ+'</option>';
				dtDiv += '<option value="QD">'+DATEOPERATOR.QD+'</option>';
				dtDiv += '<option value="TY">'+DATEOPERATOR.TY+'</option>';
				dtDiv += '</select>';
				dtDiv += '<input required="true" autocomplete="off" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control" tabindex="1" />';
				dtDiv += '</span>';
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append(dtDiv);
				//$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<input required="true" autocomplete="off" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control date-option-fld" tabindex="1" />');
				
				if(isDefalut)
				{
					$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).datepicker('disable');
					$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).datepicker('disable');
				}
				else
				{
					$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).datepicker({
						changeMonth: true,
						changeYear: true,
						dateFormat:  _strDefaultDateFormat.replace('yyyy','yy').replace('MM','mm').replace('MMM','M').replace('MMMM','MM'),
						onSelect: function(date){

							var selectedDate = new Date(date);
							var msecsInADay = 86400000;
							var endDate = new Date(selectedDate.getTime() + msecsInADay);

							$('#'+_widgetEle.utils.actionIds.widgetFld_value2+'_'+condIndex).datepicker( "option", "minDate", endDate );
							$('#widgetFilterModal_fld_dtoption_'+condIndex).val('DR');
						    $('#widgetFilterModal_fld_dtoption_'+condIndex+' + .select2-container .select2-selection').attr('title','Date Range');

							$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'-error').remove();
						}
					});
				}
				
				$('#widgetFilterModal_fld_dtoption_'+condIndex).select2({
				  minimumResultsForSearch: 'Infinity',
				  dropdownAutoWidth : true,
				  width: '7%',
				  templateSelection: function (d) {
					return '';
				  }
				});
				$('#widgetFilterModal_fld_dtoption_'+condIndex+' + .select2-container .select2-selection').attr('title','Date Range');

				if(defaultValue)
				{
					$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defaultValue);
				}
				
				$('#'+_widgetEle.utils.actionIds.widgetFld_dtoption+'_'+condIndex).change(function(){
					_widgetEle.utils.onDateOptionChange(this, _widgetEle);
				});
				
				fieldValueAvail = true;
				break;
			}
		  case 'text':{
			$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<input required="true" autocomplete="off" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control" tabindex="1" />');
			fieldValueAvail = true;
			if(defaultValue)
			{
				$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).val(defaultValue);
			}
			break;
		  }	
		  default:{
		    if(!fieldValueAvail){
				$('#'+_widgetEle.utils.actionIds.widgetDiv_value1+'_'+condIndex).append('<input required="true" autocomplete="off" id="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'"  name="'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex+'" class="form-control" tabindex="1" />');
			}
			break;  
		  }			
		}
		
		_widgetEle.filterValidation();
		//$($('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex)).parent().parent().find('#widgetFilterModal_btn_add').attr('disabled','disabled');
		//$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).unbind('change');
		/*$('#'+_widgetEle.utils.actionIds.widgetFld_value1+'_'+condIndex).change(function(){
			widgetEle.utils.enableAddRow(this, widgetEle, widgetEle.utils.actionIds.widgetModalId);
		});*/
	},
	onDateOptionChange : function(el,_widgetEle){
		let datepickerIndex = $(el).attr('datacount');
		let selectedValue = $('#widgetFilterModal_fld_dtoption_'+datepickerIndex+' option:selected').text();
		let datepickerValue1 = $("#widgetFilterModal_fld_val1_"+datepickerIndex);
		let datepickerValue2 = $("#widgetFilterModal_fld_val2_"+datepickerIndex);
		let operatorFld = $("#widgetFilterModal_fld_opr_"+datepickerIndex);

		$(datepickerValue1).val('');
		$(datepickerValue2).val('');
		switch ($(el).val()) 
		{
		  case 'DR':
		  {
			$(operatorFld).val('bt').change();
			break;  
		  }
		  case 'LT':
		  {
			$(operatorFld).val('bt').change();
			var currDt = new Date(); 
			var firstDt = new Date(currDt.getFullYear(), currDt.getMonth()-1, 1);
			var lastDt = new Date(currDt.getFullYear(), (currDt.getMonth()-1) + 1, 0);
			//$(datepickerValue1).datepicker("setDate", firstDt);
			//$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			$(datepickerValue1).val(from_date_payment);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).val(to_date_payment);
			break;    
		  }
		  case 'TD':
		  {
			$(operatorFld).val('eq').change();
			$('#widgetFilterModal_fld_dtoption_'+datepickerIndex).val('TD');
			$('#widgetFilterModal_fld_dtoption_'+datepickerIndex).trigger('change.select2');
			$(datepickerValue1).datepicker("setDate", new Date());
			break;  
		  }
		  case 'YT':
		  {
			 $(operatorFld).val('eq').change();
			 $('#widgetFilterModal_fld_dtoption_'+datepickerIndex).val('YT');
			 $('#widgetFilterModal_fld_dtoption_'+datepickerIndex).trigger('change.select2');
			 let date = new Date();
			     date.setDate(date.getDate() - 1);
				 $(datepickerValue1).datepicker("setDate", date);
			break;  
		  }
		  case 'TW':
		  {
			$(operatorFld).val('bt').change();
			
			var dtDate = new Date();
			var startDay = 1; // 0=sunday, 1=monday etc.
			var day = dtDate.getDay();
			var weekStart = new Date(dtDate.valueOf()
					- (day <= 0 ? 7 - startDay : day - startDay) * 86400000);
			
			var firstDt = new Date(weekStart);
			var lastDt = new Date(); 
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;  
		  }
		case 'WD':
		{
			$(operatorFld).val('bt').change();
			var dtDate = new Date();
			var startDay = 1; // 0=sunday, 1=monday etc.
			var day = dtDate.getDay();
			var currentWeekStartDay = new Date(dtDate.valueOf()
						- (day <= 0 ? 7 - startDay : day - startDay) * 86400000);
			var lastWeekStart = currentWeekStartDay
						.setTime(currentWeekStartDay.getTime() - 7 * 86400000);
			
			var firstDt = new Date(lastWeekStart);
			var lastDt = new Date(); 
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;  
		}
		case 'TM':
		{
			$(operatorFld).val('bt').change();
			var currDt = new Date(); 
			var firstDt = new Date(currDt.getFullYear(), currDt.getMonth(), 1);
			var lastDt = new Date();
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;   
		}
		case 'MD':
		{
			$(operatorFld).val('bt').change();
			var dtDate = new Date();
			var dtFrom = null;
			var dtJson = {};

			if (dtDate.getMonth() == 0) {
				dtFrom = new Date(dtDate.getFullYear() - 1, 11, 1);
			} else {
				dtFrom = new Date(dtDate.getFullYear(), dtDate.getMonth()
								- 1, 1);
			}

			
			var firstDt = new Date(dtFrom);
			var lastDt = new Date();
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;  
		}
		case 'LM':
		{
			$(operatorFld).val('bt').change();
			var currDt = new Date(); 
			var firstDt = new Date(currDt.getFullYear(), currDt.getMonth()-1, 1);
			var lastDt = new Date(currDt.getFullYear(), (currDt.getMonth()-1) + 1, 0);
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;   
		}
		case 'TQ':
		{
			$(operatorFld).val('bt').change();
			
			var dtDate = new Date();
			var dtFrom = null;
			var dtTo = null;
			var dtJson = {};

			if (dtDate.getMonth() <= 2) {
				// first quarter Jan-march
				dtFrom = new Date(dtDate.getFullYear(), 0, 1);
				dtTo = new Date(dtDate.getFullYear(), 0+2, 1);
			} else if (dtDate.getMonth() > 2 && dtDate.getMonth() <= 5) {
				// second quarter April-June
				dtFrom = new Date(dtDate.getFullYear(), 3, 1);
				dtTo = new Date(dtDate.getFullYear(), 3+2, 1);
			} else if (dtDate.getMonth() > 5 && dtDate.getMonth() <= 8) {
				// third quarter July-Sep
				dtFrom = new Date(dtDate.getFullYear(), 6, 1);
				dtTo = new Date(dtDate.getFullYear(), 6+2, 1);
			} else if (dtDate.getMonth() > 8 && dtDate.getMonth() <= 11) {
				// fourth quarter Oct-Dec
				dtFrom = new Date(dtDate.getFullYear(), 9, 1);
				dtTo = new Date(dtDate.getFullYear(), 9+2, 1);
			}
			var firstDt = new Date(dtFrom);
			var lastDt = new Date(dtDate);
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;  
		}
		case 'QD':
		{
			$(operatorFld).val('bt').change();
			
			var dtDate = new Date();
			var dtFrom = null, dtToStartDate = null, dtTo = null;
			var dtJson = {};

			if (dtDate.getMonth() <= 2) {
				// first quarter Jan-march
				dtFrom = new Date(dtDate.getFullYear() - 1, 9, 1);
				dtToStartDate = new Date(dtDate.getFullYear() - 1, 11, 1);
			} else if (dtDate.getMonth() > 2 && dtDate.getMonth() <= 5) {
				// second quarter April-June
				dtFrom = new Date(dtDate.getFullYear(), 0, 1);
				dtToStartDate = new Date(dtDate.getFullYear(), 2, 1);
			} else if (dtDate.getMonth() > 5 && dtDate.getMonth() <= 8) {
				// third quarter July-Sep
				dtFrom = new Date(dtDate.getFullYear(), 3, 1);
				dtToStartDate = new Date(dtDate.getFullYear(), 5, 1);
			} else if (dtDate.getMonth() > 8 && dtDate.getMonth() <= 11) {
				// fourth quarter Oct-Dec
				dtFrom = new Date(dtDate.getFullYear(), 6, 1);
				dtToStartDate = new Date(dtDate.getFullYear(), 8, 1);
			}
			var firstDt = new Date(dtFrom);
			var lastDt = new Date(dtDate);
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;   
		}
		case 'TY':
		{
			$(operatorFld).val('bt').change();
			var currDt = new Date(); 
			var firstDt = new Date(currDt.getFullYear(), 0, 1);
			var lastDt = new Date(currDt);
			$(datepickerValue1).datepicker("setDate", firstDt);
			$('#widgetFilterModal_fld_val2_'+datepickerIndex).datepicker("setDate", lastDt);
			break;  
		}
	   }
	   
	   $('#widgetFilterModal_fld_dtoption_'+datepickerIndex+' + .select2-container .select2-selection').attr('title',selectedValue);

	},
	addNewRow : function(el,_widgetEle, filterId){
		let widgetEle = _widgetEle;
		if($('.filter-conditions-item').length == 0)
			totalCondition = 0;
		++totalCondition;
		let fieldRow = filterModal.createFieldRow(_widgetEle, filterId, 'ADD', totalCondition);
		$('#'+_widgetEle.utils.actionIds.widgetBtn_add).parent().find('.remove-condition-row').remove();
		$('#'+_widgetEle.utils.actionIds.widgetBtn_add).html('<i class="material-icons">remove_circle_outline</i>');
		$('#'+_widgetEle.utils.actionIds.widgetBtn_add).removeClass('add-condition-row').addClass('remove-condition-row');
		$('#'+_widgetEle.utils.actionIds.widgetBtn_add).removeAttr('id');
		
		$('#'+_widgetEle.utils.actionIds.widgetDiv_conditions).append(fieldRow);
		$('#' + _widgetEle.utils.actionIds.widgetBtn_add).unbind('click');
		$('#' + _widgetEle.utils.actionIds.widgetBtn_add).click(function(){
			widgetEle.utils.addNewRow(this, widgetEle, widgetEle.utils.actionIds.widgetModalId);			
		});
		
		$('.remove-condition-row').unbind('click');
		$('.remove-condition-row').click(function(){
			let addBtn = $(this).parent().find('#widgetFilterModal_btn_add');
			let isAddBtn = $(addBtn).length;
			$(this).parent().parent().remove();
			if(isAddBtn > 0)
			{
				$('.filter-conditions .filter-conditions-item:last-Child #widgetFilterModal_div_add').append(addBtn);
			}
			
			let presentItemCount = $('.filter-conditions .filter-conditions-item').length;
			
			if(presentItemCount == 1)
			{
				$('.filter-conditions .filter-conditions-item:last-Child #widgetFilterModal_div_add .remove-condition-row').remove();
			}
			
			$('#' + _widgetEle.utils.actionIds.widgetBtn_add).unbind('click');
			$('#' + _widgetEle.utils.actionIds.widgetBtn_add).click(function(){
				widgetEle.utils.addNewRow(this, widgetEle, widgetEle.utils.actionIds.widgetModalId);			
			});
			
		});
		
		$('#' + _widgetEle.utils.actionIds.widgetFld_field+'_'+totalCondition).unbind('change');
		$('#' + _widgetEle.utils.actionIds.widgetFld_field+'_'+totalCondition).change(function(){
			widgetEle.utils.onFieldNameChange(this, widgetEle, widgetEle.utils.actionIds.widgetModalId);
			widgetEle.utils.changeValueFields(this, widgetEle, widgetEle.utils.actionIds.widgetModalId, false);
		});
		$('#' + _widgetEle.utils.actionIds.widgetFld_operator+'_'+totalCondition).unbind('change');
		$('#' + _widgetEle.utils.actionIds.widgetFld_operator+'_'+totalCondition).change(function(){
			widgetEle.utils.onOperatorChange(this, widgetEle, widgetEle.utils.actionIds.widgetModalId, false);
		});	
		
		_widgetEle.filterValidation();
	},
	onGroupFldChange : function(ele)
	{
		let currentSelectId = $(ele).attr('id');
		let currentSelectVal = $(ele).val();
		if(currentSelectVal)
		{
			
			if(currentSelectId == 'groupByCond1')
			{
				$('.filter-group-fld option').css("display", "block");
				$('#groupByCond2').removeAttr('disabled').val('');
				$('#groupByCond3').attr('disabled','disabled').val('');
				$('#groupByCond2 option[value="'+currentSelectVal+'"]').css("display", "none");
				$('#groupByCond3 option[value="'+currentSelectVal+'"]').css("display", "none");
			}
			else if(currentSelectId == 'groupByCond2')
			{
				let firstFldVal = $('#groupByCond1').val();
				$('.filter-group-fld option').css("display", "block");
				$('#groupByCond3').removeAttr('disabled').val('');						
				$('#groupByCond2 option[value="'+firstFldVal+'"]').css("display", "none");
				$('#groupByCond3 option[value="'+firstFldVal+'"]').css("display", "none");
				$('#groupByCond3 option[value="'+currentSelectVal+'"]').css("display", "none");
			}
		}
		else
		{
			if(currentSelectId == 'groupByCond1')
			{
				$('#groupByCond2').val('').attr('disabled','disabled');
				$('#groupByCond3').val('').attr('disabled','disabled');
			}
			else if(currentSelectId == 'groupByCond2')
			{
				$('#groupByCond3').val('').attr('disabled','disabled');
			}
		}
		if($('#widgetFilterModal_fld_savedList').val() == 'Default')
		{
			if($('#groupByCond1').val())
			{
			   $('#widgetFilterModal_btn_save').removeAttr('disabled');
			   $('#widgetFilterModal_btn_apply').attr('disabled','disabled');		   
			}
			else
			{
				$('#widgetFilterModal_btn_apply').removeAttr('disabled');
			    $('#widgetFilterModal_btn_save').attr('disabled','disabled');
			}
		}
		
	}
};

var filter = function() {
	  return filterAction();
};

function filterAction(){
	  var _thisFilter = {};
	  _thisFilter.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = FilterActionUtils;		
		this.action = '';
		
		this.initialize();
    };
	
    _thisFilter.initialize = function(){
		this.action = this.createAction();
		this.bindAction();
	};
	
	_thisFilter.createAction = function(){
        let actionItem = document.createElement('li');
		let menuOption = document.createElement('a');
		menuOption.className = 'dropdown-item';
		menuOption.id = this.utils.actionIds.actionBtnId + this.widgetId;
        menuOption.setAttribute('href','javascript:void(0);');
		$(menuOption).append(this.label);
		actionItem.appendChild(menuOption);
     	return actionItem;
	};
	
	_thisFilter.getAction = function(){
		return this.action;
	};
	
	_thisFilter.bindAction = function(){	
		let _this = this;
		let actionId = _this.utils.actionIds.actionBtnId + _this.widgetId;
		$('#'+actionId).ready(function(){
			$('#'+actionId).unbind('click');
			$('#'+actionId).click(function(){
				_this.callback ? _this.callback(_this) : _this.callAction();
			});			
		});
	};
	
	_thisFilter.callAction = function(){
		totalCondition = 0;
		this.closeFilter();
		let _this = this;
		let widgetModalId = this.utils.actionIds.widgetModalId;
		let filterModal = this.utils.createFilterModal(this, widgetModalId);
		$('body').append(filterModal.outerHTML);
		$('#'+widgetModalId).modal('show');
		
	    //grouping
		this.setGroupField();
		//grouping end
				
		$('#' + this.utils.actionIds.widgetFld_field+'_1').unbind('change');
		$('#' + this.utils.actionIds.widgetFld_field+'_1').change(function(){
			_this.utils.onFieldNameChange(this, _this, widgetModalId);
			_this.utils.changeValueFields(this, _this, widgetModalId, false);
		});
		$('#' + this.utils.actionIds.widgetFld_operator+'_1').unbind('change');
		$('#' + this.utils.actionIds.widgetFld_operator+'_1').change(function(){
			_this.utils.onOperatorChange(this, _this, widgetModalId, false);
		});		
		
		$('#' + this.utils.actionIds.widgetBtn_apply).unbind('click');
		$('#' + this.utils.actionIds.widgetBtn_apply).click(function(){
			_this.doApplyFilter('apply');
		});
		
		$('#' + this.utils.actionIds.widgetBtn_save).unbind('click');
		$('#' + this.utils.actionIds.widgetBtn_save).click(function(){
			_this.doApplyFilter('save');			
		});
		
		$('#' + this.utils.actionIds.widgetBtn_cancel).unbind('click');
		$('#' + this.utils.actionIds.widgetBtn_cancel).click(function(){
			_this.closeFilter();			
		});
		
		$('#' + this.utils.actionIds.widgetBtn_add).unbind('click');
		$('#' + this.utils.actionIds.widgetBtn_add).click(function(){
			_this.utils.addNewRow(this, _this, widgetModalId);			
		});		
				
		$('#'+this.utils.actionIds.widgetFld_field).focus();
		
		$('#'+this.utils.actionIds.widgetBtn_apply).blur(function(){
			//$('#'+_this.utils.actionIds.widgetFld_savedList).focus();
			$('#widgetFilterModal_fld_savedList').next('span.select2-container').find('.select2-selection').focus();
		});
		
		$('#widgetFilterModal_fld_savedList').unbind('change');
		$('#widgetFilterModal_fld_savedList').change(function(){
			_this.onFilterListChange($(this).val());
		});
		
		let widgetId = _this.widgetId;
		
		let selectedOption = [];
		
		selectedOption.push({id: '-1',text: getDashLabel('filter.selectFilter','Select Filter')});
		selectedOption.push({id: 'Default',text: getDashLabel('filter.default','Default')});
		
		/*saved filter*/
		if(usrDashboardPref.widgets[widgetId] 
			&& usrDashboardPref.widgets[widgetId].savedFilter){
			let filterList = usrDashboardPref.widgets[widgetId].savedFilter;			
			$.each( filterList, function( key, value ) {
				let lable = key;
				let id = key;
			   selectedOption.push({id: id,text: lable});
			});
		}
		
		$('#widgetFilterModal_fld_savedList').select2({
			  minimumResultsForSearch: 'Infinity',
			  data: selectedOption,
			  templateSelection: function (d) {
				return d.text;
			  },
			  templateResult: function (d) { 
			    let returnValue = '';
				if(d.text == 'Select Filter' || d.text == 'Default')
				{
					returnValue = '<span>'+d.text+'</span>';
				}
				else
				{
					returnValue = '<span style="width:10px">'
					+ d.text + '</span> <span clearValue = "'
					+ d.text + '" class="material-icons float-right delete-saved-filter"> clear </span>';
				}
				return $(returnValue); 
			  }
			});
			
		$('#widgetFilterModal_fld_savedList').change(function(){
			let title = $('#widgetFilterModal_fld_savedList').val();
			if(title == '-1')
			{
				title = getDashLabel('filter.selectFilter','Select Filter');
			}
			$('#select2-widgetFilterModal_fld_savedList-container').attr('title',title);
		});
			
			
			$(document).on('#widgetFilterModal_fld_savedList select2:open', function (e) {
				setTimeout(function(){
					$('.delete-saved-filter').unbind('click');
					$('.delete-saved-filter').unbind('mouseup');
					$('.delete-saved-filter').mouseup(function(e) {
						e.stopPropagation();            
					});
					$('.delete-saved-filter').click(function(e){
						e.preventDefault();
						let filterName = $(this).attr('clearValue');
						$(this).parent().remove();
						
						if(usrDashboardPref.widgets){
							if(usrDashboardPref.widgets[widgetId]  &&  usrDashboardPref.widgets[widgetId].savedFilter
									&&  usrDashboardPref.widgets[widgetId].savedFilter[filterName]){
								delete usrDashboardPref.widgets[widgetId].savedFilter[filterName];
								updateDashboardPref();								
							}
						}	
						if($('#widgetFilterModal_fld_savedList').val() == filterName)
						{
							$('#widgetFilterModal_fld_savedList').val('-1');
							$('#widgetFilterModal_fld_savedList').trigger('change');
							$('#select2-widgetFilterModal_fld_savedList-container').attr('title', getDashLabel('filter.selectFilter','Select Filter'));
						}
						$('#widgetFilterModal_fld_savedList option[value="'+filterName+'"]').remove();
						_this.refreshLocalStorage(_this.widgetId, filterName);
						widgetMap[_this.widgetId].api.refresh();
					});					
				}, 500);				
			});
		
	     //$('#widgetFilterModal_fld_savedList').val('-1');
	    //$('#widgetFilterModal_fld_savedList').trigger('change');
			
		if(usrDashboardPref.widgets){
			if(localStorage.getItem(widgetId) != null)
			{
				$('#widgetFilterModal_fld_savedList').val('-1');
				$('#widgetFilterModal_fld_savedList').trigger('change.select2');
				$('#select2-widgetFilterModal_fld_savedList-container').attr('title', getDashLabel('filter.selectFilter','Select Filter'));
				this.setLocalFilterValues();				
			}
			else if(usrDashboardPref.widgets[widgetId]  &&  usrDashboardPref.widgets[widgetId].defalutFilter
					&&  usrDashboardPref.widgets[widgetId].defalutFilter != 'Default' 
					&&  usrDashboardPref.widgets[widgetId].defalutFilter != '-1'){
				let defaluFilter = usrDashboardPref.widgets[widgetId].defalutFilter;
				$('#widgetFilterModal_fld_savedList').val(defaluFilter);
				$('#widgetFilterModal_fld_savedList').trigger('change.select2');
				this.applySavedFilter(defaluFilter, false);
			}
			else if(usrDashboardPref.widgets[widgetId] && usrDashboardPref.widgets[widgetId].defalutFilter == 'Default')
			{
				$('#widgetFilterModal_fld_savedList').val('Default');
				$('#widgetFilterModal_fld_savedList').trigger('change.select2');
				this.applyDefaultFilter('Default', true);
			}
//			else if(usrDashboardPref.widgets[widgetId].defalutFilter == '-1' &&
//					localStorage.getItem(widgetId) != null)
//			{
//				$('#widgetFilterModal_fld_savedList').val('-1');
//				$('#widgetFilterModal_fld_savedList').trigger('change.select2');
//				this.setLocalFilterValues();
//			}			
			else{
				
				let localStorageWidget = localStorage.getItem('pref_ng_widgets');
				if(localStorageWidget)
				{
					$('#widgetFilterModal_fld_savedList').val('-1');
					$('#widgetFilterModal_fld_savedList').trigger('change.select2');
					$('#select2-widgetFilterModal_fld_savedList-container').attr('title', getDashLabel('filter.selectFilter','Select Filter'));
					this.applyBlankFilter('-1');
				}
				else
				{
					$('#widgetFilterModal_fld_savedList').val('Default');
					$('#widgetFilterModal_fld_savedList').trigger('change.select2');
					this.applyDefaultFilter('Default', true);
				}
			}
		}
	};
	
	_thisFilter.closeFilter = function(){
		$('#'+this.utils.actionIds.widgetModalId).modal('hide');
		$('#'+this.utils.actionIds.widgetModalId).remove();
		$('#ui-datepicker-div').remove();
	};
	
	_thisFilter.applyBlankFilter = function(filterName){
		let widgetId = this.widgetId;
		let _this = this;
		$('#cond_sec_widgetFilterModal').empty();
		$('#widgetFilterModal_fld_filterName').val("");
		$('#widgetFilterModal_btn_save').removeAttr('disabled');
		$('.filter-group-fld').val('');
		_this.utils.onGroupFldChange($('#groupByCond1'));
		_this.utils.addNewRow(this, _this, _this.utils.actionIds.widgetModalId);
	};
	
	_thisFilter.applyDefaultFilter = function(filterName, onloadFilter){
		let widgetId = this.widgetId;
		let _this = this;
		let isDefalut = false;
		$('#widgetFilterModal_fld_filterName').val("");
		$('.filter-group-fld').val('');
		_this.utils.onGroupFldChange($('#groupByCond1'));
		if(this.metadata.filter 
			&& this.metadata.filter.fields){
			let filterObj = this.metadata.filter;
			let defaultFilterCount = 0;
			$(filterObj.fields).each(function(index, field){				
				if(field.default){
					  if(defaultFilterCount == 0)
					  {
						  isDefalut = true;
						  $('#cond_sec_widgetFilterModal').empty();
						  $('#widgetFilterModal_fld_savedList option[value=Default]').attr('selected','selected');
						  $('#widgetFilterModal_btn_save').attr('disabled','disabled');
					  }
					 _this.utils.addNewRow(this, _this, _this.utils.actionIds.widgetModalId);
					 let filsOption = $('#widgetFilterModal_fld_field_'+(defaultFilterCount+1)+' option[value='+field.fieldName+']');
					 let fils = $('#widgetFilterModal_fld_field_'+(defaultFilterCount+1));
					 let opers = $('#widgetFilterModal_fld_opr_'+(defaultFilterCount+1));
					 
					 $(filsOption).attr('selected','selected');
					 _this.utils.onFieldNameChange(fils, _this, _this.utils.actionIds.widgetModalId);
					 $('#widgetFilterModal_fld_opr_'+(defaultFilterCount+1)+' option[value='+field.default.operator+']').attr('selected','selected');
					_this.utils.onOperatorChange(opers, _this, _this.utils.actionIds.widgetModalId, true);				
					_this.utils.changeValueFields(fils, _this, _this.utils.actionIds.widgetModalId, field.default.value1, true);	
					if(field.default.operator == 'bt')
					{
						$('#widgetFilterModal_fld_val2_'+(defaultFilterCount+1)).val(field.default.value2);
					}
					
					/*if($(fils).find('option:selected').attr('data-type') == 'date')
					{
						$('#widgetFilterModal_fld_dtoption_'+(defaultFilterCount+1)).val(field.dateOption);
					}*/
					
					defaultFilterCount++;
					
					$('.filter-conditions-item input, .filter-conditions-item select, .filter-conditions-item button').attr('disabled','disabled');
				}
			});
		}
		
		if(!onloadFilter && !isDefalut)
		{
			$('#cond_sec_widgetFilterModal').empty();
		}
	};
	
	_thisFilter.applySavedFilter = function(filterName){
		let widgetId = this.widgetId;
		let _this = this;
		
		$('#widgetFilterModal_fld_filterName').val(filterName);
		$('#widgetFilterModal_btn_save').removeAttr('disabled');
		
		if(usrDashboardPref.widgets[widgetId] 
			&& usrDashboardPref.widgets[widgetId].savedFilter
			&& usrDashboardPref.widgets[widgetId].savedFilter[filterName]){
			let filterObj = usrDashboardPref.widgets[widgetId].savedFilter[filterName];	
			$('#cond_sec_widgetFilterModal').empty();
			$(filterObj.fields).each(function(index, field){				
				_this.utils.addNewRow(this, _this, _this.utils.actionIds.widgetModalId);
				let filsOption = $('#widgetFilterModal_fld_field_'+(index+1)+' option[value='+field.fieldName+']');
				let fils = $('#widgetFilterModal_fld_field_'+(index+1));
				let opers = $('#widgetFilterModal_fld_opr_'+(index+1));
				
				$(filsOption).attr('selected','selected');
				_this.utils.onFieldNameChange(fils, _this, _this.utils.actionIds.widgetModalId);			
				$('#widgetFilterModal_fld_opr_'+(index+1)+' option[value='+field.operator+']').attr('selected','selected');
				_this.utils.onOperatorChange(opers, _this, _this.utils.actionIds.widgetModalId, false);				
				_this.utils.changeValueFields(fils, _this, _this.utils.actionIds.widgetModalId, field.value1, false);	
				if(field.operator == 'bt')
				{
					$('#widgetFilterModal_fld_val2_'+(index+1)).val(field.value2);
				}
				
				if($(fils).find('option:selected').attr('data-type') == 'date')
				{
					$('#widgetFilterModal_fld_dtoption_'+(index+1)).val(field.dateOption);
					$('#widgetFilterModal_fld_dtoption_'+(index+1)).trigger('change.select2');					
					$('#widgetFilterModal_fld_dtoption_'+(index+1)+' + .select2-container .select2-selection').attr('title',DATEOPERATOR[field.dateOption]);
				}
				
			});
			$('.filter-group-fld').val('');
			$(filterObj.group).each(function(index){
				let grpVal = filterObj.group[index];
				
				(grpVal != undefined && grpVal.length > 0) 
					? $('#groupByCond'+(index+1)).removeAttr('disabled') 
					: $('#groupByCond'+(index+1)).attr('disabled','disabled');
				
				$('#groupByCond'+(index+1)).val(grpVal);
				_this.utils.onGroupFldChange($('#groupByCond'+(index+1)));
			});
		}
	};
	
	_thisFilter.doApplyFilter = function(type){
		let _this = this;
		let widgetId = _this.widgetId;
		
		let validationError =  this.filterValidation();
		
		//if(validationError.errorList.length == 0)
		//{
			$('.filter-conditions-item label.error').remove();
			if(this.doApplyValidation(type))
			{
				let appliedFilter = this.getApplyFilter();
				
				if(appliedFilter)
				{
					let savedFieldGroupArray = [];
					
					if($('#groupByCond1').val()) savedFieldGroupArray.push($('#groupByCond1').val());
					if($('#groupByCond2').val()) savedFieldGroupArray.push($('#groupByCond2').val());
					if($('#groupByCond3').val()) savedFieldGroupArray.push($('#groupByCond3').val());
					
					if(type == 'save'){
						let filterName = $('#'+this.utils.actionIds.widgetFld_filterName).val().trim();
						if(usrDashboardPref.widgets){
							if(!usrDashboardPref.widgets[widgetId]){
								usrDashboardPref.widgets[widgetId] = {
									savedFilter : {}
								}
							}else if(!usrDashboardPref.widgets[widgetId].savedFilter){
								usrDashboardPref.widgets[widgetId].savedFilter = {}
							}
						}
						else
						{
							usrDashboardPref = {
								widgets : {
									widgetId : {
										savedFilter : {}
									}
								}
							}
						}
						appliedFilter.filter['group'] = savedFieldGroupArray;
						usrDashboardPref.widgets[widgetId].savedFilter[filterName] = appliedFilter.filter;
						usrDashboardPref.widgets[widgetId].defalutFilter = filterName;
						updateDashboardPref();
					}else
					{
						let localStorageWidget = localStorage.getItem("pref_ng_widgets");
						let pref_ng_widgets = {};
						
					}	
					
					let refreshAction = refresh();
					refreshAction.constructor(_this.widgetId, null, null, this.metadata, null);
					refreshAction.appliedFilter = appliedFilter;
					let selectedFilter = (type == 'save')? $('#widgetFilterModal_fld_filterName').val() :
																			$('#widgetFilterModal_fld_savedList').val();
					_this.updateLocalStorage(this.widgetId, selectedFilter, appliedFilter, savedFieldGroupArray);
					refreshAction.callAction();
					this.closeFilter();
				}
			}	
		//}
	};
	_thisFilter.updateLocalStorage = function(id, selectedFilter, filterJson, savedFieldGroupArray)
	{
		var widget = {};
		localStorage.removeItem(id);
		widget.id = id;
		widget.localSavedFilter = filterJson;
		widget.group = savedFieldGroupArray;
		if(selectedFilter == null || selectedFilter == '')
		{
			widget.selectedFilter = '-1';
		}
		else
		{
			widget.selectedFilter = selectedFilter;
		}
		localStorage.setItem(id, JSON.stringify(widget));
	};
	
	_thisFilter.doApplyValidation = function(type){
		let _this = this;
		let error = true;
		let saveFilterName  = $('#'+this.utils.actionIds.widgetFld_filterName).val().trim();
		if(type == 'save'){
			if(!saveFilterName){
				//$('#'+this.utils.actionIds.widgetModalId+ ' .modal-error').empty().html('<span>Filter Name allowed length is 4-20</span>');
				 _this.appendErrorMsg('widgetFilterModal_fld_filterName',getDashLabel('filter.err.fldRequired','This field is required.'));
				error =  false;
			}else if(!saveFilterName || saveFilterName.length < 4 || saveFilterName.length > 20){
				//$('#'+this.utils.actionIds.widgetModalId+ ' .modal-error').empty().html('<span>Filter Name allowed length is 4-20</span>');
				 _this.appendErrorMsg('widgetFilterModal_fld_filterName',getDashLabel('filter.err.filterNameMinError','Value should be greater than 4 Characters.'));
				error =  false;
			}
			else if( saveFilterName.toLowerCase() == 'default'){
				//$('#'+this.utils.actionIds.widgetModalId+ ' .modal-error').empty().html('<span>Filter Name cannot be Default.</span>');
				_this.appendErrorMsg('widgetFilterModal_fld_filterName',getDashLabel('filter.err.filterNameError','Filter Name cannot be Default.'));
				error =  false;
			}			
		}		
		return error;
	};
	
	_thisFilter.getApplyFilter = function(){
		let _this = this;
		let widgetId = this.widgetId;
		let filterData;
		let errorList = [];
		
		let filterFields = [];
		
		$('.filter-conditions-item').each(function(index){
			//let conIndex = index+1;
			let conIndex   = $(this).find('div:first-child select').attr('id').replace('widgetFilterModal_fld_field_','');
			let fieldName  = $('#widgetFilterModal_fld_field_'+conIndex).val();
			let fieldLabel = $('#widgetFilterModal_fld_field_'+conIndex+' option:selected').text();
			let fieldType  = $('#widgetFilterModal_fld_field_'+conIndex+' option:selected').attr('data-type');
			let filterSubType  = $('#widgetFilterModal_fld_field_'+conIndex+' option:selected').attr('filterSubType');
			let operator   = $('#widgetFilterModal_fld_opr_'+conIndex).val();
			let value1     = $('#widgetFilterModal_fld_val1_'+conIndex).val();
			let value2     = $('#widgetFilterModal_fld_val2_'+conIndex).val();
			let dateOption = $('#widgetFilterModal_fld_dtoption_'+conIndex).val();
			
			if(fieldType == 'radio'){
				value1 = $('input[name="widgetFilterModal_fld_val1_'+conIndex+'"]:checked'). val();
			}
			else if(fieldType == 'checkbox'){
				value1 = [];
				$('input[name="widgetFilterModal_fld_val1_'+conIndex+'"]:checked').each(function() {
				   value1.push(this.value); 
				});
			}
			else if(fieldType == 'amount'){
				let groupSeparator = _strGroupSeparator ? _strGroupSeparator : ',';
				let regex = new RegExp(groupSeparator, "g");
				value1 = value1.replace(regex, '');
				value2 = value2.replace(regex, '');
			}
			
			value1 = (value1 && (typeof value1 == 'string')) ? value1.trim() : value1;
			value2 = (value2 && (typeof value1 == 'string')) ? value2.trim() : value2;
			
			if(!value1 || (value1 && value1.length == 0 || !operator || !fieldType) || (operator == 'bt' && !value2))
			{
				
				if(!fieldType){
					errorList.push('Select value of Field Name');
				    _this.appendErrorMsg('widgetFilterModal_fld_field_'+conIndex,getDashLabel('filter.err.fldRequired','This field is required.'));
				}else{
					if(!operator){
						errorList.push('Select value of operator');
						_this.appendErrorMsg('widgetFilterModal_fld_opr_'+conIndex,getDashLabel('filter.err.fldRequired','This field is required.'));
					}
					if(!value1 || (value1 && value1.length == 0))
					{
						let errMsg = '';
						if(fieldType == 'selectbox' || fieldType == 'autocomplete' || fieldType == 'multibox'
						   || fieldType == 'date'){
							errMsg += 'Select';
						}
						else
						{
							errMsg += 'Enter';
						}
						errMsg += ' '+getDashLabel('filter.value1','Value 1')+' for '+fieldLabel;
						errorList.push(errMsg);
						_this.appendErrorMsg('widgetFilterModal_fld_val1_'+conIndex,getDashLabel('filter.err.fldRequired','This field is required.'));
					}
					
				
					if(!value2 && operator == 'bt' )
					{
						let errMsg = '';
						if(fieldType == 'selectbox' || fieldType == 'autocomplete' || fieldType == 'multibox'
						   || fieldType == 'date'){
							errMsg += 'Select';
						}
						else
						{
							errMsg += 'Enter';
						}
						errMsg += ' '+getDashLabel('filter.value2','Value 2')+' for '+fieldLabel;
						errorList.push(errMsg);
						_this.appendErrorMsg('widgetFilterModal_fld_val2_'+conIndex,getDashLabel('filter.err.fldRequired','This field is required.'));
					}
				}
			}
			else if(value2 && operator == 'bt' && fieldType == 'amount' 
				&& parseInt(value1) > parseInt(value2))
			{
				let errMsg = getDashLabel('filter.err.value2GreaterThanValue1');
					errorList.push(errMsg);
					_this.appendErrorMsg('widgetFilterModal_fld_val2_'+conIndex,errMsg);					
			}			
            else
			{
				
				if(operator == 'in')
				{
					value1 = value1.toString();
				}
				if(fieldName){
					let filterField           = {};
					filterField.fieldName     = fieldName;
					filterField.label         = fieldLabel;
					filterField.type          = fieldType;
					filterField.filterSubType = filterSubType;
					filterField.operator      = operator;
					filterField.value1        = value1;
					filterField.value2        = value2;
					filterField.dateOption    = dateOption;
					filterFields.push(filterField);
				}	
			}			
		});//End list loop
		
		if(errorList.length == 0)
		{
			filterData = {
				"filter": {
				   "widgetId" : widgetId,	
				   "fields"   : filterFields
				}
			};
		}		
		else
		{
			let _this = this;
			
			$('#'+_this.utils.actionIds.widgetModalId+ ' .modal-error').empty();
			$(errorList).each(function(index){
				//$('#'+_this.utils.actionIds.widgetModalId+ ' .modal-error').append('<span>'+errorList[index]+'</span>');
			});		
		}
		return filterData;
	};
	
	_thisFilter.onFilterListChange = function(selectedFilter){
			let _this = this;
			/*if(selectedFilter != '-1')
			{*/
				let widgetId = _this.widgetId;
				
				if(usrDashboardPref.widgets){
					if(usrDashboardPref.widgets[widgetId]){
						usrDashboardPref.widgets[widgetId].defalutFilter = selectedFilter;
					}
				}
				updateDashboardPref();
			/*}*/
			
			if(selectedFilter == 'Default')
			{	
				_this.applyDefaultFilter(selectedFilter, false);
			}
			else if(selectedFilter == '-1')
			{	
				_this.applyBlankFilter(selectedFilter);
				$('#select2-widgetFilterModal_fld_savedList-container').attr('title', getDashLabel('filter.selectFilter','Select Filter'));
			}
			else
			{
				_this.applySavedFilter(selectedFilter);
			}
			
			_this.filterValidation();
	};
	
	_thisFilter.getDefaultFilter = function(){
		let widgetId = this.widgetId;
		let filterData;
		let metaFilter = this.metadata.filter;
		
		if(metaFilter)
		{
			let filterFields = [];
			
			$(metaFilter.fields).each(function(index, field){
				if(field.default){
					let filterField           = {};
					filterField.fieldName     = field.fieldName;
					filterField.label         = field.label;
					filterField.type          = field.type;
					filterField.filterSubType = field.filterSubType;
					filterField.operator      = (field.default.value1 == 'all') ? 'eq' : field.default.operator;
					filterField.value1        = field.default.value1;
					filterField.value2        = field.default.value2;
					filterFields.push(filterField);
				}
			});
			
			filterData = {
				"filter": {
				   "widgetId" : widgetId,	
				   "fields"   : filterFields
				}
			};
		}
		
		return filterData;
	};

	_thisFilter.setLocalFilterValues = function(){
		let filterData;
		let widgetId = this.widgetId;
		let _this = this;
		let localFilter = null; 
		let localGroupFields = null;
		let selectedSavedFilter = null;
		let metaFilter = this.metadata.filter;
		
		let localStore = localStorage.getItem(this.widgetId);
		
		if(localStore)
		{
			localStore = JSON.parse(localStorage.getItem(this.widgetId));
			localFilter = localStore.localSavedFilter;
			localGroupFields = localStore.group;
			selectedSavedFilter = localStore.selectedFilter;
		}
		if(selectedSavedFilter != null && selectedSavedFilter != '')
		{
			if(selectedSavedFilter == '-1')
			{
				$('#widgetFilterModal_fld_filterName').val('');
				$('#select2-widgetFilterModal_fld_savedList-container').attr('title', getDashLabel('filter.selectFilter','Select Filter'));
			}
			else
			{
				$('#widgetFilterModal_fld_filterName').val(selectedSavedFilter);
			}
		}
			
		if(selectedSavedFilter == 'Default')
		{
			$('#widgetFilterModal_fld_savedList').val('Default');
			$('#widgetFilterModal_fld_savedList').trigger('change.select2');
			this.applyDefaultFilter('Default', true);
		}
		else
		{
			$('#widgetFilterModal_fld_savedList').val(selectedSavedFilter);
			$('#widgetFilterModal_fld_savedList').trigger('change.select2');
			if(localFilter && localFilter.filter && localFilter.filter.fields.length > 0)
			{
				$('#cond_sec_widgetFilterModal').empty();
				$(localFilter.filter.fields).each(function(index, field){			
					_this.utils.addNewRow(this, _this, _this.utils.actionIds.widgetModalId);
					let filsOption = $('#widgetFilterModal_fld_field_'+(index+1)+' option[value='+field.fieldName+']');
					let fils = $('#widgetFilterModal_fld_field_'+(index+1));
					let opers = $('#widgetFilterModal_fld_opr_'+(index+1));
					
					$(filsOption).attr('selected','selected');
					_this.utils.onFieldNameChange(fils, _this, _this.utils.actionIds.widgetModalId);			
					$('#widgetFilterModal_fld_opr_'+(index+1)+' option[value='+field.operator+']').attr('selected','selected');
					_this.utils.onOperatorChange(opers, _this, _this.utils.actionIds.widgetModalId, false);				
					_this.utils.changeValueFields(fils, _this, _this.utils.actionIds.widgetModalId, field.value1, false);	
					if(field.operator == 'bt')
					{
						$('#widgetFilterModal_fld_val2_'+(index+1)).val(field.value2);
					}
					
					if($(fils).find('option:selected').attr('data-type') == 'date')
					{
						$('#widgetFilterModal_fld_dtoption_'+(index+1)).val(field.dateOption);
						$('#widgetFilterModal_fld_dtoption_'+(index+1)).trigger('change.select2');					
						$('#widgetFilterModal_fld_dtoption_'+(index+1)+' + .select2-container .select2-selection').attr('title', DATEOPERATOR[field.dateOption]);
					}
				});
				
				$(localGroupFields).each(function(index){
					let grpVal = localGroupFields[index];
					
					$('#groupByCond'+(index+1)).val(grpVal);
					_this.utils.onGroupFldChange($('#groupByCond'+(index+1)));
					
					(grpVal != undefined && grpVal.length > 0) 
						? $('#groupByCond'+(index+1)).removeAttr('disabled') 
						: $('#groupByCond'+(index+1)).attr('disabled','disabled');
				});
			}			
		}
		if($('#widgetFilterModal_fld_savedList').val() == '-1')
		{
			$('#select2-widgetFilterModal_fld_savedList-container').attr('title', getDashLabel('filter.selectFilter','Select Filter'));
		}
		else
		{
			$('#select2-widgetFilterModal_fld_savedList-container').attr('title',$('#widgetFilterModal_fld_savedList').val());
		}
		
	};
	
	_thisFilter.refreshLocalStorage = function(widgetId, deletedFilter)
	{
	   let filterName = null;                                                                                    
	   let localStore = localStorage.getItem(widgetId);
	   if(localStore)
	   {
		  localStore = JSON.parse(localStorage.getItem(this.widgetId));
		  filterName = localStore.selectedFilter;
		  if(filterName != null && filterName == deletedFilter)
		  {
			 localStorage.removeItem(widgetId);
		  }                             
	   }
	};
	
	_thisFilter.filterValidation = function()
	{
		let _this = this;
		$('.filter-conditions-item input, .filter-conditions-item select, .filter-conditions-item .select2-selection').blur(function(){
			let value = $(this).val();
			if(!value)
			{
				if($(this).hasClass('select2-selection'))
				{
					value = $(this).closest(":has(select)").find('select').val().length;
					value = value == 0 ? '' : value;
				}
			}
			let hasDateOption = $(this).hasClass('dtoptionfld');
			let eleId = $(this).attr('id');
			if($(this).hasClass('select2-selection'))
			{
				eleId = $(this).closest(":has(select)").find('select').attr('id');
			}
			if(hasDateOption)
			{
				return;
			}
			if(!value)
			{
				_this.appendErrorMsg(eleId, getDashLabel('filter.err.fldRequired','This field is required.'));
			}
			else
			{
				let parentDiv = $(this).parent();
				$(parentDiv).find('#'+eleId+'-error').remove();
			}
		});
		$('.filter-conditions-item input, .filter-conditions-item select').change(function(){
			let value = $(this).val();
			let eleId = $(this).attr('id');
			let hasDateOption = $(this).hasClass('dtoptionfld');
			if(hasDateOption)
			{
				return;
			}
			if(!value)
			{
				_this.appendErrorMsg(eleId, getDashLabel('filter.err.fldRequired','This field is required.'));
			}
			else
			{
				let parentDiv = $(this).parent();
				$(parentDiv).find('#'+eleId+'-error').remove();
			}
		});
		
		$('#widgetFilterModal_fld_filterName').change(function(){
			let value = $(this).val();
			let eleId = $(this).attr('id');
			if(!value)
			{
				_this.appendErrorMsg(eleId, getDashLabel('filter.err.fldRequired','This field is required.'));
			}
			if(value.length < 4)
			{
				_this.appendErrorMsg(eleId, getDashLabel('filter.err.filterNameMinError','Value should be greater than 4 Characters'));
			}
			else
			{
				let parentDiv = $(this).parent();
				$(parentDiv).find('#'+eleId+'-error').remove();
			}
		});
	};
	
	_thisFilter.appendErrorMsg = function(errorField, errorMsg){
		let parentDiv = $('#'+errorField).parent();
		if(parentDiv.length == 0)
		{
			parentDiv = $('[name='+errorField+']').parent().parent();
		}
		$(parentDiv).find('#'+errorField+'-error').remove();
		$(parentDiv).append('<label id="'+errorField+'-error" class="error" for="'+errorField+'">'+errorMsg+'</label>');
	};
	
	_thisFilter.setGroupField = function(){
		let _this = this;
		let widgetMeta = this.metadata;
		let isGroupPresent = false;
		
		let groupByCond1 = '<select class="form-control filter-group-fld" tabindex="1" id="groupByCond1">';
		let groupByCond2 = '<select disabled class="form-control filter-group-fld" tabindex="1" id="groupByCond2">';
		let groupByCond3 = '<select disabled class="form-control filter-group-fld" tabindex="1" id="groupByCond3">';
		 
		 groupByCond1 += '<option value="">'+getDashLabel('filter.select','Select')+'</option>';
		 groupByCond2 += '<option value="">'+getDashLabel('filter.select','Select')+'</option>';
		 groupByCond3 += '<option value="">'+getDashLabel('filter.select','Select')+'</option>';
				 
		 $(widgetMeta.fields.columns).each(function(index, field){
			if(field.group)
			{
				 groupByCond1 += '<option value="'+field.fieldName+'">'+field.label+'</option>';
				 groupByCond2 += '<option value="'+field.fieldName+'">'+field.label+'</option>';
				 groupByCond3 += '<option value="'+field.fieldName+'">'+field.label+'</option>';
				 isGroupPresent = true;
			}
		 });
		   	groupByCond1 += '</select>';
			groupByCond2 += '</select>';
			groupByCond3 += '</select>';
         if(isGroupPresent)
		 {
			let fldGroupBy1 = document.createElement('div');
				fldGroupBy1.className = 'col-md-2';
				fldGroupBy1.innerHTML = groupByCond1;
				
			let fldGroupBy2 = document.createElement('div');
				fldGroupBy2.className = 'col-md-2';
				fldGroupBy2.innerHTML = groupByCond2;

			let fldGroupBy3 = document.createElement('div');
				fldGroupBy3.className = 'col-md-2';
				fldGroupBy3.innerHTML = groupByCond3;				
			
			let labelsSection = document.createElement('div');
				labelsSection.className = 'row';		
                labelsSection.appendChild(fldGroupBy1);
                labelsSection.appendChild(fldGroupBy2);
                labelsSection.appendChild(fldGroupBy3);                				
			
			$('.modal-grouping').append(labelsSection.outerHTML);
			
			$('.filter-group-fld').change(function(){
				_this.utils.onGroupFldChange(this);
			});
		 }
	};
  return _thisFilter;

}
