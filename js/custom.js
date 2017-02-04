//Put custom code here
var buildTaxPopup = function(){
	var taxSet=[];
	taxSet[1] ={filingStat:"Single",taxableIncome:['1A','2','3','4','5','6','7']};
	taxSet[2] ={filingStat:"Married filing jointly",taxableIncome:['1B','2','3','4','5','6','7']};
	taxSet[3] ={filingStat:"Married filing seperate",taxableIncome:['1C','2','3','4','5','6','7']};
	taxSet[4] ={filingStat:"Head of household",taxableIncome:['1D','2','3','4','5','6','7']};
	
	//Prepare DOM for the popup
	var container='';
	for(var i=1;i<taxSet.length;i++){
		container += '<div data-role="collapsible"><h3>'+taxSet[i].filingStat+'</h3>';
		var lists='<ul data-role="listview">'
		for(j=0;j<taxSet[i].taxableIncome.length;j++){
			lists+='<li><a href="#" onClick="">'+taxSet[i].taxableIncome[j]+'</a></li>'
		}
		lists+='</ul>'
		container+= lists+'</div>'
	}
	$("#taxSet").html(container);
}
buildTaxPopup();
