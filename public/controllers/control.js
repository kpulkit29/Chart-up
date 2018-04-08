var app=angular.module("app",["ngMaterial"]);
app.directive('hcChart', function () {
	return {
		restrict: 'E',
		template: '<div></div>',
		scope: {
			options: '='
		},
		link: function (scope, element) {
			Highcharts.chart(element[0], scope.options);
		}
	};
})
app.controller("control1",function($scope,$timeout){
	 $scope.btc=true;
	 $scope.eth=false;
	/////highcharts 
   var seriesOp=[{data:[]}];
   var seriesOp2=[{data:[]}];
	///////FOR BITCOIN////////
	function renderAgain(){
		Highcharts.chart('chart', {
			
				title: {
					text: 'The bitcoin to USD conversion live graph'
				},
			    xAxis: {
					title: {
						text: '	BTC'
					}
				},
				yAxis: {
					title: {
						text: 'T0 USD'
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle'
				},
			
				plotOptions: {
					series: {
						label: {
							connectorAllowed: false
						}
					}
				},
			
				series: seriesOp

			
			});
	}
	/////FOR ETHEREUM////
	function renderAgain2(){
		Highcharts.chart('chart2', {
			
				title: {
					text: 'The ethereum to USD conversion live graph'
				},
			    xAxis: {
					title: {
						text: 'ETH'
					}
				},
				yAxis: {
					title: {
						text: 'T0 USD'
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle'
				},
			
				plotOptions: {
					series: {
						label: {
							connectorAllowed: false
						}
					}
				},
			
				series: seriesOp2

			
			});
	}
    var currentPrice = {};
    $scope.cryto=[];
    //API used - crytocompare
	var socket = window.io.connect('https://streamer.cryptocompare.com/');
	//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
	//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
	//For aggregate quote updates use CCCAGG as market
	var subscription = ['5~CCCAGG~BTC~USD','5~CCCAGG~ETH~USD'];
	socket.emit('SubAdd', { subs: subscription });
	socket.on("m", function(message) {
		var messageType = message.substring(0, message.indexOf("~"));
		var res = {};
		if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
			res = CCC.CURRENT.unpack(message);
			if(res.FROMSYMBOL=="BTC"){
				$scope.$apply(function(){
					if(res.PRICE!==undefined){
						console.log(res);
						seriesOp[0].data.push(res.PRICE);
						renderAgain();
					}
				  });
			}
			else{
				$scope.$apply(function(){
					if(res.PRICE!==undefined){
						console.log(res);
						seriesOp2[0].data.push(res.PRICE);
						renderAgain2();
					}
				  });
			}
		}
	});
	//on switch
	$scope.switch=function(str){
    if(str=="eth"){
		$scope.eth=true;
		$scope.btc=false;
	}
	else{
		$scope.eth=false;
		$scope.btc=true;
	}
	}
});