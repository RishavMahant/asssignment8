'use strict'

var debugging = false;
const MAX_TILES = 7;
var tscore = 0;

$(document).ready(function() {
    ObjScrabble.init();   
    var $blank = $('<div>').addClass('board-blank slot droppable ui-widget-header')
                           .attr('letter-mult', 1)
                           .attr('word-mult', 1);
    var $doublew = $blank.clone()
                         .addClass('board-double-word')
                         .removeClass('board-blank')
                         .attr('word-mult', 2);
    var $doublel = $blank.clone()
                         .addClass('board-double-letter')
                         .removeClass('board-blank')
                         .attr('letter-mult', 2);
    var x = 0;
    $('#board')
        .append($blank.clone().attr('col', x++))
        .append($doublew.clone().attr('col', x++))
        .append($blank.clone().attr('col', x++))
        .append($doublel.clone().attr('col', x++))
        .append($blank.clone().attr('col', x++))
        .append($doublew.clone().attr('col', x++))
        .append($blank.clone().attr('col', x++));

    drawHand();            
    refreshScoreboard();   
    makeTilesDraggable();  
    $('.slot').droppable({
        tolerance: 'intersect',
        hoverClass: 'drop-hover',
        drop: function (event, ui) {
            var $this = $(this);
            if ( $this.children().length == 0 ) {   
                ui.draggable
                    .detach()                       
                    .css({top: 0, left: 0})         
                    .addClass('drawn')              
                    .appendTo($this);               
                refreshScoreboard();

                
                $('#next-word').prop('disabled', false);
            }
        }
    });

    
    $('#rack').droppable({
        accept: '.drawn',
        tolerance: 'intersect',
        hoverClass: 'drop-hover',
        drop: function (e, ui) {
            ui.draggable.detach()              
                        .removeClass('drawn')  
                        .css({top:0, left:0})
                        .appendTo($(this));    
            refreshScoreboard();
        }
    });

    $('#reset').on('click', function(e) {
        e.preventDefault();
        ObjScrabble.init();
        $('#board').children().empty();     
        $('#rack').empty();                 
        drawHand();
        makeTilesDraggable();
        refreshScoreboard();
        tscore = 0;
        $('#total-scores').text(tscore);
    })

    $('#next-word').on('click', function(e) {
        e.preventDefault();
        $('#board').children().empty();     
        drawHand();
        makeTilesDraggable();

        var cur_score = parseInt($('#cur-scores').text(), 10);
        tscore += cur_score;
        $('#total-scores').text(tscore);
        refreshScoreboard();
    });

});

function refreshScoreboard() {

    var s_Word = "";
    var scores = 0;
    var letValue;
    var letMult = 1;
    var wMult = 1;

    
    $('.slot').each(function() {
        var $this = $(this);
        var $child;
        if ( $this.children().length > 0 ) {
            $child = $this.find('img');
            s_Word += $child.attr('letter');

            letValue = parseInt($child.attr('value'), 10);
            letMult = parseInt($this.attr('letter-mult'), 10);

            scores += (letValue * letMult);
            wMult *= parseInt($this.attr('word-mult'), 10);
        } else {
            s_Word += '.';
        }

    });

    
    $('#word').text(s_Word);
    $('#cur-scores').text(scores*wMult);
    $('#bag').text(ObjScrabble.bag.length);

}


function drawHand() {
    var $rack = $('#rack');
    var $tile = $('<img>').addClass('tile draggable ui-widget-content');
    var i = $rack.children().length;
    for (; i < MAX_TILES; ++i) {
        var key = ObjScrabble.drawTileFromBag();
        if (key) {
            var strSrc = 'images/tiles/Scrabble_Tile_' + key + '.jpg';
            var $newTile = $tile.clone()
                                .attr('value', ObjScrabble.dictTiles[key].value)
                                .attr('letter', key)
                                .attr('src', strSrc)
                                .appendTo('#rack');
        }
    }
    
    $('#next-word').prop('disabled', true);
}


function makeTilesDraggable() {
    $('.tile').draggable({
        revert: true,
        revertDuration: 100,
        scroll: false,
        start: function (e, ui) {
            $(this).addClass('hovering');
        },
        stop: function (e, ui) {
            $(this).removeClass('hovering');
        }
    });
}