function gameIsDone(board) {
	var horizontal1 = Boolean(Boolean(board[0]==board[1]) && Boolean(board[1]==board[2]) && Boolean(board[0]!=undefined));
	var horizontal2 = Boolean(Boolean(board[3]==board[4]) && Boolean(board[4]==board[5]) && Boolean(board[3]!=undefined));
	var horizontal3 = Boolean(Boolean(board[6]==board[7]) && Boolean(board[7]==board[8]) && Boolean(board[6]!=undefined));
	var vertical1   = Boolean(Boolean(board[6]==board[3]) && Boolean(board[3]==board[0]) && Boolean(board[6]!=undefined));
	var vertical2   = Boolean(Boolean(board[7]==board[4]) && Boolean(board[4]==board[1]) && Boolean(board[7]!=undefined));
	var vertical3   = Boolean(Boolean(board[8]==board[5]) && Boolean(board[5]==board[2]) && Boolean(board[8]!=undefined));
	var diagonal1   = Boolean(Boolean(board[6]==board[4]) && Boolean(board[4]==board[2]) && Boolean(board[6]!=undefined));
	var diagonal2   = Boolean(Boolean(board[0]==board[4]) && Boolean(board[4]==board[8]) && Boolean(board[0]!=undefined));
	var state = Boolean(Boolean(horizontal1)||Boolean(horizontal2)||Boolean(horizontal3)||Boolean(vertical1)||Boolean(vertical2)||Boolean(vertical3)||Boolean(diagonal2)||Boolean(diagonal1));
	return state;
}

function gameIsTied(scope) {
	return false;
}

function winner(scope) {
    scope.current.points++;
    scope.board=[];
	scope.showWin();
}
function changeTurn(scope){
	if(scope.current==scope.players[0]){
		scope.players[0].turn=undefined;
		scope.players[1].turn='(turn)';
		scope.current=scope.players[1]
	}else{
		scope.players[1].turn=undefined;
		scope.players[0].turn='(turn)';
		scope.current=scope.players[0]
	}
}
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
/*
.factory('Players',function () {
    var a ={
        getAll:function () {
            var x=window.localStorage['players'];
            (x)?return angular.toJson(x):return[];
        }
        save:function (playersList) {
            window.localStorage['players']=angular.toJson(playersList);
        }
        newPlayer:function (name) {
            return{name:name,points:0}
        }
    }
    return a;
})
*/
.controller('mainControl',function($scope,$ionicModal) {

    $ionicModal.fromTemplateUrl('new-player.html', function(modal) {
        $scope.taskModal = modal;
    }, {
    scope: $scope,
    animation: 'slide-in-up'
    });

	$ionicModal.fromTemplateUrl('error.html', function(modal) {
        $scope.errorModal = modal;
    }, {
    scope: $scope,
    animation: 'slide-in-up',
    });

	$ionicModal.fromTemplateUrl('win.html', function(modal) {
        $scope.winModal = modal;
    }, {
    scope: $scope,
    animation: 'slide-in-up',
    });

    $scope.players=[];
    $scope.current=[];
    $scope.board=[];

    $scope.putPiece=function(position) {
        if($scope.players.length===2){
            if($scope.board[position]==='X'||$scope.board[position]==='O'){
                console.error('ocupado');
				$scope.showError('ocupado');
            }else{
                $scope.board[position]=$scope.current.piece;
                if (gameIsDone($scope.board)) {
                    winner($scope);
                }
				if (gameIsTied($scope)){
					$scope.board=[];
				}
                else{
					changeTurn($scope);
                }
            }
        }
        else {
			$scope.showError('no players')
            console.error('no players');
        }
    }

    $scope.addPoints=function () {
        $scope.players[0].points++;
    }

    $scope.desactivarAdd=function() {
        return ($scope.players.length===2);
    }
    $scope.desactivarTablero=function() {
        return ($scope.players.length===0||$scope.players.length===1);
    }

    $scope.setPlayer = function (playerName) {
        if(($scope.players.length===1)||($scope.players.length===0)){
            $scope.players.push({name:playerName,points:0});
            $scope.taskModal.hide();
            if(($scope.players.length===2)){
                $scope.current=$scope.players[0];
				$scope.players[0].turn='(turn)'
                $scope.players[0].piece='X';
                $scope.players[1].piece='O';
                $scope.VS=$scope.players[0].name+' VS '+$scope.players[1].name;
            }
        }else{
            console.error("many players");
        }
    }

    $scope.newPlayer = function() {
        $scope.taskModal.show();
    };

    $scope.closeNewPlayer = function() {
        $scope.taskModal.hide();
    }

	$scope.showError=function(msj,help) {
		$scope.err=msj;
		$scope.errHelp=help;
		$scope.errorModal.show();
	}
	$scope.closeError=function() {
		$scope.errorModal.hide();
	}

	$scope.closeWin=function() {
		$scope.winModal.hide();
	}
	$scope.showWin=function() {
		$scope.winModal.show();
	}


})
