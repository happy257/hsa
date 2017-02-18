//Put custom code here

// GLOBAL VARIABLES

$(document).on("pagebeforeshow","#flow2",function(){
  console.log("pagechange-flow2");updateContLimit()
});
$(document).on("pagebeforeshow","#flow3",function(){
$( "#annualWithdrawl" ).slider();
console.log("pagechange-flow2"); updateWithdrawlLimit()
});
$(document).on("pagebeforeshow","#flow4",function(){
$( "#years" ).slider();
 console.log("pagechange-flow3"); updateAccountGrowthYears()
});

var GLOBAL={};
GLOBAL.empContLimit = 0;
GLOBAL.contLimitInd = 3400;
GLOBAL.contLimitNotInd = 6750;
GLOBAL.contLimitIndOver55 = 4400;
GLOBAL.contLimitNotIndOver55 = 7750;

GLOBAL.getCovTier = function(){
	return $("#covTier").val();
}
GLOBAL.getAge = function(){	
	if(!$("#inpage").val()){$("#inpage").val('25')};	
	return parseInt($("#inpage").val());
}



//Returns only integer of the field passed as param or zero
GLOBAL.getVal = function(field){
	if(!(field))
		console.error('"Field" not passed to getVal');
	
	var fieldValue=$("#"+field).val()
	if(isNaN(fieldValue)||fieldValue=="")
		$("#"+field).val('0');	
		return parseInt(fieldValue);
}
var setMTRate = function(selectedRateElem){
	var selRate=selectedRateElem.getAttribute("value");
	console.log(selRate);
	$($("#taxRate option").get(selRate)).attr('selected', 'selected')
	$("#taxRate").selectmenu();
        $("#taxRate").selectmenu('refresh', true);
	//$("#taxRate option[value='test1']").attr("selected", "selected");
	closePop('#taxCalcPopup')
	}
var goBack = function() {
    window.history.back()
}
var closePop = function(popupDiv){$(popupDiv).popup( "close" );}	

var updateContLimit = function(){
  //Needed to initialize slider before refresh
  $( "#annualCont" ).slider();
  
  var age = GLOBAL.getAge();
  var covTier = GLOBAL.getCovTier();
  
	if(age<=55){
		if(covTier==1){
			GLOBAL.empContLimit = GLOBAL.contLimitInd;
		}else{
			GLOBAL.empContLimit = GLOBAL.contLimitNotInd;	
		}
	}else{
		if(covTier==1){
			GLOBAL.empContLimit = GLOBAL.contLimitIndOver55;
		}else{
			GLOBAL.empContLimit = GLOBAL.contLimitNotIndOver55;
		}
	}	
  //Reset slider limits  
	$("#annualCont").prop({
	  min:0,
	  max:GLOBAL.empContLimit
	}).slider("refresh");
	
}
var updateWithdrawlLimit = function(){ 

  var maxWithdrawl = GLOBAL.getVal('currHSABal')+GLOBAL.getVal('annualCont');  
  	console.log('maxWithdrawl', maxWithdrawl);
  //Reset slider limits  	
	if(maxWithdrawl==0){
		console.log("0000000");	
		$( "#annualWithdrawl" ).val('0')
$( "#annualWithdrawl" ).slider( "disable" );

		}else{
	$( "#annualWithdrawl" ).slider( "enable" );
		  $("#annualWithdrawl").prop({
	  			min:0,
	  			max:maxWithdrawl
				}).slider("refresh");
	}
}
var updateAccountGrowthYears = function(){
var maxYears = 100-GLOBAL.getAge();
  //Reset slider limits 
 $("#years").prop({
	  min:0,
	  max:maxYears
	}).slider("refresh");
 }



/*$('#covTier').on("change",function () {
	updateContLimit();
});
$('#inpage').on("change",function () {
	console.log('Age altered');
	updateContLimit();
});*/

