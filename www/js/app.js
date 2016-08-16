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
.factory('Players',function () {
    return{
        getAll:function (){
            alasql('CREATE localStorage DATABASE IF NOT EXISTS player');
            alasql('ATTACH localStorage DATABASE player AS ticDB');
            //alasql('DROP TABLE ticDB.players');
            alasql('CREATE TABLE IF NOT EXISTS ticDB.players (name STRING UNIQUE,points INT)');
            var res = alasql('SELECT * FROM ticDB.players');
            //alasql('DELETE FROM ticDB.players where name="Lucho"');
            alasql('DETACH DATABASE ticDB');

            if(res.length===0)
                return[]
            else
                return res;
        },
        newPlayer:function (name,scope) {
            var a = alasql('SELECT * FROM ? where name=?',[scope.savedPlayers, name])
            if (a.length===1){
                console.error('user already exists');
                scope.showError('user already exists');
            }
            else{
                var toSave = {
                    name:name,
                    points:0,
                    turn:undefined,
                    piece:undefined,
                }
                alasql('CREATE localStorage DATABASE IF NOT EXISTS player');
                alasql('ATTACH localStorage DATABASE player AS ticDB');
                alasql('CREATE TABLE IF NOT EXISTS ticDB.players (name STRING UNIQUE,points INT)');
                alasql('SELECT * INTO ticDB.players FROM ?',[[{name:name, points:0}]]);
                alasql('DETACH DATABASE ticDB');
                return toSave;
            }
        },
        save:function (player) {
            alasql('CREATE localStorage DATABASE IF NOT EXISTS player;');
            alasql('ATTACH localStorage DATABASE player AS ticDB;');
            //alasql('CREATE TABLE IF NOT EXISTS ticDB.players (name STRING UNIQUE,points INT);');
            var toSave = alasql('SELECT * FROM ticDB.players where name=?;',[player.name])[0];
            toSave.points+=player.points;
            console.log(toSave.name, toSave.points);
            //alasql('UPDATE ticDB.players SET points = ? WHERE name = ?;',[toSave.points,toSave.name]);
            alasql('DELETE FROM ticDB.players where name="Lucho"',[player.name]);
            //alasql('INSERT INTO ticDB.players VALUES (?,?)',[toSave.name,toSave.points]);
            //alasql('SELECT * INTO ticDB.players FROM ?',[[{name:toSave[0].name,points:toSave[0].points}]]);
            alasql('DETACH DATABASE ticDB');
        },
        deletePlayer:function (player) {
            console.log(player.name);
            alasql('CREATE localStorage DATABASE IF NOT EXISTS player');
            alasql('ATTACH localStorage DATABASE player AS ticDB');
            alasql('CREATE TABLE IF NOT EXISTS ticDB.players (name STRING UNIQUE,points INT)');
            alasql('DELETE from ticDB.players WHERE name=?',[player.name]);
            alasql('DETACH DATABASE ticDB');
        }
    }
})
.factory('Game',function (){
	return {
	gameIsDone:function (scope) {
		var horizontal1 = ((scope.board[0]==scope.board[1]) && (scope.board[1]==scope.board[2]) && (scope.board[0]!=undefined));
		var horizontal2 = ((scope.board[3]==scope.board[4]) && (scope.board[4]==scope.board[5]) && (scope.board[3]!=undefined));
		var horizontal3 = ((scope.board[6]==scope.board[7]) && (scope.board[7]==scope.board[8]) && (scope.board[6]!=undefined));
		var vertical1   = ((scope.board[6]==scope.board[3]) && (scope.board[3]==scope.board[0]) && (scope.board[6]!=undefined));
		var vertical2   = ((scope.board[7]==scope.board[4]) && (scope.board[4]==scope.board[1]) && (scope.board[7]!=undefined));
		var vertical3   = ((scope.board[8]==scope.board[5]) && (scope.board[5]==scope.board[2]) && (scope.board[8]!=undefined));
		var diagonal1   = ((scope.board[6]==scope.board[4]) && (scope.board[4]==scope.board[2]) && (scope.board[6]!=undefined));
		var diagonal2   = ((scope.board[0]==scope.board[4]) && (scope.board[4]==scope.board[8]) && (scope.board[0]!=undefined));
		var state = ((horizontal1)||(horizontal2)||(horizontal3)||(vertical1)||(vertical2)||(vertical3)||(diagonal2)||(diagonal1));
		return state;
	},
	gameIsTied:function(scope) {
		// Soon
		return false;
	},
	winner:function(scope) {
	    scope.current.points++;
	    scope.board=[];
		scope.showWin();
	},
	changeTurn:function(scope){
		if(scope.current==scope.currentsPlayers[0]){
			scope.currentsPlayers[0].turn=undefined;
			scope.currentsPlayers[1].turn='(turn)';
			scope.current=scope.currentsPlayers[1]
		}else{
			scope.currentsPlayers[1].turn=undefined;
			scope.currentsPlayers[0].turn='(turn)';
			scope.current=scope.currentsPlayers[0]
		}
	},
    prepareGame:function (scope) {
        if((scope.currentsPlayers.length===2)){
            scope.current=scope.currentsPlayers[0];
            scope.currentsPlayers[0].turn='(turn)';
            scope.currentsPlayers[1].turn=undefined;
            scope.currentsPlayers[0].piece='X';
            scope.currentsPlayers[1].piece='O';
            scope.VS=scope.currentsPlayers[0].name+' VS '+scope.currentsPlayers[1].name;
        }
    }
}
})
.controller('mainControl',function($scope,$ionicModal,Players,Game) {

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

	$ionicModal.fromTemplateUrl('choisePlayer.html', function(modal) {
		$scope.choisePlayerModal = modal;
	}, {
	scope: $scope,
	animation: 'slide-in-up',
	});

	$ionicModal.fromTemplateUrl('menu.html', function(modal) {
        $scope.mainMenuModal = modal;
    }, {
    scope: $scope,
    animation: 'slide-in-up',
    });



    $scope.savedPlayers=Players.getAll();
	$scope.currentsPlayers=[];
    $scope.current=[];
    $scope.board=[];

    $scope.putPiece=function(position) {
        if($scope.currentsPlayers.length===2){
            if($scope.board[position]==='X'||$scope.board[position]==='O'){
                console.error('ocupado');
				$scope.showError('ocupado');
            }else{
                $scope.board[position]=$scope.current.piece;
                if (Game.gameIsDone($scope)) {
                    Game.winner($scope);
                }
				if (Game.gameIsTied($scope)){
					$scope.board=[];
				}
                else{
					Game.changeTurn($scope);
                }
            }
        }
        else {
			$scope.showError('no players')
            console.error('no players');
        }
    }

    $scope.addPoints=function () {
        $scope.currentsPlayers[0].points++;
    }

    $scope.desactivarAdd=function() {
        return ($scope.currentsPlayers.length===2);
    }
    $scope.desactivarTablero=function() {
        return ($scope.currentsPlayers.length===0||$scope.currentsPlayers.length===1);
    }

    $scope.setPlayer = function (playerName) {
        $scope.taskModal.hide();
        if(($scope.currentsPlayers.length===1)||($scope.currentsPlayers.length===0)){
            var saved = alasql('SELECT * FROM ? WHERE name=?',[$scope.savedPlayers,playerName])
            if (saved.length===0) {
                var p=Players.newPlayer(playerName,$scope);
                if (p){
                    $scope.currentsPlayers.push(p);
                    $scope.savedPlayers.push(p);
                    if(($scope.currentsPlayers.length===2)){
                        Game.prepareGame($scope);
                    }
                }
            }
            else {
                $scope.showError('Player already exists')
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

	$scope.closeChoisePlayer=function() {
		$scope.choisePlayerModal.hide();
	}
	$scope.showChoisePlayer=function() {
		$scope.choisePlayerModal.show();
	}
	$scope.choisePlayer=function(player) {
		$scope.currentsPlayers.push(player);
        if(($scope.currentsPlayers.length===2)){
            Game.prepareGame($scope);
        }
		$scope.choisePlayerModal.hide();
	}
    $scope.deletePlayer=function(player){
        $scope.choisePlayerModal.hide();
        Players.deletePlayer(player);
        $scope.savedPlayers=Players.getAll();
    }
    $scope.finishRound=function(){
        if ($scope.currentsPlayers.length===2){
            var winner=$scope.currentsPlayers[0];
            var loser=$scope.currentsPlayers[1];
            if (winner.points<loser.points) {
                var aux = loser;
                loser = winner;
                winner = aux
            }
            winner.points-=loser.points;
            Players.save(winner);
        }
        else {
            $scope.showError('No players');
            console.error('No players');
        }
    }
    $scope.mainMenu=function() {
		$scope.mainMenuModal.show();
	}

})
