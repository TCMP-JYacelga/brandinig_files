function GetInfo(ctrl, index)
{
	if( ctrl.value == 'COUNTRY'){
		var temp = $("#countryInfo"+index).html();
		$("#certificate"+index).html(temp);
	}
	else if(ctrl.value == 'QUALITY'){
		var temp = $("#qualityInfo"+index).html();
		$("#certificate"+index).html(temp);
	}
	else if(ctrl.value == 'ANALYSIS'){
		var temp = $("#analysisInfo"+index).html();
		$("#certificate"+index).html(temp);
	}
	else if(ctrl.value == 'WEIGHT'){
		var temp = $("#weightInfo"+index).html();
		$("#certificate"+index).html(temp);
	}
	else if(ctrl.value == 'QUANTITY'){
		var temp = $("#quantityInfo"+index).html();
		$("#certificate"+index).html(temp);
	}
	else if(ctrl.value == 'HEALTHCHECK'){
		var temp = $("#healthInfo"+index).html();
		$("certificate"+index).html(temp);
	}
	else if(ctrl.value == 'PHYTOSANITARY'){
		var temp = $("#PhytoInfo"+index).html();
		$("#certificate"+index).html(temp);
	}
	else{
		$("#certificate"+index).html("");		
	}		
}