var buildTaxPopup = function(){
	var taxSet=[];
	taxSet[1] ={filingStat:"Single",taxableIncome:["Up to $9,275","$9,276 - $37,650","$37,651 - $91,150","$91,151 - $190,150","$190,151 - $413,350","$413,351 - $415,050","Over $415,051"]};
	taxSet[2] ={filingStat:"Married filing jointly",taxableIncome:["Up to $18,550", "$18,551 - $75,300", "$75,301 - $151,900", "$151,901 - $231,450", "$231,451 - $413,350", "$413,351 - $466,950", "Over $466,951"]};
	taxSet[3] ={filingStat:"Married filing seperate",taxableIncome:["Up to $9,275","$9,276 - $37,650","$37,651 - $75,950","$75,951 - $115,725","$115,726 - $206,675","$206,676 - $233,475","Over $233,476"]};
	taxSet[4] ={filingStat:"Head of household",taxableIncome:["Up to $13,250", "$13,251 - $50,400", "$50,401 - $130,150", "$130,151 - $210,800"	, "$210,801 - $413,350"	, "$413,351 - $441,000"	, "Over $441,001"]};
	
	//Prepare DOM for the popup
	var container='';
	for(var i=1;i<taxSet.length;i++){
		container += '<div data-role="collapsible"><h3>'+taxSet[i].filingStat+'</h3>';
		var lists='<ul data-role="listview">'
		for(j=0;j<taxSet[i].taxableIncome.length;j++){
			lists+='<li><a href="#" value='+(j+1)+' onClick="setMTRate(this)">'+taxSet[i].taxableIncome[j]+'</a></li>'
		}
		lists+='</ul>'
		container+= lists+'</div>'
	}
	$("#taxSet").html(container);	
}
buildTaxPopup();
var ContributionArray =[];
var labelsArr=[]

var buildContributionArray = function(){
	var initialHSABalance= GLOBAL.getVal('currHSABal');
	console.log("initialHSABalance========",initialHSABalance);
	console.log("initialHSA========",(initialHSABalance + GLOBAL.getVal('annualCont') - GLOBAL.getVal('annualWithdrawl') ))
	var limit=GLOBAL.getVal('years');
	for(i=0;i<limit;i++){
		labelsArr[i]=i;
		ContributionArray[i]= (initialHSABalance + GLOBAL.getVal('annualCont') - GLOBAL.getVal('annualWithdrawl') )*(1+ GLOBAL.getVal('interestRate')/100);
		initialHSABalance=ContributionArray[i];
	}
	console.log("ContributionArray:",ContributionArray)
	
	
	$('#result-graph').css('width',window.innerWidth-50);
	$('#result-graph').css('height',window.innerHeight-120);
	console.log($('#result-graph').css('width'));
$('#result-graph').jqChart({
                //title: {text: 'Vertical Spline Chart'},
                tooltips	: {type: 'shared'},
				background: 'white',
                animation	: {duration: 1},
				legend		: {visible: false,location: 'top'},
				series: [
                    {
                        type: 'verticalLine',
                        title: 'Contributions',
                        data: ContributionArray//[297,594,891,1188,1485]
					}
                ]
				,border: {
                    cornerRadius: 0,
                    lineWidth: 0,
                    strokeStyle: '#6ba851'
                }
				,axes: [
                    {
						categories: labelsArr,
                        location: 'left',
                        majorGridLines: {
                            lineWidth: 1,
                            strokeStyle: '#efefef'
                        },
						minorGridLines: {
                            lineWidth: 1,
                            strokeStyle: '#efefef',
                            strokeDashArray: [2, 2],
							interval:1
                        }
                    }
                ]
				,shadows: {
                    enabled: true,
                    shadowColor: 'gray',
                    shadowBlur: 5,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3
                }
				,noDataMessage: {
                    text: 'No data available',
                    font: '20px sans-serif'
                },
            });
			$('#result-graph').bind('tooltipFormat', function (e, data) {
                return "$ " + data.y;
            });
}
