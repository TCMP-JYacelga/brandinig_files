const ESTATEMENTDATEOPERATOR = [
            //{'value':'DR', 'label': getDashLabel('filter.dateOperator.dateRange')},
			{'value':'LT', 'label': getDashLabel('filter.dateOperator.latest')},
			{'value':'TD', 'label': getDashLabel('filter.dateOperator.today')},
			{'value':'YT', 'label': getDashLabel('filter.dateOperator.yesterday')},
			{'value':'TW', 'label': getDashLabel('filter.dateOperator.thisWeek')},
			{'value':'WD', 'label': getDashLabel('filter.dateOperator.lastWeekToDate')},
			{'value':'TM', 'label': getDashLabel('filter.dateOperator.thisMonth')},
			{'value':'MD', 'label': getDashLabel('filter.dateOperator.lastMonthToDate')},
			{'value':'LM', 'label': getDashLabel('filter.dateOperator.lastMonthOnly')},
			{'value':'TQ', 'label': getDashLabel('filter.dateOperator.thisQuarter')},
			{'value':'QD', 'label': getDashLabel('filter.dateOperator.lastQuarterToDate')},
			{'value':'TY', 'label': getDashLabel('filter.dateOperator.thisYear')}
		];


let eStatementTemplate =  '<div class="row">'+
                          '<div class="col-3"><img class="estatement-image" src="' + imagePath + '/Reports.svg"></div>'+
                          '<div class="col-9"><h6>' +  getDashLabel('estatement.statement') + '</h6>'+
                           '<div><i>'+ getDashLabel('estatement.statement') + ' '+ getDashLabel('estatement.asOn') +' '+_dtCurrentDate.datetime + '</i></div></div></div>'+
                           '<div class="input-field form-group messageForms-input w-100">'+
                           '<label class="label-form-input" for="estatement_period">' + getDashLabel('estatement.selectPeriod') + '</label>'+
                            '<select id="estatement_period" fieldlabel="' + getDashLabel('estatement.selectPeriod') + '" class="form-control col-sm-12">' +
                            '<option value="">'+ getDashLabel('estatement.option.select') + '</option>'+
                           '</select>'+
                           '</div>'+
                           '<div class="input-field form-group messageForms-input w-100">'+
                           '<label class="label-form-input" for="estatement_accountNumber">' + getDashLabel('estatement.accountNumber') + '</label>'+
                            '<select id="estatement_accountNumber" fieldlabel="' +  getDashLabel('estatement.accountNumber') + '" class="form-control col-sm-12">' +
                            '<option value="">'+ getDashLabel('estatement.option.select') + '</option>'+
                           '</select>'+
                           '</div>'+ 
                           '<div class="float-right mt-4 cursor-pointer" id="Downloadbtn">'+
                                '<button class="btn btn-raised primary-button">'+
								'<i class="material-icons download-icon">get_app</i>'+getDashLabel('estatement.download') +
								'</button>'+
                           '</div>';


widgetMetaData.eStatement= function(widgetId, widgetType)
{
	let metadata = {

			  'title': getDashLabel('estatement.title'),
			  'desc': getDashLabel('estatement.title'),
			  'type': 'card',
              'subType': '', 
		 	  'widgetType' : widgetType,
		      'cloneMaxCount': 1,
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
              'actions' : {
				 'refresh' : {
						  'callbacks' : {
							  'init' : function(addData, metaData){
								  var width = $('#widget-body-'+widgetId).width() - 25; 
								  $('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');				  
								 $('#widget-body-'+widgetId).append(eStatementTemplate);
                                 fetchEstatementDebitAccounts();
                                 paintSelectPeriod();
                                 $('#widget-body-'+widgetId + " .row").width(width);
                                 $('#widget-body-'+widgetId).find('.loading-indicator').remove();
					           }
						  }
					  }
			  }		
			  }	
	return metadata;
}


function download_file() {
    
    var fileURL = rootUrl+ "/static/scripts/dashboard3/widgets/download/eStatement.pdf";
    var fileName = "eStatement.pdf";
    var link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function fetchEstatementDebitAccounts() {
 var strUrl = rootUrl+'/services/userseek/QuickPayDebitAccountSeek.json';
 var strData = {};
   $.ajax(
   {
		 type : 'POST',
		 data : strData,
		 url : strUrl,
                 async : false,
		 success : function(data)
		 {
		   paintEstatementDebitAccounts(data.d.preferences);
		 }                       
   });
}

function paintEstatementDebitAccounts(debitAccounts) {
    $(debitAccounts).each(function(index, account){
       var accountData = '<option value="'+account.CODE+'">'+account.CODE+'</option>';
       $('#estatement_accountNumber').append(accountData);
    });
    $('#Downloadbtn button').click(function(){
        download_file();
    });
}

function paintSelectPeriod() {
    $(ESTATEMENTDATEOPERATOR ).each(function(index, operator){
       var opData= '<option value="'+operator.value+'">'+operator.label+'</option>';
       $('#estatement_period').append(opData);
    });
}